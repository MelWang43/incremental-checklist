import {useState} from 'react'
import { supabase } from "../supabaseClient.js";
import { useNavigate, useParams, useRevalidator } from 'react-router-dom';
import '../css/SignInPage.css'
import { ArrowLeft } from 'lucide-react';

function SignInPage(){

    const {loginMode} = useParams()
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [signUpMode, setSignUpMode] = useState(loginMode === 'signup')

    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);

    const [errorMessage, setErrorMessage] = useState('');

    const [showVerifyCode, setShowVerifyCode] = useState(loginMode === 'verify');
    const [resending, setResending] = useState(false);

    const [sending, setSending] = useState(false)

    const nav = useNavigate();

    
    function validateInput(){
        if(!email){
            setErrorMessage("Enter your email")
            setValidEmail(false)
            return false;
        }
        // if(!password){
        //     setErrorMessage("Enter your password")
        //     setValidPassword(false)
        //     return false;
        // }

        setValidEmail(true)
        setValidPassword(true);
        setErrorMessage('');

        return true;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();

        
        if(!validateInput()) return;
        // if(signUpMode){
        //     handleSignUp(e);
        //     return;
        // }

        await sendCode(email);
        // window.location.href = "/account/verify"
        

        return;
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

    async function sendCode(email){

        if(sending) return;

        setSending(true)

        console.log("Sending verification code")
        const {error} = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
                emailRedirectTo: `${window.location.origin}`
            },
            type: 'email',
            
        })
        
        if(error){
            console.error(error.message)
            setErrorMessage(error.message)
            return
        }

        console.log("Sent verification code")

        nav('/account/verify', {
            state: {email},
        })
        
        setSending(false)
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

    const handleSignInWithGoogle = async (e) => {
        const {error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });

        if(error) {
            console.error(error.message);
            setErrorMessage(error.message)
        }
    }

    const handleResend = async (e) => {
        console.log(email)
        if(resending) return;
        setResending(true);
        const {error} = await supabase.auth.resend({
            type: 'signup',
            email: email,
        })

        if(error) {
            console.error(error.message)
        }

        setResending(false);
    }
    return (
        <div className="signin-page">
            
            {!showVerifyCode ? 
            
            <>
            <button className="btn-transparent corner-arrow"><a href="/"><ArrowLeft/></a></button>
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
            {/* <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Password" value={password} className={`${!validPassword ? 'invalid' : ''}`}
                onChange={(e) => {

                    const raw = e.target.value;
                    if(raw){
                        setValidPassword(true)
                        setErrorMessage("")
                    }

                    setPassword(e.target.value)
                    }}></input> */}

            <button className="btn-login" onClick={handleSubmit}>{!signUpMode ? 'Continue' : 'Sign Up'}</button>

            {errorMessage && <p style={{color: 'var(--delete)'}}>{errorMessage}</p>}
            
            <div className="seperator"><span>Or continue with:</span></div>

            <button className="btn-social" onClick={handleSignInWithGoogle}><img src="/google.svg" alt="Google" width={24}/> Google</button>

            <div className="seperator"></div>
            {signUpMode ? 
            <div>Existing user? <a href="login">Log in</a></div> 
            : 
            <div>Don't have an account? <a href="signup">Sign up</a></div>}

            </> 
            :
            (<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
                <button className="btn-transparent corner-arrow"><a href="/account/login"><ArrowLeft/></a></button>
                <h2>Verify your email</h2>
                <p>We sent a verification link to your email, click it to verify your email</p>
                
                <button onClick={handleResend}>Resend Email</button>
            </div>)
            }
        </div>
    )
}

export default SignInPage