import { useParams } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'

import { QuestionItem } from '../../components/QuestionItem';

import './styles.css'
import { useRoom } from '../../hooks/useRoom';

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId!);

  return ( 
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo LetMeAsk" />
          <div>
            <RoomCode roomId={roomId!} />
            <Button isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main className='content'>
        <div className="room-title">
          <h1>Sala: {title}</h1>
          {questions.length > 0 && (
            <span>{questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}</span>
          )}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <QuestionItem
                key={question.id}
                content={question.content}
                author={question.author}
              >
                
              </QuestionItem>
            )
          })}
        </div>

      </main>
    </div>
  )
}