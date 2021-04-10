// const { CLIENT_ORIGIN } = require('../config/clientOrigin')


// This file is exporting an Object with a single key/value pair.
// However, because this is not a part of the logic of the application
// it makes sense to abstract it to another file. Plus, it is now easily 
// extensible if the application needs to send different email templates
// (eg. unsubscribe) in the future.
module.exports = {

  confirm: id => ({
    subject: 'Kudamalana Tea Estate Confirm Email',
    html: `
    <div style = "width:70% ;margin: auto; text-align: center;">
<!--    <img width="350px" height="auto" src ="https://pin.it/2pfdV8w"/> -->
    <h1 style="font-family:'Trebuchet MS', sans-serif">Welcome to Kudamalana Tea Estate</h1>
    <hr/>
    <button style="background-color: rgb(78, 133, 235); border: none; ;border-radius: 5px; padding: 10px;">
    <a style ="color:white; text-decoration: none;" href="http://localhost:3000/email/confirm/${id}">
    Click to confirm email
    </a>
    </button>
    <hr/>
   <span>
    <p>Sent by Kudamalana Tea Estate &nbsp; • &nbsp; <a href="">Privacy policy</a>&nbsp; • &nbsp; <a href="">Terms of service </a></p>
   </span>

 
</div>


    `,
    text: `Copy and paste this link: http://localhost:3000/email/confirm/${id}`
  }),

  resetPassword: id => ({
    subject: 'Reset your password',
    html: `
    <div style = "width:70% ;margin: auto; text-align: center;">
<!--    <img width="350px" height="auto" src ="https://pin.it/2pfdV8w"/> -->
    <h1 style="font-family:'Trebuchet MS', sans-serif">Password Reset</h1>
    <hr/>
    <button style="background-color: rgb(78, 133, 235); border: none; ;border-radius: 5px; padding: 10px;">
    <a style ="color:white; text-decoration: none;" href="http://localhost:3000/auth/resetpassword">
    Click to reset password
    </a>
    </button>
    <hr/>
   <span>
    <p>Sent by Kudamalana Tea Estate &nbsp; • &nbsp; <a href="">Privacy policy</a>&nbsp; • &nbsp; <a href="">Terms of service </a></p>
   </span>
    `,
    text: `Copy and paste this link: http://localhost:3000//auth/resetpassword`
  })

}
