<<<<<<< HEAD
# usePopcorn

A small React movie discovery and watchlist tracker built with Create React App.

The app lets users search movies using the OMDB API, view movie details, rate titles using a custom star rating component, and keep a watched list persisted in local storage.

## Features

- Search movies with a custom `useMovies` hook
- View details for selected movies
- Rate movies with `StarRating`
- Add rated movies to a persisted watched list
- Delete watched movies from the list
- Local storage persistence via `useLocalStorageState`
- Keyboard shortcuts via `useKey`
- Optional authentication flow in `src/App_v2.js`

## Project Structure

- `src/App.js` � main application component with movie search, details, and watched list
- `src/App_v2.js` � alternate app version with auth support and `AuthContext`
- `src/useMovies.js` � OMDB search hook with loading/error handling
- `src/useLocalStorageState.js` � local storage state hook
- `src/useKey.js` � keyboard shortcut hook
- `src/StarRating.js` � interactive rating component
- `src/AuthContext.js` � authentication provider for `App_v2.js`
- `src/Login.js` / `src/Registration.js` � login and registration forms
## Screenshot / Demo

If you want to show the app in the README, add a screenshot here or replace the example below with your own image:

```md
![usePopcorn demo](./screenshot.png)
```

Then include a short demo note:

- Search for a movie title
- Select a movie to view details
- Rate it and add it to your watched list
- Remove movies from the watched list
## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm test
```

## Notes

- The app uses a hardcoded OMDB API key in `src/useMovies.js` and `src/App_v2.js`.
- Search queries require at least 3 characters to trigger an API request.
- `App_v2.js` includes a simple simulated auth flow and may be used for experimenting with protected UI state.

## Dependencies

- `react`
- `react-dom`
- `react-scripts`
- `prop-types`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`

## License

This project is private and for learning/demo purposes.
=======
# usePopcorn-modern
Movie Wish list Application
>>>>>>> 5d2e13f351dc873f84dc9878e1b088a089219c92
