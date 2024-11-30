// src/services/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RegisterLoginParams {
  username: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface UserProfile {
  username: string;
}

interface UserData {
  username?: string;
  password?: string;
}

export interface Participant {
  id: number;
  username: string;
}

export interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: Participant;
}

export interface Chat {
  id: number;
  participants: Participant[];
  messages: Message[];
}

export const register = async ({
  username,
  password,
}: RegisterLoginParams): Promise<ApiResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.error || "An error occurred");
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
};

export const login = async ({ username, password }: RegisterLoginParams) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);

      throw new Error(errorData.error || "An error occurred");
    }

    const data = await response.json();

    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
};

export const getProfile = async (token: string): Promise<UserProfile> => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      //console.log("error:",  errorData);

      throw new Error(errorData.message || "An error has occurred");
    }
    const data: UserProfile = await response.json();
    //console.log("front UserProfile:",  data);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error retrieving profile :", error.message);
      throw new Error(error.message || "Network error");
    } else {
      console.error("Unknown error retrieving profile");
      throw new Error("Unknown error");
    }
  }
};



export const updateProfile = async (
  token: string,
  userData: UserData
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error has occurred");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error updating profile :", error);
    throw new Error(error.message || "Network error");
  }
};

export const createChat = async (token: string, participants: string[]) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ participants }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error data:", errorData);
      throw new Error(errorData.message || "An error has occurred");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error creating chat:", error);
    throw new Error(error.message || "Network error");
  }
};

export const getChats = async (token: string) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Error data:", errorData);
      throw new Error(errorData.message || "An error has occurred");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export async function decodeToken(token: string) {
  const response = await fetch(`${API_URL}/auth/decode-token`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  console.log(data);
  
  if (!response.ok) {
    throw new Error(data.message || "Failed to decode token");
  }

  return data; 
}

export const getChatDetails = async (token: string, chatId: string): Promise<Chat> => {
  try {
    const response = await fetch(`${API_URL}/chat/${chatId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An error occurred while fetching chat details');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error fetching chat details:', error);
    throw new Error(error.message || 'Network error');
  }
};


export const sendMessage = async (token: string, chatId: string, content: string) => {
  try {
    const response = await fetch(`${API_URL}/chat/${chatId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const errorData = await response.text(); // Lire la réponse en texte si ce n'est pas du JSON
      throw new Error(errorData || 'An error occurred while sending the message');
    }

    const data = await response.json(); // Analyser la réponse JSON
    console.log(data);
    
    return data; // Retourner la donnée JSON
  } catch (error: any) {
    console.error('Error sending message:', error);
    throw new Error(error.message || 'Network error');
  }
};

export const uploadFile = async (
  token: string,
  chatId: string,
  file: File
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/chats/${chatId}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload file');
    }

    return await response.json();
  } catch (error: any) {
    throw error;
  }
};

export const downloadFile = async (
  token: string,
  chatId: string,
  fileId: string
): Promise<Blob> => {
  try {
    const response = await fetch(`${API_URL}/chats/${chatId}/files/${fileId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to download file');
    }

    return await response.blob();
  } catch (error: any) {
    throw error;
  }
};

// api.ts
export const fetchFiles = async (token: string, chatId: string) => {
  try {
    const response = await fetch(`${API_URL}/chats/${chatId}/files`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error fetching files: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};


export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Redirect to login page
};
