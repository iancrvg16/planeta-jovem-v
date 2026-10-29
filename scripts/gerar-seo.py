#!/usr/bin/env python3
"""Compõe cards de compartilhamento e favicons a partir dos assets recebidos."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import json

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
OUT=PUBLIC/'og'; OUT.mkdir(exist_ok=True)
manifest=json.loads((ROOT/'src/data/generated/midias.json').read_text())
hero=json.loads((ROOT/'src/data/generated/hero.json').read_text())
font_file=Path('/usr/share/fonts/dejavu-sans-fonts/DejaVuSans-Bold.ttf')
if not font_file.exists():
    options=list(Path('/usr/share/fonts').rglob('*Sans*Bold.ttf'))
    if not options: raise SystemExit('Instale uma fonte Sans Bold em /usr/share/fonts.')
    font_file=options[0]
def font(size):return ImageFont.truetype(str(font_file),size)
def make(name,title,subtitle,image=None,color='#271b48'):
    canvas=Image.new('RGB',(1200,630),color)
    if image:
        im=ImageOps.fit(Image.open(PUBLIC/image.lstrip('/')).convert('RGB'),(950,630),centering=(.52,.48));canvas.paste(im,(250,0))
    overlay=Image.new('RGBA',canvas.size)
    d=ImageDraw.Draw(overlay)
    for x in range(1200):
        opacity=round(245*(1-min(x/1050,1))**.7)
        d.line((x,0,x,630),fill=(14,15,37,opacity))
    canvas=Image.alpha_composite(canvas.convert('RGBA'),overlay)
    logo=Image.open(PUBLIC/'assets/planeta-jovem-marca.webp').convert('RGBA');logo.thumbnail((240,100));canvas.alpha_composite(logo,(64,49))
    d=ImageDraw.Draw(canvas);d.text((66,203),'PLANETA JOVEM V  /  A CONEXÃO COM A TERRA',font=font(16),fill='#ddd5eb')
    for i,line in enumerate(title.split('\n')): d.text((62,260+i*85),line,font=font(68),fill='#fff5fc' if i==0 else '#ffa4d2')
    d.text((66,492),subtitle,font=font(22),fill='#eee6f5')
    d.line((66,565,1110,565),fill='#917296',width=1);d.text((66,585),'PIRAMBU INNOVATION',font=font(13),fill='#c0b4cf')
    canvas.convert('RGB').save(OUT/f'{name}.jpg',quality=86,optimize=True)
make('inicio','Chegamos ao\nPlaneta Jovem.','A conexão com a Terra.',hero['src'])
for slug,name,motto,filename in [('galixandria','Galixandria','Terra, Mar, União.','1789400638988.png'),('astalania','Astalânia','Sustentabilidade · Biodiversidade · Soberania Digital','Bárbara 13 setembro 2 (BANDEIRA).png'),('jakkar','Jakkar','Diferentes vales, um só povo.','Bandeira de Jakkar.png'),('jambor','Jambor','Nosso país, nosso futuro.','bandeira de Jambor.jpeg'),('lervuria','Lervúria','Progresso e Preservação','lervuria-bandeira.png')]:
    image=next((m['src'] for m in manifest if m['original']==filename),None)
    make(slug,name,motto,image)
# Símbolo circular do O oficial, sem inventar outra marca.
logo=Image.open(PUBLIC/'assets/planeta-jovem-oficial.png').convert('RGBA')
symbol=logo.crop((86,108,167,188)); back=Image.new('RGBA',(112,112),'#15122c');symbol.thumbnail((88,88));back.alpha_composite(symbol,((112-symbol.width)//2,(112-symbol.height)//2))
back.save(PUBLIC/'favicon.ico',sizes=[(16,16),(32,32),(48,48)])
back.resize((180,180),Image.Resampling.LANCZOS).save(PUBLIC/'apple-touch-icon.png')
back.resize((64,64),Image.Resampling.LANCZOS).save(PUBLIC/'assets/favicon-64.png')
print('OG 1200×630 e favicons gerados em public/.')
