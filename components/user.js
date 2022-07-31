import React, { useEffect, useState }  from 'react';
import Search from './Search';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

export default function User(props){
    const [users, setUsers]=useState(props.users)
    const [modalContent, setModalContent]=useState(users[0])
    const [edit, setEdit]=useState(false)
    const [userCode, setusercode]=useState()
    const [name, setName]=useState()
    const [franchise, setFranchise]=useState()
    const [type, setType] = useState()
    const [organisation, setOrganisation]=useState()
    const [level, setLevel] = useState()
    const [age, setAge] = useState()
    const [gender, setGender] = useState()
    const [languagePreference, setLanguagePreference]=useState("English")
    const [address, setAddress]=useState()
    const [email, setEmail]=useState()
    const [phone, setPhone]=useState()
    const [country, setCountry]=useState()
    const [index, setIndex]=useState(0)
    const [alert, setAlert]=useState(false)
    const [alertMessage,setAlertmessage]=useState({ message :"", type: ""})
    const axiosPrivate = useAxiosPrivate();

    const makeChange = () =>{
        setusercode(modalContent.userCode)
        setFranchise(modalContent.franchise)
        setName(modalContent.name)
        setType(modalContent.type)
        setOrganisation(modalContent.organisation)
        setLevel(modalContent.grade)
        setAge(modalContent.age)
        setGender(modalContent.gender)
        setLanguagePreference('English')
        setAddress(modalContent.address)
        setEmail(modalContent.email)
        setPhone(modalContent.phone)
        setCountry(modalContent.country)
        setEdit(true);
    }

    const saveChange = async () => {
        var userTemp=users
        userTemp[index]={
            id: userTemp[index].id,
            name:name,
            franchise: franchise,
            type: type?type:"",
            organisation: organisation?organisation:"",
            level:level?level:"",
            grade: level?level:"",
            age:age,
            gender:gender,
            languagePreference: languagePreference,
            address:address,
            email:email,
            phone:phone,
            country:country,
            userCode: modalContent.userCode
        }
        const response = await axiosPrivate.post('update/user', userTemp[index]);
        if(response.status == 200 && response.data=="Success")
        {
            setUsers(userTemp);
            setModalContent(userTemp[index])
            setEdit(false); 
            setAlertmessage({message : "Changes saved successfully", type:"success"});
            setAlert(true);
        }
        else if(response.status == 500)
        {
            setEdit(false); 
            setAlertmessage({message : response.data, type:"danger"});
            setAlert(true);
        }
        else
        {
            console.log(response)
            setEdit(false); 
            setAlertmessage({message : "Something went wrong try again later...", type:"danger"});
            setAlert(true);
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

    
     
    return (
        <>
            <div className='container'>
            <div className='row mt-1'>
                <div className='col-lg-2'>
                    <h3>Users</h3>
                </div>
                {
                    users?.length
                    ?
                    <div className='col-lg-8'>
                        <Search id={"searchCol"} keyword={"user"} mainTag={"tbody"} searchTag={"tr"} innerTag={"td"} colIndex={1}/>
                    </div>
                    :""
                }
                <hr/>
                {
                users.length!=0?
                <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Code</th>
                        <th scope="col">User Name</th>
                        <th scope="col">Franchise</th>
                    </tr>
                </thead>
                <tbody>
                {
                users.map( (user, index)=>
                    <tr key={index} onClick={() => {setModalContent(users[index]); setIndex(index)}}>
                    <th scope="row">{index+1}</th>
                    <td data-bs-toggle="modal" data-bs-target="#userDetails">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                        </svg>
                        {user.userCode}
                    </td>
                    <td data-bs-toggle="modal" data-bs-target="#userDetails">{user.name}</td>
                    <td>{user.franchiseCode? user.franchiseCode: "MI_APP"}</td>
                    <td>
                        <a href={user.report_url} target="_blank" className='btn btn-primary'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-bar-graph" viewBox="0 0 16 16">
                                <path d="M10 13.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v6zm-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-1z"/>
                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                            </svg> Report
                        </a>    
                    </td>
                    </tr>
                )}
                </tbody>
                </table>
                :
                <h2 className='text-center'>No users registered yet..</h2>
                }
                
            </div>
             {/* Details Modal */}
            { modalContent?
            <div className="modal fade" id="userDetails" tabIndex="-1" aria-labelledby="userDetailsLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="userModalLabel">{ edit ? "Edit user details" :modalContent.name}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    {edit ? 
                    <div className="modal-body">
                        <div className='row'>
                            <div className='col'>
                                <label>Code</label>
                                <input className='form-control' value={userCode} disabled/>  
                            </div>
                            <div className='col'>
                                <label>Name</label><span className='text-danger'>*</span>
                                <input className='form-control' value={name} onChange={(e) => setName(e.target.value)} required/>
                            </div> 
                            
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>Type</label><span className='text-danger'>*</span>
                                <select className='form-select' onChange={() => {type=="Student"?setType("Employee"):setType("Student")}} required>
                                    <option value="Male" selected={type=="Student"?true:false}>Student</option>
                                    <option value="Female" selected={type!="Student"?true:false}>Employee</option>
                                </select> 
                            </div>
                            <div className='col'>
                                <label>Organisation</label><span className='text-danger'>*</span>
                                <input className='form-control' value={organisation} onChange={(e) => setOrganisation(e.target.value)} required/>
                            </div> 
                            
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>Level</label><span className='text-danger'>*</span>
                                <input className='form-control' value={level} onChange={(e) =>setLevel(e.target.value)} required/>  
                            </div>
                            <div className='col'>
                                <label>Age</label><span className='text-danger'>*</span>
                                <input className='form-control' value={age} type="number" onChange={(e) => setAge(e.target.value)} required/>
                            </div> 
                            
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>Gender</label><span className='text-danger'>*</span>
                                <select className='form-select' onChange={() => {gender=="Female"?setGender("Male"):setGender("Female")}} required>
                                    <option value="Male" selected={gender=="Female"?false:true}>Male</option>
                                    <option value="Female" selected={gender!="Female"?false:true}>Female</option>
                                </select>  
                            </div>
                            <div className='col'>
                                <label>Language Preference</label><span className='text-danger'>*</span>
                                <input className='form-control' value={languagePreference} onChange={(e) => setLanguagePreference(e.target.value)} required/>
                            </div>    
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>Address</label><span className='text-danger'>*</span>
                                <textarea className='form-control' onChange={(e) => setAddress(e.target.value)} required>{address}</textarea>  
                            </div>
                            <div className='col'>
                                <label>Country</label><span className='text-danger'>*</span>
                                <input className='form-control' value={country} onChange={(e) => setCountry(e.target.value)} required/>
                            </div> 
                        </div>
                        <div className='row'>
                            <div className='col'>
                                <label>Email</label><span className='text-danger'>*</span>
                                <input className='form-control' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                            </div> 
                            <div className='col'>
                                <label>Phone</label><span className='text-danger'>*</span>
                                <input className='form-control' value={phone} onChange={(e) => setPhone(e.target.value)} required/>  
                            </div>
                        </div>
                    </div>
                    : 
                    <div className="modal-body">
                        <div className='row p-2'>
                            <div className='col'>
                            Code :  <b>{modalContent.userCode}</b>
                            </div>
                            <div className='col'>
                            Franchise:  <b>{modalContent.franchiseCode? modalContent.franchiseCode: "MI_APP"}<br/>{modalContent.client_name}<br/>{modalContent.company}</b>
                            </div>
                        </div>
                        <div className='row p-2'>
                            <div className='col'>
                            Type : <b>{modalContent.type}</b>
                            </div>
                            <div className='col'>
                            Organisation : <b>{modalContent.organisation}</b>
                            </div>
                        </div>
                        <div className='row p-2'>
                            <div className='col'>
                            Level : <b>{modalContent.grade}</b>
                            </div>
                            <div className='col'>
                            Age : <b>{modalContent.age}</b>
                            </div>
                        </div>
                        <div className='row p-2'>
                            <div className='col'>
                            Gender : <b>{modalContent.gender}</b>
                            </div>
                            <div className='col'>
                            Language Preference : <b>{languagePreference}</b>
                            </div>
                        </div>
                        <div className='row p-2'>
                            <div className='col'>
                                <label>
                                Address : 
                                </label> <br/>
                                <b>{modalContent.address}</b>
                            </div>
                            <div className='col'>
                                Country : <b>{modalContent.country}</b>
                            </div>
                        </div>
                        <div className='row p-2'>
                            <div className='col'>
                            Email : <a href={"mailto:"+modalContent.email}>{modalContent.email}</a>
                            </div>
                            <div className='col'>
                            Phone : <a href={"tel:"+modalContent.phone}>{modalContent.phone}</a>
                            </div>
                        </div>  
                    </div>
                    }
                    
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => {setEdit(false);}}>Close</button>
                        {edit? 
                            <button type="button" className="btn btn-success" onClick={saveChange} data-bs-dismiss="modal" shown-bs-toast="true" id="liveToastBtn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
                                <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                                <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                            </svg>   Save</button>
                            :
                            <button type="button" className="btn btn-info" onClick={makeChange}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>   Edit</button>
                            }
                        
                    </div>
                    </div>
                </div>
            </div>
            : ""}
        { alert?
        <div className='row'>
            <div className='col-lg-4 fixed-bottom float-start'>
                <div className={`alert alert-${alertMessage.type} w3-animate-bottom`} role="alert">
                        {alertMessage.message}
                </div>
            </div>
        </div>     
            : ""}
        </div>
        </>
    )
} 