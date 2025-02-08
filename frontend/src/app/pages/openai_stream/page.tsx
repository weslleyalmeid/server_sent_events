"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatChunk } from "@/components/types/ChatChunk";
import { Switch } from "@/components/ui/switch"

export default function Chat() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [streaming, setStreaming] = useState(true);

    const handleStreamingResponse = async (response: Response) => {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });

            try {
                const jsonChunks = chunk
                    .split("\n")
                    .map((line) => line.replace(/^data: /, "").trim())
                    .filter((line) => line && line !== "[DONE]");

                for (const jsonChunk of jsonChunks) {
                    const data: ChatChunk = JSON.parse(jsonChunk);
                    const content = data.choices?.[0]?.delta?.content || "";

                    if (content) {
                        assistantMessage += content;
                        setMessages((prev) => {
                            const lastMsg = prev.at(-1)?.content || "";
                            return [...prev.slice(0, -1), { role: "assistant", content: lastMsg + content }];
                        });
                    }
                }
            } catch (error) {
                console.error("Error parsing JSON chunk:", error);
            }
        }
    };

    const handleNonStreamingResponse = async (response: Response) => {
        if (!response.ok) {
            console.error("Error response:", response.statusText);
            setMessages((prev) => [...prev, { role: "assistant", content: "An error occurred. Please try again later." }]);
            return;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";

        setMessages((prev) => [...prev, { role: "assistant", content }]);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        setMessages([...messages, { role: "user", content: input }]);
        setLoading(true);

        const newMessages = [...messages, { role: "user", content: input }];

        const payload = {
            model: "gpt-4o",
            messages: newMessages,
            stream: streaming,
        };

        const response = await fetch("http://localhost:8000/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.body) {
            console.error("Response body is empty");
            setLoading(false);
            return;
        }

        if (streaming) {
            await handleStreamingResponse(response);
        } else {
            await handleNonStreamingResponse(response);
        }

        setLoading(false);
    };




    return (
        <div className="flex flex-col max-w-xl mx-auto p-4 space-y-4">
            <Button
                variant="outline"
                onClick={() => window.location.href = "/"}
            >
                Raw to Home
            </Button>

            <div className="flex items-center gap-2">
                <span>Streaming</span>
                <Switch
                    checked={streaming}
                    onCheckedChange={setStreaming}
                    id="streaming"
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                />
            </div>


            <div className="border p-3 rounded-lg min-h-[200px] overflow-y-auto">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg ${msg.role === "user" ? "bg-blue-200 text-left" : "bg-gray-200 text-left"}`}
                    >
                        <strong>{msg.role}:</strong> {msg.content}
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    className="flex-grow p-2 border rounded-lg"
                    placeholder="Digite sua mensagem..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="bg-blue-500 text-white p-2 rounded-lg" onClick={sendMessage} disabled={loading}>
                    {loading ? "Enviando..." : "Enviar"}
                </button>
            </div>
        </div>
    );
}