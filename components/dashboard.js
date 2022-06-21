
import React, { useState }  from 'react';
import Footer from './footer';
import NewUserModal from './NewUserModal';

function Dashboard({userNo, franchiseCount, setfranchiseClass, setdashboardClass, setuserClass}) {

   //const [userNo, setUserno] = useState(userno);
   const Franchises = [1,2,3,4];
   const [choosenFranchise, setChoosenfranchise] = useState(null);


  return (
      <>
        <div className="container p-5">
            <div className='row'>
                <h3>Welcome Paul Malieckal</h3>
                <hr/>
            </div>
            <div className="row align-items-center justify-content-center text-center">
                <button className="col-lg-3 mx-2 my-3 btn btn-outline-primary py-3" onClick={() => {setuserClass(true);  setdashboardClass(false)}}>
                        <div className='row align-items-start'>
                            <div class="col">
                                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                </svg>
                            </div>
                            <div class="col">
                                <h5>Users</h5>
                                <h3 className="card-title">{userNo}</h3>
                            </div>
                        </div>
                        {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                </button>
                <button className="col-lg-3 mx-2 my-3 btn btn-outline-primary py-3" onClick={() => {setfranchiseClass(true); setdashboardClass(false)}}>
                        <div className='row align-items-start'>
                            <div class="col">
                                <svg xmlns="http://www.w3.org/2000/svg"  width="70" height="70" fill="currentColor" viewBox="0 0 640 512">
                                    <path d="M0 383.9l64 .0404c17.75 0 32-14.29 32-32.03V128.3L0 128.3V383.9zM48 320.1c8.75 0 16 7.118 16 15.99c0 8.742-7.25 15.99-16 15.99S32 344.8 32 336.1C32 327.2 39.25 320.1 48 320.1zM348.8 64c-7.941 0-15.66 2.969-21.52 8.328L228.9 162.3C228.8 162.5 228.8 162.7 228.6 162.7C212 178.3 212.3 203.2 226.5 218.7c12.75 13.1 39.38 17.62 56.13 2.75C282.8 221.3 282.9 221.3 283 221.2l79.88-73.1c6.5-5.871 16.75-5.496 22.62 1c6 6.496 5.5 16.62-1 22.62l-26.12 23.87L504 313.7c2.875 2.496 5.5 4.996 7.875 7.742V127.1c-40.98-40.96-96.48-63.88-154.4-63.88L348.8 64zM334.6 217.4l-30 27.49c-29.75 27.11-75.25 24.49-101.8-4.371C176 211.2 178.1 165.7 207.3 138.9L289.1 64H282.5C224.7 64 169.1 87.08 128.2 127.9L128 351.8l18.25 .0369l90.5 81.82c27.5 22.37 67.75 18.12 90-9.246l18.12 15.24c15.88 12.1 39.38 10.5 52.38-5.371l31.38-38.6l5.374 4.498c13.75 11 33.88 9.002 45-4.748l9.538-11.78c11.12-13.75 9.036-33.78-4.694-44.93L334.6 217.4zM544 128.4v223.6c0 17.62 14.25 32.05 31.1 32.05L640 384V128.1L544 128.4zM592 352c-8.75 0-16-7.246-16-15.99c0-8.875 7.25-15.99 16-15.99S608 327.2 608 336.1C608 344.8 600.8 352 592 352z"/>
                                </svg>
                            </div> 
                            <div class="col">
                                <h5>Franchises</h5>
                                <h3 className="card-title">{Franchises.length}</h3>
                            </div>
                        </div>
                </button>
                <button className="col-lg-4 mx-2 my-3 btn btn-outline-primary py-3"  data-bs-toggle="modal" data-bs-target="#newUserModal">
                        <div className='row align-items-center'>
                            <div class="col">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                                </svg>
                            </div>
                            <div class="col">
                                <h5>Generate Codes</h5>
                            </div>
                        </div>
                </button>
            </div>
        </div>
        <NewUserModal />
        <Footer />
      </>
  );
}

export default Dashboard;
