import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { Message, Chat } from '@/services/types';
import { getChatDetails } from '@/services/api';

interface UseChatReturn {
  messages: Message[];
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (userId: string, content: string) => void;
}

const SOCKET_URL = 'http://localhost:3001';

interface UseChatProps {
  chatId: string;
  onNewMessage?: (message: Message) => void;
}

const useChat = ({ chatId, onNewMessage }: UseChatProps): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);

  // Function to retrieve current messages
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const chatDetails = await getChatDetails(token, chatId);
      setMessages(chatDetails.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    // Initialize the WebSocket
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true,
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      //console.log('Socket connected');
      newSocket.emit('joinChat', chatId);
      fetchMessages(); // Retrieve messages as soon as chat opens
    });

    newSocket.on('receiveMessage', (newChat: Chat) => {
      setMessages(newChat.messages);
      if (onNewMessage) {
        const newMessage = newChat.messages[newChat.messages.length - 1];
        onNewMessage(newMessage);
      }
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection Error:', err);
    });

    // Update messages every 5 seconds
    const intervalId = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => {
      newSocket.close();
      clearInterval(intervalId);
    };
  }, [chatId]);

  const sendMessage = (userId: string, content: string) => {
    if (socket && content.trim()) {
      socket.emit('sendMessage', { chatId, userId, content });
      setMessage('');
    }
  };

  return {
    messages,
    message,
    setMessage,
    sendMessage,
  };
};

export default useChat;
