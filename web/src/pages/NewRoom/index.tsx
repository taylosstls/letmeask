import { Link } from 'react-router-dom'

import logoImg from '../../assets/images/logo.svg'

import { Aside } from '../../components/Aside'
import { Button } from '../../components/Button'
//import { useAuth } from '../../hooks/useAuth'

import './style.css'

export function NewRoom() {
  //const { user } = useAuth();

  return (
    <div id='page-auth'>
      <Aside />

      <main>
        <div className='main-content'>
          <img src={logoImg} alt="Logo LetMeAsk" />

          <h2>Crie uma nova sala</h2>

          <form action="">
            <input type="text" placeholder='Nome da sala' />
            <Button type='submit'>Criar sala</Button>
          </form>

          <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}