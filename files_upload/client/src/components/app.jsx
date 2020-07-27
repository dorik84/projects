import React, { useState, useEffect } from "react";
import axios from 'axios';

import Navbar from './navbar.jsx';


const App = () => {
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const state = { user, images};

    const changeState = async(newState) => {
        await setUser(newState.user);
        await setImages(newState.images);
    }

useEffect( ()=> {
    const fetchingData = async () => {
        await axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:5000"
        })
        .then(res => {
            console.log(res.data);
            changeState(res.data);
        })
    }
    fetchingData()},[])
    
    return (
        <React.Fragment>
            <Navbar data = {state} changeState = {changeState} /> 
        </React.Fragment>
    )
}

export default App


