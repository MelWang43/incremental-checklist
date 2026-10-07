import { createContext, useContext, useEffect, useState } from 'react'
import {supabase} from '../supabaseClient.js'
import { useAuth } from './AuthContext.jsx';

const ProjectContext = createContext()

export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([])
    const { session, loading } = useAuth();

    useEffect(() => {
        if(loading) return;

        if(!session){
            setProjects([])
            return
        }

        loadProjects()
    }, [loading, session])


    async function loadProjects(){
        if(!session){
            console.error("Failed to load projects: User is not authenticated");
            return;
        }

        const response = await fetch("http://localhost:3000/api/projects", {
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        });

        if(!response.ok){
            console.error("Failed to load projects");
            return;
        }
        const data = await response.json();
        setProjects(data);
        console.log(data);
    }

    async function addProject(name, description = ""){
        if(!session){
            console.error("Failed to add project: User is not authenticated");
            return;
        }


        const response = await fetch("http://localhost:3000/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                name,
                description
            })
        });

        const data = await response.json();
        console.log('Created:',data);
    }

    return (
        <ProjectContext.Provider value={
            { 
                projects, 
                loadProjects,
                addProject
             }}>
            {children}
        </ProjectContext.Provider>
    )
}

export function useProjects() {
    return useContext(ProjectContext)
}