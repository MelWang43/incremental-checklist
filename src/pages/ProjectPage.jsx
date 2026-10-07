import { useParams } from "react-router-dom";
import { useProjects } from "../contexts/ProjectContext";
import { useEffect, useState } from "react";
import '../css/ProjectPage.css'
import Board from '../components/Board'

function ProjectPage() {
    const { id } = useParams();
    const { selectProjectID } = useProjects();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const [boards, setBoards] = useState([
        {id: 0, name: "Board"},
        {id: 2, name: "Board"},
        {id: 3, name: "Board"},
        {id: 4, name: "Board"},

    ])

    useEffect(() => {
        const loadProject = async () => {
            setLoading(true);

            const proj = await selectProjectID(id);

            console.log("ID:", id);
            console.log("Project returned:", proj);

            setProject(proj);
            setLoading(false);
        };
        setLoading(true)
        loadProject();
    }, []);

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
                {boards.map((board) => <Board key={board.id} board={board}/>)}
                <button className="btn-add-board">+ Add New</button>
            </div>
        </div>
        </>
    );
}

export default ProjectPage;