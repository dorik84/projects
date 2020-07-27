import React, {useEffect, useState} from 'react';
import axios from 'axios';


function Form(props) {
    let { page, user, changeState} = props;

    const [innerUser, setUser] = useState( user || null );
    const [innerImages, setImages] = useState([]);
    
    const fetchData = async (formData,url) => {
        await axios({
            url: url,
            method: "post",
            data: formData,
            withCredentials: true })
        .then ((res) => {
            console.log(res);
            
            setUser(res.data.user);
            setImages(res.data.images);

            })
        .catch (err => console.log(err));
    }

    useEffect(()=>{
        changeState({user:innerUser, images:innerImages});
    },[innerUser])




    //----------------------rendering either register or login page

    let server = "http://localhost:5000";
    let url = server + "/auth/login";
    let btnMsg = "Log In";

    if (page === "register")  {
        url = server +"/auth/register";
        btnMsg = "Register";
    };

    const sumbitForm = (e,url) => {
        e.preventDefault();
        let myForm = document.getElementsByTagName('form')[0];
        const formData = new FormData(myForm);
        fetchData(formData,url);
    }


    return (
        <>
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
        </>
    );

}

export default Form;
