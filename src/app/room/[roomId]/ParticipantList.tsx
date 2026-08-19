"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import type { Participant } from "../../types";

export default function ParticipantList({ roomId }: { roomId: string }) {
    const [participants, setParticipants] = useState<Participant[]>([]);

    useEffect(() => {
        const participantsRef = collection(db, "rooms", roomId, "participants");
        const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
            setParticipants(
                snapshot.docs.map((doc) => ({ 
                    id: doc.id,
                     displayName: doc.data().displayName, 
                    finished: doc.data().finished ?? false,
                }))
            );
        });
        return () => unsubscribe();
    }, [roomId]);

    const finishedCount = participants.filter((p) => p.finished).length;
    const total = participants.length;

    return (
        <div className="w-72 mx-auto mt-4 text-sm">
            <p className="font-semibold mb-1 text-orange-300">
                {finishedCount} of {total} finished voting
            </p>
            <ul className="flex flex-wrap gap-2">
                {participants.map((p) => (
                    <li 
                        key={p.id} 
                        className={`px-2 py-1 rounded-full ${
                            p.finished ? "bg-green-200 text-green-700" : "bg-gray-200 text-gray-600"
                        }`}
                    >
                        {p.displayName} {p.finished ? "✓" : ""}
                    </li>
                ))}
            </ul>
        </div>
    );
}
