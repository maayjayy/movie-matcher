"use server";

import { db } from "./firebase";
import { doc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { Movie } from "@/app/types";

async function fetchMovieDeck(): Promise<Movie[]> {
    const apiKey = process.env.TMDB_API_KEY;
    const pageNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 40) + 1);

    const responses = await Promise.all(
        pageNumbers.map((page) => 
        fetch(
            `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${page}`,
            { cache: "no-store" }
        )
        )
    );

    const jsonResults = await Promise.all(
        responses.map(async (r) =>r.ok ? r.json() : { results: [] }) 
    );
    
    const combined: Movie[] = jsonResults.flatMap((data) => data.results);
    const validCombined = combined.filter((movie) => movie && movie.id);
    const uniqueMovies = Array.from(
        new Map(validCombined.map((movie) => [movie.id, movie])).values()
    );
    return uniqueMovies
        .filter((movie) => movie.poster_path)
        .sort(() => Math.random() - 0.5)
        .slice(0, 20);
}

export async function createRoom(): Promise<string> {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const roomRef = doc(db, "rooms", roomId);

    const movies = await fetchMovieDeck();

    if (movies.length === 0) {
        throw new Error("Failed to fetch movies - TMDB may be down or rate-limited");
    }

    await setDoc(roomRef, {
        createdAt: serverTimestamp(),
        movies,
    });

    return roomId;
}

export async function joinRoom(roomId: string, displayName: string, participantId: string) {
    const participantRef = doc(db, "rooms", roomId, "participants", participantId);

    try {
        await setDoc(participantRef, {
        displayName,
        joinedAt: serverTimestamp(),
    });
    } catch (err) {
        console.error("Firestore setDoc failed explicitly", err);
        throw err;
    }
}

export async function recordSwipe(
    roomId: string,
    participantId: string,
    movieId: number,
    movieTitle: string,
    posterPath: string | null,
    direction: "left" | "right"
) {
    const swipeRef = doc(db, "rooms", roomId, "swipes", `${participantId}_${movieId}`);
    await setDoc(swipeRef, {
        participantId,
        movieId,
        movieTitle,
        posterPath,
        direction,
        swipedAt: serverTimestamp(),
    });
}

export async function markParticipantFinished(roomId: string, participantId: string) {
    const participantRef = doc(db, "rooms", roomId, "participants", participantId);
    await updateDoc(participantRef, { finished: true });
}
