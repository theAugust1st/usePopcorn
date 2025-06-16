import { useState, useEffect } from "react";
export function useFetchCustom(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const KEY = "b19e0c97";
  useEffect(
    function () {
      const controller = new AbortController();

      async function getData() {
        try {
          setIsLoading(true);
          setErr("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );
          // if (res.ok)
          //   throw new Error("Something went while fetching the data...!");
          const data = await res.json();
          if (data.Response === "False") throw data.Error;
          setMovies(data.Search);
        } catch (err) {
          if (err.name !== "AbortError") setErr(err); // ✅ ONLY a string
        } finally {
          setIsLoading(false);
        }
      }

      getData();
      return () => controller.abort();
    },
    [query]
  );
  return { movies, isLoading, err };
}
