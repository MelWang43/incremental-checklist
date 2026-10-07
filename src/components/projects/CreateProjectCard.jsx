import {useState} from 'react'
import '../../css/CreateProjectCard.css'
import { useProjects } from '../../contexts/ProjectContext';

function CreateProjectCard(){
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState("");
    const [nameValid, setNameValid] = useState(true)

    const {addProject, loadProjects} = useProjects();

    const handleCreatePress = (e) => {
        e.preventDefault();
        if(!adding) setAdding(true);
    }

    const handleNameChanged = (e) => {
        e.preventDefault();
        const raw = e.target.value;
        if(raw){ setNameValid(true)}
            
        setName(raw);
    }

    const handleConfirm = async (e) => {
        e.preventDefault();

        setNameValid(true);
        if(!name){
            setNameValid(false)
            return;
        }

        await addProject(name, "Test");
        setAdding(false);
        loadProjects()
        setName("")
        setNameValid(true)
    }
    const handleCloseForm = (e) => {
        setAdding(false);
    }
    

    return(
        <div>
            <button className="new-project-btn" onClick={handleCreatePress}>
                <h3>+</h3>
                <h3>Create New Project</h3>
                <h3>+</h3>
            </button>
            <div className="form-wrapper">
                <div className={`new-project-form ${adding ? 'active' : ''}`}>
                    <label for="project-name">Project Name: </label>
                    <input className={`${nameValid ? '' : 'invalid'}`} id="project-name" placeholder='Name' value={name} onChange={handleNameChanged}></input>

                    <div className="btn-row-container">
                        <button onClick={handleConfirm}>Create</button>
                        <button onClick={handleCloseForm}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateProjectCard