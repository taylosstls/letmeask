import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

import copyImg from '../../assets/images/copy.svg'

import { FormValues } from '../../types/FormValues';

import './styles.css'

export function RoomCode({ roomId = '' }: FormValues) {
  function copyToClipBoard() {
    navigator.clipboard.writeText(roomId)
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
        <span>Sala #{roomId}</span>
      </button>

    </>
  )
}