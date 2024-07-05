import { ReactNode } from 'react';
import './style.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imgInfo: ReactNode;
};

export function Modal({ isOpen, onClose, onConfirm, imgInfo }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {imgInfo}
        <h2>Excluir Pergunta</h2>
        <p>Tem certeza que você deseja excluir esta pergunta?</p>
        <div className="modal-actions">
          <button className='btn btn-cancel' onClick={onClose}>Cancelar</button>
          <button className='btn btn-confirm' onClick={onConfirm}>Sim, excluir</button>
        </div>
      </div>
    </div>
  );
}
