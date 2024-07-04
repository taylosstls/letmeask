import firebase from 'firebase/compat/app';
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

import { FirebaseQuestion, Question } from '../../types/FirebaseQuestions'

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
    const questionsRef = roomRef.child('questions');

    const handleChangeTitle = (snapshot: firebase.database.DataSnapshot) => {
      const databaseRoom = snapshot.val();
      setTitle(databaseRoom.title)
    }

    const handleChildAdded = (snapshot: firebase.database.DataSnapshot) => {
      const newQuestion: FirebaseQuestion = snapshot.val();
      const newQuestionKey = snapshot.key as string;
  
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          id: newQuestionKey,
          ...newQuestion,
        },
      ]);
    };
  
    const handleChildChanged = (snapshot: firebase.database.DataSnapshot) => {
      const updatedQuestion: FirebaseQuestion = snapshot.val();
      const updatedQuestionKey = snapshot.key as string;
  
      setQuestions((prevQuestions) =>
        prevQuestions.map((question) =>
          question.id === updatedQuestionKey
            ? {
                id: updatedQuestionKey,
                ...updatedQuestion,
              }
            : question
        )
      );
    };
  
    const handleChildRemoved = (snapshot: firebase.database.DataSnapshot) => {
      const removedQuestionKey = snapshot.key as string;
  
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== removedQuestionKey)
      );
    };

    roomRef.once('value', handleChangeTitle);
    questionsRef.on('child_added', handleChildAdded);
    questionsRef.on('child_changed', handleChildChanged);
    questionsRef.on('child_removed', handleChildRemoved);
  
    return () => {
      questionsRef.off('child_added', handleChildAdded);
      questionsRef.off('child_changed', handleChildChanged);
      questionsRef.off('child_removed', handleChildRemoved);
    };
  }, [roomId]);

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