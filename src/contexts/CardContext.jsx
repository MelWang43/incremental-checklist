import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

const CardContext = createContext()

export function CardProvider({ children }) {
    const{session, loading} = useAuth();


    async function loadCards(boardID){
        if(!session){
            console.error("Failed to load Cards: User is not authenticated");
            return;
        }

        const response = await fetch("http://localhost:3000/api/cards/board/" + boardID, {
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

        const response = await fetch(`http://localhost:3000/api/cards`, {
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

    return (
        <CardContext.Provider value={{loadCards, addCard}}>
            {children}
        </CardContext.Provider>
    )
}

export function useCards() {
    return useContext(CardContext)
}