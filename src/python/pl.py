from pytube import Playlist
from spenx import Parser

parser = Parser()
pro= 'PLIsQ7ns9vF5BlSWHzSDfrUGrRApl_rKUc' #7
# f= open('./static/data/'+ pro+ '.html', 'w')
f= open('./media/'+ pro+ '.html', 'w')
p= Playlist('https://www.youtube.com/playlist?list='+ pro)
out= parser.parse("""
  div.row.align-items-center
""")
f.write(out)
for x in p.video_urls:
  out= parse.parse(```<div class="col">{%s}</div>```)
  f.write(out.format(x))
f.write('</div>')
f.close();
