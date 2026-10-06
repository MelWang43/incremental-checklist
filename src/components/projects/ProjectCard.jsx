import '../../css/ProjectCard.css'

function ProjectCard({project}){

    return <div className="mini-project">

        <button className="mini-project-btn">
        <h3>{project.name}</h3>

        </button>

    </div>
}

export default ProjectCard