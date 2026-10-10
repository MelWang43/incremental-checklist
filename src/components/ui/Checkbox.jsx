import {useState} from 'react'
import '../../css/Checkbox.css'
import { Check } from 'lucide-react'

function Checkbox({value, onCheck}){
    const [checked, setChecked] = useState(value)

    const handleCheck = (e) => {
        const val = !checked
        setChecked(val)
        onCheck(val)
    }
    return (
        <button className={`checkbox ${checked && 'checked'}`} onClick={handleCheck}>
            {checked ? <Check size={15}/> : <></>}
            
        </button>
    )
}

export default Checkbox