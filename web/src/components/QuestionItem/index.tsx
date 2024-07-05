import { ReactNode } from "react";
import { FirebaseQuestion } from "../../types/FirebaseQuestions";
import { formatLocalTime } from "../../utils/hourFormatter";

import './styles.css'

type QuestionProps = {
  children?: ReactNode;
} & FirebaseQuestion;

export function QuestionItem({ author, content, sendedAt, children, isAnswered = false, isHighlighted = false } : QuestionProps) {
    const formattedTime = formatLocalTime(sendedAt);
    const sendedAtFormatted = `Pergunta enviada ${formattedTime}`;
  
  return (
    <div className={`question ${isAnswered ? 'answered' : ''} ${isHighlighted ? 'highlighted' : ''}`}>
      {sendedAt && <sup>{sendedAtFormatted}</sup>}
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