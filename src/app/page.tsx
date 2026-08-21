// home page, create a room button that calls createRoom(), gets back roomId, redirects browser to /room/{roomId}
// redirect() from next.js from next/navigation

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createRoom } from "@/app/lib/rooms";
import MovieMarquee from "@/app/components/MovieMarquee";

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
    <div className="h-full w-full bg-[#292c5b] text-white flex flex-col justify-between overflow-hidden p-4 sm:p-6">
      <div className="w-full max-w-sm mx-auto my-auto flex flex-col items-center text-center">
        <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-[0_5px_5px_rgba(100,102,241,0.7)] mb-8">
          Movie<span className="text-cyan-500">Matcher</span>
        </h1>
        <button
          onClick={handleCreateRoom}
          disabled={isCreating}
          className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-lg hover:bg-blue-500 active:scale-95 transition disabled:opacity-50"
          >
            {isCreating ? "Creating..." : "Create Room"}
          </button>
        <p className="mt-4 text-sm text-gray-200/80 leading-relaxed max-w-xs">
          Stop arguing over what to watch. Create a room, swipe with friends, and find your movie match instantly.
        </p>
      </div>

      <div className="w-full shrink-0 pb-24">
        <MovieMarquee />
      </div>
    </div>
  );
}
