export interface Video {
  video_id: string;
  user_id: string;
  title: string;
  description: string;
  video_url: string;
}

export interface Comment {
  comment_id: string;
  video_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface CreateVideoPayload {
  user_id: string;
  title: string;
  description: string;
  video_url: string;
}

export interface EditVideoPayload {
  video_id: string;
  title: string;
  description: string;
}

export interface CreateCommentPayload {
  video_id: string;
  user_id: string;
  content: string;
}
