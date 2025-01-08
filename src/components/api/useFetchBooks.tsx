'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

interface Books {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  image: string;
  excerpt: { rendered: string };
}

interface QueryOptions {
  orderby?: string;
  order?: 'desc';
  search?: string;
  page?: number;
  per_page: number;
}

export const useFetchBooks = (
  options: QueryOptions = { per_page: 12, page: 1 }
) => {
  const [books, setBooks] = useState<Books[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalBooks, setTotalBooks] = useState(0);
  const loadingRef = useRef(false);

  const fetchBooks = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      const url = `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=31&${queryParams.toString()}`;
      const response = await fetch(url);

      if (response.status === 409) {
        throw new Error(
          'Conflict error: The request could not be completed due to a conflict with the current state of the target resource.'
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Books[] = await response.json();
      const totalCount =
        Number(response.headers.get('X-WP-Total')) || data.length;

      setTotalBooks(totalCount);

      setBooks(data);
      setLoading(false);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
      setLoading(false);
      setBooks([]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
    // eslint-disable-next-line
  }, [options.page, options.per_page]);

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, [fetchBooks]);

  return { books, loading, error, totalBooks };
};
