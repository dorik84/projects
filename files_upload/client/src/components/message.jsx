import React from 'react';

function Message(props) {
    const {flashMsg} = props
    // let content;
    // switch (msg) {
    //     case "home":
    //         content = "Home Page";
    //         break;
    //     case "login":
    //         content = "Please Log In";
    //         break;
    //     case "register":
    //         content = "Register Page";
    //         break;
    //     case "logout":
    //         content = "You've loged Out";
    //         break;
    //     case "profile":
    //         content = "Your Profile";
    //         break;
    //     case "upload":
    //         content = "Upload an image";
    //         break;
    //     default:
    //         content = "";
    // }


    return (
        <>
            {/* <h3>{content}</h3> */}
            { flashMsg ? <div className="alert alert-secondary" role="alert">{flashMsg}</div> : null }
        </>
    )
}

export default Message;