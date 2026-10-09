import {useEffect, useState} from 'react'
import '../css/Board.css'

function Board({board, onDragStart, onDragEnd}){

    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        const handleMouseUp = (e) =>{
            // if(e.button != 0) return;
            setDragging(false);
            onDragEnd();
        }

        document.addEventListener("mouseup", handleMouseUp)
        
        return () => {
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [])
    const handleMouseDown = (e) => {
        e.preventDefault()
        if(e.button != 0) return;
        setDragging(true);
        onDragStart(board);
    }
    return (
        <div className={`board ${dragging ? 'dragging' : ''}`} onMouseDown={handleMouseDown} >
            <span>{`${board.name} ${board.index}`}</span>
            <div className="board-items-container">
                <div className="board-item">
                    <span>Text</span>
                </div>
            </div>

            <button>+ Add New</button>
        </div>
    )
}

export default Board