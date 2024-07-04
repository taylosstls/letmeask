import 'react-toastify/dist/ReactToastify.css';
import { Bounce, ToastContainer, toast } from 'react-toastify';

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
      <ToastContainer
        className= "text-sm p-3"
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
        stacked
      />

      <button className="room-code" onClick={copyToClipBoard}>
        <div>
          <img src={copyImg} alt="Copiar código da sala" />
        </div>
        <span>Sala #{code}</span>
      </button>

    </>
  )
}