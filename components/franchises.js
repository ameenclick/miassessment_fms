import AWS from 'aws-sdk'
import React, { useState,useEffect }  from 'react';
import NewUser from './NewUser';
import Search from './Search';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
})


export default function Franchises(props){
    const [franchises, setFranchises] = useState(props.franchises)
    const [modalContent, setModalContent]= useState({ company: "", client_name: "", address: "", website: "", email: "", phone: "", designation:""})
    const [edit, setEdit]=useState(false)
    const [company,setCompany]=useState()
    const [admin, setAdmin]=useState()
    const [designation, setDesignation]=useState()
    const [address, setAddress]=useState()
    const [website, setWebsite]=useState()
    const [email, setEmail]=useState()
    const [phone, setPhone]=useState()
    const [index, setIndex]=useState(0)
    const [alert, setAlert]=useState(false)
    const [alertMessage,setAlertmessage]=useState({ message :"", type: ""})
    const [account, setAccount]=useState(true)
    const [logo, setLogo] = useState('');
    const [logoLocation, setlogoLocation] = useState(undefined) 
    const [logoProgress , setProgresslogo] = useState(0);
    const [filename, setFilename] = useState("")
    const [logoSrc, setLogoSrc] = useState(undefined)
    const [Unsold, setUnsold] = useState(undefined)
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        setFranchises(props.franchises)
    }, [])

    //Model Content Update
    useEffect(() => {
        if(modalContent)
        {
            setCompany(modalContent.company)
            setAdmin(modalContent.client_name)
            setDesignation(modalContent.designation)
            setAddress(modalContent.address)
            setWebsite(modalContent.website)
            setEmail(modalContent.email)
            setPhone(modalContent.phone)
        }
    }, [modalContent])

    //Render Uploaded Image
    useEffect(() => {
        if(logo)
        {
            setLogoSrc(URL.createObjectURL(logo))   
        }
    }, [logo])
    
        //Alert Timer
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

    const saveChange = () => {
        var content = [...franchises];
        content[index].franchiseCode=franchises[index].franchiseCode;
        content[index].company= company.replace(/'/g, "\\'");
        content[index].client_name=admin
        content[index].designation=designation;
        content[index].address=address.replace(/'/g, "\\'");
        content[index].website=website;
        content[index].email=email;
        content[index].phone=phone;
        axiosPrivate.post(`update/franchise`, content[index])
        .then(res =>{
            if(res.data == "Success")
            {
                setFranchises(content)
                setEdit(false)
                setAlertmessage({message : "Changes saved successfully", type:"success"});
                setAlert(true);
            }
            else
            {
                setEdit(false)
                setAlertmessage({message : "Something went wrong, try again later", type:"danger"});
                setAlert(true);
            }
        })
        
    }

    const uploadImage = () => {
        console.log(process.env.AWS_BUCKET)
        const s3 = new AWS.S3({
            params: { Bucket: process.env.AWS_BUCKET},
            region: process.env.AWS_REGION,
        })
        const uploadParams = {
            Key : 'franchises/logos/'+filename,
            Body : logo,
            Bucket : process.env.AWS_BUCKET
          }
        s3.upload(uploadParams,(err,res) =>{
            if(err)
            {
                console.error(err)
            }
            else{
                setlogoLocation(res.Location)
            }
        }).on('httpUploadProgress', (evt) => {
            setProgresslogo(Math.round((evt.loaded / evt.total) * 100))
        })

    }

    function createFranchiseAccount(e){
        e.preventDefault()
        if(logoSrc)
        {
            if(!logoLocation)
            {
                setAlertmessage({ message: "You should click upload", type: "warning"});
                setAlert(true)
                return
            }
        }
        const details = {
            company: company.replace(/'/g, "\\'"),
            client_name:admin,
            designation:designation,
            address:address.replace(/'/g, "\\'"),
            website: website,
            email: email,
            phone: phone,
            logo_url: logoLocation? logoLocation: null
        }
        axiosPrivate.post("register/franchise",details)
        .then(response => {
                setAlertmessage({ message: "New franchise created", type: "success"});
                var temp=[...franchises].concat([response.data])
                setModalContent({ company: "", client_name: "", address: "", website: "", email: "", phone: "", designation:""})
                setFranchises(temp)
        })
        .catch(error => { 
             console.error(error.message)
             setAlertmessage({ message: error.response? error.response:"Something wrong with server, try later..", type: "danger"});
        })
        setAlert(true)
    }

     function getUnsold(code)
     {
        axiosPrivate.get(`unsold/codes/${code}`)
        .then(res => {
            setUnsold(res.data)
        })
        .catch(err =>{ 
            console.error(err)
        })
     }

    //Accounts Status Change
    function changePrivilege(franchiseCode, accountStatus)
    {
        const url=`franchise/change/${franchiseCode}/${accountStatus}`
        axiosPrivate.get(url)
        .then(stat => {
            if(stat.data == "Success")
            {
                var changedFr=franchises
                changedFr[index].account_status=accountStatus!='revoke'?"Active":"Revoked"
                setFranchises(changedFr)
                setAlertmessage({ message: "Franchise Privilage Updated", type: "success"});
                setAlert(true)
            }
            else
            {
                setAlertmessage({ message: "Something went wrong, try again later", type: "danger"});
                    setAlert(true)
            }
        })
        .catch(error => { 
            console.error(error)
            setAlertmessage({ message: error.response.data? error.response.data:"Something wrong with server, try later..", type: "danger"});
        })
    }

    function deleteCode(code){
        if(confirm(`Do you want to delete ${code}`))
        {
            const url=`delete/code/${code}`
            axiosPrivate.delete(url)
            .then(stat => {
                if(stat.data == "success")
                {
                    var tempCodes=[...Unsold,]
                    var tempFranchise=[...franchises,]
                    tempFranchise[index].codes_generated=tempFranchise[index].codes_generated-1
                    tempCodes.pop()
                    setUnsold(tempCodes)
                    setAlertmessage({ message: "Deleted the code", type: "success"});
                    setAlert(true)
                }
                else
                {
                    setAlertmessage({ message: "Failed the operation", type: "danger"});
                    setAlert(true)
                }
            }).catch((error) => {
                console.error('Error:', error);
                setAlertmessage({ message: "Something went wrong, try again", type: "danger"});
                setAlert(true)
            });
        }
        else
        {
            return
        }
        
    }

    function resetPassword(email,company)
    {
        const url = `reset/password/${email}`
        axiosPrivate.get(url)
        .then(stat => {
            if(stat.data == "Done")
            {
                setAlertmessage({ message: "Password changed for franchise", type: "success"});
                setAlert(true)
            }
            else
            {
                setAlertmessage({ message: stat.data, type: "danger"});
                setAlert(true)
            }
        })
    }

    return(
        <>
        <div className='container'>
            <div className='row mt-1'>
                <div className='col'>
                    <h3>Franchises</h3>
                </div>
                <div className='col-lg-8'>
                    { franchises?
                    <Search id={"searchCol"} keyword={"franchise"} mainTag={"tbody"} searchTag={"tr"} innerTag={"td"} colIndex={1}/>
                    : <h4>Create the first franchise</h4>
                    }
                </div>
                <div className='col mb-1'>
                    <button className='btn btn-primary float-end' data-bs-toggle="modal" data-bs-target="#createFranchise" onClick={() => setModalContent({ company: "", client_name: "", address: "", website: "", email: "", phone: "", designation:""})}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                        </svg>    Create New
                    </button>
                </div>     
                { !franchises? 
                        <h3 className='text-center'>No franchise created</h3>
                :
                <>
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className={account?"nav-link active":"nav-link"} aria-current="page" href="#" onClick={() => setAccount(true)}>Active</a>
                        </li>
                        <li className="nav-item">
                            <a className={account?"nav-link":"nav-link active"} href="#" onClick={() => setAccount(false)}>Revoked</a>
                        </li>
                    </ul>
                        <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Code</th>
                                <th scope="col">Client Name</th>
                                <th scope="col">Company</th>
                                <th className='text-center' scope="col">Unsold</th>
                            </tr>
                        </thead>
                        <tbody>
                            { 
                                franchises.map((franchise, i) => 
                                (franchise.account_status == "Active" && account)?
                                <tr key={i}>
                                <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i);}}>{franchise.franchiseCode}</td>
                                <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i);}}>{franchise.client_name}</td>
                                <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i);}}>{franchise.company}</td>
                                <td className='text-center fs-5'><button className="badge bg-secondary" data-bs-toggle="modal" data-bs-target="#unsold" onClick={() => {getUnsold(franchise.franchiseCode); setIndex(i)}}>{franchise.codes_generated-franchise.users_registered}</button></td>
                                {
                                    franchise.franchiseCode != "MI_APP"?
                                    <td>
                                    <button type="button" className="btn btn-outline-warning" title='Reset Password'onClick={() =>{confirm(`Password of ${franchise.company} will change to new, Do you confirm?`)? resetPassword(franchise.email,franchise.company): null}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-shuffle" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z"/>
                                            <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z"/>
                                        </svg> Password
                                    </button></td>:""
                                }
                                </tr>:  
                                (franchise.account_status == "Revoked" && !account)?
                                <tr key={i}>
                                <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i);}}>{franchise.franchiseCode}</td>
                                <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i);}}>{franchise.client_name}</td>
                                <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i);}}>{franchise.company}</td>
                                <td className='text-center fs-5'><button className="badge bg-secondary" data-bs-toggle="modal" data-bs-target="#unsold" onClick={() => getUnsold(franchise.franchiseCode)}>{franchise.codes_generated-franchise.users_registered}</button></td>
                                </tr>:"")
                            }           
                        </tbody>
                        </table>
                    </>
                }
                
            </div>
            
            {/* Details Modal */
            modalContent?
            <div className="modal fade" id="franchiseDetails" tabIndex="-1" aria-labelledby="franchiseDetailsLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{edit ? "Edit Details for "+modalContent.franchiseCode:modalContent.company}</h5>
                         { modalContent.account_status == "Revoked"?
                          <span className="badge rounded-pill bg-danger">Revoked</span> : 
                          <span className="badge rounded-pill bg-success">Active</span> }
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setEdit(false)}></button>
                    </div>
                    <div className="modal-body">
                        {
                        edit ? 
                        <div>
                        <div className='row'>
                            <div className='col'>
                                <label>
                                    Organisation
                                </label>
                                <input name="company" type="text" className='form-control form-control-lg mb-3' placeholder="Enter name of  organisation" onChange={(e) => setCompany(e.target.value)} value={company} required/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>
                                    Administrator
                                </label>
                                <input name="admin" type="text" className='form-control form-control-lg mb-3' placeholder="Change username" onChange={(e) => setAdmin(e.target.value)} value={admin} required/>
                                
                            </div>
                            <div className='col'>
                                <label>
                                    Designation
                                </label>
                                <input name="designation" type="text" className='form-control form-control-lg mb-3' placeholder="Change designation" onChange={(e) => setDesignation(e.target.value)} value={designation} required/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>
                                    Address
                                </label>
                                <textarea name="address" className='form-control form-control-lg mb-3' placeholder="Change address" onChange={(e) => setAddress(e.target.value)} required>{address}</textarea>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>
                                    Phone
                                </label>
                                <input name="phone" type="text" className='form-control form-control-lg mb-3' placeholder="Change phone" onChange={(e) => setPhone(e.target.value)} value={phone} required/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>
                                    Email
                                </label>
                                <input name="email" type="email" className='form-control form-control-lg mb-3' placeholder="Change email" onChange={(e) => setEmail(e.target.value)} value={email} required/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                    <label>
                                        Website
                                    </label>
                                    <input name="website" type="text" className='form-control form-control-lg mb-3' placeholder="Change website" onChange={(e) => setWebsite(e.target.value)} value={website}  required/>
                                </div>
                            </div>
                        </div>
                        :
                        <table className="table table-striped table-hover">
                        <thead>
                            <tr><td>Code:</td><td colSpan={2}><b>{modalContent.franchiseCode}</b></td></tr>
                            <tr><td> Admin:</td><td colSpan={2}><b>{modalContent.client_name}</b></td></tr>
                            <tr><td>Designation:</td><td colSpan={2}><b>{modalContent.designation}</b></td></tr>
                            <tr><td>Address: </td><td colSpan={2}><b>{modalContent.address}</b></td></tr>
                            <tr><td>Website:</td><td colSpan={2}><a href={modalContent.website} target="_blank">{modalContent.website}</a></td></tr>
                            <tr><td>Email:  </td><td colSpan={2}><a href={"mailto:"+modalContent.email}>{modalContent.email}</a></td></tr>
                            <tr><td>Phone:</td><td colSpan={2}><a href={"tel:"+modalContent.phone}>{modalContent.phone}</a></td></tr>
                            <tr><td className='text-center'>
                                    <b>{modalContent.codes_generated}</b><br/>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-qr-code" viewBox="0 0 16 16">
                                        <path d="M2 2h2v2H2V2Z"/>
                                        <path d="M6 0v6H0V0h6ZM5 1H1v4h4V1ZM4 12H2v2h2v-2Z"/>
                                        <path d="M6 10v6H0v-6h6Zm-5 1v4h4v-4H1Zm11-9h2v2h-2V2Z"/>
                                        <path d="M10 0v6h6V0h-6Zm5 1v4h-4V1h4ZM8 1V0h1v2H8v2H7V1h1Zm0 5V4h1v2H8ZM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8H6Zm0 0v1H2V8H1v1H0V7h3v1h3Zm10 1h-1V7h1v2Zm-1 0h-1v2h2v-1h-1V9Zm-4 0h2v1h-1v1h-1V9Zm2 3v-1h-1v1h-1v1H9v1h3v-2h1Zm0 0h3v1h-2v1h-1v-2Zm-4-1v1h1v-2H7v1h2Z"/>
                                        <path d="M7 12h1v3h4v1H7v-4Zm9 2v2h-3v-1h2v-1h1Z"/>
                                    </svg>  Codes
                                </td>
                                <td className='text-center'>
                                    <b>{modalContent.users_registered}</b><br/>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people" viewBox="0 0 16 16">
                                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                                    </svg>  Users
                                </td>
                                <td className='text-center'>
                                    <b>{modalContent.user_completed}</b><br/>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-check-fill" viewBox="0 0 16 16">
                                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm1.354 4.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                                    </svg>  Reports
                                </td>
                            </tr>
                        </thead>
                        </table>
                        }
                        
                    </div>
                    <div className="modal-footer">
                        { 
                        modalContent.account_status == "Active"?
                        <button type="button" className="btn btn-outline-danger me-auto" data-bs-dismiss="modal" onClick={() =>{confirm(`User won't be able to access fms, Do you confirm?`)? changePrivilege(modalContent.franchiseCode,"revoke"):null}}>Revoke</button> :
                        <button type="button" className="btn btn-outline-success me-auto" data-bs-dismiss="modal" onClick={() =>{confirm(`User will be able to access fms, Do you confirm?`)? changePrivilege(modalContent.franchiseCode,"activate"):null}}>Activate</button>
                        }
                        
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() =>{ setEdit(false)}}>Close</button>
                        { edit? 
                        
                        <button type="button" className="btn btn-success" onClick={saveChange}  data-bs-dismiss="modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                            </svg>  Save
                        </button>
                        :
                        <button type="button" className="btn btn-info" onClick={() => {setEdit(true);}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>  Edit
                        </button>
                        }    
                    </div>
                    </div>
                </div>
            </div>
            :"" }
            {/* Create New Modal */}
            <div className="modal fade" id="createFranchise" tabIndex="-1" aria-labelledby="createFranchiseLabel" aria-hidden="true">
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Register New Franchise</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                { alert?
                    <div className='row'>
                        <div className='col-lg-4 fixed-bottom float-start'>
                            <div className={`alert alert-${alertMessage.type} w3-animate-zoom`} role="alert">
                                {alertMessage.type == "success"? 
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                </svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-dizzy" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                                </svg>
                                }    {alertMessage.message}
                            </div>
                        </div>
                    </div>     
                        : ""}
                <form onSubmit={(e) => createFranchiseAccount(e)}>
                    <div className="modal-body modal-fullscreen-lg-down p-5">
                            <div className='row'>
                                <div className='col-lg-4'>
                                    <label>
                                        Organisation
                                    </label><span className='text-danger'>*</span>
                                    <input name="company" type="text" title='Organisation name should not be empty (Max : 50 character)'
                                     onChange={(e) => setCompany(e.target.value)}
                                     value={company} className='form-control form-control-lg mb-3' placeholder="Enter name of  organisation" pattern=".{,50}" required/>
                                </div>
                                <div className='col-lg-4'>
                                    <label>
                                        Administrator
                                    </label><span className='text-danger'>*</span>
                                    <input name="admin" type="text" title='Mandatory field (Max : 50 character)'
                                     onChange={(e) => setAdmin(e.target.value)}
                                    value={admin} className='form-control form-control-lg mb-3' placeholder="Enter user name" pattern=".{,50}" required/>
                                </div>
                                <div className='col-lg-4'>
                                    <label>
                                        Designation
                                    </label><span className='text-danger'>*</span>
                                    <input name="designation" type="text" title='Mandatory field (Max : 25 character)'
                                     onChange={(e) => setDesignation(e.target.value)}
                                      value={designation} className='form-control form-control-lg mb-3' placeholder="Enter user designation" pattern=".{,25}" required/>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-lg-4'>
                                    <label>
                                        Address
                                    </label><span className='text-danger'>*</span>
                                    <textarea name="address" className='form-control form-control-lg mb-3' title='Mandatory field (Max: 150 character)' onChange={(e) => setAddress(e.target.value)} value={address}  pattern=".{,150}" placeholder="Enter organisation's address" required></textarea>
                                </div>
                                <div className='col-lg-4'>
                                    <label>
                                        Website
                                    </label><span className='text-danger'>*</span>
                                    <input name="website" type="text" pattern='https?://.+.{,50}' title='https://mywebsite.com (Max : 100 character)'
                                     onChange={(e) => setWebsite(e.target.value)}
                                    value={website} className='form-control form-control-lg mb-3' placeholder="Enter organisation's website" required/>
                                </div>
                                <div className='col-lg-4'>
                                    <label>
                                        Email
                                    </label><span className='text-danger'>*</span>
                                    <input name="email" type="email" pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,100}$" title='username@domain.sub (Max : 50 character)' onChange={(e) => setEmail(e.target.value)} value={email} className='form-control form-control-lg mb-3' placeholder="Enter user email" required/>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-lg-4'>
                                    <label>
                                        Phone
                                    </label><span className='text-danger'>*</span>
                                    <input name="phone" type="number" pattern='[0-9]+{7,20}$' title='Mandatory field' onChange={(e) => setPhone(e.target.value)} value={phone} className='form-control form-control-lg' placeholder="Enter phone" required/>
                                </div>
                                <div className='col-lg-8'>
                                        <label>
                                            Brand Logo
                                        </label>
                                        <div className='input-group'>
                                            <input name="logo" type="file" className='form-control form-control-lg' onChange={(e) =>{ setLogo(e.target.files[0]); setFilename(e.target.files[0].name)} } id='customeLogo' accept='.jpeg, .jpg, .png'/>
                                            <button type='submit' className='btn btn-primary' onClick={uploadImage} disabled={filename? false:true}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                                                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                            </svg> Upload</button>
                                        </div> 
                                </div>
                            </div>
                            {    logoSrc?
                                <div className='row  justify-content-center'>
                                    <div className="col-lg-4 my-4">
                                        {
                                            logoProgress > 0?
                                            <div className="progress">
                                                <div className="progress-bar progress-bar-striped" role="progressbar" style={{width: `${logoProgress}%`}} aria-valuenow={logoProgress} aria-valuemin="0" aria-valuemax="100">{`${logoProgress}%`}</div>
                                            </div>
                                                : ""
                                        }
                                        <img src={logoSrc} className="img-thumbnail float-center" alt="Logo"/>
                                    </div>
                                </div>:""
                            }
                        
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                            </svg> Create
                        </button>
                    </div>
                </form> 
                </div>
            </div>
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
                            { Unsold.map((val, i) =>         
                                <li className="list-group-item text-center" key={i}>
                                    {val.userCode} &nbsp;
                                    <a className='p-5 text-danger' title={`Delete code permanently`} href="#" onClick={()=>deleteCode(val.userCode)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                        </svg>
                                    </a>
                                </li> )
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
                { alert?
                    <div className='row'>
                        <div className='col-lg-4 fixed-bottom float-start'>
                            <div className={`alert alert-${alertMessage.type} w3-animate-zoom`} role="alert">
                                {alertMessage.type == "success"? 
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                                </svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-dizzy" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                                </svg>
                                }    {alertMessage.message}
                            </div>
                        </div>
                    </div>     
                        : ""}
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>
        { alert?
        <div className='row'>
            <div className='col-lg-4 fixed-bottom float-start'>
                <div className={`alert alert-${alertMessage.type} w3-animate-bottom`} role="alert">
                    {alertMessage.type == "success"? 
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check2" viewBox="0 0 16 16">
                         <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                      </svg> :
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-dizzy" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                    </svg>
                    }    {alertMessage.message}
                </div>
            </div>
        </div>     
            : ""}
        <NewUser franchises={franchises}  setFranchises={setFranchises} />
        </>
    )
} 