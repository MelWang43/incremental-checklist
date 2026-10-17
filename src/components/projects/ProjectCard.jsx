import { useNavigate } from 'react-router-dom'
import '../../css/ProjectCard.css'
import { useConfirm } from '../../contexts/ConfirmContext';
import { useProjects } from '../../contexts/ProjectContext';
import { EllipsisVertical, Trash } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';


import { useState } from 'react'

function ProjectCard({project}){
    const { confirm} = useConfirm();
    const {loadProjects, deleteProject} = useProjects();

    const [deleted, setDeleted] = useState(false);
    const navigate = useNavigate();

    const handleClick = (e) => {
        e.preventDefault();
        if(e.target.closest(".options-btn")){
            return;
        }

        if(deleted) return;

        navigate("/project/" + project.id)
    }

    const handleDelete = async () => {

        if(deleted) return
        
        const confirmed = await confirm({
            title: `Delete Project: ${project.name}`,
            message: "Are you sure you want to delete this project? This cannot be undone."
        })

        if(!confirmed) return;

        setDeleted(true)

        await deleteProject(project.id)
        loadProjects();
    }

    function formatDate(d){
        const date = new Date(d);
        const now = new Date().getSeconds();

        const diff = now - date.getSeconds();

        return date.toLocaleDateString();
    }

    return <div className="mini-project" onClick={handleClick}>
                <div className="mini-project-overlay"></div>
                <div className="mini-project-img"></div>
                <div className="mini-project-desc">{project.name}

                    <div style={{display: 'flex', padding: '0.1rem 0.4rem', width: '95%'}}>
                        <span style={{fontSize: '0.76rem', fontWeight: 'normal', opacity: 0.7}}>Last Accessed: {formatDate(project.accessed_at)}</span>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger className="btn-transparent options-btn">
                                <EllipsisVertical size={18}/>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Portal>
                                <DropdownMenu.Content className="options-content" 
                                sideOffset={5} 
                                align='end'
                                onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu.Item className="options-item" style={{color: 'var(--delete)'}} onSelect={handleDelete}>
                                        <Trash size={18}/> Delete
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                    </div>
                </div>
    </div>
}

export default ProjectCard