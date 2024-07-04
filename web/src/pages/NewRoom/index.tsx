import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';

import logoImg from '../../assets/images/logo.svg';

import { database } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';

import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Aside } from '../../components/Aside';
import { Button } from '../../components/Button';

import { FormValues } from '../../types/FormValues';

import './style.css';

export function NewRoom() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateRoom: SubmitHandler<FormValues> = async data => {
    setIsSubmitting(true);
    try {
      if (!data.roomId.trim()) {
        throw new Error('Informe o nome da sala');
      }

      const roomRef = database.ref('rooms');
      const firebaseRoom = await roomRef.push({
        title: data.roomId.trim(),
        authorId: user?.id
      });

      navigate(`/rooms/${firebaseRoom.key}`);

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

          <h2>Crie uma nova sala</h2>

          <form onSubmit={handleSubmit(handleCreateRoom)}>
            <input 
              type="text" 
              placeholder='Nome da sala' 
              id="roomId" 
              {...register('roomId', { required: 'Informe o nome da sala' })} 
              disabled={isSubmitting}
            />
            {errors.roomId && <span>{errors.roomId.message}</span>}
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <LoadingSpinner />
              ) : (
                'Criar sala'
              )}
            </Button>
          </form>

          <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  );
}
