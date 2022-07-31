import useAxiosPrivate from '../hooks/useAxiosPrivate';
import React, { useState }  from 'react';
import Alert from './alert';

export default function ChangePassword(){
    const axiosPrivate = useAxiosPrivate();

    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [valid, setValid]=useState(false)
    const [alert, setAlert] = useState({message: "", type: ""})
    const [alertStatus, setAlertStatus]=useState(false)
    const [newPass, setNewpass]=useState("")
    const [confirmPass, setConfirmpass]=useState("")
    const identityValidation = (e) => {
        e.preventDefault()
        axiosPrivate.post(`validate/password`, 
                { email: email,password: password})
            .then(response => {
                if(response.data == "Valid"){  
                    setAlert({ message: "Valid Credential", type: "success"})
                    setValid(true)
                }
                else if(response.data == "Invalid"){
                    setAlert({ message: "Email or password incorrect..", type: "danger"})
                    setAlertStatus(true)
                }
            })
            .catch(err => {
                console.log(err)
                setAlert({ message: "Something went wrong..", type: "danger"});
                setAlertStatus(true)
            })
    }

    const ChangePassword = async (e) => {
        e.preventDefault()
        if(password===newPass)
        {
            setAlert({ message: "Password cannot be same as previous..", type: "danger"})
            setAlertStatus(true)
        }
        else if(newPass===confirmPass)
        {
            try{
            const response = await axiosPrivate.post(`change/password`, 
            { email: email,password: newPass})
            if(response.data == "Success"){
                    setValid(false)
                    setAlert({ message: "Password changed successfully..", type: "success"})
                    setAlertStatus(true)
            }
            else if(response.data == "Invalid"){
                    setAlert({ message: "Email or password incorrect..", type: "danger"})
                    setAlertStatus(true)
            }
            }
            catch(err){
                console.log(err)
                setAlert({ message: "Something went wrong...", type: "danger"});
                setAlertStatus(true)
            }
        }
        else
        {
            setAlert({ message: "Password not maching...", type: "danger"});
            setAlertStatus(true)
        }
    }

    return(
        <>
            <div className='container m-lg-5 p-5'>
                <Alert message={alert.message} type={alert.type} alert={alertStatus} setAlert={setAlertStatus}/>
                <div className='row justify-content-center'>
                    <div className='col-lg-8'>
                        <div className="card border-primary">
                        <div className="card-body p-5">
                            <h4 className="card-title my-4">{valid? "New Password":"Change Password"}</h4>
                            {valid?
                                <form onSubmit={ChangePassword}>
                                    <input type="password" className='form-control form-control-lg mb-3' name="new" placeholder='New Password' title='Minimin 6, Atleast 1 number, 1 Capital letter' pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{6,}$" onInput={(e) => {e.preventDefault(); setNewpass(e.target.value)}} value={newPass} required/>
                                    <input type="password" className='form-control form-control-lg mb-5' name="confirm" placeholder='Confirm Password' onInput={(e) => {e.preventDefault(); setConfirmpass(e.target.value)}} value={confirmPass} required/>
                                    <button className='btn btn-primary px-5' type='submit'>Submit</button>
                                </form>
                                :
                                <form onSubmit={identityValidation}>
                                    <input type="email" className='form-control form-control-lg mb-3' name="email" placeholder='Enter your email...' pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title='username@domain.sub' onInput={(e) => {e.preventDefault(); setEmail(e.target.value)}} value={email} required/>
                                    <input type="password" className='form-control form-control-lg mb-5' name="pasword" placeholder='Enter password...' onInput={(e) => {e.preventDefault(); setPassword(e.target.value)}} value={password} required/>
                                    <button className='btn btn-primary px-5' type='submit'>Submit</button>
                                </form>
                            }  
                        </div>
                        </div>
                    </div>    
                </div>
            </div>
        </>
    )
}