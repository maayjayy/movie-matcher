//client component : handles interaction

"use client";

import { useState } from "react";
import { motion, type PanInfo } from "framer-motion";
import type { Movie } from "./types";

const SWIPE_THRESHOLD = 100;

export default function SwipeDeck({ movies }: { movies: Movie[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = (direction: "left" | "right") => {
    const currentMovie = movies[currentIndex];
    console.log(`Swiped ${direction} on ${currentMovie.title}`);
    // need to add record the vote
    setCurrentIndex((prev) => prev + 1);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent, 
    info: PanInfo
  ) => { 
    if (info.offset.x > SWIPE_THRESHOLD) {
      handleSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      handleSwipe("left");
    }
  };

  const currentMovie = movies[currentIndex];

  if (!currentMovie) {
    return <div>No more movies!</div>;
  }

  return (
    <motion.div
      key={currentMovie.id}
      drag="x"
      dragSnapToOrigin
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05 }}
      className="w-72 mx-auto mt-10 cursor-grab active:cursor-grabbing"
    >
      <h2 className="text-lg font-bold">{currentMovie.title}</h2>
      {currentMovie.poster_path && (
        <img
          src={`https://image.tmdb.org/t/p/w342${currentMovie.poster_path}`}
          alt={currentMovie.title}
          className="w-full rounded-lg"
          draggable={false}
        />
      )}
      <div className="flex justify-between mt-2">
        <button onClick={() => handleSwipe("left")}>👎 Pass</button>
        <button onClick={() => handleSwipe("right")}>👍 Like</button>
      </div>
    </motion.div>
  );
}
