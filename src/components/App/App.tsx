import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import { searchMovies } from '../../api/movies';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import toast, { Toaster } from 'react-hot-toast';
import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => searchMovies(query, page),
    enabled: query.trim() !== '',
  });
  useEffect(() => {
    if (data && data.results.length === 0) {
      toast.error('No movies found for your request');
    }
  }, [data]);
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
       <Toaster position="top-center" />
      

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong...</p>}

      
      {data?.total_pages && data.total_pages > 1 && (
        <ReactPaginate className={css.pagination}
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}

    

      
      <ul className={css.movieList}>
        {data?.results.map((movie: Movie) => (
          <li key={movie.id} >
            <h3>{movie.title}</h3>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                width={200}
              />
            ) : (
              <p>No image available</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
