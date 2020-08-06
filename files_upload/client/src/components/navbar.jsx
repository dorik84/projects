import React, {useEffect, useState} from 'react';
import axios from "axios";

import Form from './form.jsx';
import UploadForm from "./uploadForm.jsx";
import Profile from './profile.jsx';


import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch,
  } from 'react-router-dom';


function Navbar(props) {
    
    const {user, flashMsg} = props.state;
    const {setIsLoading, changeState, setFlashMsg} = props;
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = (e) => {
        e.preventDefault();
        setIsLoggingOut(true);
    }

    useEffect(()=>{
        let isLoading = true;
        const fetching = async () => {
            await axios({
                method: "GET",
                withCredentials: true,
                url: "http://localhost:5000/auth/logout"
            })
            .then(res => {
                if (isLoading) {
                    console.log(res.data);
                    setFlashMsg([...flashMsg, {
                        text : res.data.msg,
                        timeStamp : Date.now() 
                    }]);
                    changeState(res.data);
                    setIsLoggingOut(false);
                }
            })
            .catch(err=>{
                console.log(err)
                if (isLoading){
                    setIsLoggingOut(false);
                }
            }) 
        }
        if (isLoggingOut) 
            fetching();
            
        return () => isLoading = false;
    },[isLoggingOut])

    const showMenuAndGreeting = () => {
        let greeting = "Please log in";

        let content =
            <React.Fragment>
                <li className="nav-item">
                    <Link className="text-warning nav-link" to="/auth/login">Login</Link>
                </li>
                <li className="nav-item">
                    <Link className="text-warning nav-link" to="/auth/register">Register</Link>
                </li>
            </React.Fragment>

        if (user){
            greeting = `Hi, ${user}`;
            content = 
                <React.Fragment>
                    <li className="nav-item">
                        <Link className="text-warning nav-link" to="/profile" >Profile</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="text-warning nav-link" to="/upload" >Upload</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="text-warning nav-link" to="/auth/logout" onClick={(e)=>logout(e)}>Log out</Link>
                    </li>
                </React.Fragment>
        }
        return [greeting, content];
    }

    return (
        <Router>

            <ul className=" d-flex nav nav-tabs bg-dark">
                <li className="nav-item active">
                    <Link className="text-warning nav-link" to="/" >Home<span className="sr-only">(current)</span></Link>
                </li>
                {showMenuAndGreeting()[1]}
                <span className="ml-auto p-2 text-white navbar-text">
                    {showMenuAndGreeting()[0]}
                </span>
            </ul>


            <Switch>
                <Route exact path = "/">
                    <h3>Homepage</h3>
                </Route>
                <Route  path = "/auth/login">
                    <Form page = {"login"} changeState = {changeState} setFlashMsg = {setFlashMsg} flashMsg = {flashMsg} user = {user} />
                </Route>
                <Route  path ="/auth/register">
                    <Form page = {"register"} changeState = {changeState} setFlashMsg = {setFlashMsg} flashMsg = {flashMsg} user = {user} />
                </Route>
                <Route  path="/upload">
                    <UploadForm setIsLoading = {setIsLoading} setFlashMsg = {setFlashMsg} flashMsg = {flashMsg}/>
                </Route>
                <Route  path = "/profile">
                    <Profile {...props} />
                </Route>
            </Switch>

        </Router>
    )
}

export default Navbar;
