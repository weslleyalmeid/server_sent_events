from pydantic import BaseModel

class EventModel(BaseModel):
    type: str
    message: str