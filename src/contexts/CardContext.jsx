import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const API_URL = import.meta.env.VITE_API_URL
const CardContext = createContext()

export function CardProvider({ children }) {
    const{session, loading} = useAuth();


    async function loadCards(boardID){
        if(!session){
            console.error("Failed to load Cards: User is not authenticated");
            return;
        }

        const response = await fetch(`${API_URL}/api/cards/board/${boardID}`, {
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        });

        const data = await response.json();
        if(!response.ok){
            console.error("Failed to load Cards");
            return;
        }

        if(!data) {
            console.log("Retrieved: " + data + " , returning empty list");
            return []
        }
        console.log("Retrieved Cards", data);
        return data
    }

    async function addCard(boardID, text, index){
        console.log("Trying to add: " + boardID, text, index)

        const response = await fetch(`${API_URL}/api/cards`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                board_id: boardID,
                text: text,
                index: index
            })
        });

        const data = await response.json();
        if(!response.ok){
            console.error("Failed to add card: ");
            return;
        }

        console.log('Created Card:',data);

        return data
    }

    async function updateCard(cardID, boardID, text, index, checked){
        console.log("Updating:", cardID, text, index, checked)
        const response = await fetch(`${API_URL}/api/cards/${cardID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                text: text,
                index: index,
                checked: checked
            })
        });

        const {data, error} = await response.json();
        if(!response.ok){
            console.error("Failed to update card: ", error);
            return;
        }

        console.log('Updated card:', data);
        return data
    }

    async function deleteCard(cardID){
        const response = await fetch(`${API_URL}/api/cards/${cardID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`
            },
        });

        const {data, error} = await response.json();
        if(!response.ok){
            console.error("Failed to delete card: ", error);
            return;
        }

        console.log('Deleted card:', data);
        return data
    }

    return (
        <CardContext.Provider value={{loadCards, addCard, updateCard, deleteCard}}>
            {children}
        </CardContext.Provider>
    )
}

export function useCards() {
    return useContext(CardContext)
}