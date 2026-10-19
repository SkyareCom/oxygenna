"""Escurece somente o piso da fotografia aprovada de FISIOLOGIA.
Preserva câmara, texto e dimensões; resultado determinístico para o deploy.
Executar após instalar Pillow: python scripts/escurecer-piso-fisiologia.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
ASSET = ROOT / "dist/assets/fisiologia-camara-apresentacao.webp"


def darken_floor(source: Image.Image) -> Image.Image:
    image = source.convert("RGB")
    width, height = image.size
    sx, sy = width / 800, height / 522
    xy = lambda x, y: (round(x * sx), round(y * sy))
    mask = Image.new("L", image.size, 0)
    drawer = ImageDraw.Draw(mask)
    # Contorno do piso; acompanha a base da câmara sem escurecer o equipamento.
    floor = [
        (0, 285), (47, 285), (62, 291), (67, 305), (78, 314),
        (79, 331), (97, 351), (140, 366), (198, 380),
        (254, 394), (321, 399), (347, 405), (490, 405),
        (565, 398), (636, 394), (750, 382), (752, 352),
        (800, 341), (800, 437), (0, 437),
    ]
    drawer.polygon([xy(*p) for p in floor], fill=245)
    mask = mask.filter(ImageFilter.GaussianBlur(radius=3 * sx))
    pixels_mask = mask.load()
    # Transição suave para a faixa inferior clara com o título FISIOLOGIA.
    for y in range(height):
        y_norm = y / sy
        fade = 1 if y_norm <= 420 else max(0, min(1, (440 - y_norm) / 20))
        if fade < 1:
            for x in range(width):
                pixels_mask[x, y] = round(pixels_mask[x, y] * fade)
    recolored = Image.new("RGB", image.size)
    old = image.load()
    new = recolored.load()
    for y in range(height):
        for x in range(width):
            r, g, b = old[x, y]
            xx, yy = x / sx, y / sy
            warmth = max(0, 1 - abs(xx - 142) / 100) * max(0, 1 - abs(yy - 370) / 80)
            new[x, y] = (
                min(255, int(r * .16 + 8 + warmth * 10)),
                min(255, int(g * .19 + 11 + warmth * 7)),
                min(255, int(b * .23 + 14 + warmth * 3)),
            )
    # Juntas discretas do piso cerâmico, com perspectiva e reflexos existentes.
    grout = Image.new("RGBA", image.size, (0, 0, 0, 0))
    lines = ImageDraw.Draw(grout)
    for start, end in [
        ((420, 350), (0, 438)), ((460, 350), (170, 438)),
        ((500, 350), (420, 438)), ((535, 350), (625, 438)),
        ((570, 350), (800, 438)),
    ]:
        lines.line([xy(*start), xy(*end)], fill=(11, 20, 27, 90), width=max(1, round(sx)))
    for y in (413, 430):
        lines.line([xy(0, y), xy(800, y)], fill=(9, 16, 21, 66), width=max(1, round(sx)))
    recolored = Image.alpha_composite(recolored.convert("RGBA"), grout).convert("RGB")
    return Image.composite(recolored, image, mask)


def main():
    if not ASSET.is_file():
        raise FileNotFoundError(f"Imagem original ausente: {ASSET}")
    with Image.open(ASSET) as loaded:
        original = loaded.convert("RGB")
    result = darken_floor(original)
    # Verifica o conteúdo original para evitar alterações no título e na câmara.
    assert result.size == original.size
    assert result.getpixel((400, 470)) == original.getpixel((400, 470))
    assert result.getpixel((550, 180)) == original.getpixel((550, 180))
    assert sum(result.getpixel((500, 417))) < sum(original.getpixel((500, 417)))
    temporary = ASSET.with_suffix(".temporary.webp")
    result.save(temporary, "WEBP", quality=82, method=6)
    temporary.replace(ASSET)
    print(f"OK piso antracito: {ASSET}, {result.width}x{result.height}")


if __name__ == "__main__":
    main()
