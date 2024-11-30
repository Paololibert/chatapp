import { useState, useEffect } from 'react';
import useChat from '@/hooks/useChat';
import { Message } from '@/services/types';
import Notification from '@/app/__composant/Notification';
import FileUpload from '@/app/__composant/FileUpload';
import FileDownload from '@/app/__composant/FileDownload';
import { fetchFiles } from '@/services/api';

interface ChatDetailsProps {
  chatId: string;
  userId: string;
}

export default function ChatDetails({ chatId, userId }: ChatDetailsProps) {
  const [notification, setNotification] = useState<Message | null>(null);
  const { messages, message, setMessage, sendMessage } = useChat({
    chatId,
    onNewMessage: (newMessage: Message) => {
      setNotification(newMessage);
    },
  });

  const [files, setFiles] = useState<any[]>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId && message) {
      sendMessage(userId, message);
    }
  };

  // Utilisation de la fonction fetchFiles depuis api.ts
  useEffect(() => {
    const getFiles = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const data = await fetchFiles(token, chatId);
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    getFiles();
  }, [chatId]);

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Chat</h2>
      <div>
        <ul className="mb-5">
          {messages.map((msg: Message, index: number) => (
            <li key={index} className="mb-2 p-2 border rounded">
              <strong>{msg.sender?.username || 'Unknown User'}</strong>: {msg.content} <br />
              <span className="text-gray-500 text-sm">
                {new Date(msg.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
            placeholder="Type your message..."
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Send
          </button>
        </form>

        {/* Composant de téléversement de fichier */}
        <FileUpload chatId={chatId} />

        {/* Liste des fichiers à télécharger */}
        <div className="mt-4">
          {files.map((file) => (
            <FileDownload key={file.id} chatId={chatId} file={file} />
          ))}
        </div>
      </div>

      {notification && <Notification message={notification} />}
    </div>
  );
}
