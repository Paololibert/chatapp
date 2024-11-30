'use client';
import { createChat } from '@/services/api';
import { useState } from 'react';

export default function CreateChatForm() {
  const [participants, setParticipants] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const participantIds = participants.split(',').map(id => id.trim());
        console.log(participantIds);
        
        const data = await createChat(token, participantIds);
        setMessage('Chat created successfully');
        setError(''); 
        setParticipants("")
      } else {
        setError('No token found');
      }
    } catch (error: any) {
      setMessage('');
      setError(`Error: ${error.message || 'An error occurred'}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Create Chat</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Participants</label>
          <input
            type="text"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Comma-separated user IDs"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Chat
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
