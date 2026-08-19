"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import type { VoteTally } from "@/app/types";

export default function Podium({ roomId }: { roomId: string }) {
    const [topThree, setTopThree] = useState<VoteTally[]>([]);
    const [rest, setRest] = useState<VoteTally[]>([]);

    useEffect(() => {
        const swipesRef = collection(db, "rooms", roomId, "swipes");
        const rightSwipeQuery = query(swipesRef, where("direction", "==", "right"));

        const unsubscribe = onSnapshot(rightSwipeQuery, (snapshot) => {
            const counts = new Map<number, VoteTally>();

            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                const existing = counts.get(data.movieId);
                if (existing) {
                    existing.count += 1;
                } else {
                    counts.set(data.movieId, {
                        movieId: data.movieId,
                        movieTitle: data.movieTitle,
                        posterPath: data.posterPath,
                        count: 1
                    });
                }
            });

            const sorted = Array.from(counts.values()).sort((a, b) => b.count - a.count);
            setTopThree(sorted.slice(0, 3));
            setRest(sorted.slice(3));
        });

        return () => unsubscribe();
    }, [roomId]);

    return (
        <div>
            <div className="min-h-screen flex items-end justify-center gap-22 pb-36">
                {topThree[1] && (<PodiumSpot movie={topThree[1]} place={2} height="h-40" bg="bg-blue-700"/>)}
                {topThree[0] && (<PodiumSpot movie={topThree[0]} place={1} height="h-76" bg="bg-blue-400"/>)}
                {topThree[2] && (<PodiumSpot movie={topThree[2]} place={3} height="h-20" bg="bg-blue-900"/>)}
            </div>

            {rest.length > 0 && (
                <>
                    <div className="flex justify-center -mt-8 mb-4">
                        <a href="#full-rankings" className="text-sm text-gray-200 underline">
                            See full rankings ⬇
                        </a>
                    </div>

                    <div id="full-rankings" className="w-72 mx-auto mt-8 mb-12">
                        <h3 className="font-bold text-lg mb-2 text-center text-orange-300">Movie ranking recap</h3>
                        <ol className="list-decimal list-inside text-base text-white text-jusitfy">
                            {rest.map((movie) => (
                                <li key={movie.movieId}>
                                    {movie.movieTitle} - {movie.count} vote{movie.count !== 1 ? "s" : ""}
                                </li>
                            ))}
                        </ol>
                    </div>
                </>
            )} 
        </div>
    );
}

function PodiumSpot({
    movie,
    place,
    height,
    bg,
}: {
    movie: VoteTally;
    place: number;
    height: string;
    bg: string;
}) {
    return (
        <div className="flex flex-col items-center w-56 ">
            <img
              src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
              alt={movie.movieTitle}
              className="w-full rounded-lg"/>
            <p className="font-bold text-center text-xl mb-2 line-clamp-2">{movie.movieTitle}</p>
            <p className="text-base text-blue-200 mb-2 font-bold">{movie.count} vote{movie.count !== 1 ? "s" : ""}</p>
            <div className={`w-full ${height} ${bg} rounded-t-2xl flex items-center justify-center text-3xl font-extrabold shadow-lg`}>
                {place}
            </div>
        </div>
    );
}
