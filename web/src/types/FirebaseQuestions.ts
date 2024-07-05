export type FirebaseLike = {
  authorId: string;
};

export type FirebaseQuestion = {
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  sendedAt: string;
  isAnswered?: boolean;
  isHighlighted?: boolean;
  likes?: Record<string, FirebaseLike>;
};

export type FirebaseQuestions = Record<string, FirebaseQuestion>;

export type Question = {
  id: string;
  likeCount?: number;
  likeId?: string | undefined;
} & FirebaseQuestion;
