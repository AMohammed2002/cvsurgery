#!/usr/bin/env python3
"""Extract the source figures used by the Day 5 angiography module.

Usage:
    python3 tools/extract-angiography-assets.py /path/to/angiography-slides.pdf

The mapping is intentionally page-specific so rerunning the tool produces stable,
descriptive web asset names instead of opaque PowerPoint image identifiers.
"""

from pathlib import Path
import sys

from pypdf import PdfReader


SOURCE = Path(sys.argv[1]).expanduser() if len(sys.argv) > 1 else Path(
    "/Users/aymanmohammed/Downloads/Basic-Coronary-Angiography_All-Slides (1).pdf"
)
OUTPUT = Path(__file__).resolve().parents[1] / "assets" / "angiography"

# (one-based slide, zero-based image index): stable output filename
ASSETS = {
    (4, 0): "history-first-coronary-frame.jpg",
    (4, 1): "history-first-angiography-lab.jpg",
    (15, 0): "pressure-ventricularization-waveform.png",
    (16, 0): "cranial-caudal-angulation.png",
    (17, 0): "rao-lao-angulation.png",
    (20, 0): "projection-rao-caudal-geometry.png",
    (20, 1): "projection-rao-caudal-tree.png",
    (21, 0): "projection-lao-cranial-tree.png",
    (22, 0): "projection-steep-lao-tree.png",
    (23, 0): "projection-true-lateral-tree.png",
    (23, 1): "projection-true-lateral-geometry.png",
    (24, 0): "projection-rca-lao-cranial.png",
    (25, 0): "projection-rca-rao-cranial.png",
    (26, 0): "angiogram-left-lao-cranial.jpg",
    (27, 0): "angiogram-left-rao-cranial.jpg",
    (28, 0): "angiogram-left-spider.jpg",
    (29, 0): "angiogram-left-rao-cranial-long.jpg",
    (30, 0): "angiogram-left-rao-caudal.jpg",
    (31, 0): "angiogram-rca-lao-cranial.jpg",
    (32, 0): "angiogram-rca-lao-cranial-distal.jpg",
    (33, 0): "angiogram-rca-rao.jpg",
    (34, 0): "challenge-left-rao-caudal.jpg",
    (36, 0): "challenge-left-lao-cranial.jpg",
    (38, 0): "challenge-left-ramus.jpg",
    (40, 0): "aha-lesion-type-a.png",
    (40, 1): "aha-lesion-type-b.png",
    (40, 2): "aha-lesion-type-b2.png",
    (40, 3): "aha-lesion-type-c.png",
    (41, 0): "angiogram-calcified-plaque.jpg",
    (42, 0): "angiogram-coronary-thrombus.jpg",
    (43, 0): "angiogram-air-embolism.jpg",
    (44, 0): "myocardial-bridge-cross-sections.png",
    (44, 1): "myocardial-bridge-systolic-sequence.png",
    (44, 2): "myocardial-bridge-mechanism.jpg",
    (46, 0): "angiogram-lad-pa-fistula.jpg",
    (48, 0): "anomaly-normal-origins.jpg",
    (48, 1): "anomaly-left-main-from-right-cusp.jpg",
    (48, 2): "anomaly-rca-from-left-cusp.jpg",
    (50, 0): "anomalous-lcx-course.png",
    (50, 1): "anomalous-lcx-coronary-frame.png",
    (50, 2): "anomalous-lcx-angiogram.jpg",
    (51, 0): "coronary-collateral-pathways.jpg",
    (52, 0): "angiogram-coronary-aneurysm.jpg",
}


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Source PDF not found: {SOURCE}")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    reader = PdfReader(str(SOURCE))
    written = []

    for (page_number, image_index), filename in ASSETS.items():
        images = reader.pages[page_number - 1].images
        if image_index >= len(images):
            raise SystemExit(
                f"Slide {page_number} has {len(images)} images; cannot extract index {image_index}"
            )
        target = OUTPUT / filename
        target.write_bytes(images[image_index].data)
        written.append(target)

    print(f"Extracted {len(written)} angiography assets to {OUTPUT}")


if __name__ == "__main__":
    main()
