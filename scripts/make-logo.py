from PIL import Image
import base64
import os

src = (
    r"C:\Users\salva\.cursor\projects\c-projetos-react-plataforma-ai-langchain-front-react"
    r"\assets\c__Users_salva_AppData_Roaming_Cursor_User_workspaceStorage_"
    r"717fe46d92845995b19987130966cac0_images_Copilot_20260906_082951-0af7604c-169e-4049-b61c-a2f4b645d2fd.png"
)
out_dir = os.path.join(os.path.dirname(__file__), "..", "public")
os.makedirs(out_dir, exist_ok=True)

im = Image.open(src).convert("RGBA")
w, h = im.size
px = im.load()

for y in range(0, 80):
    for x in range(int(w * 0.78), w):
        px[x, y] = (0, 0, 0, 0)

for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        if a and max(r, g, b) < 28:
            px[x, y] = (0, 0, 0, 0)

bbox = im.getbbox()
if bbox:
    im = im.crop(bbox)

png_path = os.path.join(out_dir, "logo-langconect.png")
im.save(png_path, "PNG")

with open(png_path, "rb") as handle:
    b64 = base64.b64encode(handle.read()).decode("ascii")
iw, ih = im.size
svg_path = os.path.join(out_dir, "logo-langconect.svg")
with open(svg_path, "w", encoding="utf-8") as handle:
    handle.write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {iw} {ih}" '
        f'width="{iw}" height="{ih}" role="img" aria-label="LangConect">'
        f'<image href="data:image/png;base64,{b64}" width="{iw}" height="{ih}"/>'
        f"</svg>\n"
    )
print("png", im.size, os.path.getsize(png_path))
print("svg", os.path.getsize(svg_path))
