#!/usr/bin/env python3
"""Decode the font-scrambled text of "Key Questions in Cardiac Surgery (2nd edition).pdf".

The PDF ships two substitution ciphers and no ToUnicode map:
  body    byte = ascii + 29 (0x7F skipped), byte then rendered as MacRoman
  display byte = ascii - 29, plain ASCII

Font family does not predict which cipher a span uses -- both appear inside CenturyGothic --
so every line is decoded with both maps and the better English match wins.

Outputs (into build_assets/):
  key_questions.txt          full decoded text, page-numbered
  key_questions_figures.json per-figure record keyed by the image ids already used by the site
"""

import json
import pathlib
import re
import sys

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF required: pip install pymupdf")

ROOT = pathlib.Path(__file__).resolve().parents[2]
PDF = ROOT / "Key Questions in Cardiac Surgery (2nd edition).pdf"
OUT = ROOT / "build_assets"
IMAGES = ROOT / "images"


def _body_map():
    m = {}
    for p in range(32, 127):
        b = p + 29
        if b >= 0x7F:
            b += 1
        if b <= 0xFF:
            m[bytes([b]).decode("mac_roman")] = chr(p)
    return m


def _display_map():
    return {chr(p - 29): chr(p) for p in range(32 + 29, 127) if 32 <= p - 29 < 127}


BODY = _body_map()
DISPLAY = _display_map()

def _vocabulary():
    """System dictionary plus the terms this book is dense with.

    A hand-written word list is not enough: it misses ordinary prose like
    "First septal perforator branch" and scores a perfect decode at zero.
    """
    words = set()
    sysdict = pathlib.Path("/usr/share/dict/words")
    if sysdict.exists():
        words |= {w.strip().lower() for w in sysdict.read_text(errors="ignore").splitlines() if len(w.strip()) > 1}
    words |= set("""aortic valve cardiac coronary atrial ventricular myocardial infarction stenosis
regurgitation bypass graft echocardiography anastomosis cannulation cardioplegia sternotomy
perforator septal ischaemia ischemia oedema anaesthesia catheterisation angiography stent
prosthesis prosthetic annuloplasty commissural leaflet papillary sinoatrial atrioventricular
tricuspid mitral pericardial pericardium endocarditis arrhythmia bradycardia tachycardia
fibrillation defibrillation inotrope vasopressor diastolic systolic afterload preload""".split())
    return words


WORDS = _vocabulary()

TOKEN = re.compile(r"[a-z]+")


def score(text):
    """Fraction of alphabetic characters sitting inside real English words.

    Single letters are skipped: "a"/"i" are real words and would give scrambled
    label callouts ("i^a") a false English signal.
    """
    toks = [t for t in TOKEN.findall(text.lower()) if len(t) > 1]
    if not toks:
        return 0.0
    hits = sum(len(t) for t in toks if t in WORDS)
    return hits / sum(len(t) for t in toks)


def _abbrev_score(text):
    """How much a no-vocabulary span reads as an anatomical label callout.

    Figure labels are uppercase ("LMCA", "SVC"); body-ciphering them yields a
    lowercase/punctuation mix, so uppercase density separates the two cleanly.
    """
    alpha = [c for c in text if c.isalpha()]
    if not alpha:
        return -1.0
    return sum(c.isupper() for c in alpha) / len(alpha)


PLAIN, BODY_CIPHER, DISPLAY_CIPHER, UNKNOWN = "plain", "body", "display", "unknown"

APPLY = {
    PLAIN: lambda t: t,
    BODY_CIPHER: lambda t: "".join(BODY.get(c, c) for c in t),
    DISPLAY_CIPHER: lambda t: "".join(DISPLAY.get(c, c) for c in t),
}


def classify(text):
    """Identify which cipher produced a span, or UNKNOWN if it cannot be told.

    High-byte MacRoman chars are decisive: only the body cipher emits them.
    Everything else is ASCII and ambiguous -- a span may be plain,
    body-ciphered ("ij`^" -> "LMCA") or display-ciphered ("&DUGLDF" ->
    "Cardiac") -- so those get scored against real English. Plain is always a
    candidate: without it a cipher gets applied to already-plain text and
    re-scrambles it ("right atrial" -> "right=~tri~l").
    """
    if not text.strip():
        return PLAIN
    if any(ord(c) > 0x7F for c in text):
        return BODY_CIPHER
    options = [PLAIN, BODY_CIPHER]
    # The display cipher shifts plaintext a-z up into the uppercase/symbol
    # range, so display-ciphered text never contains a lowercase letter. Any
    # lowercase rules it out. This matters because DISPLAY is a partial map:
    # left on plain prose it mangles only capitals and punctuation, so enough
    # words survive to outscore the untouched original.
    if not any("a" <= c <= "z" for c in text):
        options.append(DISPLAY_CIPHER)
    scored = [score(APPLY[option](text)) for option in options]
    best = max(scored)
    if best == 0.0:
        return UNKNOWN
    # Ties favour plain, then body -- options is ordered accordingly.
    return options[scored.index(best)]


