//client component : handles interaction

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type { Movie } from "@/app/types";
import { db } from "@/app/lib/firebase";
import { createRoom, recordSwipe } from "@/app/lib/rooms";

const SWIPE_THRESHOLD = 100;

export default function SwipeDeck({
  roomId,
  participantId,
  movies,
}: {
  roomId: string;
  participantId: string;
  movies: Movie[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const handleSwipe = async (direction: "left" | "right") => {
    const currentMovie = movies[currentIndex];
    console.log(`Swiped ${direction} on ${currentMovie.title}`);
    setExitDirection(direction);
    setCurrentIndex((prev) => prev + 1);

    await recordSwipe(roomId, participantId, currentMovie.id, currentMovie.title, direction);
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
    return <div className="text-6xl text-orange-300 font-semibold min-h-screen flex
    items-center justify-center">Decisions have been saved, final ones will be revealed soon.</div>;
  }

  return (
    <div className="relative w-72 h-96 mx-auto mt-10">
      <AnimatePresence custom={exitDirection}>
        <motion.div
          key={currentMovie.id}
          drag="x"
          dragSnapToOrigin
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.05 }}
          variants={{
            initial: { scale: 0.95, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: (direction: "left" | "right" | null) => ({
              x: direction === "right" ? 500 : -500,
              opacity: 0,
              rotate: direction === "right" ? 20 : -20,
            }),
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
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
            <button onClick={() => handleSwipe("left")}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition"
              >👎 Pass</button>
            <button onClick={() => handleSwipe("right")}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition"
              >👍 Like</button>
          </div>
          <div>
            <p className="text-sm text-grey-600 text-justify mt-1">{currentMovie.overview}</p>
            <p className="text-sm font-semibold mt-1">⭐ {currentMovie.vote_average.toFixed(1)}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
