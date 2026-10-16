"""Check the team's CSS crop geometry; this does not render a browser."""
from pathlib import Path
import re

css=Path('dist/styles.css').read_text()
minimum=0
align='stretch'
for block in re.findall(r'\.track \.art\{([^{}]+)\}',css):
 for prop,value in re.findall(r'([\w-]+)\s*:\s*([^;]+)',block):
  if prop=='min-height': minimum=float(value.strip().removesuffix('px'))
  if prop=='align-self': align=value.strip()
for viewport in [320,360,390,430,480]:
 width=(viewport-(40 if viewport<=430 else 48)-2)*.345
 height=max(width*96/155,minimum)
 assert align!='stretch','The crop viewport must not stretch with card height'
 scale=width/155
 source_y=height*7.21875/scale
 source_bottom=source_y+height/scale
 assert abs(source_y-693)<.001,(viewport,source_y)
 assert abs(source_bottom-789)<.001,(viewport,source_bottom)
print('Approved team artwork crop preserved at five viewport widths (geometry only).')
