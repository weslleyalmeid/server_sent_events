
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.events import SSEEvent
from models.events import EventModel

from routers import sse, openai, openai_sdk

app = FastAPI()

origins = [
    "*",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sse.router)
app.include_router(openai.router)
app.include_router(openai_sdk.router)