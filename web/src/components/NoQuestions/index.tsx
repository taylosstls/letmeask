import { ReactNode } from 'react';
import emptyQuestions from '../../assets/images/empty-questions.svg';

import './styles.css';

type QuestionProps = {
  children: ReactNode;
};

export function NoQuestions({ children }: QuestionProps) {
  return (
    <div className="no-questions">
      <img src={emptyQuestions} alt="Nenhuma mensagem cadastrada" />
      <h2>Nenhuma pergunta por aqui...</h2>
      <p>{children}</p>
    </div>
  );
}
