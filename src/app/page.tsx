//server component : fetches data

import type { Movie } from "./types";
import SwipeDeck from "./SwipeDeck";

export default async function Home() {
  const apiKey = process.env.TMDB_API_KEY;

  //fetch movies directly on the server
  const result = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
  const data: {results: Movie[] } = await result.json();

  return <SwipeDeck movies={data.results} />;

}