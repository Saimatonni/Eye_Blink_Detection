from fastapi import APIRouter, HTTPException
from controllers.retrive_blink_data import get_all_blink_detection_results,get_latest_blink_detection_result


detect_data = APIRouter()

@detect_data.get("/blink_detection_results/")
async def get_blink_detection_results():
    return get_all_blink_detection_results()

@detect_data.get("/blink_detection_results/{userId}")
async def get_latest_result(userId: str):
    result = get_latest_blink_detection_result(userId)
    if result is None:
        raise HTTPException(status_code=404, detail="Blink detection result not found")
    return result
