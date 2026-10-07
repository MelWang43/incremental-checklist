import CreateProjectCard from "../components/projects/CreateProjectCard"
import ProjectCard from "../components/projects/ProjectCard"
import '../css/ProjectDisplayPage.css'
import { useAuth } from "../contexts/AuthContext"
import { useProjects } from "../contexts/ProjectContext"
import { useEffect } from "react"

function ProjectDisplayPage(){
    const {user, loading} = useAuth()
    const { projects, loadProjects} = useProjects();
    
    useEffect(()=> {
        loadProjects();
    }, [])

    if (!user){
        return <p>Log in first</p>            
    }
    return(
        <div className="project-page">
            

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

export default ProjectDisplayPage