def decode(text):
    """Decode one span in isolation. Prefer decode_spans, which has context."""
    kind = classify(text)
    if kind is UNKNOWN:
        return max((APPLY[PLAIN](text), APPLY[BODY_CIPHER](text)), key=_abbrev_score)
    return APPLY[kind](text)


def decode_spans(texts):
    """Decode a line's spans together, resolving ambiguous ones by context.

    A span carrying no dictionary word cannot be classified alone: "MVR" is a
    real abbreviation but body-decodes to the equally plausible "095", and this
    book is full of both. PyMuPDF splits numbers into their own spans, so the
    clinical values ("MKMUJMKNO" -> "0.08-0.12", "URJVMB" -> "85-90%") are
    exactly this ambiguous case -- 760 of them. Resolve by inheriting the
    cipher of the confidently-classified spans on the same line, and only fall
    back to uppercase density for a line that offers no context at all.
    """
    kinds = [classify(t) for t in texts]
    ciphered = [k for k in kinds if k in (BODY_CIPHER, DISPLAY_CIPHER)]
    context = max(set(ciphered), key=ciphered.count) if ciphered else None
    out = []
    for text, kind in zip(texts, kinds):
        if kind is UNKNOWN:
            if context is not None:
                kind = context
            else:
                out.append(decode(text))
                continue
        out.append(APPLY[kind](text))
    return out


def page_lines(page):
    """Decode span by span -- a single line can mix ciphered and plain spans,
    and joining first makes those lines undecodable ("origin~ting=from=the")."""
    out = []
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            out.append("".join(decode_spans([sp["text"] for sp in line["spans"]])))
    return out


FIG_ID = re.compile(r"^ch(\d+)_fig(\d+)_p(\d+)_", re.I)
FIG_HEAD = re.compile(r"^\s*Figure\s+(\d+)\s*[.:]", re.I)


def main():
    if not PDF.exists():
        sys.exit(f"missing source PDF: {PDF}")
    OUT.mkdir(exist_ok=True)
    doc = fitz.open(PDF)

    pages = []
    for i, page in enumerate(doc):
        pages.append({"page": i + 1, "lines": page_lines(page)})

    text_path = OUT / "key_questions.txt"
    with text_path.open("w", encoding="utf-8") as fh:
        for p in pages:
            fh.write(f"\n\n===== PAGE {p['page']:03d} =====\n")
            fh.write("\n".join(p["lines"]))
    print(f"wrote {text_path.relative_to(ROOT)} ({text_path.stat().st_size/1024:.0f} KB)")

    by_page = {p["page"]: p["lines"] for p in pages}

    # Key each site image id to its caption + surrounding section text.
    records = {}
    for img in sorted(IMAGES.glob("*.png")):
        m = FIG_ID.match(img.stem)
        if not m:
            continue
        chap, fig, page = int(m.group(1)), int(m.group(2)), int(m.group(3))
        lines = by_page.get(page, [])

        caption = []
        for idx, line in enumerate(lines):
            head = FIG_HEAD.match(line)
            if head and int(head.group(1)) == fig:
                caption = [line]
                for nxt in lines[idx + 1:]:
                    if FIG_HEAD.match(nxt) or not nxt.strip():
                        break
                    caption.append(nxt)
                break

        context = []
        for pg in (page - 1, page, page + 1):
            context.extend(by_page.get(pg, []))

        records[img.stem] = {
            "chapter": chap,
            "figure": fig,
            "page": page,
            "caption": " ".join(caption).strip(),
            "context": "\n".join(context).strip(),
        }

    json_path = OUT / "key_questions_figures.json"
    json_path.write_text(json.dumps(records, indent=2, ensure_ascii=False), encoding="utf-8")
    withcap = sum(1 for r in records.values() if r["caption"])
    print(f"wrote {json_path.relative_to(ROOT)}: {len(records)} figures, {withcap} with captions")


if __name__ == "__main__":
    main()
