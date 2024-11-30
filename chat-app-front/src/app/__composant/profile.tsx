"use client";
import { getProfile } from "@/services/api";
import { useEffect, useState } from "react";
import LogoutButton from "./LogoutButton";

interface UserProfile {
  username: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const data = await getProfile(token);
          if (data) {
            setProfile(data);
          }
        } else {
          setError("No token found");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-5">Profile</h2>
          {profile ? (
            <div>
              <p>
                <strong>Username:</strong> {profile.username}
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <div className="m-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
