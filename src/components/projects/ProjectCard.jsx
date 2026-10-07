import { useNavigate } from 'react-router-dom'
import '../../css/ProjectCard.css'

function ProjectCard({project}){

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/project/" + project.id)
    }
    return <div className="mini-project">

            <button onClick={handleClick} className="mini-project-btn">
                <h3>{project.name}</h3>

            </button>

    </div>
}

export default ProjectCard