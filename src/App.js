import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import Login from "./Login";
import Registration from "./Registration";
import StarRating from "./StarRating";
import { useKey } from "./useKey";
import { useLocalStorageState } from "./useLocalStorageState";
import { useMovies } from "./useMovies";

const average = (arr) =>
  arr.length ? arr.reduce((acc, cur) => acc + cur / arr.length, 0) : 0;

const KEY = "f84fc31d";

export default function App() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [authView, setAuthView] = useState("login");
  const [query, setQuery] = useState("batman");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  if (!isAuthenticated) {
    return authView === "login" ? (
      <Login
        onLoginSuccess={() => setAuthView("login")}
        onNavigateToRegister={() => setAuthView("register")}
      />
    ) : (
      <Registration
        onRegistrationSuccess={() => setAuthView("login")}
        onNavigateToLogin={() => setAuthView("login")}
      />
    );
  }

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
        <UserMenu user={user} onLogout={logout} />
      </NavBar>

      <Hero watched={watched} query={query} />

      <Main>
        <Box title="Discover movies" meta="Live OMDb search">
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box title={selectedId ? "Movie profile" : "Your watchlist"} meta="Saved locally">
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}

function Loader() {
  return (
    <div className="loader">
      <span />
      <p>Finding the best matches...</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="empty-state">
      <strong>No match found</strong>
      <p>{message}. Try another title, actor, or franchise.</p>
    </div>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function UserMenu({ user, onLogout }) {
  return (
    <div className="user-menu">
      <div className="user-avatar" aria-hidden="true">
        {(user?.name || user?.email || "U").slice(0, 1).toUpperCase()}
      </div>
      <div className="user-copy">
        <span>Signed in</span>
        <strong>{user?.name || user?.email}</strong>
      </div>
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span className="logo-mark" aria-hidden="true">
        <span className="popcorn-bucket">
          <span className="kernel kernel-one" />
          <span className="kernel kernel-two" />
          <span className="kernel kernel-three" />
          <span className="bucket-stripe" />
        </span>
        <span className="soda-cup">
          <span className="straw" />
          <span className="cup-shine" />
        </span>
      </span>
      <div>
        <h1 aria-label="usePoPcorn">
          useP
          <span className="logo-title-popcorn" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Pcorn
        </h1>
        <p>Movie night planner</p>
      </div>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <label className="search-wrap">
      <span>Search</span>
      <input
        className="search"
        type="text"
        placeholder="Search movies, sagas, studios..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        ref={inputEl}
      />
    </label>
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      <strong>{movies.length}</strong>
      <span>results</span>
    </p>
  );
}

function Hero({ watched, query }) {
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const totalRuntime = watched.reduce((sum, movie) => sum + movie.runtime, 0);

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Personal cinema dashboard</p>
        <h2>Find, rate, and remember the movies worth your evening.</h2>
        <p>
          Search real movie data, inspect details, score films your way, and
          keep a clean watchlist that stays on your device.
        </p>
      </div>
      <div className="hero-stats" aria-label="Watchlist statistics">
        <StatCard label="Saved" value={watched.length} />
        <StatCard label="Avg score" value={avgUserRating.toFixed(1)} />
        <StatCard label="Runtime" value={`${totalRuntime || 0}m`} />
        <StatCard label="Searching" value={query || "None"} compact />
      </div>
    </section>
  );
}

function StatCard({ label, value, compact = false }) {
  return (
    <div className={compact ? "stat-card stat-card-wide" : "stat-card"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children, title, meta }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="box">
      <div className="box-header">
        <div>
          <p>{meta}</p>
          <h2>{title}</h2>
        </div>
        <button
          className="btn-toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Collapse panel" : "Expand panel"}
        >
          {isOpen ? "-" : "+"}
        </button>
      </div>

      {isOpen && <div className="box-body">{children}</div>}
    </section>
  );
}

function MovieList({ movies, onSelectMovie }) {
  if (!movies?.length)
    return (
      <div className="empty-state">
        <strong>Start with a search</strong>
        <p>Try "Batman", "Interstellar", "Harry Potter", or any film title.</p>
      </div>
    );

  return (
    <ul className="list list-movies">
      {movies.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <div className="movie-copy">
        <h3>{movie.Title}</h3>
        <p>{movie.Year}</p>
      </div>
      <span className="pill">Details</span>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime?.split(" ").at(0)) || 0,
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              Back
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className="details-overview">
              <p className="eyebrow">{released}</p>
              <h2>{title}</h2>
              <p>{runtime} / {genre}</p>
              <strong>{imdbRating} IMDb</strong>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <p>Rate this for your watchlist</p>
                  <StarRating
                    maxRating={10}
                    size={22}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      Add to watchlist
                    </button>
                  )}
                </>
              ) : (
                <p>You rated this movie {watchedUserRating} out of 10.</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Library snapshot</h2>
      <div>
        <p>
          <span>Movies</span>
          <strong>{watched.length}</strong>
        </p>
        <p>
          <span>IMDb</span>
          <strong>{avgImdbRating.toFixed(1)}</strong>
        </p>
        <p>
          <span>Your score</span>
          <strong>{avgUserRating.toFixed(1)}</strong>
        </p>
        <p>
          <span>Avg time</span>
          <strong>{Math.round(avgRuntime)}m</strong>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  if (!watched.length)
    return (
      <div className="empty-state empty-watchlist">
        <strong>Your watchlist is ready</strong>
        <p>Open a movie, choose a rating, and save it here.</p>
      </div>
    );

  return (
    <ul className="list list-watched">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <div className="movie-copy">
        <h3>{movie.title}</h3>
        <p>
          IMDb {movie.imdbRating} / You {movie.userRating} / {movie.runtime}m
        </p>
      </div>

      <button
        className="btn-delete"
        onClick={() => onDeleteWatched(movie.imdbID)}
        aria-label={`Remove ${movie.title}`}
      >
        x
      </button>
    </li>
  );
}
