export interface MediaItemProps {
  url: string;
  title: string;
  episodes?: Array<{ title: string; url: string }>;
}
export interface MediaShow {
  title: string;
  url: string;
  tagId: number;
  slug: string;
  link: string;
}

export interface MediaEpisode {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  link: string;
}

export interface EpisodeColors {
  [key: number]: string;
}

export interface ImageSet {
  left: string;
  right: string;
  podcastBgLeft: string;
  podcastBgRight: string;
}

export interface StoredEpisodes {
  [tagId: number]: {
    episodes: MediaEpisode[];
    lastFetched: number;
  };
}

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  sharePermission?: 'yes-full' | 'yes-initials' | 'yes-anonymous' | 'no';
  phone?: string;
  dateRequested?: string;
  timePreference?: string;
  eventType?: string;
  numberOfAttendees?: string;
  venueDetails?: string;
  additionalNotes?: string;
}
export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  sharePermission?: 'yes-full' | 'yes-initials' | 'yes-anonymous' | 'no';
  phone?: string;
  dateRequested?: string;
  timePreference?: string;
  eventType?: string;
  numberOfAttendees?: string;
  venueDetails?: string;
  additionalNotes?: string;
}
export interface FormErrors {
  [key: string]: string;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  country: string;
  phoneNumber: string;
  churchName: string;
  churchWebsite: string;
  typeOfEvent: string;
  dateOfEvent: string;
  eventLocation: string;
  eventCountry: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  closestAirport: string;
  additionalInformation?: string;
  hearAboutUs: string;
}

export type BookingFormErrors = {
  [K in keyof FormData]?: string;
};

// tpye for comment
export interface CommentData {
  fullName: string;
  email: string;
  content: string;
}
export interface ApiCommentData {
  content: string;
}

export interface CommentDisplayData extends CommentData {
  id: number;
  date: string;
  replies: CommentDisplayData[];
  isExpanded?: boolean;
}

export interface CommentSubmitData {
  post: number;
  author_name: string;
  author_email: string;
  content: string;
  parent?: number;
}

export interface CommentResponse {
  id: number;
  author_name: string;
  author_email: string;
  content: {
    rendered: string;
  };
  date: string;
  parent: number;
  post: number;
  replies?: CommentResponse[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalComments: number;
  perPage: number;
}

export interface CommentProps {
  postId: string | number;
}

export interface SingleCommentProps {
  comment: CommentDisplayData;
  depth?: number;
  onReply: (id: number) => void;
  onToggleExpanded: (id: number) => void;
  replyingTo: number;
  replyFormData: CommentData;
  handleReplyChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleReplySubmit: (parentId: number) => void;
  errors: Partial<CommentData>;
}

export const transformCommentToDisplayData = (
  comment: CommentResponse
): CommentDisplayData => {
  return {
    id: comment.id,
    fullName: comment.author_name,
    email: comment.author_email,
    content: comment.content.rendered,
    date: new Date(comment.date).toLocaleDateString(),
    replies: comment.replies?.map(transformCommentToDisplayData) || [],
  };
};

export const transformFormToSubmitData = (
  formData: CommentData,
  postId: number,
  parentId?: number
): CommentSubmitData => {
  return {
    post: postId,
    author_name: formData.fullName,
    author_email: formData.email,
    content: formData.content,
    ...(parentId && { parent: parentId }),
  };
};


