from collections import deque

from models.events import EventModel

class SSEEvent:
    EVENTS = deque()
    
    @staticmethod
    def add_event(event: EventModel):
        SSEEvent.EVENTS.append(event)
        
    @staticmethod
    def get_event():
        if len(SSEEvent.EVENTS) > 0:
            return SSEEvent.EVENTS.popleft()
        return None
    
    @staticmethod
    def count() -> int:
        return len(SSEEvent.EVENTS)