import { downloadFile } from '@/services/api';
import React from 'react';

interface FileDownloadProps {
  chatId: string;
  file: {
    _id: string;
    filename: string;
  };
}

const FileDownload: React.FC<FileDownloadProps> = ({ chatId, file }) => {
  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found. Please log in.');
        return;
      }

      const fileData = await downloadFile(token, chatId, file._id);

      const url = window.URL.createObjectURL(new Blob([fileData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error downloading file:', err.message || err);
    }
  };

  return (
    <div className="mb-2">
      <button
        onClick={handleDownload}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Download {file.filename}
      </button>
    </div>
  );
};

export default FileDownload;
