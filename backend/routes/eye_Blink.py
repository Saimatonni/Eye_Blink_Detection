from fastapi import APIRouter, UploadFile, File,  Request, BackgroundTasks
from controllers.eye_Blink import detect_blinks
from fastapi.responses import JSONResponse
import cv2
from fastapi.responses import StreamingResponse
from imutils.video import VideoStream
import threading
import multiprocessing


eye_blink = APIRouter()
# vs = None
stop_flag = threading.Event()
keep_running = threading.Event()
blink_count = multiprocessing.Value('i', 0)

@eye_blink.post("/start-stream/")
# async def start_video_stream(request: Request):
async def start_video_stream(request: Request, background_tasks: BackgroundTasks):
    # global vs
    global keep_running
    data = await request.json()
    userId = data.get('userId')
    if userId is None:
        return JSONResponse(status_code=422, content={"detail": [{"msg": "userId is required", "type": "value_error.missing", "loc": ["body", "userId"]}]})


    # if vs is None:
    #     vs = VideoStream(src=0).start()
    if keep_running.is_set():
        return {"message": "Video stream is already running."}

    keep_running.set()
    background_tasks.add_task(detect_blinks, keep_running, blink_count)
    return {"message": "Video stream started for user with ID: {}".format(userId)}

@eye_blink.post("/stop-stream/")
async def stop_video_stream(request: Request):
    # global vs
    global keep_running
    data = await request.json()
    user_id = data.get('user_id')
    if user_id is None:
        return JSONResponse(status_code=422, content={"detail": [{"msg": "user_id is required", "type": "value_error.missing", "loc": ["body", "user_id"]}]})

    if not keep_running.is_set():
        return {"message": "Video stream is already stopped."}

    keep_running.clear()
    return {"message": "Video stream stopped for user with ID: {}".format(user_id), "blink_count": blink_count.value}
    # if vs is not None:
        # vs.stop() 


