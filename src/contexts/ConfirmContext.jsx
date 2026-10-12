import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import ConfirmModal from '../components/ui/ConfirmModal'

const ConfirmContext = createContext()

export function ConfirmProvider({ children }) {
    const [modal, setModal] = useState(null)

    const confirm = ({title, message, card}) => {
        return new Promise((resolve) => {
            setModal({
                title,
                message,
                card,
                resolve
            })
        })
    }

    const handleResponse = (result) => {
        modal.resolve(result);
        setModal(null)
    }
    return (
        <ConfirmContext.Provider value={{ confirm}}>
            {children}

            {modal && (
                <ConfirmModal
                title={modal.title}
                message={modal.message}
                cardElement={modal.card}
                onConfirm={() => handleResponse(true)}
                onCancel={() => handleResponse(false)}/>
            )}
        </ConfirmContext.Provider>
    )
}

export function useConfirm() {
    return useContext(ConfirmContext)
}