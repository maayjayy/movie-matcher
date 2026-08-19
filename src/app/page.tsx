// home page, create a room button that calls createRoom(), gets back roomId, redirects browser to /room/{roomId}
// redirect() from next.js from next/navigation

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/app/lib/rooms";

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const roomId = await createRoom();
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      setIsCreating(false);
    }
  };

  return (
    <div className="w-72 mx-auto mt-30 text-center">
      <h1 className="text-4xl font-bold mb-4">Movie Matcher</h1>
      <button
        onClick={handleCreateRoom}
        disabled={isCreating}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600"
        >
          {isCreating ? "Creating..." : "Create Room"}
        </button>
      <p className="mt-16 text-center text-l mb-4 text-gray-400">This will hopefully make your movie nights more bearable. Once the room is created, share the link with your friends and start swiping on movies to match.</p>
    </div>
  );
}
