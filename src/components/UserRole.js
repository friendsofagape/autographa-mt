import jwt_decode from 'jwt-decode';

let decoded;
let firstName;
let lastName;
let role;
let email
let istokenAlive = false
var accessToken = localStorage.getItem('accessToken')
if (accessToken) {
    decoded = jwt_decode(accessToken)
    let currentDate = new Date().getTime()
    let expiry = decoded.exp * 1000
    firstName = decoded.firstName
    lastName = decoded.lastName
    email = decoded.email
    role = decoded.role
    var hours = (expiry - currentDate) / 36e5
    if(hours > 0){
        istokenAlive = true
    }else{
        console.log("logged out")
    }
}

//  firstName;

module.exports = {
    lastName: lastName,
    role: role,
    email: email,
    istokenAlive: istokenAlive,
    accessToken: accessToken,
    }