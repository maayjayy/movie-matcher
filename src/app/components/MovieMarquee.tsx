"use client";

const STATIC_POSTERS = [
  "https://image.tmdb.org/t/p/w342/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg", // Interstellar
  "https://image.tmdb.org/t/p/w342/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg", // Inception
  "https://image.tmdb.org/t/p/w342/qJ2tW6WMUDux911r6m7haRef0WH.jpg", // Dark Knight
  "https://image.tmdb.org/t/p/w342/v1tRXZ4JtD2Iv6fjkPvT4GiwslV.jpg", // Dune
  "https://image.tmdb.org/t/p/w342/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", // Oppenheimer
  "https://image.tmdb.org/t/p/w342/iPOn6DinuVyLY17YM9mKuPofV08.jpg", // Spider-Man
  "https://image.tmdb.org/t/p/w342/wqnLdwVXoBjKibFRR5U3y0aDUhs.jpg", // Star Wars
  "https://image.tmdb.org/t/p/w342/t3vaWRPSf6WjDSamIkKDs1iQWna.jpg", // Ratatouille
  "https://image.tmdb.org/t/p/w342/gKY6q7SjCkAU6FqvqWybDYgUKIF.jpg", // Avatar
  "https://image.tmdb.org/t/p/w342/921q4gPNN4J6UxvKaw6SCNBe3F8.jpg", // Togo
  "https://image.tmdb.org/t/p/w342/xYLiCWmAMHJubx5jNZ7HuXKjAbV.jpg", // Mamma Mia
  "https://image.tmdb.org/t/p/w342/wVYREutTvI2tmxr6ujrHT704wGF.jpg", // The Conjuring
  "https://image.tmdb.org/t/p/w342/o8UhmEbWPHmTUxP0lMuCoqNkbB3.jpg", // Pride and Prejudice
];

export default function MovieMarquee() {
  const displayPosters = [...STATIC_POSTERS, ...STATIC_POSTERS, ...STATIC_POSTERS];

  return (
    <div className="w-full overflow-hidden py-4 bg-[#292c5b]/90 relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[#292c5b] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[#292c5b] to-transparent pointer-events-none" />

      <div className="flex w-max animate-marquee gap-4">
        {displayPosters.map((src, idx) => (
          <img
            key={`${src}-${idx}`}
            src={src}
            alt="Movie Poster"
            className="w-32 h-50 object-cover rounded-xl border border-white/10 shadow-lg shrink-0"
          />
        ))}
      </div>
    </div>
  );
}