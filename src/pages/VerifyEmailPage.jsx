import { ArrowLeft } from "lucide-react"
import { supabase } from "../supabaseClient.js";
import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

function VerifyEmailPage(){
    const {user, currentEmail, setCurrentEmail} = useAuth();

    
    const [resending, setResending] = useState(false);

    const verified = !!user?.email_confirmed_ai;

    useEffect(() => {
        console.log("Started Verification process for:",currentEmail)
        console.log("This email is verified:", verified)
    }, [])

    const handleResend = async (e) => {
        console.log(currentEmail)
        if(resending) return;
        setResending(true);
        const {error} = await supabase.auth.resend({
            type: 'signup',
            email: currentEmail,
        })

        if(error) {
            console.error(error.message)
        }

        setResending(false);
    }
    return(
        <div className="signin-page">
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%'}}>
                <button className="btn-transparent corner-arrow"><a href="/account/login"><ArrowLeft/></a></button>

                {!verified ? <>
                    <h2>Verify your email</h2>
                    <p>We sent a verification link to your email, click it to verify your email</p>
                    <button disabled={resending} onClick={handleResend}>Resend Email</button>
                </> : <>
                    <h2>Email verified</h2>
                    <p>You can close this tab</p>
                </>}

            </div>
        </div>
    )
}

export default VerifyEmailPage