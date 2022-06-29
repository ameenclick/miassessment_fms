import React, { useEffect, useState }  from 'react';
import Dashboard from './dashboard';
import Franchises from './franchises';
import ChangePassword from './password';
import User from './user';

function Nav(){
    const [dashboardClass, setdashboardClass] = useState(true)
    const [passwordClass, setpasswordClass] = useState(false)
    const [franchiseClass, setfranchiseClass] = useState(false)
    const [userClass, setuserClass] = useState(false)
    const [users, setUsers]=useState(undefined)
    const [franchises, setFranchises]=useState(undefined)
    const [user, setUser]=useState({})

    useEffect((e) => {
        fetch("https://raw.githubusercontent.com/ameenmsit/testJson/main/users.json")
        .then((response)=> response.json())
        .then((jsonResponse) => {
            setUsers(jsonResponse.users)
        })
        fetch("https://raw.githubusercontent.com/ameenmsit/testJson/main/franchise.json", { method: "GET", headers: {
            'Content-Type': 'application/json',
            'token': "029f46cd2eee78a34d42eee79d44723dbcfb4d2f27956fc97d1920db7ac3644b39345f5c92007eeeabf0ecbeab506b36e9e2b4671dfefd8b874827479a9781e5",
            'authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUEFVTFNJUiIsImlhdCI6MTY0OTY0NjgyNX0.BEx1Xz-yEl-0jWzQY0ROvCTL07C7XqHLitJPpupsup0"
        }})
        .then((response)=> response.json())
        .then((franchiseList) => {
            setFranchises(franchiseList)
        })
        // var headers= {
        //     'Content-Type': 'application.json', 
        //     token: "029f46cd2eee78a34d42eee79d44723dbcfb4d2f27956fc97d1920db7ac3644b39345f5c92007eeeabf0ecbeab506b36e9e2b4671dfefd8b874827479a9781e5",
        //     authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUEFVTFNJUiIsImlhdCI6MTY0OTY0NjgyNX0.BEx1Xz-yEl-0jWzQY0ROvCTL07C7XqHLitJPpupsup0"
        // }
        // fetch("http://ec2-3-111-37-72.ap-south-1.compute.amazonaws.com/api/franchise/details", {headers})
        // .then(res => res.json())
        // .then(data => setFranchises(data))
    }, [])

    useEffect(() => {
        console.log(users)
        console.log(franchises)
    },[users,franchises])

    return (
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                {/* <a className="navbar-brand" href="#"> */}
                <img src="./images/Logo.png" className="App-logo" alt="logo" width="120" height="75"/>
                {/* </a> */}
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
                        <li className="nav-item">
                            <a href="/" className={franchiseClass? "nav-link active":"nav-link"} aria-current="page"  onClick={(e) =>{e.preventDefault(); setdashboardClass(false); setpasswordClass(false); setuserClass(false); setfranchiseClass(true) }}>Franchises</a>
                        </li>
                        <li className="nav-item">
                            <a href="/" className={passwordClass? "nav-link active":"nav-link"} aria-current="page" onClick={(e) =>{e.preventDefault();setdashboardClass(false); setpasswordClass(true); setuserClass(false); setfranchiseClass(false) }}>Change Password</a>
                        </li>
                        <li className="nav-item">
                            <a href="/SignIn" className="nav-link" aria-current="page"  onClick={(e) =>{setdashboardClass(false); setpasswordClass(false); setuserClass(false); setfranchiseClass(false) }}>Signout</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        {(users && franchises)? 
            dashboardClass ? <Dashboard userNo={users.length} franchiseCount={franchises.length} setfranchiseClass={setfranchiseClass} setdashboardClass={setdashboardClass} setuserClass={setuserClass} />: 
            passwordClass? <ChangePassword />:
                userClass? <User users={users}/>: 
                    franchiseClass? <Franchises franchises={franchises}/> : "Page Under Construction"
            :
            <div className="d-flex justify-content-center m-5 p-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          }
        </>
    )
}

export default Nav;