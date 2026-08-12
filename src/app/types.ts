export type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
    vote_average: number;
  };

  export type VoteTally = {
    movieId: number;
    movieTitle: string;
    posterPath: string | null,
    count: number;
  };