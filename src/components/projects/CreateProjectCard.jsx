import {useState} from 'react'
import '../../css/CreateProjectCard.css'
import { useProjects } from '../../contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';

function CreateProjectCard(){
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState("");
    const [nameValid, setNameValid] = useState(true)

    const {addProject, loadProjects} = useProjects();

    const nav = useNavigate()

    const handleCreatePress = (e) => {
        e.preventDefault();
        setAdding(!adding)

        if(adding) handleCloseForm(e)
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

        const data = await addProject(name, "Test");
        setAdding(false);
        loadProjects()
        setName("")
        setNameValid(true)

        nav('/project/' + data[0].id)
    }
    const handleCloseForm = (e) => {
        setAdding(false);
        setName("")
        setNameValid(true)
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