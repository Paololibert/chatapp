"use client";

import ChatDetails from '@/app/__composant/ChatDetails';
import React, { useEffect, useState } from 'react';
import { decodeToken } from '@/services/api';

interface ChatDetailsPageProps {
  params: Promise<{ id: string }>;
}

const ChatDetailsPage = ({ params }: ChatDetailsPageProps) => {
  const { id: chatId } = React.use(params); // Use React.use() to destructure params
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      try {
        const data = await decodeToken(token);
        setUserId(data.id);
        setUsername(data.username);
      } catch (error) {
        console.error("Error decoding token:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!userId || !username) {
    return <div>Utilisateur non authentifié.</div>;
  }

  return <ChatDetails chatId={chatId} userId={userId} />;
};

export default ChatDetailsPage;
