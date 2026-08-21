//client component : handles interaction

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import type { Movie } from "@/app/types";
import { recordSwipe } from "@/app/lib/rooms";
import { markParticipantFinished } from "@/app/lib/rooms";

const SWIPE_THRESHOLD = 100;

export default function SwipeDeck({
  roomId,
  participantId,
  movies,
  onFinished,
}: {
  roomId: string;
  participantId: string;
  movies: Movie[];
  onFinished: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const handleSwipe = async (direction: "left" | "right") => {
    const currentMovie = movies[currentIndex];
    if (!currentMovie) return;
    setExitDirection(direction);
    setCurrentIndex((prev) => prev + 1);

    await recordSwipe(
      roomId, 
      participantId, 
      currentMovie.id, 
      currentMovie.title, 
      currentMovie.poster_path, 
      direction
    );
  };

  const currentMovie = movies[currentIndex];

  useEffect(() => {
    if (!currentMovie) {
      markParticipantFinished(roomId, participantId);
      onFinished();
    }
  }, [currentMovie]);

  if (!currentMovie) return null;

  return (
    <div className="relative w-72 h-96 mx-auto mt-10">
      <AnimatePresence custom={exitDirection} mode="popLayout">
        <SwipeCard
          key={currentMovie.id}
          movie={currentMovie}
          onSwipe={handleSwipe}
        />
      </AnimatePresence>
      </div>
  );
}

function SwipeCard({
  movie,
  onSwipe,
}: {
  movie: Movie;
  onSwipe: (direction: "left" | "right") => void;
}) {
  const x = useMotionValue(0);
  const [isSwipingOut, setIsSwipingOut] = useState(false);

  const redGlowOpacity = useTransform(x, [-120, -20, 0], [0.6, 0.1, 0]);
  const greenGlowOpacity = useTransform(x, [0, 20, 120], [0, 0.1, 0.6]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const isOverflowing = el.scrollHeight > el.clientHeight;
    const isAtBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 10;    
    setShowFade(isOverflowing && !isAtBottom);
  };

  useEffect(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setTimeout(checkScroll, 50);
    }, [movie]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent, 
    info: PanInfo
  ) => { 
    if (info.offset.x > SWIPE_THRESHOLD) {
      setIsSwipingOut(true);
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      setIsSwipingOut(true);
      onSwipe("left");
    }
  };

  const triggerButtonSwipe = async (direction: "left" | "right") => {
    setIsSwipingOut(true);
    onSwipe(direction)
  };

  return (
      <div className="absolute inset-0">
      {!isSwipingOut && (
        <>
          <motion.div
            style={{ opacity: redGlowOpacity }}
            className="absolute -inset-4 bg-red-500/50 blur-2xl rounded-3xl pointer-events-none z-0"
          />
          <motion.div
            style={{ opacity: greenGlowOpacity }}
            className="absolute -inset-4 bg-green-500/50 blur-2xl rounded-3xl pointer-events-none z-0"
          />
        </>
      )}

        <motion.div
          style={{ x }}
          drag={isSwipingOut ? false : "x"} 
          dragSnapToOrigin={!isSwipingOut}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.02 }}
          variants={{
            initial: { scale: 0.9, opacity: 0, y: 15 },
            animate: { scale: 1, opacity: 1 },
            exit: (dir: "left" | "right" | null) => ({
              x: dir === "right" ? 500 : -500,
              opacity: 0,
              rotate: dir === "right" ? 20 : -20,
              scale: 0.85
            }),
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ 
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
           }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"       
        >
          <h2 className="text-lg font-bold">{movie.title} - {movie.release_date?.slice(0, 4)}</h2>
          {movie.poster_path && (
            <img
              src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
              alt={movie.title}
              className="w-full rounded-lg"
              draggable={false}
            />
          )}
          <div className="flex justify-between mt-2">
            <button onClick={() => triggerButtonSwipe("left")}
              className="px-4 py-2 bg-blue-500/80 text-white rounded-xl shadow-md hover:bg-red-800 active:scale-95 transition"
              >Pass</button>
            <button onClick={() => triggerButtonSwipe("right")}
              className="px-4 py-2 bg-blue-500/80 text-white rounded-xl shadow-md hover:bg-green-800 active:scale-95 transition"
              >Approve</button>
          </div>
          <div className="relative overflow-hidden rounded-md flex-1 min-h-[5rem]">
            <div 
              ref={scrollRef}
              onScroll={checkScroll} 
              className="max-h-48 overflow-y-auto custom-scroll pr-2 pb-4"
            >
              <p className="text-sm text-gray-200 text-justify mt-1">{movie.overview}</p>
              <p className="text-sm font-semibold mt-1">⭐ {movie.vote_average.toFixed(1)}</p>
            </div>
            {showFade && (
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#292c5b] via-[#292c5b]/70 to-transparent pointer-events-none transition-opacity duration-300" />
            )}
          </div>
        </motion.div>
      </div>
  );
}
