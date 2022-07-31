import React from 'react';
import NewUserModal from './NewUserModal';

export default function NewUser({franchises, setFranchises}){
    return(
        <>
        <div className='row fixed-bottom'>
            <div className='col'>
                <button className="float-end btn btn-outline-primary m-4"  data-bs-toggle="modal" data-bs-target="#newUserModal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                    </svg>   Generate Codes
                </button>
            </div>
        </div>
        <NewUserModal franchises={franchises} setFranchises={setFranchises} />
        </>
    )
}