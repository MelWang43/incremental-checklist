import CreateProjectCard from "../components/projects/CreateProjectCard"
import ProjectCard from "../components/projects/ProjectCard"
import '../css/ProjectPage.css'
import { useAuth } from "../contexts/AuthContext"

function ProjectPage(){
    const {user, loading} = useAuth()
    const projects = [
        {id: 1, name: "Test"},
        {id: 2, name: "Test2"},
        {id: 3, name: "Test3"},
        {id: 4, name: "Test4"},
        {id: 5, name: "Test5"},
        {id: 6, name: "Test6"},

    ]

    if (!user){
        return <p>Log in first</p>            
    }
    return(
        <div className="project-page">
            

            <div className="project-header">

            </div>

            <div className="recent-projects">

                <CreateProjectCard/>
                <h3>Recent</h3>
                <div className="project-grid">
                    {projects.map((project) => <ProjectCard project={project} key={project.id}/>)}
                </div>
            </div>
        </div>
    )
}

export default ProjectPage