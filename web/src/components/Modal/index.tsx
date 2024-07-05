import { ReactNode } from 'react';
import './style.css';

type ModalAction = {
  handler: () => void;
  buttonText: string;
};

type ModalProps = {
  isOpen: boolean;
  onClose?: ModalAction;
  onConfirm?: ModalAction;
  imgInfo?: ReactNode;
  title: string;
  description?: string;
};

export function Modal({ isOpen, onClose, onConfirm, imgInfo, title, description }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {imgInfo}
        <h2>{title}</h2>
        <p>{description}</p>
        {(onClose || onConfirm) && (
          <div className="modal-actions">
            {onClose && <button className='btn btn-cancel' onClick={onClose.handler}>{onClose.buttonText}</button>}
            {onConfirm && <button className='btn btn-confirm' onClick={onConfirm?.handler}>{onConfirm.buttonText}</button>}
          </div>
          )
        }
      </div>
    </div>
  );
}
