import json
import os
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
import httpx
import asyncio
from openai import AsyncOpenAI

router = APIRouter(prefix="/sdk")

API_KEY = os.getenv("OPENAI_API_KEY")

httpx_client = httpx.AsyncClient(http2=True, verify=False)
client = AsyncOpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
    http_client=httpx_client
)


async def stream_openai_response(payload: dict):
    response = await client.chat.completions.create(**payload)
    async for line in response:
        if line:
            data = line.model_dump()  # or use line.dict() if your object supports it
            yield f"data: {json.dumps(data)}\n\n"
            await asyncio.sleep(0.01)

@router.post("/chat/completions")
async def proxy_openai_chat_completions(request: Request):
    payload = await request.json()
    is_stream = payload.get("stream", False)
    
    if is_stream:
        return StreamingResponse(stream_openai_response(payload), media_type="text/event-stream")
    
    response = await client.chat.completions.create(**payload)
    return JSONResponse(content=response.model_dump())