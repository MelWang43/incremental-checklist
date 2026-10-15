import { useEffect } from 'react'
import '../../css/ConfirmModal.css'
import Card from '../Card.jsx'

function ConfirmModal({title, message, onConfirm, onCancel, cardElement, confirmButtonText = "Delete"}){

    useEffect(() => {
        const handleKey = (e) => {
            if(e.key === 'Escape'){
                onCancel()
            } else if (e.key == 'Enter') {
                onConfirm()
            }
        };

        window.addEventListener("keydown", handleKey)
        return () => {
            window.removeEventListener("keydown", handleKey)
        }
    }, [onCancel])

    function handleClick(e){
        if(e.target.closest(".confirm-modal")){
            return;
        }

        onCancel()
    }
    return (
        <div className="darken-screen" onClick={handleClick}>
            <div className="confirm-modal">
                <h3>{title}</h3>
                <p>{message}</p>

                {/* <div className='modal-card-container'>
                {cardElement && <Card card={cardElement}
                    />}
                </div> */}

                <div style={{display: 'flex', gap: '1rem'}}>
                    <button className="btn-cancel" onClick={onCancel}>Cancel</button>
                    <button className="btn-delete" onClick={onConfirm}>{confirmButtonText}</button>
                </div>
            </div>
        </div>
        
    )
}

export default ConfirmModal