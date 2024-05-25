from pydantic import BaseModel

class BlinkDetectionResult(BaseModel):
    userId: str
    plot_image: str
    average_blink: float
