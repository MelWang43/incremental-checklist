import {useEffect, useState, useRef} from 'react'
import '../css/Board.css'
import { useProjects } from '../contexts/ProjectContext';
import { useCards } from '../contexts/CardContext';
import Card from './Card';

function Board({board, onDragStart, onDragEnd, onEditName}){

    const [dragging, setDragging] = useState(false);
    const [name, setName] = useState(board.name)
    const { updateBoard } = useProjects();
    

    const [isAdding, setIsAdding] = useState(false)
    const [newCardText, setCardText] = useState("")
    const inputRef = useRef();

    const [cards, setCards] = useState([])
    const [progress, setProgress] = useState(0)
    const { loadCards, addCard} = useCards();

    useEffect(() => {
        const load = async () => {
            const data = await loadCards(board.id)
            setCards(data)
        }

        load()
    }, [])
    const handleMouseDown = (e) => {
        return
        e.preventDefault()
        if(e.button != 0) return;
        setDragging(true);
        onDragStart(board);
    }

    const handleNameChange = (e) => {
        const raw = e.target.value;

        setName(raw)
    }

    const handleBlurName = (e) => {
        console.log("Changing: " + board.name + " to " + name)
        if(name === board.name) return;
        updateBoard(board.project_id, board.id, name, board.index)
        onEditName(board.id, name)
    }

    const handleStartAdd = (e) => {
        setIsAdding(true)
        
    }

    const handleChangeNewCard = (e) => {
        const raw = e.target.value;
        setCardText(raw)    
    }

    const handleAddNewCard = (e) => {
        e?.preventDefault();
        if(newCardText) createNewCard(newCardText, cards.length + 1)

        setIsAdding(false)
    }

    const createNewCard = async (text, index) => {
        await addCard(board.id, text, index)
        const data = await loadCards(board.id)
        setCards(data)
        setProgress(calculateProgress(data))
        setCardText("")
        
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            handleAddNewCard()
        } else if (e.key == 'Escape'){
            setIsAdding(false)
        }
    }

    const calculateProgress = (list) => {
        const sum = list.reduce((sum, card) => sum + (card.checked ? 1 : 0), 0)
        return sum * 100 / list.length
    }

    const handleCheck = (id, val) => {
        const next = cards.map((card) => (id === card.id) ? {...card, checked : val} : card)
        setProgress(calculateProgress(next))
        setCards(next);
    }
    useEffect(() => {
        if(isAdding) inputRef.current?.focus()
    }, [isAdding])


    return (
        <div className={`board ${dragging && 'dragging' } ${progress >= 100 && 'completed'}`} onMouseDown={handleMouseDown} >
            <div className="progress-bar">{progress}</div>
            <textarea className="auto-grow board-editable-text" value={name} onChange={handleNameChange} onBlur={handleBlurName}></textarea>
            <div className="board-items-container">
                {cards.map((card) => <Card card={card} key={card.id} onCheck={handleCheck}/>)}
            </div>

            { isAdding ? 
            <div className="add-container">
                <textarea 
                placeholder='Enter card text'
                ref={inputRef} 
                className="auto-grow board-add-input"
                onBlur={() => setIsAdding(false)}
                onChange={handleChangeNewCard}
                value={newCardText}
                onKeyDown={handleKeyDown}></textarea>

                <button className="board-add-btn"
                onClick={handleAddNewCard}
                onMouseDown={(e) => {e.preventDefault()}}>Add</button>
            </div>
             : <button className="board-add-btn" onClick={handleStartAdd}>+ Add New</button>}
        </div>
    )
}

export default Board