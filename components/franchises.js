import axios from 'axios';
import React, { useState,useEffect }  from 'react';
import NewUser from './NewUser';
import Search from './Search';

export default function Franchises(props){
    const [franchises, setFranchises] = useState(props.franchises)
    const [modalContent, setModalContent]= useState(props.franchises[0])
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
    const [api_access, setAPI]=useState()
    const [logo, setLogo] = useState('');
    const [filename, setFilename] = useState('Choose File')

    useEffect(() => console.log(franchises))

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

    useEffect(() => {
        if(franchises.length != 0)
        {
            setModalContent(franchises[0])
        } 
    }, [franchises])

    const saveChange = () => {
        var Temp = franchises
        Temp[index]={
            franchiseCode: franchises[index].franchiseCode,
            company: company,
            client_name:admin,
            designation:designation,
            address:address,
            website: website,
            email: email,
            phone: phone
        }
        setModalContent(Temp[index])
        setFranchises(Temp)
        setEdit(false)
        setAlertmessage({message : "Changes saved successfully", type:"success"});
        setAlert(true);
    }

    async function uploadImage(e){
        e.preventDefault()
        const formData = new FormData();
        formData.append('file',logo);
        formData.append('fileName',filename);
        const config = {
            header: {
                'content-type': 'multipart/form-data',
            },
        };
        try{
            const res = await axios.post('/uploads', formData, config).then((res) => {
                console.log(res.data)
            })
            const { fileName, filePath }=res.data
            console.log(filePath)
        }catch(err){
            console.error(err)
        }
        
    }

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

    return(
        <>
        <div className='container'>
            <div className='row mt-1'>
                <div className='col'>
                    <h3>Franchises</h3>
                </div>
                <div className='col-lg-8'>
                    <Search id={"searchCol"} keyword={"franchise"} mainTag={"tbody"} searchTag={"tr"} innerTag={"td"} colIndex={1}/>
                </div>
                <div className='col mb-1'>
                    <button className='btn btn-primary float-end' data-bs-toggle="modal" data-bs-target="#createFranchise">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
                        </svg>    Create New
                    </button>
                </div>
                <hr/>
                { franchises == []? 
                        <div className="d-flex justify-content-center m-5 p-5">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                :

                        <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Code</th>
                                <th scope="col">Client Name</th>
                                <th scope="col">Company</th>
                            </tr>
                        </thead>
                        <tbody>
                            { franchises.map((franchise, i) => 
                                <tr>
                                <th scope="row">{i + 1}</th>
                                <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i);}}>{franchise.franchiseCode}</td>
                                <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i);}}>{franchise.client_name}</td>
                                <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i);}}>{franchise.company}</td>
                                </tr>
                            )}
                            
                        </tbody>
                        </table>
                }
                
            </div>
            {franchises.length == 0? "" :
              /* Details Modal */
                <div class="modal fade" id="franchiseDetails" tabindex="-1" aria-labelledby="franchiseDetailsLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{edit ? "Edit Details for "+modalContent.franchiseCode:modalContent.company}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setEdit(false)}></button>
                    </div>
                    <div class="modal-body">
                        {
                        edit ? 
                        <div>
                        <div className='row'>
                            <div className='col'>
                                <label>
                                    Organisation
                                </label>
                                <input name="company" type="text" className='form-control form-control-lg mb-3' placeholder="Enter name of  organisation" value={company} onChange={(e) => setCompany(e.target.value)}/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>
                                    Administrator
                                </label>
                                <input name="admin" value={admin} onChange={(e) => setAdmin(e.target.value)} type="text" className='form-control form-control-lg mb-3' placeholder="Change username"/>
                                
                            </div>
                            <div className='col'>
                                <label>
                                    Designation
                                </label>
                                <input name="designation" value={designation} onChange={(e) => setDesignation(e.target.value)} type="text" className='form-control form-control-lg mb-3' placeholder="Change designation"/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>
                                    Address
                                </label>
                                <textarea name="address" value={address} onChange={(e) => setAddress(e.target.value)} className='form-control form-control-lg mb-3' placeholder="Change address"></textarea>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>
                                    Phone
                                </label>
                                <input name="phone" value={phone} onChange={(e) => setPhone(e.target.value)} type="text" className='form-control form-control-lg mb-3' placeholder="Change phone"/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>
                                    Email
                                </label>
                                <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" className='form-control form-control-lg mb-3' placeholder="Change email"/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'>
                                    <label>
                                        Website
                                    </label>
                                    <input name="website" value={website} onChange={(e) => setWebsite(e.target.value)} type="text" className='form-control form-control-lg mb-3' placeholder="Change website"/>
                                </div>
                            </div>
                        </div>
                        :
                        <table class="table table-striped table-hover">
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-qr-code" viewBox="0 0 16 16">
                                        <path d="M2 2h2v2H2V2Z"/>
                                        <path d="M6 0v6H0V0h6ZM5 1H1v4h4V1ZM4 12H2v2h2v-2Z"/>
                                        <path d="M6 10v6H0v-6h6Zm-5 1v4h4v-4H1Zm11-9h2v2h-2V2Z"/>
                                        <path d="M10 0v6h6V0h-6Zm5 1v4h-4V1h4ZM8 1V0h1v2H8v2H7V1h1Zm0 5V4h1v2H8ZM6 8V7h1V6h1v2h1V7h5v1h-4v1H7V8H6Zm0 0v1H2V8H1v1H0V7h3v1h3Zm10 1h-1V7h1v2Zm-1 0h-1v2h2v-1h-1V9Zm-4 0h2v1h-1v1h-1V9Zm2 3v-1h-1v1h-1v1H9v1h3v-2h1Zm0 0h3v1h-2v1h-1v-2Zm-4-1v1h1v-2H7v1h2Z"/>
                                        <path d="M7 12h1v3h4v1H7v-4Zm9 2v2h-3v-1h2v-1h1Z"/>
                                    </svg>  Codes
                                </td>
                                <td className='text-center'>
                                    <b>{modalContent.users_registered}</b><br/>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 16">
                                        <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
                                    </svg>  Users
                                </td>
                                <td className='text-center'>
                                    <b>{modalContent.user_completed}</b><br/>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-check-fill" viewBox="0 0 16 16">
                                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zm1.354 4.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708z"/>
                                    </svg>  Reports
                                </td>
                            </tr>
                        </thead>
                        </table>
                        }
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-danger me-auto">Revoke</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() =>{ setEdit(false)}}>Close</button>
                        { edit? 
                        
                        <button type="button" class="btn btn-success" onClick={saveChange}  data-bs-dismiss="modal">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                            </svg>  Save
                        </button>
                        :
                        <button type="button" class="btn btn-info" onClick={() => {setEdit(true);}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>  Edit
                        </button>
                        }    
                    </div>
                    </div>
                </div>
                </div>
            }
            {/* Create Modal */}
            <div class="modal fade" id="createFranchise" tabindex="-1" aria-labelledby="createFranchiseLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Register New Franchise</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body modal-fullscreen-lg-down p-5">
                    <div className='row'>
                        <div className='col-lg-4'>
                            <label>
                                Organisation
                            </label>
                            <input name="company" type="text" className='form-control form-control-lg mb-3' placeholder="Enter name of  organisation"/>
                        </div>
                        <div className='col-lg-4'>
                            <label>
                                Administrator
                            </label>
                            <input name="admin" type="text" className='form-control form-control-lg mb-3' placeholder="Enter user name"/>
                            
                        </div>
                        <div className='col-lg-4'>
                            <label>
                                Designation
                            </label>
                            <input name="designation" type="text" className='form-control form-control-lg mb-3' placeholder="Enter user designation"/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-4'>
                            <label>
                                Address
                            </label>
                            <textarea name="address" className='form-control form-control-lg mb-3' placeholder="Enter organisation's address"></textarea>
                        </div>
                        <div className='col-lg-4'>
                            <label>
                                Website
                            </label>
                            <input name="website" type="text" className='form-control form-control-lg mb-3' placeholder="Enter organisation's website"/>
                        </div>
                        <div className='col-lg-4'>
                            <label>
                                Email
                            </label>
                            <input name="email" type="email" className='form-control form-control-lg mb-3' placeholder="Enter user email"/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-lg-4'>
                            <label>
                                Phone
                            </label>
                            <input name="phone" type="number" className='form-control form-control-lg mb-3' placeholder="Enter organisation's phone"/>
                        </div>
                        <div className='col-lg-8'>
                            <form>
                                <label>
                                    Brand Logo
                                </label>
                                <div className='input-group'>
                                    <input name="logo" type="file" className='form-control form-control-lg' onChange={(e) =>{ setLogo(e.target.files[0]); setFilename(e.target.files[0].name)} }id='customeLogo'/>
                                    <button type='submit' className='btn btn-primary' onClick={(e) => {uploadImage(e)}}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                                    </svg> Upload</button>
                                </div> 
                            </form>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" onClick={() =>{ setAlertmessage({ message: "Registered new user.", type: "success"}); setAlert(true)}} data-bs-dismiss="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-check-fill" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm8.854-9.646a.5.5 0 0 0-.708-.708L7.5 7.793 6.354 6.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                        </svg> Create
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
        { alert?
        <div className='row'>
            <div className='col-lg-4 fixed-bottom float-start'>
                <div class={`alert alert-${alertMessage.type} w3-animate-bottom`} role="alert">
                        {alertMessage.message}
                </div>
            </div>
        </div>     
            : ""}
        <NewUser />
        </>
    )
} 