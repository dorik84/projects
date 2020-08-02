import React, { useState, useEffect } from "react";
import axios from 'axios';
import Navbar from './navbar.jsx';
import Loading from './loading.jsx';


const App = () => {
    const [user, setUser] = useState(null);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
 
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
                changeState(res.data);
                setIsLoading(false);
            };
        })
        .catch (err => console.log(err));
    }
    setIsLoading(true);
    fetchingData();
    return () => isFetching = false
    },[])
    
    return (
        <React.Fragment>
            <Navbar data = {state} changeState = {changeState} setIsLoading = {setIsLoading}/>
            {isLoading ? <Loading />: null}
        </React.Fragment>
    )
}

export default App


