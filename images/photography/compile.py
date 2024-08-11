"""
script that compiles website my photos
at the end, each directory will be layed out as:

[folder]
    [thumbnails] (folder that contains the resized images)
    [input] (folder that contains files to be converted)
    [stamp] (file that stores the recent created id)
    <reszied images>
"""

from os.path import join as join_path
from os.path import exists as path_exist
from os.path import dirname,isdir,isfile
from os import listdir,mkdir
from subprocess import Popen
SCRIPT_PATH = dirname(__file__)
DIRECTORY_LIST = listdir(SCRIPT_PATH)

def generate_ffmpeg_clamp(max_size : int):
    return "-vf 'scale=if(gte(iw\,ih)\,min({}\,iw)\,-2):if(lt(iw\,ih)\,min({}\,ih)\,-2)'".format(max_size,max_size)

for files in DIRECTORY_LIST:
    target_directory = join_path(SCRIPT_PATH,files)
    
    if isdir(target_directory):
        
        thumbnail_fd_location = join_path(target_directory,"thumbnails")
        if not isdir(thumbnail_fd_location):
            mkdir(thumbnail_fd_location)

        stamp_id_file_location = join_path(target_directory,"stamp")

        if not isfile(stamp_id_file_location):
            open(stamp_id_file_location,"w").close()

        stamp_id_file = open(join_path(target_directory,"stamp"),"r+")
        stamp_id = -1

        try:
            stamp_id = int(stamp_id_file.read())
        except:
            pass

        # look for the input folder
        input_folder = join_path(target_directory,"input")
        if not path_exist(input_folder):
            # the user needs to create an input folder
            print("no input folder, skipping! ", target_directory)
            continue

        queued_pictures = listdir(input_folder)
        # we create thumbnails and lower quailty photos using ffmpeg
        # thumbnails have a max size of 1024 pixels on both the width and height
        # images have a max size of 2000 pixels on both the width and height
        for pictures in queued_pictures:
            stamp_id +=1
            target_picture = join_path(input_folder,pictures)
            output_thumbnail = join_path(thumbnail_fd_location,str(stamp_id))
            output_image = join_path(target_directory,str(stamp_id))

            Popen('ffmpeg -y -i {} {} {}.jpg'.format(target_picture,generate_ffmpeg_clamp(1024),output_thumbnail),shell=True).wait()
            Popen('ffmpeg -y -i {} {} {}.jpg'.format(target_picture,generate_ffmpeg_clamp(2048),output_image),shell=True).wait()

        stamp_id_file.seek(0)
        stamp_id_file.write(str(stamp_id))