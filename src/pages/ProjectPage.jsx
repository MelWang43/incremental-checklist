import { useParams } from "react-router-dom";
import { useProjects } from "../contexts/ProjectContext";
import { useEffect, useState } from "react";
import '../css/ProjectPage.css'
import Board from '../components/Board'

function ProjectPage() {
    const { id } = useParams();
    const { selectProjectID, loadBoards, addBoard} = useProjects();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const [boards, setBoards] = useState([])

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

    async function createNewBoard(e){
        const newBoard = {name: 'New Board', index: !boards ? 0 : boards.length}
        console.log("New Board Info:", newBoard)
        await addBoard(id, newBoard)
        const board = await loadBoards(id)
        setBoards(board);
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
                {boards && boards.map((board) => <Board key={board.id} board={board}/>)}
                <button onClick={createNewBoard} className="btn-add-board">+ Add New</button>
            </div>
        </div>
        </>
    );
}

export default ProjectPage;