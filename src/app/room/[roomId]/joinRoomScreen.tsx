"use client";

import { useState } from "react";
import { joinRoom } from "@/app/lib/rooms";
import { getOrCreateParticipantId } from "@/app/lib/participants";
import SwipeDeck from "./SwipeDeck";
import WaitingForOthers from "./WaitingForOthers";
import type { Movie } from "../../types";
import JoinToast from "./JoinToast";
import CompactStatus from "./CompactStatus";
import ParticipantList from "./ParticipantList";

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
    const [finishedSwiping, setFinishedSwiping] = useState(false);

    const handleJoin = async() => {
        if (!name.trim()) return;

        const id = getOrCreateParticipantId();
        await joinRoom(roomId, name, id);

        setParticipantId(id);
        setHasJoined(true);
    };

    if (hasJoined && participantId) {
        return finishedSwiping ? (
            <WaitingForOthers roomId={roomId} />
        ) : (
            <div>
                <SwipeDeck 
                roomId={roomId} 
                participantId={participantId} 
                movies={movies} 
                onFinished={() => setFinishedSwiping(true)}
                />
                <CompactStatus roomId={roomId}/>
                <ParticipantList roomId={roomId}/>
                <JoinToast roomId={roomId} currentParticipantId={participantId}/>
            </div>    
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
