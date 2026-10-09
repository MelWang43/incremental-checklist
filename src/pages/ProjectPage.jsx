import { useParams } from "react-router-dom";
import { useProjects } from "../contexts/ProjectContext";
import { useEffect, useState, useRef} from "react";
import '../css/ProjectPage.css'
import Board from '../components/Board'

function ProjectPage() {
    const { id } = useParams();
    const { selectProjectID, loadBoards, addBoard, swapProjectIndex} = useProjects();

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
                let newGhostIndex = 1;
                for(var i = 1; i < boardStats.length; i++){
                    
                    if(i < boardStats.length - 1 && pos.x < boardStats[i].x){
                        newGhostIndex = i;
                        break;
                    }

                    // if(pos.x >= boardStats[i].x)

                    if(i === boardStats.length - 1 ){
                        newGhostIndex = i;
                    }
                }
                setGhostBoardIndex(newGhostIndex);
                
            }
        }

        document.addEventListener("mousemove", handleMouseMove)

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
        }
    }, [editingBoards])

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
        console.log(stats)
    }

    const handleStopEditing = () => {
        console.log("STOPPED EDITING")

        if(editIndex !== ghostBoardIndex) swapProjectIndex(editIndex, ghostBoardIndex)

        setEditingBoards(false)
        setEditIndex(-1)
    }

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (!project) {
        return <h1>Failed to get Project</h1>;
    }

    

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
                        {editingBoards && editIndex === board.index ? 
                            <></> :
                            <div key={board.id} ref={(el) => boardRefs.current[board.index] = el}>
                                    <Board key={board.id} 
                                    board={board} 
                                    onDragStart={handleStartEditing} 
                                    onDragEnd={handleStopEditing}
                                    />
                            </div>
                        }

                        {editingBoards && ghostBoardIndex === board.index ? <div className="board ghost">GHOST</div> : <></>}
                        </>
                        
                    )
                })}
                    
                        
                <button onClick={createNewBoard} className="btn-add-board">+ Add New</button>
            </div>
        </div>
        </>
    );
}

export default ProjectPage;