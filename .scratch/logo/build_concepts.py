"""Exploration geometry for the kulaSQL mark. Black on white."""
import math
from pathlib import Path

OUT = Path(__file__).parent


def svg(body: str, vb: str = "0 0 256 256") -> str:
    w, h = vb.split()[2], vb.split()[3]
    return (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{w}" height="{h}" '
        'role="img" aria-labelledby="title">\n'
        "  <title id=\"title\">kulaSQL</title>\n"
        f"{body}\n"
        "</svg>\n"
    )


def poly(points, decimals=1) -> str:
    bits = []
    for x, y in points:
        bits.append(f"{x:.{decimals}f},{y:.{decimals}f}")
    return " ".join(bits)


def bar(x1, y1, x2, y2, width) -> list[tuple[float, float]]:
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy)
    ux, uy = dx / length, dy / length
    px, py = -uy * width / 2, ux * width / 2
    return [
        (x1 + px, y1 + py),
        (x2 + px, y2 + py),
        (x2 - px, y2 - py),
        (x1 - px, y1 - py),
    ]


def clockwise(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    area = 0.0
    for i, (x, y) in enumerate(points):
        x2, y2 = points[(i + 1) % len(points)]
        area += x * y2 - x2 * y
    return points if area > 0 else list(reversed(points))


def path_from(polygons) -> str:
    parts = []
    for raw in polygons:
        points = clockwise(raw)
        cmd = [f"M {points[0][0]:.1f} {points[0][1]:.1f}"]
        for x, y in points[1:]:
            cmd.append(f"L {x:.1f} {y:.1f}")
        cmd.append("Z")
        parts.append(" ".join(cmd))
    return " ".join(parts)


def caret_k() -> str:
    # Lowercase k. Centerlines use an exact 30°. Ends are buried in the stem and the cursor.
    stem = [(36, 12), (84, 12), (84, 232), (36, 232)]
    rise = 130 * math.tan(math.radians(30))
    upper = bar(70, 144, 200, 144 - rise, 32)
    cursor = [(158, 34), (226, 34), (226, 106), (158, 106)]
    drop = 88 * math.tan(math.radians(30))
    lower = bar(70, 172, 158, 172 + drop, 32)
    d = path_from([stem, upper, cursor, lower])
    return f'  <path fill="#111111" d="{d}"/>'


def query_cursor() -> str:
    # The row being written ends in the caret. The row above is the result already returned.
    row_done = [(28, 68), (132, 68), (132, 112), (28, 112)]
    row_live = [(28, 136), (168, 136), (168, 180), (28, 180)]
    caret = [(156, 124), (216, 124), (216, 192), (156, 192)]
    d = path_from([row_done, row_live, caret])
    return f'  <path fill="#111111" d="{d}"/>'


def wordmark() -> str:
    # Geometric kulaSQL. The l is the block caret. Height 256, width follows the letters.
    # Shared measures: stem 32, cap 48–208, x-height 96–208, baseline 208.
    shapes: list[list[tuple[float, float]]] = []
    x = 8.0

    def add_rect(rx, ry, rw, rh):
        shapes.append([(rx, ry), (rx + rw, ry), (rx + rw, ry + rh), (rx, ry + rh)])

    # k
    add_rect(x, 48, 32, 160)
    kx = x
    shapes.append(bar(kx + 16, 158, kx + 78, 158 - 62 * math.tan(math.radians(30)), 28))
    shapes.append(bar(kx + 18, 176, kx + 86, 176 + 68 * math.tan(math.radians(30)), 28))
    x += 108

    # u — two stems and a flat bottom bar (geometric, not a thin curve)
    add_rect(x, 96, 28, 92)
    add_rect(x + 56, 96, 28, 112)
    add_rect(x, 176, 84, 32)
    x += 108

    # l — the block caret, full ascender, same width as a cursor
    add_rect(x, 48, 36, 160)
    x += 60

    # a — single story: bowl as a ring (evenodd later) plus stem
    # Drawn as outer rounded bowl via two rects making a D, hole added separately.
    bowl_x = x
    add_rect(x, 112, 28, 96)  # left of bowl
    add_rect(x, 112, 72, 28)  # top
    add_rect(x, 180, 72, 28)  # bottom
    add_rect(x + 52, 112, 28, 96)  # stem
    x += 100

    # SQL — same skeleton, slightly tighter, still the same family
    # S as three bars
    add_rect(x, 96, 64, 26)
    add_rect(x, 146, 64, 26)
    add_rect(x, 182, 64, 26)
    add_rect(x, 96, 26, 76)  # left stem of S top
    add_rect(x + 38, 146, 26, 62)  # right stem of S bottom
    x += 84

    # Q — bowl plus a short tail at 45°
    add_rect(x, 96, 26, 112)
    add_rect(x + 46, 96, 26, 112)
    add_rect(x, 96, 72, 26)
    add_rect(x, 182, 72, 26)
    shapes.append(bar(x + 40, 168, x + 78, 206, 22))
    x += 96

    # L
    add_rect(x, 48, 32, 160)
    add_rect(x, 176, 72, 32)
    x += 80

    d = path_from(shapes)
    width = int(math.ceil(x))
    return svg(f'  <path fill="#111111" d="{d}"/>', f"0 0 {width} 256"), width


def tile() -> str:
    # The caret k knocked out of a night-ink tile. Same geometry, smaller, centred.
    body = caret_k().replace('fill="#111111"', 'fill="#111111"')
    return (
        '  <rect x="0" y="0" width="256" height="256" rx="56" fill="#111111"/>\n'
        '  <g transform="translate(128 128) scale(0.62) translate(-128 -128)">\n'
        f"{body}\n"
        "  </g>"
    )


def main() -> None:
    (OUT / "concept-a-caret-k.svg").write_text(svg(caret_k()), encoding="utf-8")
    (OUT / "concept-b-query.svg").write_text(svg(query_cursor()), encoding="utf-8")
    # Knockout: tile minus the k. Built as a mask-free evenodd by painting the k in white
    # for the concept sheet only; the installed favicon uses the real ink and lamp colours.
    (OUT / "concept-c-tile.svg").write_text(
        svg(
            '  <rect width="256" height="256" rx="56" fill="#111111"/>\n'
            '  <g transform="translate(128 128) scale(0.62) translate(-128 -128)">\n'
            + caret_k().replace("#111111", "#ffffff")
            + "\n  </g>"
        ),
        encoding="utf-8",
    )
    print("wrote concepts")


if __name__ == "__main__":
    main()
