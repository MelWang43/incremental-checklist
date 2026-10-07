import {useState} from 'react'
import { supabase } from "../supabaseClient.js";
import { useNavigate } from 'react-router-dom';

function SignInPage(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const nav = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if(error){
            console.error(error.message)
            return
        }

        nav('/');
        console.log("Logged in:", data.user)
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: password
        })

        if(error){
            console.error(error.message)
            return
        }


        nav('/');
        console.log("Signed up:", data.user)
    }
    return <div className="signin-page">
        <label for="email">Email</label>
        <input id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <label for="password">Password</label>
        <input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>

        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleSignUp}>Signup</button>
    </div>
}

export default SignInPage