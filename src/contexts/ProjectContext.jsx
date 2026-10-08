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

    // =============== PROJECT FUNCTIONS ===============
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
        console.log("Retrieved", data);
    }

    async function selectProjectID(id){
        const response = await fetch("http://localhost:3000/api/projects/" + id, {
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        });

        if(!response.ok){
            console.error("Failed to get project " + id);
            return;
        }
        const data = await response.json();
        return data
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

        if(!response.ok){
            console.error("Failed to add project");
            return;
        }

        const data = await response.json();
        console.log('Created:',data);

        return data
    }

    // =============== BOARD FUNCTIONS ===============

    async function loadBoards(projectID){
        if(!session){
            console.error("Failed to load projects: User is not authenticated");
            return;
        }

        const response = await fetch(`http://localhost:3000/api/projects/${projectID}/boards`, {
            headers: {
                Authorization: `Bearer ${session.access_token}`
            }
        });

        const {data, error} = await response.json();
        if(!response.ok){
            console.error("Failed to load board for Project: " + projectID + ":", error);
            return;
        }
        console.log("Retrieved", data);
        return data
    }

    async function addBoard(projectID, board){
        const response = await fetch(`http://localhost:3000/api/projects/${projectID}/boards`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({
                name: board.name,
                index: board.index
            })
        });

        const {data, error} = await response.json();
        if(!response.ok){
            console.error("Failed to add board: ", error);
            return;
        }

        console.log('Created Board:',data);

        return data
    }

    return (
        <ProjectContext.Provider value={
            { 
                projects, 
                loadProjects,
                addProject,
                selectProjectID,

                loadBoards,
                addBoard
             }}>
            {children}
        </ProjectContext.Provider>
    )
}

export function useProjects() {
    return useContext(ProjectContext)
}