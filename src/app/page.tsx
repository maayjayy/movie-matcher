//server component : fetches data

import type { Movie } from "./types";
import SwipeDeck from "./SwipeDeck";

export default async function Home() {
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

  const shuffled = uniqueMovies
    .filter((movie) => movie.poster_path)
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);

  return <SwipeDeck movies={shuffled} />;
}