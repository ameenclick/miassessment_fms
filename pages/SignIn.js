import { useState }  from 'react';
import dynamic from 'next/dynamic';
const Footer = dynamic(() => import('../components/footer'));
const MyHead = dynamic(() => import('../components/WebHead'));

export default function SignIn(){
    const [email, setEmail] = useState("");
    const [password, setPassword]  =useState("");

    return(
        <>
            <MyHead />
            <div className='container'>
                <div className='row mt-lg-3 p-lg-5'>
                    <h3 className='text-center'> Franchise Management System</h3>
                    <div className='col-lg align-self-center p-5'>
                        <img alt='Center Of Innovation' className='p-2 img-fluid' src="./images/Logo.png"/>
                    </div>
                    <div className='col-lg align-self-center m-lg-5 p-lg-5'>
                        <form className='form' method='post'>
                        <h5>Signin</h5>
                            <div className="mb-1">
                                <label for="staticEmail" className="col-form-label">Email</label>
                                <div className="col">
                                    <input type="email" placeholder='Enter your email..' onInput={(e) =>{ setEmail(e.target.value)} } value={email} className="form-control form-control-lg" id="staticEmail" required autoFocus/>
                                </div>
                            </div>
                            <div className="mb-5">
                                <label htmlFor="inputPassword" className="col-form-label">Password</label>         
                                <input type="password" placeholder='Enter your password' onInput={(e) =>{ setPassword(e.target.value)} } value={password} className="form-control form-control-lg" id="inputPassword" required autoFocus/>
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