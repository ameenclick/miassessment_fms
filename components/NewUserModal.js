import useAxiosPrivate from '../hooks/useAxiosPrivate';
import React, { useEffect, useState } from "react";
import style from "../styles/loader.module.css"

export default function NewUserModal({franchises, setFranchises}){
    const axiosPrivate = useAxiosPrivate();
    const [userNo, setUserno] = useState(0);
    const Franchises = franchises?[{franchiseCode: "MI_APP", company: "Centre Of Innovation", account_status: "Active", client_name: "App"}].concat([...franchises,]):[{franchiseCode: "MI_APP", company: "Centre Of Innovation", account_status: "Active", client_name: "App"}];
    const [choosenFranchise, setChoosenfranchise] = useState(0);
    const [generation, setGeneration] = useState(false)
    const [codes, setCodes] = useState(undefined)
    
    const generateCodes = ()=>{
        if(userNo>0)
        {
            if(!confirm(`Press Ok if you are sure to give ${userNo} codes for ${Franchises[choosenFranchise].company}`))
            {
                return
            }
            setGeneration(true)
            const url=`generate/codes/${Franchises[choosenFranchise].franchiseCode}/${userNo}`;
            axiosPrivate.get(url)
            .then(res =>{
                 if(res.data)
                 {
                    setCodes(res.data[0])
                    if(Franchises[choosenFranchise].franchiseCode!="MI_APP")
                    {
                         var temp=[...franchises]
                         temp[choosenFranchise-1].codes_generated+=res.data[0].length
                         if(setFranchises) setFranchises(temp)
                    } 
                 }
            }
             ).catch((error) => {
                 console.error('Error:', error);
                 setCodes([])
               });
        }
        else
        {
            alert("Give a count more than 0!..");
            return
        }
    }

    useEffect(() => {
        if(codes)
        {
            setGeneration(false)
        }
    },[codes])

    return(
        <>
        <div className="modal fade" id="newUserModal" tabIndex="-1" aria-labelledby="newUserModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="newUserModalLabel">Generate New Codes</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            { Franchises?
            <div className="modal-body">
                
                <label>
                    Franchise
                </label>
                <select name="franchise" className="form-select form-select-lg mb-3" aria-label=".form-select-lg example" onChange={(e) => {setChoosenfranchise(e.target.value)}}>
                    {/* { (choosenFranchise === null)? <option defaultValue>Choose a Franchise</option>: "" } */}
                    { Franchises.map((Franchise, i) =>
                        (Franchise.account_status == "Active")?
                        <option value={i} key={i} defaultValue={i==0}>{Franchise.company+" - "+Franchise.client_name+""}</option>
                        :""
                    )}
                </select>
                <div className='userCouter text-center'>
                    <label>
                        Number of codes
                    </label>
                    <h1><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" height={45} width={45} onClick={() => userNo > 0 ?setUserno(userNo-1): setUserno(userNo)}>
                            <path d="M137.4 406.6l-128-127.1C3.125 272.4 0 264.2 0 255.1s3.125-16.38 9.375-22.63l128-127.1c9.156-9.156 22.91-11.9 34.88-6.943S192 115.1 192 128v255.1c0 12.94-7.781 24.62-19.75 29.58S146.5 415.8 137.4 406.6z"/>
                        </svg>{userNo}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512" height={45} width={45}  onClick={() => setUserno(userNo+1)}>
                            <path d="M118.6 105.4l128 127.1C252.9 239.6 256 247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91 11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5 96.23 118.6 105.4z"/>
                            </svg>
                    </h1>
                </div>
                <div className="row">
                    {codes?
                        codes.length<5?
                            codes==[]?
                                <div className="alert alert-danger w3-animate-zoom">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-dizzy" viewBox="0 0 16 16">
                                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                            <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                                        </svg>  Something went wrong with server
                                </div>
                                :
                                codes.map((code,i) =>
                                    <div className="col alert alert-info w3-animate-top" key={i}>
                                        {code} , 
                                    </div>
                                
                                )
                            :
                            <div className="alert alert-info w3-animate-zoom">
                                    Generated {codes.length} codes
                            </div>
                        :   ""}
                </div>
            </div>
            :
            <div className="d-flex justify-content-center m-5 p-5">
                <div className="spinner-border p-4" role="status">
                <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            }
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={generateCodes} disabled={generation}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={generation? style.spinner: ""} width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                    </svg>  {!generation? "Generate": "Generating..."}
                </button>
            </div>
            </div>
        </div>
        </div>
        </>
    )
}