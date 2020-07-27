

function Message(props) {
    let msg;
    switch (props.msg) {
        case "home":
            msg = "Home Page";
            break;
        case "login":
            msg = "Please Log In";
            break;
        case "register":
            msg = "Register Page";
            break;
        case "logout":
            msg = "You've loged Out";
            break;
        case "profile":
            msg = "Your Profile";
            break;
        case "upload":
            msg = "Upload an image";
            break;
        default:
            msg = "";
    }


return msg

}

export default Message;