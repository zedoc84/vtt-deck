#!/usr/bin/env python3
"""Icônes des actions ajoutées depuis la 1.3.0 (pavé, ambiance, page dynamique, séquence, molette),
dans le style des autres : glyphe blanc ; imgs/actions = fond transparent 20/40 px ;
imgs/keys = carré coloré 72/144 px ; imgs/actions/dial-encoder = icône de molette 72/144 px."""
import math, os, sys
from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "com.vttdeck.foundry.sdPlugin", "imgs")
COLORS = {"numpad": (160, 72, 48), "ambiance": (36, 118, 128), "page": (134, 118, 44), "sequence": (98, 66, 140), "dial": (70, 74, 88)}
U = 512  # dessin en haute résolution puis réduction (anticrénelage)
W = (255, 255, 255, 255)

def numpad(d):
    s, g = 120, 26
    x0 = (U - (3 * s + 2 * g)) / 2
    for r in range(3):
        for c in range(3):
            x, y = x0 + c * (s + g), x0 + r * (s + g)
            d.rounded_rectangle([x, y, x + s, y + s], radius=24, fill=W)

def star(d, cx, cy, R, r):
    pts = []
    for i in range(8):
        a = math.pi / 4 * i - math.pi / 2
        rad = R if i % 2 == 0 else r
        pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
    d.polygon(pts, fill=W)

def ambiance(d):
    star(d, 210, 290, 190, 46)
    star(d, 390, 130, 95, 24)
    star(d, 400, 380, 60, 16)

def page(d):
    # deux feuilles décalées + flèche
    d.rounded_rectangle([150, 70, 400, 400], radius=26, outline=W, width=34)
    d.rectangle([80, 120, 330, 450], fill=(0, 0, 0, 0))
    d.rounded_rectangle([80, 120, 330, 450], radius=26, fill=W)
    d.polygon([(150, 215), (265, 285), (150, 355)], fill=(0, 0, 0, 0))

def sequence(d):
    # trois étapes reliées + flèche de lecture
    for i, y in enumerate((90, 230, 370)):
        d.rounded_rectangle([70, y, 300, y + 70], radius=20, fill=W)
    d.rectangle([170, 160, 200, 370], fill=W)
    d.polygon([(350, 160), (460, 256), (350, 352)], fill=W)

def dial(d):
    # molette avec repère
    d.ellipse([86, 86, 426, 426], outline=W, width=40)
    d.ellipse([196, 196, 316, 316], fill=W)
    d.rounded_rectangle([236, 40, 276, 170], radius=18, fill=W)

def glyph(fn):
    im = Image.new("RGBA", (U, U), (0, 0, 0, 0))
    fn(ImageDraw.Draw(im))
    return im

def main():
    for name, fn in (("numpad", numpad), ("ambiance", ambiance), ("page", page), ("sequence", sequence), ("dial", dial)):
        g = glyph(fn)
        for size, suffix in ((20, ""), (40, "@2x")):
            g.resize((size, size), Image.LANCZOS).save(os.path.join(ROOT, "actions", f"{name}{suffix}.png"))
        for size, suffix in ((72, ""), (144, "@2x")):
            key = Image.new("RGBA", (size, size), COLORS[name] + (255,))
            inner = int(size * 0.44)
            gl = g.resize((inner, inner), Image.LANCZOS)
            key.alpha_composite(gl, ((size - inner) // 2, (size - inner) // 2))
            key.convert("RGB").save(os.path.join(ROOT, "keys", f"{name}{suffix}.png"))
        if name == "dial":
            for size, suffix in ((72, ""), (144, "@2x")):
                g.resize((size, size), Image.LANCZOS).save(os.path.join(ROOT, "actions", f"dial-encoder{suffix}.png"))
    print("icônes écrites dans", os.path.normpath(ROOT))

if __name__ == "__main__":
    main()
