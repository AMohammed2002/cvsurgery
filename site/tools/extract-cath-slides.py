"""Extract the coronary projection plates from the Cath Slides deck.

Usage: python3 tools/extract-cath-slides.py "../Cath Slides.pdf"

Source: Sachdev S, Omar B, Awan GM, Eyrich G. "Coronary Angiography: Basic
Views." Cardiofellows Newsletter 2018 Nov;1(5):27-38.

Pages 2-12 are eleven regular projection plates. Each carries:
  * one large angiogram on the right of the page (clean, unlabelled),
  * two small X-ray positioning reference images on the left, with the C-arm
    drawn over them as black tube/detector boxes and a pair of beam lines,
  * red anatomy labels that are live PDF text plus red filled dots, so the
    hotspot coordinates are recoverable rather than burned into the pixels.

The sibling extractor (extract-angiography-assets.py) uses pypdf, which needs
Pillow for image extraction; Pillow is not installed here. PyMuPDF is, and it
also lets us render the positioning regions *with* their vector C-arm overlay,
which is the geometry reference the lab's SVG rigs are drawn from.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
# Its own directory, not assets/angiography: validate-angiography.js requires
# that folder to mirror the angiography module's own data file exactly.
OUTPUT = ROOT / "assets" / "cath-projections"
# The positioning renders are build-time reference for drawing the lab's C-arm
# rigs, not shipped content: only nine distinct chest films are reused across
# the eleven plates, and the deck already ships cranial-caudal-angulation.png
# and rao-lao-angulation.png as the teaching diagrams.
REFERENCE = Path(__file__).resolve().parent / "cath-position-refs"
INDEX = Path(__file__).resolve().parent / "cath-slides-index.json"
DEFAULT_SOURCE = ROOT.parent / "Cath Slides.pdf"

# One-based page -> (target key, view slug). The plate title is live text on the
# page and is re-read at extraction time as a cross-check against this table.
PLATES = {
    2: ("lca", "rao-caudal"),
    3: ("lca", "ap-caudal"),
    4: ("lca", "lao-caudal"),
    5: ("lca", "lao-cranial"),
    6: ("lca", "ap-cranial"),
    7: ("lca", "rao-cranial"),
    8: ("rca", "lao-straight"),
    9: ("rca", "ap-lao-cranial"),
    10: ("rca", "rao-straight"),
    11: ("lv", "rao-cranial"),
    12: ("lv", "lao-cranial"),
}

RED = 0xFF0000
# The angiogram is always the right-hand frame; the positioning references are
# always the left-hand column. Nothing in the deck straddles this divide.
FILM_MIN_X = 350
POSITION_MAX_X = 300


def is_red_fill(drawing) -> bool:
    fill = drawing.get("fill")
    return bool(fill) and fill[0] > 0.85 and fill[1] < 0.2 and fill[2] < 0.2


def red_spans(page) -> list[dict]:
    """Anatomy labels: 12pt pure-red text. The plate title is black 18pt."""
    out = []
    for block in page.get_text("dict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            for span in line["spans"]:
                text = span["text"].strip()
                if text and span["color"] == RED:
                    out.append({"text": text, "bbox": fitz.Rect(span["bbox"])})
    return out


def plate_title(page) -> str:
    """The 18pt black heading, e.g. 'LCA: RAO Caudal'."""
    for block in page.get_text("dict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            for span in line["spans"]:
                if span["size"] > 15 and span["text"].strip():
                    return span["text"].strip()
    return ""


def placed_images(page) -> list[dict]:
    out = []
    for info in page.get_images(full=True):
        xref = info[0]
        rects = page.get_image_rects(xref)
        if not rects:
            continue
        out.append({"xref": xref, "rect": rects[0]})
    return out


def pct(value: float, start: float, size: float) -> float:
    return round((value - start) / size * 100, 2)


def main() -> None:
    source = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else DEFAULT_SOURCE
    if not source.exists():
        raise SystemExit(f"Source PDF not found: {source}")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    REFERENCE.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(str(source))
    plates: list[dict] = []
    position_refs: dict[int, str] = {}

    for page_number, (target, view) in sorted(PLATES.items()):
        page = doc[page_number - 1]
        images = placed_images(page)

        films = [i for i in images if i["rect"].x0 > FILM_MIN_X]
        if not films:
            raise SystemExit(f"Page {page_number}: no angiogram frame found")
        # Guard against the small header ornaments that also sit on the right.
        film = max(films, key=lambda i: i["rect"].get_area())
        raw = doc.extract_image(film["xref"])
        # The deck stores every angiogram as JPEG; keep the repo's .jpg suffix.
        name = f"cath-{target}-{view}.{'jpg' if raw['ext'] == 'jpeg' else raw['ext']}"
        (OUTPUT / name).write_bytes(raw["image"])

        rect = film["rect"]
        dots = [
            d for d in page.get_drawings()
            if is_red_fill(d) and rect.x0 <= d["rect"].x0 and d["rect"].x1 <= rect.x1
        ]
        spans = red_spans(page)
        unclaimed = list(dots)
        labels = []
        for span in spans:
            centre = fitz.Point(
                (span["bbox"].x0 + span["bbox"].x1) / 2,
                (span["bbox"].y0 + span["bbox"].y1) / 2,
            )
            def distance(drawing, point=centre):
                mid = fitz.Point(
                    (drawing["rect"].x0 + drawing["rect"].x1) / 2,
                    (drawing["rect"].y0 + drawing["rect"].y1) / 2,
                )
                return abs(mid - point)

            # Each red dot belongs to exactly one label; claim it so a crowded
            # plate cannot silently point two captions at the same vessel.
            near = min(unclaimed, key=distance, default=None)
            if near is not None:
                unclaimed.remove(near)
            anchor = near["rect"] if near else span["bbox"]
            labels.append({
                "text": span["text"],
                # x/y = the anatomic point (the red dot); lx/ly = where the
                # caption sits, both as percentages of the angiogram frame.
                "x": pct((anchor.x0 + anchor.x1) / 2, rect.x0, rect.width),
                "y": pct((anchor.y0 + anchor.y1) / 2, rect.y0, rect.height),
                "lx": pct(centre.x, rect.x0, rect.width),
                "ly": pct(centre.y, rect.y0, rect.height),
            })

        # Positioning references: dedupe by xref across the deck, and also
        # render the region so the drawn C-arm overlay comes with it.
        page_refs = []
        for index, item in enumerate(
            sorted((i for i in images if i["rect"].x0 < POSITION_MAX_X), key=lambda i: i["rect"].y0)
        ):
            axis = "rot" if index == 0 else "tilt"
            ref_name = f"cath-pos-{target}-{view}-{axis}.png"
            pad = 14
            clip = fitz.Rect(
                max(0, item["rect"].x0 - pad), max(0, item["rect"].y0 - pad),
                min(page.rect.x1, item["rect"].x1 + pad), min(page.rect.y1, item["rect"].y1 + pad),
            )
            page.get_pixmap(clip=clip, dpi=220).save(str(REFERENCE / ref_name))
            position_refs[item["xref"]] = ref_name
            page_refs.append({"axis": axis, "file": ref_name})

        plates.append({
            "page": page_number,
            "target": target,
            "view": view,
            "title": plate_title(page),
            "file": name,
            "width": raw["width"],
            "height": raw["height"],
            "labels": labels,
            "positionRefs": page_refs,
        })
        print(f"  p{page_number:>2} {plate_title(page):<24} {name:<32} {len(labels)} labels")

    INDEX.write_text(json.dumps(plates, indent=2) + "\n", encoding="utf-8")
    print(f"\nExtracted {len(plates)} plates and {len(position_refs)} positioning renders to {OUTPUT}")
    print(f"Index written to {INDEX}")


if __name__ == "__main__":
    main()
