import {useState} from 'react'
import { supabase } from "../supabaseClient.js";
import { useNavigate } from 'react-router-dom';
import '../css/SignInPage.css'

function SignInPage({mode = 'login'}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [signUpMode, setSignUpMode] = useState(mode === 'signup')

    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);

    const [errorMessage, setErrorMessage] = useState('');

    const nav = useNavigate();

    function validateInput(){
        if(!email){
            setErrorMessage("Please enter your email")
            setValidEmail(false)
            return false;
        }
        if(!password){
            setErrorMessage("Please enter your password")
            setValidPassword(false)
            return false;
        }

        setValidEmail(true)
        setValidPassword(true);
        setErrorMessage('');

        return true;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        
        if(!validateInput()) return;
        if(signUpMode){
            handleSignUp(e);
            return;
        }
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if(error){
            console.error(error.message)

            setErrorMessage(error.message)
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
            setErrorMessage(error.message)
            return
        }


        nav('/');
        console.log("Signed up:", data.user)
    }
    return <div className="signin-page">
        <h1>{signUpMode ? 'Create an account' : 'Welcome back'}</h1>
        <label htmlFor="email">Email</label>
        <input id="email" placeholder="Email" value={email} className={`email ${!validEmail ? 'invalid' : ''}`}
            onChange={(e) => {
                const raw = e.target.value;
                if(raw){
                    setValidEmail(true)
                    setErrorMessage("")
                }
                setEmail(e.target.value)

                }}></input>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" placeholder="Password" value={password} className={`${!validPassword ? 'invalid' : ''}`}
            onChange={(e) => {

                const raw = e.target.value;
                if(raw){
                    setValidPassword(true)
                    setErrorMessage("")
                }

                setPassword(e.target.value)
                }}></input>

        <button className="btn-login" onClick={handleSubmit}>{!signUpMode ? 'Continue' : 'Sign Up'}</button>

        {errorMessage && <p style={{color: 'var(--delete)'}}>{errorMessage}</p>}

        {signUpMode ? 
        <div>Existing user? <a href="login">Log in</a></div> 
        : 
        <div>Don't have an account? <a href="signup">Sign up</a></div>}
        
    </div>
}

export default SignInPage