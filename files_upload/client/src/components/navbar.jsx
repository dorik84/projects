import React, {useEffect, useState} from 'react';
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faAddressCard, faSignOutAlt, faHome, faFileUpload, faSignInAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons'
// import {useSpring, useTransition, animated} from 'react-spring';
import {useSpring, animated} from 'react-spring';
import Form from './form.jsx';
import Profile from './profile.jsx';


import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch,
  } from 'react-router-dom';




function Navbar(props) {
    
    const {setIsLoading, changeState, flashMsg, setFlashMsg, user } = props;
    const [isLoggingOut, setIsLoggingOut] = useState(false);


    //event handler on Logout button
    const logout = (e) => {
        e.preventDefault();
        setIsLoggingOut(true);
    }

    //hook which triggers when the logout button is pressed
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
                        timeStamp : Date.now(),
                        error: false
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

    //--------animation
    const [onHover,setOnHover] = useState(false);
    const propys = useSpring({
        // transform:  onHover? 'scale(1.1)': 'scale(1)',
        filter: onHover? 'blur(5rem)': 'blur(0px)',
        letterSpacing: onHover? '10rem': '0px'
    
    }
    )

    //function which switches content of the menu depending on whether user is logged in or not
    const showMenuAndGreeting = () => {
        let greeting = "Please log in";

        let content =
            <>
                <li className="nav-item" onMouseEnter={()=>setOnHover(true)} onMouseLeave={()=>setOnHover(false)} >
                <Link className="text-warning nav-link" to="/auth/register"><FontAwesomeIcon icon={faUserPlus} /><animated.div style={propys}> <span style={{position:"absolute"}}>Register</span></animated.div></Link>
                </li>
                <li className="nav-item">
                    <Link className="text-warning nav-link" to="/auth/login"><FontAwesomeIcon icon={faSignInAlt} /> Login</Link>
                </li>
            </>

        if (user){
            greeting = <span><FontAwesomeIcon icon={faUserCircle} /> You are {user}</span>;
            content = 
                <React.Fragment>
                    <li className="nav-item">
                        <Link className="text-warning nav-link" to="/profile" ><FontAwesomeIcon icon={faAddressCard} /> Profile</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="text-warning nav-link" to="/auth/logout" onClick={(e)=>logout(e)}><FontAwesomeIcon icon={faSignOutAlt} /> Log out</Link>
                    </li>
                </React.Fragment>
        }
        return [greeting, content];
    }


    return (
        <Router>

            <ul className=" d-flex nav nav-tabs bg-dark mb-3">
                <li className="nav-item active">
                    <Link className="text-warning nav-link" to="/" >
                        <FontAwesomeIcon icon={faHome} /> Home
                        <span className="sr-only">(current)</span>
                    </Link>
                </li>
                {showMenuAndGreeting()[1]}
                <span className="ml-auto p-2 text-white navbar-text">
                    {showMenuAndGreeting()[0]}
                </span>
            </ul>

            {/* {transitions.map(({ item, key, props }) => 
              item && <animated.div key={key} style={props}>*/}
              {/* <animated.div style={propys}> */}
                    <Switch > 
                        <Route exact path = "/">
                            <h3 style={{color:"white"}}>Homepage</h3>
                        </Route>
                        <Route  path = "/auth/login">
                            <Form page = {"login"} {...props} />
                        </Route>
                        <Route  path ="/auth/register">
                            <Form page = {"register"} {...props} />
                        </Route>
                        <Route  path = "/profile">
                            <Profile {...props} />
                        </Route>
                    </Switch>
                {/* </animated.div> */}
        </Router>
    )
}

export default Navbar;
