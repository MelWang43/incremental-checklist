import CreateProjectCard from "../components/projects/CreateProjectCard"
import ProjectCard from "../components/projects/ProjectCard"
import '../css/ProjectDisplayPage.css'
import { useAuth } from "../contexts/AuthContext"
import { useProjects } from "../contexts/ProjectContext"
import { useEffect, useState } from "react"

function ProjectDisplayPage(){
    const {user, loading} = useAuth()
    const { projects, loadProjects} = useProjects();

    const [loadingProject, setLoadingProject] = useState(true)
    
    useEffect(()=> {
        const load = async () => {
            await loadProjects();
            setLoadingProject(false)
        }
        setLoadingProject(true)
        

        if(!user) return;

        console.log("Load Projects")
        load()
    }, [user])

    if (!user){
        return (
            <div className="home-no-account">
                <h2>Log in first</h2>   
                <p>You need an account to use this app</p>   
                

                <div className="seperator" style={{width: '26%'}}></div>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', margin: '1rem'}}>
                    <a href="/account/login">
                        <button>Log in</button>
                    </a>
                    <p>or</p>

                    <a href="/account/signup">
                        <button>Sign up</button>
                    </a>
                </div>
            </div>
        )         
    }

    if(loadingProject){
        
        return (<div className="project-page">
            <div className="recent-projects" style={{alignItems: 'center'}}>
                <h2>Loading...</h2>
                <div className="project-grid">
                    <div className="mini-project loading"></div>
                    <div className="mini-project loading"></div>
                    <div className="mini-project loading"></div>
                    <div className="mini-project loading"></div>
                    <div className="mini-project loading"></div>
                    <div className="mini-project loading"></div>
                    <div className="mini-project loading"></div>
                </div>
            </div>
        </div>)
    }

    return(
        <div className="project-page">
            

            <div className="recent-projects">

                <CreateProjectCard/>
                <h3>Recent</h3>
                <div className="project-grid">
                    {projects.length > 0 ? projects.map((project) => <ProjectCard project={project} key={project.id}/>) : <h3>No Projects yet</h3>}
                </div>
            </div>
        </div>
    )
}

export default ProjectDisplayPage