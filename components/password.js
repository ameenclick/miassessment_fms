import React, { useState }  from 'react';
import Nav from './Nav'
import MyHead from './WebHead';

export default function ChangePassword(){

    const [email, setEmail]=useState("");

    return(
        <>
            <div className='container m-5 p-5'>
                <div className='row justify-content-center'>
                    <div className='col-lg-8'>
                        <div class="card border-primary">
                        <div class="card-body p-5">
                            <h5 class="card-title my-4">Change Password</h5>
                            <input type="email" className='form-control form-control-lg' name="email" placeholder='Enter your email...' onInput={(e) => {e.preventDefault(); setEmail(e.target.value)}} value={email}/>
                            <button className='my-5 btn btn-primary px-5' type='submit'>Submit</button>
                        </div>
                        </div>
                    </div>    
                </div>
            </div>
        </>
    )
}