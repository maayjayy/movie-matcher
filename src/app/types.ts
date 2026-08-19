export type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
    vote_average: number;
    release_date: string;
  };

  export type VoteTally = {
    movieId: number;
    movieTitle: string;
    posterPath: string | null,
    count: number;
  };

  export type Participant = {
    id: string;
    displayName: string;
    finished?: boolean;
  }

  export type ToastItem = {
    id: string;
    message: string;
  }