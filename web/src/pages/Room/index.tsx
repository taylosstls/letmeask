import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useParams } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'
import { LoadingSpinner } from '../../components/LoadingSpinner'

import { useAuth } from '../../hooks/useAuth'

import { database } from '../../services/firebase'

import { FirebaseQuestions, Question } from '../../types/FirebaseQuestions'

import './styles.css'

type RoomParams = {
  id: string
}

type QuestionParams = {
  textForm: string
}

export function Room() {
  const { user } = useAuth();

  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuestionParams>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState()

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const questions: FirebaseQuestions = databaseRoom.questions;

      const parsedQuestions = Object.entries(questions ?? {}).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered
          }
        }
      )

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)

    })
  }, [roomId])

  const handleSendQuestion: SubmitHandler<QuestionParams> = async data => {
    setIsSubmitting(true);
    try {
      if (!user) throw new Error('Faça login para enviar sua mensagem.');
      if (!data.textForm.trim()) throw new Error('Preencha o campo de mensagem.');

      const question = {
        content: data.textForm,
        author: {
          name: user.name,
          avatar: user.avatar
        },
        isHighlighted: false,
        isAnswered: false,
      };

      await database.ref(`rooms/${roomId}/questions`).push(question)
      reset();

      toast.success("Pergunta enviada com sucesso!", {
        toastId: 'code-send-message-success'
      });

    } catch (error) {
      console.error(error);
      toast.error("Não foi possível enviar sua mensagem", {
        toastId: 'code-send-message-error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return ( 
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo LetMeAsk" />
          <RoomCode roomId={roomId!} />
        </div>
      </header>

      <main className='content'>
        <div className="room-title">
          <h1>Sala: {title}</h1>
          {questions.length > 0 && (
            <span>{questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}</span>
          )}
        </div>

        <form onSubmit={handleSubmit(handleSendQuestion)}>
          <textarea
            placeholder='O que você quer perguntar?'
            id="textForm" 
            {...register('textForm', { required: 'Preencha o campo' })} 
            disabled={isSubmitting}
            />
            {errors.textForm && <span>{errors.textForm.message}</span>}

          <div className='form-footer justify-between'>
            { user ? (
              <div className='user-info'>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button type='button'>faça seu login</button>.</span>
            )}
            <Button type='submit' disabled={!user || isSubmitting}>
              {isSubmitting ? (
                <LoadingSpinner />
              ) : (
                'Enviar pergunta'
              )}</Button>
          </div>
        </form>

        {JSON.stringify(questions)}

      </main>
    </div>
  )
}