import React, { useState, useEffect } from "react";
import axios from 'axios';
import Navbar from './navbar.jsx';
import Loading from './loading.jsx';
import Message from './message.jsx';


const App = () => {
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [flashMsg, setFlashMsg] = useState([]);
 
    const state = { user, images, flashMsg };

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
                    timeStamp : Date.now() 
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
            <Message flashMsg = {flashMsg} setFlashMsg = {setFlashMsg} />
            <Navbar state = {state} changeState = {changeState} setIsLoading = {setIsLoading} setFlashMsg = {setFlashMsg} flashMsg = {flashMsg} />
            {isLoading ? <Loading />: null}
        </React.Fragment>
    )
}

export default App


