'use-client';
import React, { useState, useMemo } from 'react';
import { FormField } from '../contact-us/FormModal';
import * as yup from 'yup';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useComments } from '../api/useComment';
import parse from 'html-react-parser';

import {
  SingleCommentProps,
  CommentData,
  transformCommentToDisplayData,
  CommentProps,
} from '../utils/types';
import { decodeHtmlEntities } from '../utils/utils';
import CircleLoader from '../utils/Loader';
import CustomAlert from '../utils/CustomAlert';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
interface ExtendedCommentProps extends CommentProps {
  postDate: string;
}

// Validation schema using Yup
const validationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email'),
  content: yup
    .string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment must be less than 1000 characters'),
});
const adminValidationSchema = yup.object().shape({
  content: yup
    .string()
    .required('Comment is required')
    .min(10, 'Comment must be at least 10 characters')
    .max(1000, 'Comment must be less than 1000 characters'),
});

const bgColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-red-500',
  'bg-teal-500',
];

const getInitials = (name: string): string => {
  if (!name) return '??';
  const names = name.trim().split(' ');
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  return names[0][0].toUpperCase();
};

const initialFormData: CommentData = {
  fullName: '',
  email: '',
  content: '',
};

const UserAvatar: React.FC<{ fullName: string }> = ({ fullName }) => {
  const backgroundColor = useMemo(() => {
    const index =
      Math.abs(
        fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      ) % bgColors.length;
    return bgColors[index];
  }, [fullName]);

  return (
    <div
      className={`w-8 h-8 rounded-full ${backgroundColor} flex items-center justify-center text-white text-sm font-medium`}
      data-testid='user-avatar'>
      {getInitials(fullName)}
    </div>
  );
};
const isAdmin = localStorage.getItem('token') !== null;

