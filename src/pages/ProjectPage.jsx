import { useParams } from "react-router-dom";
import { useProjects } from "../contexts/ProjectContext";
import { useEffect, useState } from "react";
import '../css/ProjectPage.css'

function ProjectPage() {
    const { id } = useParams();
    const { selectProjectID } = useProjects();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

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
        <div className="project-header">
            <h3>{project.name}</h3>
        </div>
    );
}

export default ProjectPage;