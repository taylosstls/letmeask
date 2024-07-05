import { ReactNode } from "react";
import { FirebaseQuestion } from "../../types/FirebaseQuestions";
import './styles.css'

type QuestionProps = {
  children?: ReactNode;
} & FirebaseQuestion;

export function QuestionItem({ author, content, children } : QuestionProps) {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  )
}