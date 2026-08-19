"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export default function CompactStatus({ roomId }: { roomId: string }) {
    const [finished, setFinished] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const participantsRef = collection(db, "rooms", roomId, "participants");
        const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
            const docs = snapshot.docs.map((d) => d.data());
            setTotal(docs.length);
            setFinished(docs.filter((d) => d.finished).length);
        });
        return () => unsubscribe();
    }, [roomId]);

    return (
        <p className="text-center text-sm text-gray-500 mt-2">
            {finished} of {total} finished voting
        </p>
    );
}
