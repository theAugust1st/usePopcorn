import { useEffect, useState } from "react";
import StarRating from "./components/StarRating.jsx";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "b19e0c97";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  useEffect(
    function () {
      const controller = new AbortController();

      async function getData() {
        try {
          setIsLoading(true);
          setErr("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          // if (res.ok)
          //   throw new Error("Something went while fetching the data...!");
          const data = await res.json();
          if (data.Response === "False") throw data.Error;
          setMovies(data.Search);
        } catch (err) {
          if(err.name !== "AbortError")
          setErr(err); // ✅ ONLY a string
        } finally {
          setIsLoading(false);
        }
      }

      getData();
      return () => controller.abort();
    },
    [query]
  );
  function showDetails(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function unSelectDetails() {
    setSelectedId(null);
  }
  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <SearchResult movies={movies} />
      </Navbar>
      <Main>
        <MoviesBox
          movies={movies}
          isLoading={isLoading}
          error={err}
          selectedId={selectedId}
          setSelectedId={showDetails}
        />
        <WatchedMoviesBox
          selectedId={selectedId}
          unSelectDetails={unSelectDetails}
        />
      </Main>
    </>
  );
}
function Loader() {
  return <p>...LOADING</p>;
}
function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
function SearchResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function MoviesBox({
  movies,
  isLoading,
  error,
  setSelectedId,
  unSelectDetails,
}) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isLoading && <Loader />}
      {!isLoading && !error && isOpen1 && (
        <ul className="list">
          {movies?.map((movie) => (
            <MoviesList
              key={movie.imdbID}
              movie={movie}
              setSelectedId={setSelectedId}
              unSelectDetails={unSelectDetails}
            />
          ))}
        </ul>
      )}
      {error && <Error err={error} />}
    </div>
  );
}
function MoviesList({ movie, setSelectedId, unselectDetails }) {
  return (
    <li onClick={() => setSelectedId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function Error({ err }) {
  return (
    <div className="error container">
      <span>⛔️</span>
      <p className="error">{err}</p>
    </div>
  );
}
function SelectedMovie({ selectedId, unSelectDetails, setWatched, watched }) {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [rating, setRating] = useState(0);
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    imdbVotes,
    Genre: genre,
    Director: director,
    Actors: actors,
    Released: released,
    Plot: plot,
  } = selectedMovie;
  useEffect(
    function () {
      async function getMovieDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setSelectedMovie(data);
      }
      getMovieDetails();
    },
    [selectedId]
  );
  useEffect(function (){
    if (!title) return ;
    document.title = `Movie | ${title}`
    return () => document.title = 'usePopcorn'
  },[title])
  function handleAdd(selectedId) {
    setRating();
    const watchedList = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating: rating,
    };
    setWatched((watched) => [...watched, watchedList]);
    unSelectDetails();
  }
  return (
    <div className="details">
      <button className="btn-back" onClick={unSelectDetails}>
        &larr;
      </button>
      <img src={poster} alt="movie-poster" />
      <div className="details-overview">
        <h2>{title}</h2>
        <p>
          {released} &bull; {runtime}
        </p>
        <p>
          <span>⭐️</span>
          {imdbRating}
        </p>
      </div>
      <div className="rating">
        {!isWatched ? (
          <>
            <StarRating maxLength={10} size={24} onSetRating={setRating} />
            <button className="btn-add" onClick={() => handleAdd(selectedId)}>
              + Add to list
            </button>
          </>
        ) : (
          <p>You already rated this moveie.</p>
        )}
      </div>
      <div>
        <section>
          <p>
            <em>{plot}</em>
          </p>
          <p>Starring cast:{actors}</p>
          <p>{director}</p>
        </section>
      </div>
    </div>
  );
}
function WatchedMoviesBox({ selectedId, unSelectDetails }) {
  const [watched, setWatched] = useState(()=>
    JSON.parse(localStorage.getItem("Movie"))
  );
  const [isOpen2, setIsOpen2] = useState(true);
    useEffect(()=>{
    localStorage.setItem("Movie",JSON.stringify(watched))
  },[watched])
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {selectedId ? (
        <SelectedMovie
          selectedId={selectedId}
          unSelectDetails={unSelectDetails}
          setWatched={setWatched}
          watched={watched}
        />
      ) : (
        isOpen2 && <WatchedMovies watched={watched} setWatched={setWatched} />
      )}
    </div>
  );
}
function WatchedMovies({ watched, setWatched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  function handleDelete(selectedId) {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== selectedId)
    );
  }
  return (
    <>
      <div className="summary">
        <h2>Movies you watched</h2>
        <div>
          <p>
            <span>#️⃣</span>
            <span>{watched.length} movies</span>
          </p>
          <p>
            <span>⭐️</span>
            <span>{avgImdbRating}</span>
          </p>
          <p>
            <span>🌟</span>
            <span>{avgUserRating}</span>
          </p>
          <p>
            <span>⏳</span>
            <span>{avgRuntime} min</span>
          </p>
        </div>
      </div>

      <ul className="list">
        {watched.map((movie) => (
          <WatchedMoviesList
            key={movie.imdbID}
            movie={movie}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </>
  );
}
function WatchedMoviesList({ movie, onDelete }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
        X
      </button>
    </li>
  );
}
