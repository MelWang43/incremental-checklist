import { useParams } from "react-router-dom";
import { useProjects } from "../contexts/ProjectContext";
import { useEffect, useState, useRef} from "react";
import '../css/ProjectPage.css'
import Board from '../components/Board'
import FollowMouse from "../components/ui/FollowMouse";
import { useCards } from "../contexts/CardContext";
import { useAuth } from "../contexts/AuthContext";
import { useConfirm } from "../contexts/ConfirmContext";

function ProjectPage() {
    const { id } = useParams();
    const { selectProjectID, updateProject, loadBoards, addBoard, updateBoard, deleteBoard} = useProjects();
    const { loadCards } = useCards();

    const {loading} = useAuth();
    const { confirm } = useConfirm();

    const [project, setProject] = useState(null);
    const [projectLoadError, setProjectLoadError] = useState(null)
    const [loadingProject, setLoadingProject] = useState(true);

    const [projectName, setProjectName] = useState('')
    const nameRef = useRef(null);

    const boardRefs = useRef([]);
    const [boards, setBoards] = useState([])
    const [newestBoardID, setNewestBoardID] = useState(-1) 
    const [editingBoards, setEditingBoards] = useState(false)

    const [mousePos, setMousePos] = useState({x: 0, y: 0})
    const [dragOffset, setDragOffset] = useState({x: 0, y: 0})
    const [draggingBoard, setDraggingBoard] = useState(null) // The current board that is being moved
    const [editIndex, setEditIndex] = useState(0) // The index of the board we're currently moving 
    const [ghostBoardIndex, setGhostBoardIndex] = useState(0)
    const [boardStats, setBoardStats] = useState({index: 0, x: 0})

    useEffect(() => {
        const loadProject = async () => {
            setLoadingProject(true);
            
            if(loading) return;
            const proj = await selectProjectID(id);
            console.log("Loaded project: ", proj)
            if(!proj){
                setProjectLoadError("Failed to Load")
                setLoadingProject(false)
                return
            };
            setProject(proj);
            setProjectName(proj.name)

            updateProject(proj.id, proj.name, proj.description, new Date())
            

            const board = await loadBoards(id)
            
            // Pre-load all cards into each board
            const result = await Promise.all(
                board.map(async (b) => ({
                    ...b,
                    cards: await loadCards(b.id)
                }))
            );
            setBoards(result);

            setLoadingProject(false);
        };
        setLoadingProject(true)
        loadProject();
        
    }, [loading]);

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
                // console.log("Ghost: " + newGhostIndex, "Editing: " + editIndex, "IsEditing?", editingBoards)
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

        setNewestBoardID(boards.length + 1)
        await addBoard(id, newBoard)
        const board = await loadBoards(id)
        setBoards(board);
    }
    const handleStartEditing = (board) => {
        setEditingBoards(true)
        
        setDraggingBoard(board)
        setGhostBoardIndex(board.index)
        setEditIndex(board.index)
        
        // Compile all x coords, paied with their index value
        const stats = boardRefs.current.map((el, index) => {
            const rect = el?.getBoundingClientRect()
            if(rect == null) console.log("NULL")
            const newX = (rect.width / 2) + rect.x
            return {index: index, x: newX, cornerX: rect.x}
        })
        
        console.log(mousePos.x - stats[board.index].cornerX)
        setDragOffset({x: -(mousePos.x - stats[board.index].cornerX), y: -20})
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

            updateAllBoardIndexes(next, boards)
            setBoards(next)                      
            updateBoardIndexesInstant();
        }

        setDraggingBoard(null)
        setEditingBoards(false)
        setEditIndex(-1)
    }

    function updateBoardIndexesInstant(){
        setBoards(prev => prev.map((board, index) => ({...board, index : index + 1})))
    }

    function updateBoardName(id, newName, doUpdate = false){
        console.log(newestBoardID)
        setNewestBoardID(-1)

        if(!doUpdate) return;
        setBoards(prev => prev.map((board) => (id === board.id ? {...board, name : newName} : board)))
    }
    async function updateAllBoardIndexes(boards, oldBoards){
        for(let i = 0; i < boards.length; i++){
            // if(boards[i].index === oldBoards[i].index) continue;
            await updateBoard(project.id, boards[i].id, boards[i].name, i + 1)
        }
    }

    async function handleDeleteBoard(board){
        const next = boards
        .filter(b => b.id !== board.id)
        .map((b, index) => ({
            ...b,
            index: index + 1
        }));

        
        await deleteBoard(board.project_id, board.id)
        console.log("Next:", next, "vs", boards);
        updateAllBoardIndexes(next, boards)
        setBoards(next);
    }

    useEffect(() => {
        boardRefs.current = []
        console.log("Boards updated: ", boards)
    }, [boards])

    function updateBoardCards(id, cards){
        setBoards(prev => prev.map((board) => (id === board.id ? {...board, cards : cards} : board)))
    }

    function handleNameChange(e) {
        const raw = e.target.value;
        if(!raw) return;
        setProjectName(raw);
    }

    const handleNameBlur = async (e) => {
        const raw = e.target.value

        nameRef.current?.blur()
        if(raw === project.name) return;
        const data = await updateProject(project.id, raw, project.description, project.accessed_at)
        setProject(data)
    }


    
    if (loadingProject) {
        return(
        <div>
            <div className="project-header" style={{height: '3.1rem'}}>
                Loading...
            </div>
            <div className="project-content">
                <div className="board-container">
                    <div className="board blank" style={{height: '9rem'}}></div>
                    <div className="board blank" style={{height: '6rem'}}></div>
                    <div className="board blank" style={{height: '3rem'}}></div>
                    <div className="board blank" style={{height: '9rem'}}></div>
                    <div className="board blank" style={{height: '6rem'}}></div>
                </div>
            </div>
        </div>);
    }

    if (projectLoadError) {
        return <h1>Failed to get Project :(</h1>;
    }

    
    // const ghostBoard = (<div className="board ghost"></div>)
    const ghostBoard = (<Board
                className={'ghost'}
                board={draggingBoard}
                initCards={draggingBoard?.cards}/>)
    const progress = 50
    return (
        <>
        

        <div className="project-header">
            <input className="project-editable-text" value={projectName} 
            onChange={handleNameChange} 
            onBlur={handleNameBlur}
            ref={nameRef}
            onKeyDown={(e) => {if(e.key === 'Enter') {handleNameBlur(e)}}}></input>

        </div>

        {editingBoards && draggingBoard !== null ? <FollowMouse initialPos={mousePos} offset={dragOffset}>
            <Board
                className={'dragging'}
                board={draggingBoard}
                initCards={draggingBoard.cards}/>
        </FollowMouse> : <></>}
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
                                    onDelete={handleDeleteBoard}
                                    onEditName={updateBoardName}
                                    isNew={newestBoardID === board.index}
                                    initCards={board.cards}
                                    onUpdateCards={updateBoardCards}
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