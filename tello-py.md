# Tello 無人機測試

### 飛行控制
 - 參考 
   - https://github.com/hanyazou/TelloPy
   - https://github.com/katoy/dron-tello/blob/master/tello3.py
```
pip install tellopy

$ python
>>> import tellopy
>>> help(tellopy)
Help on package tellopy:
...
```


### 影像控制
- 參考:
  - https://github.com/Ubotica/telloCV/
  - https://github.com/hanyazou/TelloPy#video_effect
```
sudo apt-get install -y python-dev python-virtualenv pkg-config
sudo sudo apt-get install -y \
    libavformat-dev libavcodec-dev libavdevice-dev \
    libavutil-dev libswscale-dev libavresample-dev \
    libavfilter-dev libswresample-dev
```

** 較舊版本ubuntu: 可能會發生 libswresample-dev 查無套件，須以以下步驟處理
```
https://www.ffmpeg.org/download.html
Unpack it.
tar -xvf ffmpeg-3.3.2.tar.bz2
then change to that directory and:
./configure
make
sudo make install
```
 
```
$ pip install av
$ pip install opencv-python
$ pip install image
$ python -m tellopy.examples.video_effect
```
