import illustrationImg from '../../assets/images/illustration.svg';
import scrollFinger from '../../assets/images/scroll-finger.svg';

import './style.css';

export function Aside() {
  return (
    <aside>
      <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
      <strong>Crie salas de Q&amp;A ao-vivo</strong>
      <p>Tire as dúvidas da sua audiência em tempo-real</p>

      <button onClick={() => document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' })}>
        <img className="scrollfinger-mob" src={scrollFinger} alt="" />
      </button>
    </aside>
  );
}
