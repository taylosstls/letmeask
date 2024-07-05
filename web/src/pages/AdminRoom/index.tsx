import { useParams } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'
import { QuestionItem } from '../../components/QuestionItem';

import { useRoom } from '../../hooks/useRoom';

import { database } from '../../services/firebase';

import './styles.css'
import { useState } from 'react'
import { Modal } from '../../components/Modal'
import { Delete } from '../../components/Icons/Delete';

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId!);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  function handleOpenModal(questionId: string) {
    setQuestionToDelete(questionId);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setQuestionToDelete(null);
  }

  async function handleDeleteQuestion() {
    if (questionToDelete) {
      await database.ref(`rooms/${roomId}/questions/${questionToDelete}`).remove();
      handleCloseModal();
    }
  }

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
                <button type="button" onClick={() => handleOpenModal(question.id)}>
                  <Delete />
                </button>
              </QuestionItem>
            )
          })}
        </div>

      </main>

      <Modal
        imgInfo={<Delete />}
        title='Excluir Pergunta'
        description='Tem certeza que você deseja excluir esta pergunta?'
        isOpen={isModalOpen}
        onClose={{ handler: handleCloseModal, buttonText: 'Cancelar' }}
        onConfirm={{ handler: handleDeleteQuestion, buttonText: 'Sim, excluir'}}
      />
    </div>
  )
}