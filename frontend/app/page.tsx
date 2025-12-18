"use client"
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
    type: "message" | "system";
    author?: string;
    text: string;
    timestamp?: string;
}

type UserDataType = {
    name: string;
    room: string;
    joined: boolean;
}

export default function Home() {
    const socketRef = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");

    const [user, setUser] = useState<UserDataType>({
        name: "",
        room: "general",
        joined: false,
    });

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:4000/ws");
        socketRef.current = socket;

        socket.onmessage = (event) => {
            try {
                const data: ChatMessage = JSON.parse(event.data);
                setMessages(prev => [...prev, data]);
            } catch (e) {
                const error = e instanceof Error ? e.message : null;
                console.error(error);
            }
        };

        return () => socket.close();
    }, []);

    const joinChat = () => {
        if (!user.name.trim() || !user.room.trim()) return;

        socketRef.current?.send(JSON.stringify({
            type: "join",
            name: user.name,
            room: user.room,
        }));
        setUser({ ...user, joined: true });
    };

    const sendMessage = () => {
        if (!input.trim() || !socketRef.current) return;

        const messageData = {
            type: "message",
            text: input
        };

        socketRef.current.send(JSON.stringify(messageData));
        setInput("");
    };

    if (!user.joined) {
        return (
            <section className="pt-20 flex flex-col gap-4 max-w-md">
                <h2 className="text-2xl font-bold">Chat</h2>
                <input
                    className="border p-2 rounded"
                    placeholder="Your name"
                    value={user.name}
                    onChange={e => setUser({...user, name: e.target.value})}
                />
                <input
                    className="border p-2 rounded"
                    placeholder="Room name"
                    value={user.room}
                    onChange={e => setUser({...user, room: e.target.value})}
                />
                <button className="bg-blue-500 text-white p-2 rounded" onClick={joinChat}>
                    Join
                </button>
            </section>
        )
    }

    return (
        <section className="pt-20">
            <h2 className="text-xl mb-5 font-bold">Chat: {user.room} (me: {user.name})</h2>

            <div className="flex gap-4 mb-5">
                <input
                    className="border border-gray-300 rounded-lg px-2 py-1 flex-1"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Write message..."
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    className="bg-blue-500 text-black rounded-lg px-4 py-1"
                    onClick={sendMessage}>Send</button>
            </div>

            <div className="flex flex-col gap-2 border-t pt-5">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`p-2 rounded-lg max-w-fit ${
                            msg.type === 'system'
                                ? "bg-gray-100 text-gray-500 text-sm self-center"
                                : "border border-blue-100 bg-white shadow-sm"
                        }`}
                    >
                        {msg.type === 'message' && (
                            <div className="text-xs font-bold text-blue-600">{msg.author} <span className="text-gray-400 font-normal">{msg.timestamp}</span></div>
                        )}
                        <div>{msg.text}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}