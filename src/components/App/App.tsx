import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import toast, { Toaster } from 'react-hot-toast';

import { searchMovies } from '../../api/movies';
import type { Movie } from '../../types/movie';

import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

import css from './App.module.css';

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
   const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => searchMovies(query, page),
    enabled: query.trim() !== '',
     placeholderData: keepPreviousData,
  });
 const movies = data?.results || [];
  const totalPages = data?.total_pages || 0;

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };
 useEffect(() => {
  let shown = false;

  if (query && movies.length === 0 && !isLoading && !isError && !shown) {
    toast.error('No movies found for your request');
    shown = true;
  }
}, [query, isLoading, isError]); 
    if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage />;

  

 
  return (
    <div className={css.container}>
      <Toaster position="top-right" />
      <div className={css.header}>
        
        <SearchBar onSubmit={handleSearch} />
        {totalPages > 1 && (
          <div className={css.paginationWrapper}>
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
          </div>
        )}
      </div>

      <MovieGrid movies={movies} onSelect={setSelectedMovie} />

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}
