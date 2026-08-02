//client component : handles interaction

"use client";

import { useState } from "react";
import type { Movie } from "./types";

export default function SwipeDeck({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: "left" | "right") => {
    const currentMovie = movies[currentIndex];
    console.log(`Swiped ${direction} on ${currentMovie.title}`);
    // need to add record the vote
    setCurrentIndex((prev) => prev + 1);
  };

  const currentMovie = movies[currentIndex];

  if (!currentMovie) {
    return <div>No more movies!</div>;
  }

  return (
    <div>
      <h2>{currentMovie.title}</h2>
      {currentMovie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w342${currentMovie.poster_path}`}
          alt={currentMovie.title}
        />
      )}
      <button onClick={() => handleSwipe("left")}>👎 Pass</button>
      <button onClick={() => handleSwipe("right")}>👍 Like</button>
    </div>
  );
}
