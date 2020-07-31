import React, { useState, useEffect } from "react";
import axios from 'axios';
import Message from './message.jsx';
import Navbar from './navbar.jsx';


const App = () => {
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
 
    const state = { user, images};

    const changeState = (newState) => {
        setUser(newState.user);
        setImages(newState.images);
    }

useEffect( ()=> {
    let isFetching = true;
    const fetchingData = async () => {
        await axios({
            method: "GET",
            withCredentials: true,
            url: "http://localhost:5000"
        })
        .then(res => {
            console.log(res.data);
            if (isFetching){
                changeState(res.data)
            };
        })
        .catch (err => console.log(err));
    }
    fetchingData();
    return () => isFetching = false
    },[])
    
    return (
        <React.Fragment>
            <Navbar data = {state} changeState = {changeState} /> 
        </React.Fragment>
    )
}

export default App


