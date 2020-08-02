import React, {useEffect, useState} from 'react';
import axios from "axios";
import { CSSTransitionGroup } from 'react-transition-group'

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
    const {setIsLoading, changeState} = props;

    const [flashMsg, setFlashMsg] = useState([]);

    let greeting = "";
    let content = "";

    const logout = (e) => {
        let url = e.target.href.replace("3000", "5000");
        e.preventDefault();
        axios({
            method: "GET",
            withCredentials: true,
            url: url
        })
        .then(res => {
            console.log(res.data);
            setFlashMsg([...flashMsg, res.data.msg]);
            changeState(res.data);
        })
    }

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
    } else {
        greeting = "Please log in";
        content =
            <React.Fragment>
                <li className="nav-item">
                    <Link className="text-warning nav-link" to="/auth/login">Login</Link>
                </li>
                <li className="nav-item">
                    <Link className="text-warning nav-link" to="/auth/register">Register</Link>
                </li>
            </React.Fragment>
    }
    
        //renders massages and deletes them in 5 sec
        const renderMessages = 
        flashMsg.map((msg,index) => { 
            let del = {};
            del[index] = setTimeout(() => {
                let temp = [...flashMsg].filter(element => element !== msg);
                setFlashMsg(temp);
            } ,5000);

                return <div key={index} className="alert alert-success" role="alert">{msg}</div>
            })


    return (
        <Router>

            <ul className=" d-flex nav nav-tabs bg-dark">
                <li className="nav-item active">
                    <Link className="text-warning nav-link" to="/" >Home<span className="sr-only">(current)</span></Link>
                </li>
                {content}
                <span className="ml-auto p-2 text-white navbar-text">
                    {greeting}
                </span>
            </ul>


            <CSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout ={500}
                transitionLeaveTimeout ={500}
                transitionEnter={true}
                transitionLeave={true}>
                {renderMessages}
            </CSSTransitionGroup>

            <Switch>
                <Route exact path="/">
                    <h3>Homepage</h3>
                </Route>
                <Route  path="/auth/login">
                    <Form page = {"login"} changeState = {changeState} user={user} />
                </Route>
                <Route  path="/auth/register">
                    <Form page = {"register"} changeState = {changeState} setFlashMsg = {setFlashMsg} user={user} />
                </Route>
                <Route  path="/upload">
                    <UploadForm setIsLoading={setIsLoading} />
                </Route>
                <Route  path="/profile">
                    <Profile images = {images} changeState = {changeState} setIsLoading = {setIsLoading}/>
                </Route>
            </Switch>

        </Router>
    )
}

export default Navbar;
