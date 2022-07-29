import axios from "axios";

export default axios.create({
    baseURL: process.env.host
})

 export const axiosPrivate = axios.create({
     baseURL: process.env.host,
     headers: { 'Content-Type': 'application/json' , },
     withCredentials: true
 })