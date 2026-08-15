"""Derive the public/ icon set from tmp/another-star-logo-assets/.

Only two source files are usable as-is:
  - another-star-search-icon-512.png : contains the circular AS mark (plus a
    "48x48" caption that has to be cropped away)
  - another-star-ogp-1200x630.png    : the OGP artwork (has transparent edge rows)
Everything else in that folder is a screenshot of the same spec sheet.
"""
from PIL import Image, ImageDraw
import numpy as np
import os

SRC = "/Users/naoya.yasuda/another-star-figma/tmp/another-star-logo-assets"
OUT = "/Users/naoya.yasuda/another-star-figma/public"

# --- 1. circular mark -------------------------------------------------------
sheet = Image.open(os.path.join(SRC, "another-star-search-icon-512.png")).convert("RGBA")
mark = sheet.crop((143, 33, 509, 400))          # disc only, caption excluded
CX, CY, R = 182.5, 183.5, 180.0                 # disc geometry inside `mark`
SS = 8                                          # supersampling for the mask


def render(size, background=None):
    """Return `size`x`size` icon: the disc scaled to fill the square edge to edge."""
    scale = size / (2 * R)
    w, h = int(round(mark.width * scale)), int(round(mark.height * scale))
    big = mark.resize((w, h), Image.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.paste(big, (int(round(size / 2 - CX * scale)),
                       int(round(size / 2 - CY * scale))))

    # crisp circular mask, trimmed slightly to drop the source drop-shadow ring
    m = Image.new("L", (size * SS, size * SS), 0)
    inset = size * SS * 0.006
    ImageDraw.Draw(m).ellipse([inset, inset, size * SS - inset, size * SS - inset], fill=255)
    canvas.putalpha(Image.composite(canvas.getchannel("A"),
                                    Image.new("L", (size, size), 0),
                                    m.resize((size, size), Image.LANCZOS)))

    if background:
        flat = Image.new("RGBA", (size, size), background)
        canvas = Image.alpha_composite(flat, canvas)
    return canvas


WHITE = (255, 255, 255, 255)

# transparent circle — browser tabs and Google's search-result icon
for n in (16, 32, 48, 96, 192):
    render(n).save(os.path.join(OUT, f"favicon-{n}.png"))

# .ico for legacy/bookmark surfaces
render(64).save(os.path.join(OUT, "favicon.ico"),
                sizes=[(16, 16), (32, 32), (48, 48)])

# opaque — iOS home screen and Android/PWA reject transparency (renders black)
render(180, WHITE).convert("RGB").save(os.path.join(OUT, "apple-touch-icon.png"))
for n in (192, 512):
    render(n, WHITE).convert("RGB").save(os.path.join(OUT, f"icon-{n}.png"))

# Organization logo for the knowledge panel
render(512, WHITE).convert("RGB").save(os.path.join(OUT, "company-logo-512.png"))

# --- 2. OGP -----------------------------------------------------------------
og = Image.open(os.path.join(SRC, "another-star-ogp-1200x630.png")).convert("RGBA")
a = np.asarray(og).copy()
opaque = np.nonzero((a[..., 3] > 250).sum(1) > a.shape[1] * 0.9)[0]
top, bottom = opaque[0], opaque[-1]
a[:top] = a[top]          # extend the gradient into the transparent edge bands
a[bottom + 1:] = a[bottom]
Image.fromarray(a).convert("RGB").save(os.path.join(OUT, "og-image.png"), optimize=True)

for f in sorted(os.listdir(OUT)):
    if f.endswith((".png", ".ico")) and ("icon" in f or "favicon" in f or "logo" in f or f.startswith("og-")):
        p = os.path.join(OUT, f)
        print(f"{f:26} {Image.open(p).size} {os.path.getsize(p) // 1024}KB")
