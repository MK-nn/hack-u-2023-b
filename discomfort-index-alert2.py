#!/usr/bin/python3
# coding: utf-8
import Adafruit_DHT as DHT
from playsound import playsound
import time
import datetime
import random

while True:
    # センサータイプを選ぶ
    SENSOR_TYPE = DHT.DHT22

    # 今回はGPIO04を使う 
    DHT_GPIO = 4

    # DHT22のデータを取得
    h,t = DHT.read_retry(SENSOR_TYPE, DHT_GPIO)

    # データ形式を整えて出力
    message_temp = "Temp= {0:0.1f} deg C".format(t)
    message_humidity = "Humidity= {0:0.1f} %".format(h)
    message = message_temp +". " + message_humidity
    print (message)

    #不快度の計算
    discomfort_index=0.81*t+h*0.01*(0.99*t-14.3)+46.3
    print (discomfort_index)

    #エアコンをつけるかどうか
    dt_now = datetime.datetime.now()
    
    if dt_now.month>=6 and dt_now.month<=9: 
        if discomfort_index>50 or t>=31:
            print("エアコンをつけてください")
            playsound("/home/pi/Desktop/小夜(SAYO)　音声ファイル/001_小夜SAYO（ノーマル）_暑いワン。エアコン….wav")
        else:
            #本当に危ないよ！
            if t >= 30 or discomfort_index >= 80:
                playsound("/home/pi/Desktop/小夜(SAYO)　音声ファイル/001_小夜SAYO（ノーマル）_暑いよ～苦しいワン！.wav")
                #弱々しい声のほうがgood
            else:
                #これ以上は危ないかも？！
                if t>= 28 or discomfort_index >= 75:
                    playsound("/home/pi/Desktop/小夜(SAYO)　音声ファイル/001_小夜SAYO（ノーマル）_暑くなってきたワン.wav")
                else:
                    #ちょうどいい温度！
                    if 26<t<28 or 60<discomfort_index<70:
                        playsound("/home/pi/Desktop/小夜(SAYO)　音声ファイル/001_小夜SAYO（ノーマル）_元気になってきたワ….wav")
                        #ハツラツとした明るい声がgood
                    else:
                        #夏でも冷え過ぎ！
                        if t < 26:
                            playsound("/home/pi/Desktop/小夜(SAYO)　音声ファイル/001_小夜SAYO（ノーマル）_ちょっと冷えてきた….wav")
    else :
        #冬のちょっと暑すぎな時
        if 23<t or h>60:
            playsound("/home/pi/Desktop/小夜(SAYO)　音声ファイル/001_小夜SAYO（ノーマル）_空気こもってない？….wav")
        else:
            #冬のちょうどいいとき
            if 20<t<22 or 60<discomfort_index<70:
                playsound("/home/pi/Desktop/小夜(SAYO)　音声ファイル/001_小夜SAYO（ノーマル）_気持ちいいワン.wav")
            else:
                #冬すこし寒いとき
                if t<=20 or discomfort_index<55:
                    playsound("/home/pi/Desktop/小夜(SAYO)　音声ファイル/001_小夜SAYO（ノーマル）_寒くなってきたワン.wav")
                else:
                    #めちゃめちゃ寒い！
                    if t<16:
                        playsound("/home/pi/Desktop/小夜(SAYO)　音声ファイル/002_小夜SAYO（ノーマル）_寒すぎて震えてくる….wav")
                    else:
                        #乾燥しすぎ
                        if h<50:
                            playsound("/home/pi/Desktop/小夜(SAYO)　音声ファイル/003_小夜SAYO（ノーマル）_乾燥してるワン.wav ")
                            
    #time stop
    time.sleep(10)
    if dt_now.hour==0 and dt_now.minute==48:
        print('break')
        break
