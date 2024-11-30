"use client";

import { getChats } from "@/services/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Participant {
  id: number;
  username: string;
}

interface Chat {
  id: number;
  participants: Participant[];
}

export default function ChatList() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const data = await getChats(token);
          setChats(data);
        } else {
          setError("No token found");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    };

    fetchChats();
  }, []);

  // Filter chats based on search
  const filteredChats = chats.filter((chat) =>
    chat.participants.some((participant) =>
      participant.username.toLowerCase().includes(search.toLowerCase())
    )
  );

  // Managing a click on a chat
  const handleChatClick = (chatId: number) => {
    router.push(`/chatlist/${chatId}`);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Chats</h2>

      {/* Search bar */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 border rounded mb-5"
        placeholder="Search chats..."
      />

      {/* List of filtered chats */}
      {filteredChats.length > 0 ? (
        <ul>
          {filteredChats.map((chat) => (
            <li
              key={chat.id}
              className="mb-2 p-2 border rounded cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => handleChatClick(chat.id)}
            >
              {chat.participants.map((participant) => participant.username).join(", ")}
            </li>
          ))}
        </ul>
      ) : (
        <p>No chats available.</p>
      )}
    </div>
  );
}
