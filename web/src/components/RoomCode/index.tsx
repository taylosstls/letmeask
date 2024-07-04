import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

import copyImg from '../../assets/images/copy.svg'

import './styles.css'

type RoomCodeProps = {
  code: string;
} 

export function RoomCode({ code = '' }: RoomCodeProps) {
  function copyToClipBoard() {
    navigator.clipboard.writeText(code)
    toast.success("Código copiado com sucesso!", {
      toastId: 'copy-room-code'
    });
  }

  return (
    <>
      <button className="room-code" onClick={copyToClipBoard}>
        <div>
          <img src={copyImg} alt="Copiar código da sala" />
        </div>
        <span>Sala #{code}</span>
      </button>

    </>
  )
}