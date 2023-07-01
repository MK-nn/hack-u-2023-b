import os
import time
import subprocess
import Adafruit_DHT as DHT
import datetime
from playsound import playsound
import random

while True:
    SENSOR_TYPE =DHT.DHT22 
    DHT_GPI0 = 4

    humidity, temperature = DHT.read_retry(SENSOR_TYPE, DHT_GPI0)
    print("humidity, temperature", humidity, temperature)

    current_date = datetime.date.today()
    year = current_date.year
    month = current_date.month
    day = current_date.day

    def dog_voice(humidity, temperature, month):
        if month >=3 and month <=9:
            if temperature >= 25 and temperature <=28:
                if humidity >= 45 and humidity <= 60:
                    sound_file = "/home/pi/Desktop/bow/犬の鳴き声3.mp3"
                else:
                    sound_file = "/home/pi/Desktop/bow/small_dog1.mp3"
            else:
                sound_file ="/home/pi/Desktop/bow/small_dog1.mp3"
        else:
            if temperature >=18    and temperature<=22  :
                if humidity >=55  and humidity <=65 :
                    sound_file ="/home/pi/Desktop/bow/犬の鳴き声3.mp3"
                else:
                    sound_file = "/home/pi/Desktop/bow/small_dog1.mp3"
            else:
                sound_file = "/home/pi/Desktop/bow/small_dog1.mp3"

        print("sound_file", sound_file)

        # コマンドを実行して音声を再生
        print("sound play")
        playsound(sound_file)

    dog_voice(humidity, temperature, month)

    #time stop
    time.sleep(random.randrange(5,15,5))
    dt_now = datetime.datetime.now()
    if dt_now.hour==21 and dt_now.minute==4:
        print('break')
        break
