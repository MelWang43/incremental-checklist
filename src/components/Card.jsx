import '../css/Card.css'
import Checkbox from './ui/Checkbox'
import {useState} from 'react'

function Card( {card, onCheck}){

    const [checked, setChecked] = useState(card.checked);
    const handleCheck = (val) => {
        setChecked(val);
        onCheck(card.id, val);
    }
    return(
        <div className={`card ${checked && 'completed'}`}>
            <Checkbox value={card.checked} onCheck={handleCheck}/>
            <textarea className="auto-grow card-editable-text">{card.text}</textarea>
        </div>
    )
}

export default Card