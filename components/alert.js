import React, { useEffect } from "react";
export default function Alert({message, type, alert, setAlert}){

    useEffect(() => {
        var count
        if(alert)
        {
            count = 0
            var timerId= setInterval(() =>{
                count += 1
                if(count === 5)
                {
                    clearInterval(timerId)    
                    count=0
                    setAlert(false)
                } 
                }, 1000)
        }
    }, [alert])


    return(
        <>
        {alert ?  
        <div className='row'>
            <div className='col-lg-4 fixed-bottom float-start'>
                <div className={`alert alert-${type} w3-animate-bottom`} role="alert">
                    {type == "success"? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-dizzy" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                    </svg>
                    }    {message}
                </div>
            </div>
        </div>      
        : ""}
        </>
    )
}