"use client"
import { useState, useEffect } from 'react';
import { Message } from '../components/types/EventMessage';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const sse: EventSource = new EventSource('http://localhost:8000/stream', {
      withCredentials: true,
    });

    sse.onmessage = (event) => {
      const dataString = event.data.startsWith('data:') 
        ? event.data.substring(5).trim() 
        : event.data;
      const parsedData = JSON.parse(dataString);
      console.log(parsedData);

      setMessages((prevMessages) => [...prevMessages, parsedData]);
    }
  }, [])
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold">Messages</h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-lg">
        {messages.map((message, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-md">
            <p className="text-sm font-bold">{message.type}</p>
            <p className="text-sm">{message.message}</p>
            <p className="text-xs text-gray-500">{JSON.stringify(message.data)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
