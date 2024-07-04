import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SubmitHandler, useForm } from 'react-hook-form'

import logoImg from '../../assets/images/logo.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import { database } from '../../services/firebase'
import { useAuth } from '../../hooks/useAuth'

import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Aside } from '../../components/Aside'
import { Button } from '../../components/Button'

import { FormValues } from '../../types/FormValues';

import './style.css'

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  const handleCreateRoom = async () => {
    if (!user) await signInWithGoogle()

    navigate('/rooms/new');
  };

  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoinRoom: SubmitHandler<FormValues> = async data => {
    setIsSubmitting(true);
    try {
      if (!data.roomId.trim()) throw new Error('Informe o código da sala');

      const roomRef = await database.ref(`rooms/${data.roomId}`).get()

      if(!roomRef.exists()) throw new Error('Código de sala inexistente');

      navigate(`/rooms/${data.roomId}`);

    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setError('roomId', {
          type: 'manual',
          message: error.message,
        });
      } else {
        setError('roomId', {
          type: 'manual',
          message: 'Ocorreu um erro desconhecido',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id='page-auth'>
      <Aside />

      <main>
        <div className='main-content'>
          <img src={logoImg} alt="Logo LetMeAsk" />

          <button className='create-room' onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>

          <div className='separator'>ou entre em uma sala</div>

          <form onSubmit={handleSubmit(handleJoinRoom)}>
            <input
              type="text"
              placeholder='Digite o código da sala'
              id="roomId" 
              {...register('roomId', { required: 'Informe o código da sala' })} 
              disabled={isSubmitting}
            />
            {errors.roomId && <span>{errors.roomId.message}</span>}

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <LoadingSpinner />
              ) : (
                'Entrar na sala'
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}