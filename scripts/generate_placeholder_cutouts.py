"""Generate placeholder PNGs with transparent backgrounds for the image map prototype.

Run once: `python3 scripts/generate_placeholder_cutouts.py`
Outputs go to assets/images/cutouts/.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / "assets" / "images" / "cutouts"
OUT.mkdir(parents=True, exist_ok=True)


def _font(size: int) -> ImageFont.ImageFont:
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def polaroid() -> None:
    """A tilted-photo-style placeholder. Crops to its visible content."""
    w, h = 240, 280
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((10, 10, w - 10, h - 10), radius=4,
                        fill=(255, 252, 245, 255),
                        outline=(180, 170, 150, 255), width=2)
    d.rectangle((28, 28, w - 28, h - 78), fill=(120, 150, 180, 255))
    d.polygon([(28, h - 78), (90, h - 140), (140, h - 100), (200, h - 160), (w - 28, h - 78)],
              fill=(80, 110, 140, 255))
    d.ellipse((170, 45, 200, 75), fill=(255, 230, 120, 255))
    font = _font(18)
    d.text((w // 2, h - 50), "about", fill=(60, 50, 40, 255), font=font, anchor="mm")
    img.save(OUT / "polaroid.png")


def sticker() -> None:
    """A circular sticker with a wavy edge."""
    size = 220
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # Wavy outer edge built from overlapping circles
    import math
    cx, cy = size // 2, size // 2
    points = []
    for i in range(72):
        angle = i / 72 * 2 * math.pi
        bump = 6 if i % 2 == 0 else 0
        r = 95 + bump
        points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    d.polygon(points, fill=(255, 90, 130, 255), outline=(180, 40, 80, 255))
    d.ellipse((cx - 78, cy - 78, cx + 78, cy + 78), fill=(255, 240, 245, 255),
              outline=(180, 40, 80, 255), width=3)
    font = _font(28)
    d.text((cx, cy - 14), "READ", fill=(180, 40, 80, 255), font=font, anchor="mm")
    d.text((cx, cy + 18), "the blog", fill=(180, 40, 80, 255), font=_font(18), anchor="mm")
    img.save(OUT / "sticker.png")


def badge() -> None:
    """A pixelated retro star badge."""
    size = 180
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    import math
    cx, cy = size // 2, size // 2
    outer, inner = 80, 32
    points = []
    for i in range(10):
        angle = -math.pi / 2 + i * math.pi / 5
        r = outer if i % 2 == 0 else inner
        points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    d.polygon(points, fill=(255, 210, 60, 255), outline=(180, 130, 0, 255))
    font = _font(16)
    d.text((cx, cy), "HOME", fill=(120, 80, 0, 255), font=font, anchor="mm")
    img.save(OUT / "badge.png")


def button88() -> None:
    """A classic 88x31 web button."""
    w, h = 176, 62  # 2x for retina sharpness
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, w - 1, h - 1), fill=(20, 20, 60, 255), outline=(255, 255, 255, 255), width=2)
    d.rectangle((4, 4, w - 5, h - 5), outline=(120, 200, 255, 255), width=1)
    font = _font(20)
    d.text((w // 2, h // 2 - 8), "TONYSAINEZ", fill=(120, 200, 255, 255), font=font, anchor="mm")
    d.text((w // 2, h // 2 + 14), ".com", fill=(255, 100, 200, 255), font=_font(14), anchor="mm")
    img.save(OUT / "button88.png")


def speech_bubble() -> None:
    """A speech-bubble shape for a guestbook/contact link."""
    w, h = 240, 180
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((10, 10, w - 10, h - 50), radius=20,
                        fill=(190, 240, 200, 255),
                        outline=(60, 130, 80, 255), width=3)
    d.polygon([(60, h - 50), (50, h - 10), (100, h - 50)],
              fill=(190, 240, 200, 255), outline=(60, 130, 80, 255))
    d.line([(60, h - 50), (50, h - 10)], fill=(60, 130, 80, 255), width=3)
    d.line([(50, h - 10), (100, h - 50)], fill=(60, 130, 80, 255), width=3)
    d.line([(60, h - 51), (100, h - 51)], fill=(190, 240, 200, 255), width=3)
    font = _font(22)
    d.text((w // 2, (h - 50) // 2 + 5), "say hi", fill=(40, 90, 60, 255), font=font, anchor="mm")
    d.text((w // 2, (h - 50) // 2 + 30), "(email me)", fill=(60, 130, 80, 255), font=_font(14), anchor="mm")
    img.save(OUT / "speech.png")


if __name__ == "__main__":
    polaroid()
    sticker()
    badge()
    button88()
    speech_bubble()
    print(f"Wrote 5 PNGs to {OUT}")
