import {useEffect, useState, useRef} from 'react'
import '../css/Board.css'
import { useProjects } from '../contexts/ProjectContext';
import { useCards } from '../contexts/CardContext';
import { useConfirm} from '../contexts/ConfirmContext'
import Card from './Card';
import { GripHorizontal, Trash} from 'lucide-react';
import { DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';

function Board({board, onDragStart, onDelete, onEditName, onUpdateCards, onProgressChange, initCards = [], isNew = false, className}){
    const [deleted, setDeleted] = useState(false)
    
    const [dragging, setDragging] = useState(false);
    const [name, setName] = useState(board.name)
    const { updateBoard } = useProjects();
    

    const [isAdding, setIsAdding] = useState(false)
    const [newCardText, setCardText] = useState("")
    const inputRef = useRef();
    const nameRef = useRef();

    const [cards, setCards] = useState(initCards)
    const [progress, setProgress] = useState(0)
    const [doCompleteEffect, setDoCompleteEffect] = useState(false);

    const { loadCards, addCard, updateCard, deleteCard} = useCards();

    const {confirm} = useConfirm();

    useEffect(() => {
        const load = async () => {
            console.log(initCards, cards)
            const data = await loadCards(board.id)

            
            // setCards(data)
            setProgress(calculateProgress(data))

            if(data.length === 0) return false

            return true;
        }

        if(initCards.length === 0) {
            load()
        } else {
            setProgress(calculateProgress(cards))
        }
        if(isNew) nameRef.current?.focus()
    }, [])
    const handleMouseDown = (e) => {
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
        onEditName(board.id, name, !(name === board.name))
        if(name === board.name) return;
        updateBoard(board.project_id, board.id, name, board.index)
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

        onUpdateCards(board.id, data)
        
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

    const handleCheck = (e, val) => {
        console.log("Setting checked to:", val)
        const next = cards.map((card) => (e.id === card.id) ? {...card, checked : val} : card)
        
        setDoCompleteEffect(false);

        requestAnimationFrame(() => {
            setDoCompleteEffect(true)
        })

        updateCard(e.id, board.id, e.text, e.index, val)
        setProgress(calculateProgress(next))
        setCards(next);

        onUpdateCards(board.id, next)
    }

    const handleCardChange = (e, newText) => {
        if(e.text == newText) return

        const next = cards.map((card) => (e.id === card.id) ? {...card, text : newText} : card)

        updateCard(e.id, board.id, newText, e.index, e.checked)
        onUpdateCards(board.id, next)
        setCards(next)
    }

    const handleDeleteCard = async (e) => {
        const next = cards.filter(card => card.id !== e.id)
        await deleteCard(e.id)

        // await new Promise(resolve => setTimeout(resolve, 340))
        // setCards(next)

        const data = await loadCards(board.id)
        setCards(data)
        onUpdateCards(board.id, data)
        setProgress(calculateProgress(data))
    }

    const handleDelete = async (e) => {
        if(deleted) return

        const confirmed = await confirm({
            title: "Delete Board",
            message: "Are you sure you want to delete this board? This cannot be undone."
        })

        if(!confirmed) return;

        setDeleted(true)

        await new Promise(resolve => setTimeout(resolve, 340))
        onDelete(board)
    }
    useEffect(() => {
        if(isAdding) inputRef.current?.focus()
    }, [isAdding])

    const onCardsDragEnd = (e) => {
        if(e.canceled) return;

        const {source} = e.operation;
        if(!isSortable(source)) return;
        const {initialIndex, index} = source;
        if(initialIndex === index){
            console.log("Same index: ", initialIndex, index)
            return;
        }

        setCards((current) => {
            const next = [...current];

            const [movedCard] = next.splice(initialIndex, 1)

            next.splice(index, 0, movedCard)
            
            const reIndexed = next.map((card, index) => {
                const newIndex = index + 1;
                if(card.index !== newIndex) updateCard(card.id, board.id, card.text, newIndex, card.checked)
                return {...card, index: newIndex}
            })

            // console.log("Old: ", current, "vs New: ", reIndexed, next)
            return reIndexed;
        })

        
    }
    return (
        <div className={`board ${dragging ? 'dragging' : '' }
         ${progress >= 100 && doCompleteEffect ? 'complete-effect' : ''} 
         ${progress >= 100 && !doCompleteEffect ? 'completed' : ''}
         ${className}
         ${deleted ? 'deleted' : ''}`} >
            {/* <p>{board.index}</p> */}
            <button className="btn-no-effects btn-board-drag" onMouseDown={handleMouseDown}><GripHorizontal size={15}/></button>
            <div className="progress-bar">
                {cards.length > 0 && <div className={`progress-bar-fill`} style={{width: progress + "%"}}></div>}
            </div>

            <div className="board-title-container">
                <textarea className="auto-grow board-editable-text" ref={nameRef} value={name} onChange={handleNameChange} onBlur={handleBlurName}></textarea>
                <button className="btn-transparent board-delete-btn" onClick={handleDelete}><Trash/></button>
            </div>
            
            <DragDropProvider onDragEnd={onCardsDragEnd}>
                <ul className="board-items-container">
                    {cards.map((card, index) => 
                        
                        <Card card={card} 
                        key={card.id} 
                        index={index}
                        onCheck={handleCheck} 
                        onChange={handleCardChange}
                        onDelete={handleDeleteCard}/>)}
                </ul>
            </DragDropProvider>

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