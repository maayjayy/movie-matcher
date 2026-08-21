"use client";

import { useState } from "react";
import { joinRoom } from "@/app/lib/rooms";
import { getOrCreateParticipantId } from "@/app/lib/participants";
import SwipeDeck from "./SwipeDeck";
import WaitingForOthers from "./WaitingForOthers";
import type { Movie } from "../../types";
import JoinToast from "./JoinToast";
import CompactStatus from "./CompactStatus";

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
    const [copied, setCopied] = useState(false);

    const shareUrl = 
        typeof window !== "undefined" ? `${window.location.origin}/room/${roomId}` : "";

    const handleCopyLink = async () => {
        const isMobile = /iPhone|Ipad|Android/i.test(navigator.userAgent);
        if(isMobile && navigator.share) {
            try {
                await navigator.share({
                    title: "Movie Night Matcher",
                    text: "Join my room and let's pick a movie together!",
                    url: shareUrl,
                });
                return;
            } catch (err) {
            }
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

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
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
                    <CompactStatus roomId={roomId} />
                </div>
                <JoinToast roomId={roomId} currentParticipantId={participantId}/>
            </div>    
        );
    }

    return (
        <div className="w-100 mx-auto mt-20 p-9 bg-[#121243] rounded-2xl border border-white/10 shadow-2xl text-white space-y-8">
            <div className="space-y-2">
                <label className="text-sm font-semibold tracking-wider text-slate-300">
                INVITE FRIENDS - share the link
                </label>
                <div className="flex items-center gap-2 bg-[#020518] p-1 rounded-xl border border-white/10">
                <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="bg-transparent text-sm text-gray-300 w-full focus:outline-none select-all px-1"
                />
                <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-medium rounded-lg transition-all shrink-0"
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
                </div>
            </div>

            <hr className="border-white/10" />

            <div className="space-y-3">
                <h2 className="text-lg font-bold">Join Room</h2>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="Enter your name"
                className="w-full bg-[#020518] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                />
                <button
                onClick={handleJoin}
                disabled={!name.trim()}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-md active:scale-95 transition"
                >
                Start Swiping
                </button>
            </div>
        </div>
    );
}
