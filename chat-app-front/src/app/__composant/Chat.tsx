import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");// Front URL

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]); // Spécifier le type des messages
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Nettoyage pour éviter des connexions persistantes
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("sendMessage", input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className="bg-gray-200 p-2 my-2 rounded">
            {msg}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-300 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
