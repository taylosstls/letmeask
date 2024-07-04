
import { useNavigate } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import { Aside } from '../../components/Aside'
import { Button } from '../../components/Button'
import { useAuth } from '../../hooks/useAuth'

import './style.css'

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();

  const handleCreateRoom = async () => {
    if (!user) await signInWithGoogle()

    navigate('/rooms/new');
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

          <form action="">
            <input type="text" placeholder='Digite o código da sala' />
            <Button type='submit'>Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}