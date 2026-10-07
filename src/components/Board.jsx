import '../css/Board.css'

function Board({board}){

    return (
        <div className="board">
            <span>{board.name}</span>
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