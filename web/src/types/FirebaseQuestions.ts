export type FirebaseQuestion = {
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

export type FirebaseQuestions = Record<string, FirebaseQuestion>;

export type Question = {
  id: string;
} & FirebaseQuestion;
