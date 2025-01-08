'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

interface Blog {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  modified: string;
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

export const useFetchBlogs = (
  options: QueryOptions = { per_page: 12, page: 1 }
) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const loadingRef = useRef(false);

  const fetchBlogs = useCallback(async () => {
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

      const url = `https://blog.ibidunlayiojo.com/wp-json/wp/v2/posts?categories=1&${queryParams.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const totalPagesHeader = response.headers.get('X-WP-TotalPages');
      if (totalPagesHeader) {
        setTotalPages(parseInt(totalPagesHeader));
      }

      const data: Blog[] = await response.json();
      setBlogs(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
      setBlogs([]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
    // eslint-disable-next-line
  }, [options.page, options.per_page]);

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line
  }, [fetchBlogs]);

  return {
    blogs,
    loading,
    error,
    totalPages,
  };
};
