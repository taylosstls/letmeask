import { useNavigate, useParams } from 'react-router-dom'

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
import { Close } from '../../components/Icons/Close';
import { toast } from 'react-toastify';

type RoomParams = {
  id: string
}

export function AdminRoom() {
  const navigate = useNavigate();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId!);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEndRoomModalOpen, setIsEndRoomModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  function handleOpenModal(questionId: string) {
    setQuestionToDelete(questionId);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setQuestionToDelete(null);
  }

  function handleOpenEndRoomModal() {
    setIsEndRoomModalOpen(true);
  }
  
  function handleCloseEndRoomModal() {
    setIsEndRoomModalOpen(false);
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })

    toast.success("Sala encerrada com sucesso!", {
      toastId: 'close-room-session'
    });
    
    navigate('/');
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
            <Button isOutlined onClick={handleOpenEndRoomModal}>Encerrar sala</Button>
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

      <Modal
        imgInfo={<Close />}
        title="Encerrar Sala"
        description="Tem certeza que você deseja encerrar esta sala?"
        isOpen={isEndRoomModalOpen}
        onClose={{ handler: handleCloseEndRoomModal, buttonText: 'Cancelar' }}
        onConfirm={{ handler: handleEndRoom, buttonText: 'Sim, encerrar' }}
      />
    </div>
  )
}