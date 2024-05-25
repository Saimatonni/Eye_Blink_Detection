import matplotlib.pyplot as plt
from scipy.spatial import distance as dist
from imutils.video import FileVideoStream
from imutils.video import VideoStream
from imutils import face_utils
import numpy as np
import pandas as pd
import argparse
import imutils
from config.db import db
import time
import cv2
import base64
from models.blink_detection import BlinkDetectionResult

def run_blink_detection(keep_running, userId: str):
    vs = VideoStream(src=0).start() 
    time.sleep(2.0)  
    fps = 30

    prevision_file_path = "data_final.csv"

    SHOWCASE_DATA = pd.read_csv(prevision_file_path, index_col="frame")
    SHOWCASE_DATA_CUMSUM = SHOWCASE_DATA.cumsum(axis=0)
    SHOWCASE_DATA_CUMSUM = SHOWCASE_DATA_CUMSUM.drop('ear_norm', axis=1)

    def mediaMoblieBlinkRate(df, wind):
        list_blink = list(df)
        list_blink_tmp = list()
        for i in range(wind, len(list_blink)):
            list_blink_tmp.append(sum(list_blink[i - wind:i]) / wind)
        series_blink = pd.Series(list_blink_tmp, index=range(wind, len(list_blink)))
        return series_blink

    def smoth_BR_moving_av(df, wind):
        indici = df.index
        list_blink = list(df)
        list_blink_tmp = list()
        for i in range(int(wind / 2), len(list_blink) - int(wind / 2)):
            list_blink_tmp.append(sum(list_blink[i - int(wind / 2):i + int(wind / 2)]) / wind)
        series_blink = pd.Series(list_blink_tmp, index=range(indici[0] + int(wind / 2), indici[-1] - int(wind / 2)))
        return series_blink

    DF_BLINK = SHOWCASE_DATA
    DF_MOV_BR = mediaMoblieBlinkRate(list(DF_BLINK.blink), 20 * fps)
    DF_MOV_BR = DF_MOV_BR * fps * 60
    SMOOTH_BR = DF_MOV_BR.rolling(window=3 * fps, center=False).mean()
    DF_BLINK = DF_BLINK[DF_BLINK.blink > 0]

    FRAME = 1

    secondi = SHOWCASE_DATA.index / fps
    my_xticks = list()
    for i in secondi:
        my_xticks.append(time.strftime("%M:%S", time.gmtime(i)))

    while keep_running.is_set():
        frame = vs.read()
        frame = imutils.resize(frame, width=450)

        fig = plt.figure()
        ax1 = fig.add_subplot(2, 1, 1)
        SHOWCASE_DATA.ear_norm[max([0, FRAME - 20 * fps]):FRAME + 1].plot(color="blue", label='EAR norm')
        plt.plot(DF_BLINK.index, DF_BLINK.ear_norm, 'o', color="red", label='Blink')
        plt.legend(loc=2, prop={'size': 8})
        plt.ylim([0, 1])
        frequency = (fps * 5)
        plt.xticks(SHOWCASE_DATA.index[max([0, FRAME - 20 * fps]):FRAME + 1:frequency],
                   my_xticks[max([0, FRAME - 20 * fps]):FRAME + 1:frequency])
        plt.ylabel('EAR')
        plt.xlabel('Time (MM:SS)')

        ax2 = fig.add_subplot(2, 1, 2)  
        SMOOTH_BR.plot(color="r", label="Blink/min")
        plt.legend(loc=2, prop={'size': 8})
        plt.axvline(x=FRAME, color="black")
        frequency = fps * 5
        # frequency = (fps * 5)
        plt.xticks(SHOWCASE_DATA.index[::frequency], my_xticks[::frequency], rotation=45)
        plt.ylabel('Blink/min')
        plt.xlabel('Time (MM:SS)')

        plt.subplots_adjust(hspace=0.5, bottom=0.2)

        plt.savefig('plot.png')
        plt.close()
        plot = cv2.imread('plot.png')
        plot = imutils.resize(plot, width=450)
        plot_image_base64 = base64.b64encode(cv2.imencode('.png',  plot)[1].tobytes()).decode('utf-8')

        try:
            frame = np.concatenate((frame, plot), axis=0)
            cv2.putText(frame, "SVM blink detection: {}".format(SHOWCASE_DATA_CUMSUM.blink[FRAME]), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            try:
                blink_per_min = round(DF_MOV_BR.loc[FRAME])
                cv2.putText(frame, "Blink/min: {}".format(blink_per_min), (10, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            except:
                cv2.putText(frame, "Blink/min: collecting data", (10, 300), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        except:
            cv2.putText(frame, "End of Data", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

        try:
           cv2.imshow("Frame", frame)

        except Exception as e:
           print("Exception:", e)

        FRAME += 1
    cv2.destroyAllWindows()
    vs.stop()

    average_blinking = DF_MOV_BR.mean()
    reference_value = 60  
    blinking_percentage = (average_blinking / reference_value) * 100

    # print("Average Blinking per Minute:", round(average_blinking, 2))
    # print("Blinking Percentage:", round(blinking_percentage, 2), "%")

    result = BlinkDetectionResult(userId=userId, plot_image=plot_image_base64, average_blink=average_blinking)
    db.get_collection("blink_detection_results").insert_one(result.dict())
    return result
   


