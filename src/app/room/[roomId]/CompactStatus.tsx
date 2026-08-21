"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export default function CompactStatus({ roomId }: { roomId: string }) {
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const participantsRef = collection(db, "rooms", roomId, "participants");
        const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
            const docs = snapshot.docs.map((d) => d.data());
            setTotal(docs.length);
        });
        return () => unsubscribe();
    }, [roomId]);

    return (
        <p className="text-center text-xs font-bold text-cyan-600 mt-2">
            {total} {total !== 1 ? "people are" : "person is"} voting
        </p>
    );
}
