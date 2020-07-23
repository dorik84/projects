import React, {useEffect} from 'react';
import axios from 'axios';

function Form(props) {
    let {data, changeState} = props;
    
    
    const fetchData = async (formData,url) => {
        await axios({
            url: url,
            method: "post",
            data: formData,
            withCredentials: true })
        .then (async (res) => {
            console.log(res);
            await changeState(res); })
        .catch (err => console.log(err));
    }

    const sumbitForm = (e,url) => {
        e.preventDefault();
        let myForm = document.getElementsByTagName('form')[0];
        const formData = new FormData(myForm);
        fetchData(formData,url);
    }

    //----------------------rendering either register or login page
    if (data.page === "register" || data.page === "login") {

        let server = "http://localhost:5000";
        let url = server + "/auth/login";
        let btnMsg = "Log In";

        if (data.page === "register")  {
            url = server +"/auth/register";
            btnMsg = "Register";
        };

        return (
            <form action={url} method="post">
                <div>
                    <label>Username:</label>
                    <input type="text" name="email"/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password"/>
                </div>
                <div>
                    <input type="submit" onClick={(e)=>sumbitForm(e,url)} value={btnMsg}/>
                </div>
            </form>
        );
    } else return null;
}

export default Form;
