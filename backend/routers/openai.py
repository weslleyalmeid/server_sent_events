import os
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
import httpx
import asyncio
import openai

router = APIRouter()

OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
API_KEY = os.getenv("OPENAI_API_KEY")

async def stream_openai_response(payload: dict):
    async with httpx.AsyncClient(timeout=None, verify=False) as client:
        async with client.stream(
            "POST", OPENAI_API_URL, json=payload, headers={"Authorization": f"Bearer {API_KEY}"}
        ) as response:
            async for line in response.aiter_lines():
                if line:
                    yield line
                    await asyncio.sleep(0.01)  # delay to avoid buffer blocking


@router.post("/chat/completions")
async def proxy_openai_chat_completions(request: Request):
    payload = await request.json()
    is_stream = payload.get("stream", False)
    if is_stream:
        return StreamingResponse(stream_openai_response(payload), media_type="text/event-stream")
    
    async with httpx.AsyncClient(timeout=None, verify=False) as client:
        response = await client.post(OPENAI_API_URL, json=payload, headers={"Authorization": f"Bearer {API_KEY}"})
        return JSONResponse(content=response.json())