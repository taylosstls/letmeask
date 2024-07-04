import { FirebaseQuestion } from "../../types/FirebaseQuestions";
import './styles.css'

export function QuestionItem({ author, content } : FirebaseQuestion) {
  return (
    <div className="question">
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div></div>
      </footer>
    </div>
  )
}