"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import Podium from "./podium";

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
        <div className="text-4xl text-orange-300 font-semibold min-h-screen flex flex-col items-center justify-center text-center px-4">
            <p>Decisions have been saved.</p>
            <p className="text-2xl mt-4">Waiting for {total - finished} more...</p>
        </div>
    );
}