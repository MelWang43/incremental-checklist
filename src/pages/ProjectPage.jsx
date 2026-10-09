import { useParams } from "react-router-dom";
import { useProjects } from "../contexts/ProjectContext";
import { useEffect, useState, useRef} from "react";
import '../css/ProjectPage.css'
import Board from '../components/Board'

function ProjectPage() {
    const { id } = useParams();
    const { selectProjectID, loadBoards, addBoard, updateBoard} = useProjects();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const boardRefs = useRef([]);
    const [boards, setBoards] = useState([])
    const [editingBoards, setEditingBoards] = useState(false)

    const [mousePos, setMousePos] = useState({x: 0, y: 0})
    const [editIndex, setEditIndex] = useState(0) // The index of the board we're currently moving 
    const [ghostBoardIndex, setGhostBoardIndex] = useState(0)
    const [boardStats, setBoardStats] = useState({index: 0, x: 0})

    useEffect(() => {
        const loadProject = async () => {
            setLoading(true);

            const proj = await selectProjectID(id);

            setProject(proj);
            setLoading(false);

            const board = await loadBoards(id)

            setBoards(board);
        };
        setLoading(true)
        loadProject();
        
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const pos = {x: e.clientX, y: e.clientY}
            setMousePos(pos)
            // Determine if mouse is in the area of a board, prompting a move
            if(editingBoards){
                let newGhostIndex = 0;
                for(var i = 1; i < boardStats.length; i++){
                    
                    if(i >= editIndex){
                        if(i < boardStats.length - 1 && pos.x < boardStats[i + 1].x && pos.x >= boardStats[i].x){
                        newGhostIndex = i
                        break;
                        }
                    }  
                    
                    if(i <= editIndex){
                        if(i < boardStats.length - 1 && pos.x < boardStats[i].x ){
                        newGhostIndex = i
                        break;
                        }
                    }

                    if(i === boardStats.length - 1 ){
                        newGhostIndex = i
                    }
                }
                console.log("Ghost: " + newGhostIndex, "Editing: " + editIndex, "IsEditing?", editingBoards)
                setGhostBoardIndex(newGhostIndex);
                
            }
        }

        document.addEventListener("mousemove", handleMouseMove)

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
        }
    }, [editingBoards])

    useEffect(() => {

        const handleMouseUp = (e) =>{
            // if(e.button != 0) return;
            handleStopEditing()
        }

        document.addEventListener("mouseup", handleMouseUp)
        
        return () => {
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [editingBoards, editIndex, ghostBoardIndex])

    async function createNewBoard(e){
        const newBoard = {name: 'New Board', index: !boards ? 0 : boards.length + 1}

        await addBoard(id, newBoard)
        const board = await loadBoards(id)
        setBoards(board);
    }
    const handleStartEditing = (board) => {
        setEditingBoards(true)
        
        setGhostBoardIndex(board.index)
        setEditIndex(board.index)
        
        // Compile all x coords, paied with their index value
        const stats = boardRefs.current.map((el, index) => {
            const rect = el?.getBoundingClientRect()
            const newX = (rect.width / 2) + rect.x
            return {index: index, x: newX}
        })
        setBoardStats(stats)
    }

    async function handleStopEditing() {
        if(!editingBoards) return
        console.log("STOPPED EDITING")
        console.log("Attempting to swap: ", editIndex, "and", ghostBoardIndex)
        
        if (editIndex !== ghostBoardIndex) {
            const next = [...boards];
            const i1 = editIndex - 1;
            const i2 = ghostBoardIndex - 1;
            
            const [item] = next.splice(i1, 1)
            next.splice(i2, 0, item)

            setBoards(next)                      
            updateBoardIndexesInstant();
            updateAllBoardIndexes(next)
        }

        setEditingBoards(false)
        setEditIndex(-1)
    }

    function updateBoardIndexesInstant(){
        setBoards(prev => prev.map((board, index) => ({...board, index : index + 1})))
    }
    async function updateAllBoardIndexes(boards){
        for(let i = 0; i < boards.length; i++){
            await updateBoard(project.id, boards[i].id, boards[i].name, i + 1)
        }
    }

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!project) {
        return <h1>Failed to get Project</h1>;
    }

    
    const ghostBoard = (<div className="board ghost">GHOST</div>)
    return (
        <>
        <div className="project-header">
            <h3>{project.name}</h3>
        </div>

        <div className="project-content">
            <div className="board-container">
                {boards && boards.map((board) => {

                    
                    return (
                        <>
                        {editingBoards && ghostBoardIndex === board.index && board.index < editIndex ?  ghostBoard : <></>}
                        {editingBoards && editIndex === board.index ? 
                            <></> :
                            <div key={board.id} ref={(el) => boardRefs.current[board.index] = el}>
                                    <Board  
                                    board={board} 
                                    onDragStart={handleStartEditing} 
                                    onDragEnd={handleStopEditing}
                                    />
                            </div>
                        }

                        {editingBoards && ghostBoardIndex === board.index && board.index >= editIndex ? ghostBoard : <></>}
                        </>
                        
                    )
                })}
                {/* {editingBoards && ghostBoardIndex === boards.length ? <div className="board ghost">GHOST</div> : <></>} */}
                    
                        
                <button onClick={createNewBoard} className="btn-add-board">+ Add New</button>
            </div>
        </div>
        </>
    );
}

export default ProjectPage;