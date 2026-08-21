"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import Podium from "./Podium";
import ParticipantList from "./ParticipantList";

export default function WaitingForOthers({ roomId }: { roomId: string }) {
    const [participants, setParticipants] = useState<{ finished?: boolean }[]>([]);

    useEffect(() => {
        const participantsRef = collection(db, "rooms", roomId, "participants");
        const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
            setParticipants(snapshot.docs.map((doc) => doc.data()));
        });
        return () => unsubscribe();
    }, [roomId]);

    const total = participants.length;
    const finished = participants.filter((p) => p.finished).length;

    if (total > 0 && finished === total) {
        return <Podium roomId={roomId} />;
    }

    return (
        <div className="fixed inset-0 h-dvh w-full flex flex-col items-center justify-center text-center p-4 overflow-hidden select-none">
            <div className="flex flex-col items-center max-w-md w-full gap-4">
                <h2 className="text-3xl sm:text-4xl text-cyan-400 font-bold tracking-tight drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                    Decisions have been saved.
                </h2>
                <p className="text-lg sm:text-xl text-slate-300 font-medium">
                    Waiting for {total - finished} more {total - finished !== 1 ? "people" : "person"}...
                </p>
                <div className="w-full mt-2 max-h-[40vh] overflow-y-auto custom-scroll">
                    <ParticipantList roomId={roomId} />
                </div>
            </div>
        </div>
    );
}
