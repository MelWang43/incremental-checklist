import {useState} from 'react'
import '../../css/CreateProjectCard.css'

function CreateProjectCard(){
    const [adding, setAdding] = useState(false);
    const [name, setName] = useState("");

    const handleCreatePress = (e) => {
        e.preventDefault();
        if(!adding) setAdding(true);
    }

    const handleNameChanged = (e) => {
        e.preventDefault();
        const raw = e.target.currentValue;
        setName(raw);
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
                    <input id="project-name" placeholder='Name' value={name} onChange={handleNameChanged}></input>

                    <div className="btn-row-container">
                        <button>Create</button>
                        <button onClick={handleCloseForm}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateProjectCard