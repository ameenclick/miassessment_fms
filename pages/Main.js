import useAxiosPrivate from '../hooks/useAxiosPrivate';
import React, { useEffect, useState }  from 'react';
import Alert from '../components/alert';
import Dashboard from '../components/dashboard';
import Franchises from '../components/franchises';
import ChangePassword from '../components/password';
import User from '../components/user';
import useAuth from '../hooks/useAuth';
import { useRouter } from 'next/router';
import MyHead from '../components/WebHead';

function Main(){
    const router = useRouter();
    const { setAuth, auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [dashboardClass, setdashboardClass] = useState(true)
    const [passwordClass, setpasswordClass] = useState(false)
    const [franchiseClass, setfranchiseClass] = useState(false)
    const user=auth?.user
    const [userClass, setuserClass] = useState(false)
    const [users, setUsers]=useState(undefined)
    const [franchises, setFranchises]=useState(undefined)
    const [alert, setAlert]=useState(false)
    const [alertMessage,setAlertmessage]=useState({ message :"", type: ""})
    const getUsers = async () => {
        try {
            let url=""
            if(user.admin_access == 1) url=`users/details`
            else url=`users/details/${user.franchiseCode}`
            const users = await axiosPrivate.get(url,{       
                        signal: controller.signal
                    })
            isMounted && setUsers(users?.data? users.data:[])
            } catch (err) {
                console.error(err)
            }
    }
    const getFranchises = async () => {
        try {
            const franchises = await axiosPrivate.get(`franchise/details`, {
            signal: controller.signal
            })
            isMounted && setFranchises(franchises?.data? franchises.data:[])
        }
        catch (err){
            console.error(err)
        }
    }

    useEffect(() => {
        if(auth && !auth.user){
            setAuth({});
            router.push("/SignIn");
        }
        let isMounted = true;
        const controller = new AbortController();  
        if(user) getUsers();
        if(user?.admin_access == 1) getFranchises();
        return () => {
            isMounted = false;
            controller.abort();
        }  
    }, [])

    const refreshData = () => {
        if(user) getUsers();
        if(user?.admin_access == 1) getFranchises();
    }
    
    const Signout = async (e) =>{
        try{
            const response = await axiosPrivate.delete('logout', {data: { token: auth.refreshToken}})
            if(response.status==204){
                setUsers(response.data)
                setAuth({})
           }
        }catch (error) {
            console.error('Error:', error);
            setAlertmessage({ message: "Something went wrong, try again later", type: "danger"});
            setAlert(true)
        }
    }

    return (
        <>
        <MyHead />
        {((users!=undefined && franchises!=undefined) || (auth?.user?.admin_access))? 
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <img src="./images/Logo.png" className="App-logo" alt="logo" width="100" height="75"/>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav nav justify-content-end">
                            <li className="nav-item">
                                <a href="/" className={dashboardClass? "nav-link active":"nav-link"} aria-current="page" onClick={(e) =>{e.preventDefault();setdashboardClass(true); setpasswordClass(false); setuserClass(false); setfranchiseClass(false) }}>Dashboard</a>
                            </li>
                            <li className="nav-item">
                                <a href="/" className={userClass? "nav-link active":"nav-link"} aria-current="page" onClick={(e) =>{e.preventDefault(); setdashboardClass(false); setpasswordClass(false); setuserClass(true); setfranchiseClass(false) }}>Users</a>
                            </li>
                            { auth?.user?.admin_access ?
                            <li className="nav-item">
                                <a href="/" className={franchiseClass? "nav-link active":"nav-link"} aria-current="page"  onClick={(e) =>{e.preventDefault(); setdashboardClass(false); setpasswordClass(false); setuserClass(false); setfranchiseClass(true) }}>Franchises</a>
                            </li>
                            :""}
                            <li className="nav-item">
                                <a href="/" className={passwordClass? "nav-link active":"nav-link"} aria-current="page" onClick={(e) =>{e.preventDefault();setdashboardClass(false); setpasswordClass(true); setuserClass(false); setfranchiseClass(false) }}>Change Password</a>
                            </li>
                            <li className="nav-item">
                                <a href="/" className="nav-link" aria-current="page"  onClick={() =>{ Signout(); }}>Signout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {dashboardClass ? <Dashboard userNo={users?users.length:0} franchiseCount={franchises?franchises.length:0} setfranchiseClass={setfranchiseClass} setdashboardClass={setdashboardClass} setuserClass={setuserClass}  franchises={franchises} User={user} />: 
            passwordClass? <ChangePassword />:
                userClass? <User users={users} franchises={franchises} User={user}/>: 
                    franchiseClass? <Franchises franchises={franchises} User={user}/> : "Ops You lost somewhere...."
            }
            </div>
            :
            <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container">
                        <img src="./images/Logo.png" className="App-logo" alt="logo" width="100" height="75"/>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav nav justify-content-end">
                                <li className="nav-item">
                                    <a href="/" className={dashboardClass? "nav-link active":"nav-link"} aria-current="page" onClick={(e) =>{e.preventDefault();setdashboardClass(true); setpasswordClass(false); setuserClass(false); setfranchiseClass(false) }}>Dashboard</a>
                                </li>
                                <li className="nav-item">
                                    <a href="/" className={userClass? "nav-link active":"nav-link"} aria-current="page" onClick={(e) =>{e.preventDefault(); setdashboardClass(false); setpasswordClass(false); setuserClass(true); setfranchiseClass(false) }}>Users</a>
                                </li>
                                { auth?.user?.admin_access ?
                                <li className="nav-item">
                                    <a href="/" className={franchiseClass? "nav-link active":"nav-link"} aria-current="page"  onClick={(e) =>{e.preventDefault(); setdashboardClass(false); setpasswordClass(false); setuserClass(false); setfranchiseClass(true) }}>Franchises</a>
                                </li>
                                :""}
                                <li className="nav-item">
                                    <a href="/" className={passwordClass? "nav-link active":"nav-link"} aria-current="page" onClick={(e) =>{e.preventDefault();setdashboardClass(false); setpasswordClass(true); setuserClass(false); setfranchiseClass(false) }}>Change Password</a>
                                </li>
                                <li className="nav-item">
                                    <a href="/" className="nav-link" aria-current="page"  onClick={() =>{ Signout(); }}>Signout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            {(auth?.user?.admin_access == 0)?
            dashboardClass ? <Dashboard userNo={users?users.length:0} franchiseCount={undefined} setfranchiseClass={undefined} setdashboardClass={setdashboardClass} setuserClass={setuserClass}  User={user} />: 
            passwordClass? <ChangePassword />:
            userClass? <User users={users?users:[]} User={user}/>: ""
            : 
            <div className="d-flex justify-content-center m-5 p-5">
                <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            }
            </>
          }
          <Alert message={alertMessage.message} type={alertMessage.type} alert={alert} setAlert={setAlert} />
        </>
    )
}

export default Main;