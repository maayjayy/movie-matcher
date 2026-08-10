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
    const roomId = await createRoom();
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="w-72 mx-auto mt-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Movie Matcher</h1>
      <button
        onClick={handleCreateRoom}
        disabled={isCreating}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600"
        >
          {isCreating ? "Creating..." : "Create Room"}
        </button>
    </div>
  );
}
