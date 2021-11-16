from pytube import Playlist
pro= 'PLIsQ7ns9vF5BlSWHzSDfrUGrRApl_rKUc' #7
f= open('./static/data/'+ pro+ '.html', 'w')
p= Playlist('https://www.youtube.com/playlist?list='+ pro)
for x in p.video_urls:
  f.write("<div></div>")
