import asyncio
from fastapi import APIRouter, Request

from models.events import EventModel
from services.events import SSEEvent
from sse_starlette.sse import EventSourceResponse

router = APIRouter()

@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.post("/emit")
async def new_event(event: EventModel):
    SSEEvent.add_event(event)
    return {"message": "Event added to the queue", "count": SSEEvent.count()}


@router.get("/stream")
async def stream_events(request: Request):
    async def stream_generator():
        while True:
            if await request.is_disconnected():
                print("SSE disconnected")
                break
            
            event = SSEEvent.get_event()
            if event:
                yield f"data: {event.model_dump_json()}\n\n"
                
            await asyncio.sleep(1)
    
    
    return EventSourceResponse(stream_generator())