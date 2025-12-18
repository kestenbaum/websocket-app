"use client"
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const socketRef = useRef<WebSocket>(null);
    const initializedRef = useRef<boolean>(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>("");

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        const socket = new WebSocket("ws://localhost:4000/ws");
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Socket opened");
        }

        socket.onmessage = (event) => {
            setMessages(prev => [...prev, event.data])
        }

        socket.onclose = () => {
            console.log("Socket closed");
        }

        socket.onerror = (err) => {
            console.log("Socket error", err);
        }

        return () => {
            socket.close();
        }
    }, [])

    const sendMessage = () => {
        if (!input.trim()) return null;
        const socket = socketRef.current;

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket not connected yet');
            return;
        }

        socket.send(input)
        setInput("")
    }

  return (
   <section className="pt-17">
       <h2>websocket chat</h2>
       <div>
           <input
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder="Enter your message"
           />
           <button onClick={sendMessage}>Send</button>
       </div>

       <div>
           {messages && messages.map(msg => <div key={msg}>
               {msg}
           </div>)}
       </div>
   </section>
  );
}
