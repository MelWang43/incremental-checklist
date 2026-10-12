import { EllipsisVertical, GripVertical, SquareX, Trash } from 'lucide-react';
import '../css/Card.css'
import Checkbox from './ui/Checkbox'
import {useState} from 'react'
import { useConfirm } from '../contexts/ConfirmContext';

function Card( {card, onCheck, onChange, onDelete}){

    const [checked, setChecked] = useState(card.checked);
    const [doCheckEffect, setDoCheckEffect] = useState(false);
    const [text, setText] = useState(card.text)
    const [deleted, setDeleted] = useState(false) 

    const {confirm} = useConfirm();
    const handleCheck = (val) => {
        setChecked(val);
        setDoCheckEffect(true)
        onCheck(card, val);
    }

    const handleTextChange = (e) => {
        const raw = e.target.value
        setText(raw); 
    }

    const handleTextBlur = (e) => {
        onChange(card, e.target.value)
    }

    async function handleDelete(e) {
        if(deleted) return

        const confirmed = await confirm({
            title: 'Delete Card',
            message: "Are you sure you want to delete this card? This cannot be undone.",
            card: card
        })

        if(!confirmed) return;
        onDelete(card)
        setDeleted(true)
    }
    return(
        <div className={`card ${checked && doCheckEffect ? 'complete-effect' : ''} ${checked && !doCheckEffect ? 'completed' : ''} ${deleted ? 'deleted' : ''}`}>
            <Checkbox value={card.checked} onCheck={handleCheck}/>
            <textarea className="auto-grow card-editable-text" value={text} onChange={handleTextChange} onBlur={handleTextBlur}></textarea>
            
            <button className="btn-transparent card-delete-btn" onClick={handleDelete}><SquareX/></button>
        </div>
    )
}

export default Card