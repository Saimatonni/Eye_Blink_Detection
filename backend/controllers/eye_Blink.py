from imutils.video import VideoStream
from imutils import face_utils
from scipy.spatial import distance as dist
import numpy as np
import argparse
import imutils
import time
import dlib
import cv2
import sys
from imutils.video import FileVideoStream
import pandas as pd
from pandas import DataFrame
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.svm import SVC
from sklearn.metrics import roc_auc_score
import copy

def eye_aspect_ratio(eye):
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    C = dist.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

def moving_av(mylist, N):
    cumsum, moving_aves = [0], []
    for i, x in enumerate(mylist, 1):
        cumsum.append(cumsum[i-1] + x)
        if i >= N:
            moving_ave = (cumsum[i] - cumsum[i-N])/N
            moving_aves.append(moving_ave)
    return moving_aves

# def detect_blinks(stop_flag):
def detect_blinks(keep_running,blink_count):
    ap = argparse.ArgumentParser()
    # ap.add_argument("-v", "--video", type=str, default="",
	#     help="path to input video file")
    # args = vars(ap.parse_args())
    EYE_AR_THRESH = 0.30
    EYE_AR_CONSEC_FRAMES = 2
    COUNTER = 0
    TOTAL = 0

    print("[INFO] loading facial landmark predictor...")
    detector = dlib.get_frontal_face_detector()
    # predictor = dlib.shape_predictor(args["shape_predictor"])
    predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")
    (lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
    (rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

    print("[INFO] starting video stream thread...")
    vs = VideoStream(src=0).start()
    time.sleep(1.0)

    FRAME = 0
    ear_list = []
    array_blink_threshold = []

    # while True:
    while keep_running.is_set():
        # if stop_flag.is_set():
        #     break 
        frame = vs.read()
        frame = imutils.resize(frame, width=500)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        rects = detector(gray, 0)
        if(len(rects) == 0):
            ear_list.append(np.nan)
            array_blink_threshold.append(np.nan)
        for rect in rects:
            shape = predictor(gray, rect)
            shape = face_utils.shape_to_np(shape)
            leftEye = shape[lStart:lEnd]
            rightEye = shape[rStart:rEnd]
            leftEAR = eye_aspect_ratio(leftEye)
            rightEAR = eye_aspect_ratio(rightEye)
            ear = (leftEAR + rightEAR) / 2.0
            ear_list.append(ear)
            array_blink_threshold.append(0)
            leftEyeHull = cv2.convexHull(leftEye)
            rightEyeHull = cv2.convexHull(rightEye)
            if ear < EYE_AR_THRESH:
                COUNTER += 1
            else:
                if COUNTER >= EYE_AR_CONSEC_FRAMES:
                    TOTAL += 1
                    array_blink_threshold[FRAME] = 1
                COUNTER = 0
            cv2.putText(frame, "Blinks: {}".format(TOTAL), (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.putText(frame, "Frame: {}".format(FRAME), (10, 300),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.putText(frame, "EAR: {:.2f}".format(ear), (300, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)

            for (x, y) in shape:
                cv2.circle(frame, (x, y), 1, (0, 0, 255), -1)

        cv2.imshow("Frame", frame)
        sys.stdout.write('\r{}'.format(FRAME))
        key = cv2.waitKey(1) & 0xFF

        FRAME += 1
        # if key == ord("q"):
        #     break
    mov_ear_3=moving_av(ear_list,3)
    mov_ear_5=moving_av(ear_list,5)
    mov_ear_7=moving_av(ear_list,7)
    ear_list = pd.Series(ear_list, index=range(0, len(ear_list)))
    array_blink_threshold=pd.Series(array_blink_threshold,index=range(0, len(array_blink_threshold)))
    
    mov_ear_3=pd.Series(mov_ear_3, index=range(2, len(mov_ear_3)+2))
    mov_ear_5=pd.Series(mov_ear_5, index=range(3, len(mov_ear_5)+3))
    mov_ear_7=pd.Series(mov_ear_7, index=range(4, len(mov_ear_7)+4))
    
    ear_list = pd.DataFrame(ear_list)
    ear_list["threshold"] = array_blink_threshold
    ear_list["mov_ear_3"] = mov_ear_3
    ear_list["mov_ear_5"] = mov_ear_5
    ear_list["mov_ear_7"] = mov_ear_7
    ear_list.columns = ["ear", "threshold", "mov_ear_3","mov_ear_5","mov_ear_7"]

    ear_list.index.name="frame"
    ear_list.to_csv("tmp.csv",index=True, header=True)
    
    
    #unione detect_blinks con preproc_svm
    dati=ear_list

    listear=list(dati.ear)
    listear=np.array(listear)
    listear=(listear-np.nanmin(listear))/(np.nanmax(listear)-np.nanmin(listear))
    listear=list(listear)
    LIST_EAR_PER_TABELLA_PREVISIONI=listear
    LIST_EAR_PER_TABELLA_PREVISIONI=pd.Series(LIST_EAR_PER_TABELLA_PREVISIONI, index=range(0,len(LIST_EAR_PER_TABELLA_PREVISIONI)))

    col=['F1',"F2","F3","F4","F5",'F6',"F7"]
    df_fin=pd.DataFrame(columns=col)
    
    for i in range(3, len(listear)-4):
       tmp_ear=listear[i-3:i+4]
       df_fin.loc[i]=tmp_ear
	
    df_fin.index.name="frame"
    df_fin.dropna(how='any', inplace=True)
    
    dataset=pd.read_csv("balanced_preproc_all.csv", index_col="frame")
    # Split-out validation dataset
    array = dataset.values
    X = array[:,:dataset.shape[1]-1].astype(float)
    Y = array[:,dataset.shape[1]-1]
    validation_size = 0.20
    seed = 7
    X_train, X_validation, Y_train, Y_validation = train_test_split(X, Y,test_size=validation_size, random_state=seed)

    # Test options and evaluation metric
    num_folds = 10
    seed = 7
    scoring = 'accuracy'
    scaler = StandardScaler().fit(X_train)
    rescaledX = scaler.transform(X_train)
    model = SVC(C=1.7)  #choose our best model and C
    model.fit(rescaledX, Y_train)
    rescaledValidationX = scaler.transform(X_validation)
    predictions = model.predict(rescaledValidationX)
    # print(accuracy_score(Y_validation, predictions))
    # print(confusion_matrix(Y_validation, predictions))
    # print(classification_report(Y_validation, predictions))

    # print(roc_auc_score(Y_validation,predictions))
    
    def prev_to_csv(X, scaler=scaler, model=model):
       rescaledX = scaler.transform(X)
       predictions = model.predict(rescaledX)
       newdata = DataFrame(predictions, index=X.index, columns=["blink"])
       return newdata

    previsioni = prev_to_csv(df_fin)
    try:
       previsioni.to_csv(
           "output_SVM.csv", index=True, header=True)     
    except: 
       previsioni.to_csv(
         "output_SVM.csv",index=True, header=True)
    
    #unisco ML con blink_ajust
    DATA = previsioni
    FRAME_LIST = list(DATA.index)
    BLINK_LIST = list(DATA.blink)
    for n in range(len(BLINK_LIST)):
        if BLINK_LIST[n]==1.0:
            i = copy.deepcopy(n)
            if sum(BLINK_LIST[i:i+6])<3.0:
                BLINK_LIST[i]=0.0
            else:
                while (sum(BLINK_LIST[i:i+6])>=3.0):
                  BLINK_LIST[i+1]=1.0
                  BLINK_LIST[i+2]=1.0
                  i+=1
                
    for n in range(len(BLINK_LIST)):
    #trovo il primo 1.0
        if BLINK_LIST[n]==1.0:
            i = copy.deepcopy(n)
            while (BLINK_LIST[i+1]==1.0):
                BLINK_LIST[i+1]=0.0
                i+=1
                
    BLINK_LIST=[0.0,0.0,0.0,0.0,0.0]+BLINK_LIST[:len(BLINK_LIST)-5]
    BLINK_LIST = pd.DataFrame(BLINK_LIST, index=FRAME_LIST)
    BLINK_LIST.index.name='frame'
    BLINK_LIST.columns = ['blink']
    
    result=BLINK_LIST
    raw_data=pd.read_csv("tmp.csv", index_col="frame")
    raw_data_1=raw_data.threshold
    SHOWCASE_DATA=pd.concat([raw_data_1, result,LIST_EAR_PER_TABELLA_PREVISIONI], axis=1 )
    SHOWCASE_DATA=SHOWCASE_DATA.fillna(0)
    SHOWCASE_DATA.columns = ["threshold", "blink", "ear_norm"]  
    SHOWCASE_DATA.index.name = "frame"
    
    try:
       SHOWCASE_DATA.to_csv("data_final.csv", index=True, header=True)
    except:
       SHOWCASE_DATA.to_csv("data_final.csv", index=True, header=True)
    print("end")
    vs.stop()
    cv2.destroyAllWindows()
    blink_count.value = TOTAL


