rm video.mp4
ffmpeg -i input.mp4 -vf scale=-1:720 -r 30 video.mp4

