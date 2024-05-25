from fastapi import APIRouter, UploadFile, File,  Request, BackgroundTasks
from controllers.detect_Blink import run_blink_detection
from fastapi.responses import JSONResponse
import cv2
from fastapi.responses import StreamingResponse
from imutils.video import VideoStream
import threading
import multiprocessing

keep_running = threading.Event()
detect_blink = APIRouter()

@detect_blink.post("/start-detect/")
# async def start_video_stream(request: Request):
async def start_detect_stream(request: Request, background_tasks: BackgroundTasks):
    # global vs
    global keep_running
    data = await request.json()
    userId = data.get('userId')
    if userId is None:
        return JSONResponse(status_code=422, content={"detail": [{"msg": "userId is required", "type": "value_error.missing", "loc": ["body", "userId"]}]})

    if keep_running.is_set():
        return {"message": "Video stream is already running."}

    keep_running.set()
    background_tasks.add_task(run_blink_detection, keep_running,  userId)
    return {"message": "Video stream started for user with ID: {}".format(userId)}

@detect_blink.post("/stop-detect/")
async def stop_detect_stream(request: Request):
    # global vs
    global keep_running
    data = await request.json()
    user_id = data.get('userId')
    if user_id is None:
        return JSONResponse(status_code=422, content={"detail": [{"msg": "user_id is required", "type": "value_error.missing", "loc": ["body", "user_id"]}]})

    if not keep_running.is_set():
        return {"message": "Video stream is already stopped."}

    keep_running.clear()
    return {"message": "Video stream stopped for user with ID: {}".format(user_id)}