const SingleComment: React.FC<SingleCommentProps> = ({
  comment,
  depth = 0,
  onReply,
  onToggleExpanded,
  replyingTo,
  replyFormData,
  handleReplyChange,
  handleReplySubmit,
  errors,
}) => {
  const isReplying = replyingTo === comment.id;

  return (
    <div className={`space-y-4 ${depth > 0 ? 'ml-8 mt-4' : ''}`}>
      <div className='flex items-start gap-3'>
        <UserAvatar fullName={comment.fullName} />
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <h3 className='font-medium'>{comment.fullName}</h3>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => onReply(comment.id)}
                className='text-gray-600 hover:text-gray-800'>
                Reply
              </button>
              {comment.replies?.length > 0 && (
                <button
                  onClick={() => onToggleExpanded(comment.id)}
                  className='flex items-center gap-1 text-gray-600 hover:text-gray-800'>
                  {comment.isExpanded ? (
                    <IoIosArrowUp className='w-4 h-4' />
                  ) : (
                    <IoIosArrowDown className='w-4 h-4' />
                  )}
                  {comment.replies.length}{' '}
                  {comment.replies.length === 1 ? 'reply' : 'replies'}
                </button>
              )}
            </div>
          </div>
          <p className='text-gray-500 text-sm'>{comment.date}</p>
          <p className='mt-2'>{parse(decodeHtmlEntities(comment.content))}</p>
        </div>
      </div>

      {isReplying && !isAdmin && (
        <div className='ml-8 mt-4 space-y-5'>
          <FormField
            label='Full Name'
            name='fullName'
            value={replyFormData.fullName}
            onChange={handleReplyChange}
            error={errors.fullName}
          />

          <FormField
            label='Email Address'
            name='email'
            type='email'
            value={replyFormData.email}
            onChange={handleReplyChange}
            error={errors.email}
          />

          <div>
            <label htmlFor='content' className='block mb-1'>
              Your Reply
            </label>
            <textarea
              id='content'
              name='content'
              className={`w-full p-2 border-2 rounded border-[#495551] outline-none mt-1 h-32 bg-inherit ${
                errors.content ? 'border-red-500' : ''
              }`}
              value={replyFormData.content}
              onChange={handleReplyChange}
            />
            {errors.content && (
              <p className='text-red-500 text-sm mt-1'>{errors.content}</p>
            )}
          </div>

          <div className='flex gap-2'>
            <button
              onClick={() => handleReplySubmit(comment.id)}
              className='bg-black text-white py-2 px-4 rounded font-medium hover:bg-gray-800 transition-colors'>
              Submit Reply
            </button>
            <button
              onClick={() => onReply(0)} // Reset replyingTo
              className='border border-gray-300 py-2 px-4 rounded font-medium hover:bg-gray-50 transition-colors'>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isReplying && isAdmin && (
        <div className='ml-8 mt-4 space-y-5'>
          <div>
            <label htmlFor='content' className='block mb-1'>
              Your Reply
            </label>
            <textarea
              id='content'
              name='content'
              className={`w-full p-2 border-2 rounded border-[#495551] outline-none mt-1 h-32 bg-inherit ${
                errors.content ? 'border-red-500' : ''
              }`}
              value={replyFormData.content}
              onChange={handleReplyChange}
            />
            {errors.content && (
              <p className='text-red-500 text-sm mt-1'>{errors.content}</p>
            )}
          </div>

          <div className='flex gap-2'>
            <button
              onClick={() => handleReplySubmit(comment.id)}
              className='bg-black text-white py-2 px-4 rounded font-medium hover:bg-gray-800 transition-colors'>
              Submit Reply
            </button>
            <button
              onClick={() => onReply(0)} // Reset replyingTo
              className='border border-gray-300 py-2 px-4 rounded font-medium hover:bg-gray-50 transition-colors'>
              Cancel
            </button>
          </div>
        </div>
      )}

      {comment.isExpanded && comment.replies?.length > 0 && (
        <div className='space-y-4'>
          {comment.replies.map((reply) => (
            <SingleComment
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              onToggleExpanded={onToggleExpanded}
              replyingTo={replyingTo}
              replyFormData={replyFormData}
              handleReplyChange={handleReplyChange}
              handleReplySubmit={handleReplySubmit}
              errors={errors}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Comments: React.FC<ExtendedCommentProps> = ({ postId, postDate }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CommentData>(initialFormData);
  const [errors, setErrors] = useState<Partial<CommentData>>({});
  const [replyingTo, setReplyingTo] = useState<number>(0);
  const [replyFormData, setReplyFormData] =
    useState<CommentData>(initialFormData);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoadingMoreComments, setIsLoadingMoreComments] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const {
    comments,
    isLoading,
    error,
    addComment,
    addReply,
    fetchComments,
    pagination,
  } = useComments(Number(postId));

  const displayComments = useMemo(
    () => comments.map(transformCommentToDisplayData),
    [comments]
  );
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof CommentData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleReplyChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReplyFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof CommentData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const toggleReply = (commentId: number) => {
    setReplyingTo(replyingTo === commentId ? 0 : commentId);
    setReplyFormData(initialFormData);
    setErrors({});
  };

  const toggleExpanded = (commentId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };
  // Calculate if comments should be disabled based on post date
  const isCommentsDisabled = useMemo(() => {
    const postDateTime = new Date(postDate);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - postDateTime.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays > 28;
  }, [postDate]);

  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const isAdmin = localStorage.getItem('token') !== null;

      if (isAdmin) {
        // For admin, only validate content
        await adminValidationSchema.validate(
          { content: formData.content },
          { abortEarly: false }
        );
        await addComment({
          content: formData.content,
        });
      } else {
        // For regular users, validate all fields
        await validationSchema.validate(formData, { abortEarly: false });
        await addComment(formData);
      }

      setFormData(initialFormData);
      setSubmitLoading(false);

      setErrors({});
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 8000);
    } catch (err) {
      setSubmitLoading(false);

      if (err instanceof yup.ValidationError) {
        const validationErrors: Partial<CommentData> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof CommentData] = error.message;
          }
        });
        setErrors(validationErrors);
      } else {
        setSubmitLoading(false);

        const error = err as AxiosError;
        if (error?.status === 403) {
          router.push('/login');
          setErrors({
            content: 'Session expired. Please login again.',
          });
          return;
        }
        setErrors({
          content: 'Failed to submit comment. Please try again.',
        });
      }
    }
  };

  const handleReplySubmit = async (parentId: number) => {
    try {
      const isAdmin = localStorage.getItem('token') !== null;

      if (isAdmin) {
        await adminValidationSchema.validate(
          { content: replyFormData.content },
          { abortEarly: false }
        );
        await addReply(parentId, {
          content: replyFormData.content,
        });
      } else {
        await validationSchema.validate(replyFormData, { abortEarly: false });
        await addReply(parentId, replyFormData);
      }

      setReplyFormData(initialFormData);
      setReplyingTo(0);
      setErrors({});
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 8000);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors: Partial<CommentData> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path as keyof CommentData] = error.message;
          }
        });
        setErrors(validationErrors);
      } else {
        // Handle API errors
        const error = err as AxiosError;
        if (error?.status === 403) {
          router.push('/login');
          setErrors({
            content: 'Session expired. Please login again.',
          });
          return;
        }
        setErrors({
          content: 'Failed to submit comment. Please try again.',
        });
      }
    }
  };

  const displayedComments = useMemo(() => {
    if (showAllComments) return displayComments;
    return displayComments.slice(0, pagination.perPage);
  }, [displayComments, showAllComments, pagination.perPage]);

  const handleToggleComments = async () => {
    if (!showAllComments && pagination.currentPage < pagination.totalPages) {
      setIsLoadingMoreComments(true);
      try {
        await fetchComments(pagination.currentPage + 1);
      } catch (err) {
        console.error('Failed to load more comments', err);
      } finally {
        setIsLoadingMoreComments(false);
      }
    }

    // If showing all comments, reset to first page and show only initial comments
    if (showAllComments) {
      fetchComments(1);
    }

    setShowAllComments(!showAllComments);
  };
  if (isLoading) {
    return <CircleLoader />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='max-w-2xl mx-auto p-4 md:p-0'>
      {showSuccessMessage && (
        <CustomAlert variant='success'>
          Thank you for your comment!
          {!isAdmin
            ? 'It has been submitted successfully and will be reviewed by our admin team before being published.'
            : ''}
        </CustomAlert>
      )}

      <div className='mb-8'>
        <h2 className='text-green-700 font-medium text-lg mb-4'>
          Comments ({pagination.totalComments})
        </h2>

        <div className='space-y-6'>
          {displayedComments.map((comment) => (
            <SingleComment
              key={comment.id}
              comment={{
                ...comment,
                isExpanded: expandedComments.has(comment.id),
              }}
              onReply={isCommentsDisabled ? () => {} : toggleReply}
              onToggleExpanded={toggleExpanded}
              replyingTo={replyingTo}
              replyFormData={replyFormData}
              handleReplyChange={handleReplyChange}
              handleReplySubmit={handleReplySubmit}
              errors={errors}
            />
          ))}
        </div>

        {/* Pagination "See More" Button */}
        {pagination.totalPages > 1 && (
          <div className='mt-6 text-center'>
            <button
              onClick={handleToggleComments}
              disabled={isLoadingMoreComments}
              className=' text-green-700 underline underline-offset-4 py-2 px-4 rounded flex items-center justify-center mx-auto'>
              {isLoadingMoreComments ? (
                <CircleLoader />
              ) : showAllComments ? (
                'Show Less Comments'
              ) : (
                'See More Comments'
              )}
            </button>
          </div>
        )}
      </div>

      {isCommentsDisabled ? (
        <CustomAlert variant='warning'>
          Comments are closed for this post as it is more than 28 days old.
        </CustomAlert>
      ) : (
        <div className='border-t pt-8'>
          <h3 className='text-green-700 font-medium text-lg mb-6'>
            Leave a comment
          </h3>
          {!isAdmin && (
            <div className='space-y-5'>
              <FormField
                label='Full Name'
                name='fullName'
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />

              <FormField
                label='Email Address'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <div>
                <label htmlFor='mainContent' className='block mb-1'>
                  Enter your Comment
                </label>
                <textarea
                  id='mainContent'
                  name='content'
                  className={`w-full p-2 border-2 rounded border-[#495551] outline-none mt-1 h-32 bg-inherit ${
                    errors.content ? 'border-red-500' : ''
                  }`}
                  value={formData.content}
                  onChange={handleChange}
                />
                {errors.content && (
                  <p className='text-red-500 text-sm mt-1'>{errors.content}</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                className='w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors'>
                {submitLoading ? 'Submitting ...' : ' Submit Comment'}
              </button>
            </div>
          )}
          {isAdmin && (
            <div className='space-y-5'>
              <div>
                <label htmlFor='mainContent' className='block mb-1'>
                  Enter your Comment
                </label>
                <textarea
                  id='mainContent'
                  name='content'
                  className={`w-full p-2 border-2 rounded border-[#495551] outline-none mt-1 h-32 bg-inherit ${
                    errors.content ? 'border-red-500' : ''
                  }`}
                  value={formData.content}
                  onChange={handleChange}
                />
                {errors.content && (
                  <p className='text-red-500 text-sm mt-1'>{errors.content}</p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                className='w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800 transition-colors'>
                {submitLoading ? 'Submitting ...' : ' Submit Comment'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;
