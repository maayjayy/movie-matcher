"use client";

import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import type { ToastItem } from "../../types";

export default function JoinToast({
    roomId,
    currentParticipantId,
}: {
    roomId: string;
    currentParticipantId: string;
}) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const knownIds = useRef<Set<string> | null>(null);

    useEffect(() => {
        const participantsRef = collection(db, "rooms", roomId, "participants");

        const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
            const currentIds = new Set(snapshot.docs.map((doc) => doc.id));

            if (knownIds.current == null) {
                knownIds.current = currentIds;
                return;
            }

            snapshot.docs.forEach((doc) => {
                const id = doc.id;
                const isNew = !knownIds.current!.has(id);
                if (isNew && id != currentParticipantId) {
                    const name = doc.data().displayName;
                    const toastId = `${id}-${Date.now()}`;
                    setToasts((prev) => [...prev, { id: toastId, message: `${name} just joined!` }]);
                    setTimeout(() => {
                        setToasts((prev) => prev.filter((t) => t.id !== toastId));
                    }, 3000);
                }
            });

            knownIds.current = currentIds;
        });

        return () => unsubscribe();
    }, [roomId, currentParticipantId]);

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50">
            {toasts.map((toast) => (
                <div key={toast.id} className="bg-black text-white px-4 py-2 rounded full shadow-lg text-sm">
                    {toast.message}
                </div>
            ))}
        </div>
    );
}
