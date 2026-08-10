"use client";

import { useState } from "react";
import { joinRoom } from "@/app/lib/rooms";
import { getOrCreateParticipantId } from "@/app/lib/participants";
import SwipeDeck from "./SwipeDeck";
import type { Movie } from "../../types";

export default function JoinRoomScreen({
    roomId,
    movies,
}: {
    roomId: string;
    movies: Movie[];
}) {
    const [name, setName] = useState("");
    const [hasJoined, setHasJoined] = useState(false);
    const [participantId, setParticipantId] = useState<string | null>(null);

    const handleJoin = async() => {
        if (!name.trim()) return;

        const id = getOrCreateParticipantId();
        await joinRoom(roomId, name, id);

        setParticipantId(id);
        setHasJoined(true);
    };

    if (hasJoined && participantId) {
        return (
            <SwipeDeck roomId={roomId} participantId={participantId} movies={movies} />
        );
    }

    return (
        <div className="w-72 mx-auto mt-10">
            <h2 className="text-lg font-bold mb-2">Join the room</h2>
            <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="border rounded px-2 py-1 w-full"
            />
            <button
                onClick={handleJoin}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600"
            >
                Join
            </button>
        </div>
    );
}