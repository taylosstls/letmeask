import { SubmitHandler, useForm } from 'react-hook-form';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

import logoImg from '../../assets/images/logo.svg';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { LoadingSpinner } from '../../components/Icons/LoadingSpinner';

import { useAuth } from '../../hooks/useAuth';

import { database } from '../../services/firebase';

import { QuestionItem } from '../../components/QuestionItem';

import './styles.css';
import { useRoom } from '../../hooks/useRoom';
import { NoQuestions } from '../../components/NoQuestions';

type QuestionParams = {
  textForm: string;
};

type RoomParams = {
  id: string;
};

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId!);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuestionParams>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendQuestion: SubmitHandler<QuestionParams> = async (data) => {
    setIsSubmitting(true);
    try {
      if (!user) throw new Error('Faça login para enviar sua mensagem.');
      if (!data.textForm.trim()) throw new Error('Preencha o campo de mensagem.');

      const question = {
        content: data.textForm,
        author: {
          name: user.name,
          avatar: user.avatar,
        },
        isHighlighted: false,
        isAnswered: false,
        sendedAt: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      };

      await database.ref(`rooms/${roomId}/questions`).push(question);
      reset();

      toast.success('Pergunta enviada com sucesso!', {
        toastId: 'code-send-message-success',
      });
    } catch (error) {
      console.error(error);
      toast.error('Não foi possível enviar sua mensagem', {
        toastId: 'code-send-message-error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      // Remover o like
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
    } else {
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
      });
    }
  }

  console.log(questions.length);

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo LetMeAsk" />
          <RoomCode roomId={roomId!} />
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala: {title}</h1>
          {questions.length > 0 && (
            <span>
              {questions.length} {questions.length === 1 ? 'pergunta' : 'perguntas'}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit(handleSendQuestion)}>
          <textarea
            placeholder="O que você quer perguntar?"
            id="textForm"
            {...register('textForm', { required: 'Preencha o campo' })}
            disabled={isSubmitting}
          />
          {errors.textForm && <span>{errors.textForm.message}</span>}

          <div className="form-footer justify-between">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta, <button type="button">faça seu login</button>.
              </span>
            )}
            <Button type="submit" disabled={!user || isSubmitting}>
              {isSubmitting ? <LoadingSpinner /> : 'Enviar pergunta'}
            </Button>
          </div>
        </form>

        <div className="question-list">
          {questions.length === 0 ? (
            <NoQuestions>
              {!user
                ? 'Faça o seu login e seja a primeira pessoa a fazer uma pergunta!'
                : 'Seja a primeira pessoa a fazer uma pergunta!'}
            </NoQuestions>
          ) : (
            questions
              .sort((a, b) => {
                // Primeiro, ordena pelas destacadas que não foram respondidas
                if (a.isHighlighted && !a.isAnswered && (!b.isHighlighted || b.isAnswered)) return -1;
                if (b.isHighlighted && !b.isAnswered && (!a.isHighlighted || a.isAnswered)) return 1;
                // Depois, ordena pelas não destacadas e não respondidas
                if (!a.isHighlighted && !a.isAnswered && (b.isHighlighted || b.isAnswered)) return -1;
                if (!b.isHighlighted && !b.isAnswered && (a.isHighlighted || a.isAnswered)) return 1;
                // Por último, ordena pelas respondidas
                if (a.isAnswered && !b.isAnswered) return 1;
                if (!a.isAnswered && b.isAnswered) return -1;
                // Mantém a ordem original se as condições acima não se aplicarem
                return 0;
              })
              .map((question) => {
                return (
                  <QuestionItem
                    key={question.id}
                    content={question.content}
                    author={question.author}
                    sendedAt={question.sendedAt}
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighlighted}
                  >
                    <button
                      type="button"
                      className={`like-button ${question.likeId ? 'liked' : ''}`}
                      aria-label="Marcar como gostei"
                      onClick={() => handleLikeQuestion(question.id, question.likeId)}
                    >
                      {Number(question.likeCount) > 0 ? <span>{question.likeCount}</span> : ''}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                          stroke="#737380"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </QuestionItem>
                );
              })
          )}
        </div>
      </main>
    </div>
  );
}
