import axios from "axios";


const BASE_URL = process.env.REACT_APP_BASE_URL ;
//const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken
const checker = localStorage.getItem("persist:root");
//console.log(checker && JSON.parse(JSON.parse(checker).user).currentUser)
const checker2 = checker && JSON.parse(JSON.parse(checker).user).currentUser
let token;
if(checker === null) {
    token = ""
} else if (checker2 === null) {
    token = "";
} else {
    token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
}


export const tokenChecker = token === "" ? false: true

export const accessToken = token

 //const token = checker === null? "null" : "not null"//JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
// console.log(tokenChecker)
export const publicRequest = axios.create({
    baseURL: BASE_URL,
})
export const userRequest = axios.create({
    baseURL: BASE_URL,
    headers: {token: `Bearer ${token}`} 
})