#!/usr/bin/env python3
"""
Brand assets, generated from the artwork the client supplied (Sharon.pdf).

    pip install pymupdf
    python tools/logo-assets.py

Everything below is derived from that one file — nothing is hand-drawn, so the
logo on the site can never drift from the registered mark.

Writes into assets/img/:
    sharon-logo.svg        full badge — vector, used for the header/footer mark
    sharon-mark.svg        tea-glass only — vector, reads at favicon sizes
    favicon-32.png         PNG fallback for older browsers
    apple-touch-icon.png   180px, iOS home screen
"""

import pathlib
import pymupdf

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "Sharon.pdf"
OUT = ROOT / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

RING = {"#231f20", "#ffffff", None}          # outer rule, wreath, white disc


def _hex(c):
    return None if c is None else "#%02x%02x%02x" % tuple(round(v * 255) for v in c)


def glass_box(page):
    """Square box around the tea glass, ignoring the ring and the wreath."""
    box = None
    for d in page.get_drawings():
        if {_hex(d.get("fill")), _hex(d.get("color"))} <= RING:
            continue
        box = d["rect"] if box is None else box | d["rect"]
    # Square it off horizontally — the glass is taller than it is wide, and
    # growing sideways keeps us clear of the wreath above and below.
    cx = (box.x0 + box.x1) / 2
    half = box.height / 2
    return pymupdf.Rect(cx - half, box.y0, cx + half, box.y1)


def drop_ring_and_wreath(svg):
    """Remove the outer rule, the laurel wreath and the white disc.

    Crop alone cannot do this — a square box around the glass clips the
    wreath's corners rather than removing them. The glass artwork contains no
    #231f20 of its own, so colour is a safe discriminator.
    """
    kept, removed = [], 0
    for chunk in svg.split("<path"):
        if not kept:                       # text before the first <path>
            kept.append(chunk)
            continue
        is_wreath = 'fill="#231f20"' in chunk or 'stroke="#231f20"' in chunk
        is_disc = 'fill="#ffffff"' in chunk and "C1377" in chunk   # the big circle
        if is_wreath or is_disc:
            removed += 1
            continue
        kept.append(chunk)
    print("  dropped %d ring/wreath paths from the mark" % removed)
    return "<path".join(kept)


def svg_of(page, title):
    svg = page.get_svg_image(text_as_path=True)
    # Give it an accessible name and let it scale to whatever box it is put in.
    return svg.replace(
        "<svg ", '<svg role="img" aria-label="%s" ' % title, 1
    ).replace(' width="', ' data-w="', 1).replace(' height="', ' data-h="', 1)


doc = pymupdf.open(SRC)
page = doc[0]

# 1 ── full badge ─────────────────────────────────────────────────────────
(OUT / "sharon-logo.svg").write_text(
    svg_of(page, "Sharon Tea Stall"), encoding="utf-8")

# 2 ── glass mark: wreath removed, then framed on the glass ──────────────
box = glass_box(page)
mark_svg = drop_ring_and_wreath(svg_of(page, "Sharon Tea Stall"))
mark_svg = mark_svg.replace(
    'viewBox="0 0 1800 1800"',
    'viewBox="%.1f %.1f %.1f %.1f"' % (box.x0, box.y0, box.width, box.height),
    1,
)
(OUT / "sharon-mark.svg").write_text(mark_svg, encoding="utf-8")

# 3 ── raster fallbacks, rendered from that same mark ─────────────────────
tmp = OUT / "_mark.pdf"
pymupdf.open("svg", mark_svg.encode()).save(tmp)
mark_doc = pymupdf.open(tmp)
mk = mark_doc[0]
for name, px in (("favicon-32.png", 32), ("apple-touch-icon.png", 180)):
    scale = px / mk.rect.width
    mk.get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=False).save(OUT / name)
mark_doc.close()
tmp.unlink()

for f in sorted(OUT.iterdir()):
    print("  %-22s %6.1f KB" % (f.name, f.stat().st_size / 1024))
