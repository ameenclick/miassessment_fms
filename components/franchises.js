import axios from 'axios';
import React, { useState,useEffect }  from 'react';
import NewUser from './NewUser';
import NewUserModal from './NewUserModal';
import Search from './Search';

export default function Franchises(){
    const [franchises, setFranchises] = useState([
        {
            "franchiseCode": "MI_APP",
            "client_name": "Paul Maliekkal",
            "company": "Centre Of Innovation",
            "designation": "Academician",
            "address": "MNRA 158 , KOCHI 33, INDIA",
            "website": "www.centreofinovation.com",
            "email": "info@centreofinnovation.com",
            "phone": "+971 7012717483",
            "api_access": 1
        },
        {
            "franchiseCode": "FRMIA_2",
            "client_name": "Sajid M",
            "company": "Deseo Connect Private Ltd",
            "designation": "Executive Director",
            "address": "Deseo Connect Private Ltd Third Floor MTI Complex Chungam West Hill, Calicut -673005",
            "website": "www.deseoconnect.com",
            "email": "info@deseoconnect.com",
            "phone": "+91 9744883288",
            "api_access": 0
        }
    ])
    const [modalContent, setModalContent]= useState(franchises[0])
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

    const makeChage = () =>{
        setEdit(true);
        setCompany(modalContent.company)
        setAdmin(modalContent.client_name)
        setDesignation(modalContent.designation)
        setAddress(modalContent.address)
        setWebsite(modalContent.website)
        setEmail(modalContent.email)
        setPhone(modalContent.phone)
    }

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
                <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Code</th>
                        <th scope="col">Client Name</th>
                        <th scope="col">Company</th>
                        <th className='text-center'>
                            Users
                        </th>
                        <th className='text-center'>Codes</th>
                    </tr>
                </thead>
                <tbody>
                    { franchises.map((franchise, i) => 
                        <tr>
                        <th scope="row">{i + 1}</th>
                        <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i)}}>{franchise.franchiseCode}</td>
                        <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i)}}>{franchise.client_name}</td>
                        <td title='View full profile on click' data-bs-toggle="modal" data-bs-target="#franchiseDetails"  onClick={() =>{ setModalContent(franchises[i]); setIndex(i)}}>{franchise.company}</td>
                        <td className='text-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                            </svg>
                        </td>
                        <td className='text-center'>
                            0
                        </td>
                        </tr>
                    )}
                    
                </tbody>
                </table>
            </div>
            {/* Details Modal */}
            <div class="modal fade" id="franchiseDetails" tabindex="-1" aria-labelledby="franchiseDetailsLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">{edit ? "Edit Details for "+modalContent.franchiseCode:modalContent.company}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setEdit(false)}></button>
                </div>
                <div class="modal-body">
                    { edit ? 
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
                        <tr><td>Code:</td><td><b>{modalContent.franchiseCode}</b></td></tr>
                        <tr><td> Admin:</td><td><b>{modalContent.client_name}</b></td></tr>
                        <tr><td>Designation:</td><td><b>{modalContent.designation}</b></td></tr>
                        <tr><td>Address: </td><td><b>{modalContent.address}</b></td></tr>
                        <tr><td>Website:</td><td><a href={modalContent.website} target="_blank">{modalContent.website}</a></td></tr>
                        <tr><td>Email:  </td><td><a href={"mailto:"+modalContent.email}>{modalContent.email}</a></td></tr>
                        <tr><td>Phone:</td><td><a href={"tel:"+modalContent.phone}>{modalContent.phone}</a></td></tr>
                    </thead>
                    </table>
                    }
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={() =>{ setEdit(false)}}>Close</button>
                    { edit? 
                    
                    <button type="button" class="btn btn-success" onClick={saveChange}  data-bs-dismiss="modal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                        </svg>  Save
                    </button>
                    :
                    <button type="button" class="btn btn-info" onClick={makeChage}>
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