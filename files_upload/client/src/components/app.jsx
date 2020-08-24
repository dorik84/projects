import React, { useState, useEffect } from "react";
import axios from 'axios';
import Navbar from './navbar.jsx';
import Loading from './loading.jsx';
import Messages from './messages.jsx';
import {
    BrowserRouter as Router,
    useLocation
  } from 'react-router-dom';

const App = () => {
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [flashMsg, setFlashMsg] = useState([]);


    

    const changeState = (newState) => {
        setUser(newState.user);
        setImages(newState.images);
    }

    const props = {user, setUser, images, setImages, isLoading, setIsLoading, flashMsg, setFlashMsg, changeState};

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
                changeState(res.data);
                setIsLoading(false);
            };
        })
        // .catch (err => console.log(err));
        .catch (err => {
            // console.log(err.response);
            if (isFetching && err.response && err.response.status === 500) {
                setFlashMsg([...flashMsg, {
                    text : "Problem with database connection",
                    timeStamp : Date.now(),
                    error: true
                }]);
                setIsLoading(false);
            }  
        });
    }
    setIsLoading(true);
    fetchingData();
    return () => isFetching = false
    },[])
    
    return (
        <React.Fragment>
            <Messages flashMsg = {flashMsg} setFlashMsg = {setFlashMsg} />
            <Navbar {...props} /> 
            {isLoading ? <Loading />: null}
        </React.Fragment>
    )
}

export default App


