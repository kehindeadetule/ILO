'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { CommentResponse, PaginationInfo } from '../utils/types';
interface WordPressCommentData {
  post: number;
  content: string;
  author_name?: string;
  author_email?: string;
}

// Add these type definitions
type AdminCommentData = {
  content: string;
};

type RegularCommentData = {
  fullName: string;
  email: string;
  content: string;
};

type CommentData = RegularCommentData;

export const useComments = (postId: number, initialPerPage: number = 10) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    perPage: initialPerPage,
  });

  // Use ref to track loading state to prevent race conditions
  const loadingRef = useRef(false);

  const organizeComments = useCallback((flatComments: CommentResponse[]) => {
    const commentMap = new Map<number, CommentResponse>();
    const rootComments: CommentResponse[] = [];

    // First pass: Create comment objects with empty replies arrays
    flatComments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: Organize comments into tree structure
    flatComments.forEach((comment) => {
      const processedComment = commentMap.get(comment.id)!;
      if (comment.parent === 0) {
        rootComments.push(processedComment);
      } else {
        const parentComment = commentMap.get(comment.parent);
        if (parentComment) {
          if (!parentComment.replies) {
            parentComment.replies = [];
          }
          parentComment.replies.push(processedComment);
        }
      }
    });

    return rootComments;
  }, []);

  const fetchComments = useCallback(
    async (page: number = 1) => {
      // Prevent multiple simultaneous requests
      if (loadingRef.current) return;

      loadingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get<CommentResponse[]>(
          `https://blog.ibidunlayiojo.com/wp-json/wp/v2/comments`,
          {
            params: {
              post: postId,
              page,
              per_page: pagination.perPage,
              orderby: 'date',
              order: 'desc',
            },
          }
        );

        const totalPages = parseInt(response.headers['x-wp-totalpages'], 10);
        const totalComments = parseInt(response.headers['x-wp-total'], 10);

        setPagination((prev) => ({
          ...prev,
          currentPage: page,
          totalPages,
          totalComments,
        }));

        const organizedComments = organizeComments(response.data);
        setComments(organizedComments);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch comments')
        );
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    },
    [postId, pagination.perPage, organizeComments]
  );

  const addComment = async (commentData: AdminCommentData | CommentData) => {
    const token = localStorage.getItem('token');
    const baseUrl = 'https://blog.ibidunlayiojo.com/wp-json/wp/v2';

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const wpCommentData: WordPressCommentData = {
        post: postId,
        content: commentData.content,
      };

      if ('fullName' in commentData) {
        wpCommentData.author_name = commentData.fullName;
        wpCommentData.author_email = commentData.email;
      }

      const response = await fetch(`${baseUrl}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(wpCommentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      await fetchComments(1);
      return await response.json();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  // Update the addReply function similarly
  const addReply = async (
    parentId: number,
    commentData: AdminCommentData | CommentData
  ) => {
    const token = localStorage.getItem('token');
    const baseUrl = 'https://blog.ibidunlayiojo.com/wp-json/wp/v2';

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const wpCommentData: WordPressCommentData & { parent: number } = {
        post: postId,
        content: commentData.content,
        parent: parentId,
      };

      if ('fullName' in commentData) {
        wpCommentData.author_name = commentData.fullName;
        wpCommentData.author_email = commentData.email;
      }

      const response = await fetch(`${baseUrl}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(wpCommentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add reply');
      }

      await fetchComments(pagination.currentPage);
      return await response.json();
    } catch (error) {
      console.error('Error adding reply:', error);
      throw error;
    }
  };

  // Initial fetch effect
  useEffect(() => {
    fetchComments(1);
  }, [postId, fetchComments]);

  return {
    comments,
    pagination,
    isLoading,
    error,
    fetchComments,
    addComment,
    addReply,
  };
};
