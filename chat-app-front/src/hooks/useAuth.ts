
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push('/login'); 
    }
  }, [router]);

  return isAuthenticated;
}
//const isAuthenticated = useAuth();

//if (!isAuthenticated) return null; 