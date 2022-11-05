import useAxiosPrivate from '../hooks/useAxiosPrivate';
import React, { useEffect, useState, useCallback }  from 'react';
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

    useEffect(() => {
        if(auth && !auth.user){
            setAuth({});
            router.push("/SignIn");
        }
        let isMounted = true;
        const controller = new AbortController(); 
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
        if(user) getUsers();
        if(user?.admin_access == 1) getFranchises();
        return () => {
            isMounted = false;
            controller.abort();
        }  
    }, [])


    //Limit the rate of execution of the funtion
    const debounce = (func) => {
        let timer;
        return function (...args) {
          const context = this;
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            timer = null;
            func.apply(context, args);
          }, 1000);
        };
    };

    const refreshData = async () => {
        if(user) 
        {
            try {
                let url=""
                if(user.admin_access == 1) url=`users/details`
                else url=`users/details/${user.franchiseCode}`
                const users = await axiosPrivate.get(url)
                setUsers(users?.data? users.data:[])
                } catch (err) {
                    console.error(err)
                }
        }
        if(user?.admin_access == 1){
            try {
                const franchises = await axiosPrivate.get(`franchise/details`)
                setFranchises(franchises?.data? franchises.data:[])
            }
            catch (err){
                console.error(err)
            }
        }
    }

    //Avoid senting request again when double click
    const optimizedRefresh = useCallback(debounce(refreshData), []);
    
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
            <div className='mt-5 me-5'>
                <button className=' float-end btn btn-outline-dark' onClick={optimizedRefresh}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                    </svg>
                </button>
            </div>
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