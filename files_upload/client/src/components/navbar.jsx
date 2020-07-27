import React from 'react';
import axios from "axios";

import Message from './message.jsx';
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
    
    const {user,images} = props.data;
    const changeState = props.changeState;
    let greeting = "";
    let content = "";

    const redirect = (e) => {
        let url = e.target.href.replace("3000", "5000");
        e.preventDefault();
        axios({
            method: "GET",
            withCredentials: true,
            url: url
        })
        .then(res => {
            console.log(res.data);
            changeState(res.data);
        })
    }

    if (user){
        greeting = `You are logged in as ${user}`;
        content = 
            <React.Fragment>
                <li className="nav-item">
                    <Link className="nav-link" to="/profile" >Profile</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/upload" >Upload</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/auth/logout" onClick={(e)=>redirect(e)}>Log out</Link>
                </li>
            </React.Fragment>
    } else {
        greeting = "Please log in";
        content =
            <React.Fragment>
                <li className="nav-item">
                    <Link className="nav-link" to="/auth/login">Login</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/auth/register">Register</Link>
                </li>
            </React.Fragment>
    }
    

    return (
        <Router>

            <nav className="navbar navbar-dark bg-dark">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/" >Home<span className="sr-only">(current)</span></Link>
                    </li>
                    {content}
                </ul>
                <span className="navbar-text">
                    {greeting}
                </span>
            </nav>

            <Switch>
                <Route exact path="/">
                    <Message msg = {"home"} />
                </Route>
                <Route  path="/auth/login">
                    <Message msg = {"login"} />
                    <Form page = {"login"} user={user} changeState = {changeState} />
                </Route>
                <Route  path="/auth/register">
                    <Message msg = {"register"} />
                    <Form page = {"register"} user={user} changeState = {changeState} />
                </Route>
                <Route  path="/upload">
                    <Message msg = {"upload"} />
                    <UploadForm />
                </Route>
                <Route  path="/profile">
                    <Message msg = {"profile"} />
                    <Profile images = {images} user = {user} changeState = {changeState}/>
                </Route>
            </Switch>

        </Router>
    )
}

export default Navbar;
