
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import React, { useEffect, useState }  from 'react';
import Alert from './alert';
import Footer from './footer';

function Dashboard({userNo, franchiseCount, setfranchiseClass, setdashboardClass, setuserClass, franchises, User}) {

   const [UnsoldCount,setUnsoldCount] = useState(undefined);
   const [Unsold,setUnsold] = useState(undefined);
   const [alert, setAlert]=useState(false)
   const [alertMessage,setAlertmessage]=useState({ message :"", type: ""})
   const axiosPrivate = useAxiosPrivate();

   useEffect(() => {
        if(Unsold==undefined)
        {
            try{
            axiosPrivate.get(`unsold/codes/${User.franchiseCode}`)
            .then(res => {
                setUnsoldCount(res.data.length)
                setUnsold(res.data)
            })
        } catch(error){ 
                console.error(error.data)
                setAlertmessage({ message: error.data? error.data:"Something wrong with server, unable to show unsold..", type: "danger"});
                setAlert(true)
            }
        }
   }, [Unsold])

  return (
      <>
        <div className="container p-5">
            <div className='row'>
                <h3>Welcome {User?.client_name}  {(UnsoldCount && User?.admin_access===1)?<button className="btn btn-outline-warning rounded-pill fs-6" data-bs-toggle="modal" data-bs-target="#unsold">{UnsoldCount} Unsold</button>:""}</h3>
                <hr/>
            </div>
            <div className="row align-items-center justify-content-center text-center">
                <button className="col-lg-3 mx-2 my-3 btn btn-outline-primary py-3" onClick={() => {setuserClass(true);  setdashboardClass(false)}}>
                        <div className='row align-items-start'>
                            <div className="col">
                                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                </svg>
                            </div>
                            <div className="col">
                                <h5>Users</h5>
                                <h3 className="card-title">{userNo}</h3>
                            </div>
                        </div>
                </button>
                {
                    User?.admin_access==1?
                    <>
                    <button className="col-lg-3 mx-2 my-3 btn btn-outline-primary py-3" onClick={() => {setfranchiseClass(true); setdashboardClass(false)}}>
                        <div className='row align-items-start'>
                            <div className="col">
                                <svg xmlns="http://www.w3.org/2000/svg"  width="70" height="70" fill="currentColor" viewBox="0 0 640 512">
                                    <path d="M0 383.9l64 .0404c17.75 0 32-14.29 32-32.03V128.3L0 128.3V383.9zM48 320.1c8.75 0 16 7.118 16 15.99c0 8.742-7.25 15.99-16 15.99S32 344.8 32 336.1C32 327.2 39.25 320.1 48 320.1zM348.8 64c-7.941 0-15.66 2.969-21.52 8.328L228.9 162.3C228.8 162.5 228.8 162.7 228.6 162.7C212 178.3 212.3 203.2 226.5 218.7c12.75 13.1 39.38 17.62 56.13 2.75C282.8 221.3 282.9 221.3 283 221.2l79.88-73.1c6.5-5.871 16.75-5.496 22.62 1c6 6.496 5.5 16.62-1 22.62l-26.12 23.87L504 313.7c2.875 2.496 5.5 4.996 7.875 7.742V127.1c-40.98-40.96-96.48-63.88-154.4-63.88L348.8 64zM334.6 217.4l-30 27.49c-29.75 27.11-75.25 24.49-101.8-4.371C176 211.2 178.1 165.7 207.3 138.9L289.1 64H282.5C224.7 64 169.1 87.08 128.2 127.9L128 351.8l18.25 .0369l90.5 81.82c27.5 22.37 67.75 18.12 90-9.246l18.12 15.24c15.88 12.1 39.38 10.5 52.38-5.371l31.38-38.6l5.374 4.498c13.75 11 33.88 9.002 45-4.748l9.538-11.78c11.12-13.75 9.036-33.78-4.694-44.93L334.6 217.4zM544 128.4v223.6c0 17.62 14.25 32.05 31.1 32.05L640 384V128.1L544 128.4zM592 352c-8.75 0-16-7.246-16-15.99c0-8.875 7.25-15.99 16-15.99S608 327.2 608 336.1C608 344.8 600.8 352 592 352z"/>
                                </svg>
                            </div> 
                            <div className="col">
                                <h5>Franchises</h5>
                                <h3 className="card-title">{franchiseCount}</h3>
                            </div>
                        </div>
                    </button>
                    </>
                    :
                    <button className="col-lg-3 mx-2 my-3 btn btn-outline-warning py-3"  data-bs-toggle="modal" data-bs-target="#unsold">
                        <div className='row align-items-start' >
                            <div className="col">
                                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" className="bi bi-collection" viewBox="0 0 16 16">
                            <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-11zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM0 13a1.5 1.5 0 0 0 1.5 1.5h13A1.5 1.5 0 0 0 16 13V6a1.5 1.5 0 0 0-1.5-1.5h-13A1.5 1.5 0 0 0 0 6v7zm1.5.5A.5.5 0 0 1 1 13V6a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-13z"/>
                                </svg>
                            </div>
                            <div className="col">
                                <h5>Unsold</h5>
                                <h3 className="card-title">{UnsoldCount}</h3>
                            </div>
                        </div>
                    </button>
                }

            </div>
        </div>
        {/* Unsold  */}
        <div className="modal fade" id="unsold" tabIndex="-1" aria-labelledby="unsoldModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="unsoldModalLabel">Unsold Codes</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    { Unsold? 
                        Unsold.length==0 ?
                        <h3>No Code To Sell</h3>
                        :
                        <ul className="list-group">
                            { Unsold.map((val, i) => <li className="list-group-item text-center" key={i}>{val.userCode}</li> )
                            }
                        </ul>
                    :
                        <div className="d-flex justify-content-center m-5 p-5">
                            <div className="spinner-border p-4" role="status">
                            <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
        <Alert message={alertMessage.message} type={alertMessage.type} alert={alert} setAlert={setAlert}/> 
        <Footer />
      </>
  );
}

export default Dashboard;
