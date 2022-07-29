import { useRef, useState, useEffect }  from 'react';
import useAuth from '../hooks/useAuth';
import Footer from '../components/footer';
import MyHead from '../components/WebHead';
import axios from '../api/axios';
import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';

export default function SignIn(){
    const router = useRouter()
    const { setAuth } = useAuth();
    const userRef = useRef();
    const [email, setEmail] = useState("");
    const [password, setPassword]  =useState("");
    const [alert, setAlert] = useState({});
    const [alertStatus, setAlertStatus] = useState(false);
    const [revoked, setAccountRevoked] = useState(false)

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        if(alertStatus)
        {
            setAlertStatus(false)
        }
    }, [email, password])

    const SignIn = async (e) =>{
        e.preventDefault();
        try{
            const response = await axios.post('login', JSON.stringify({ 'email': email, 'password': password}),
            {
                headers: { 'Content-Type': 'application/json'},
                withCredentials: true 
            })
            const accessToken = response?.data?.accessToken;
            const user = jwtDecode(accessToken)
            const refreshToken = response?.data?.refreshToken
            setAlert({ message: "Successfully logging in ", type: "success"})
            setAlertStatus(true)
            setAuth({  user,  accessToken, refreshToken })
            localStorage.setItem('persist', JSON.stringify({  user,  accessToken, refreshToken }));
            router.push("/Main")
        }catch (err) {
            var message=""
            if (!err?.response) {
                message='No Server Response'
            } else if (err.response?.status === 401) {
                message='Incorrect Email or Password'
            } else if (err.response?.status === 403) {
                message='Authorisation revoked';
                setAccountRevoked(true)
            } else {
                message='Login Failed';
            }
            setAlert({ message: message,
                type: "danger",
                alert: true})
            setAlertStatus(true)
        }
    }


    return(
        <>
            <MyHead />
            <div className='container'>
                <div className='row mt-lg-3 p-lg-5'>
                    <h2 className='text-center'> Franchise Management System</h2>
                    <div className='col-lg align-self-center p-5'>
                        <img alt='Center Of Innovation' className='p-2 img-fluid' src="./images/Logo.png"/>
                    </div>
                    <div className='col-lg align-self-center m-lg-5 p-lg-5'>
                        <form className='form' method='post' onSubmit={SignIn}>
                        <h3>Signin</h3>
                            <div className="mb-1">
                                <label htmlFor="staticEmail" className="col-form-label">Email</label>
                                <div className="col">
                                    <input type="email" ref={userRef} placeholder='Enter your email' onChange={(e) =>{ setEmail(e.target.value)} } value={email} className="form-control form-control-lg" id="staticEmail" title='Follow pattern: username@domain.sub'  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required autoFocus/>
                                </div>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="inputPassword" className="col-form-label">Password</label>         
                                <input type="password" placeholder='Enter your password' onChange={(e) =>{ setPassword(e.target.value)} } value={password} className="form-control form-control-lg" id="inputPassword" required autoFocus/>
                            </div>
                            <div className={`alert alert-${alert.type} w3-animate-zoom`} role="alert">
                                {alert?.message? alert.message+"  ": ""}
                                {   
                                    alert?.type == "success"? 
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div> :
                                        revoked?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-x-fill" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"/>
                                        </svg>
                                        :
                                        alert?.message?
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-emoji-dizzy" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                                        </svg>
                                        : ""
                                }  
                            </div>
                            <button className='btn btn-primary px-5' type='submit'><b>Submit</b></button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}