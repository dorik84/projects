
import React, { useState, useEffect } from "react";
import axios from 'axios';


import Navbar from './navbar.jsx';
import Form from './form.jsx';
import Images from './images.jsx';
import Message from './message.jsx';
import UploadForm from "./uploadForm.jsx";

const App = () => {
    const [page, setPage] = useState("home");
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const state = {page, user, images};
        
    

    const changeState = async(newState) => {
        await setPage(newState.page);
        await setUser(newState.user);
        await setImages(newState.images);
    }
/**
    const fetchingData = async () => {
        await axios({
            method: "GET",
            withCredentials: true,
            url: "/"
        })
        .then(res => {
            console.log(res.data);
            changeState(res.data);
        })
    }

    fetchingData()
 */
    

    return (
        <React.Fragment>
            <Navbar data = {state} changeState = {changeState} /> 
            <Message data = {state} />
            <Form data = {state} changeState = {changeState} />
            <UploadForm data = {state}/>
            <Images data ={state} />
        </React.Fragment>
    )

}

export default App


