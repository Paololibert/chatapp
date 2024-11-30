import { uploadFile } from '@/services/api';
import React, { useState, ChangeEvent, FormEvent } from 'react';
 

interface FileUploadProps {
  chatId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ chatId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No token found. Please log in.');
        return;
      }

      await uploadFile(token, chatId, file);
      setMessage('File uploaded successfully');
      setFile(null);
    } catch (err: any) {
      setMessage(`Error: ${err.message || 'Failed to upload file'}`);
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-2"
          accept="*/*"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!file}
        >
          Upload File
        </button>
      </form>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default FileUpload;
