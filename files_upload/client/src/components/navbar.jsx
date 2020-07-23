import React from 'react';
import axios from "axios";


function Navbar(props) {
    
    const {user} = props.data;
    const changeState = props.changeState;
    let greeting = "";


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

    const isLoggedIn = ()=>{
        if (user){
            greeting = `Hello, ${user}`;
            return (
                <React.Fragment>
                    <li className="nav-item">
                        <a className="nav-link" href="/profile" onClick={(e)=>redirect(e)}>Profile</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/upload" onClick={(e)=>redirect(e)}>Upload</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/auth/logout" onClick={(e)=>redirect(e)}>Log out</a>
                    </li>
                </React.Fragment>)
        } else {
            greeting = "Please log in";
            return(
                <React.Fragment>
                    <li className="nav-item">
                        <a className="nav-link" href="/auth/login" onClick={(e)=>redirect(e)}>Login</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="/auth/register"  onClick={(e)=>redirect(e)}>Register</a>
                    </li>

                </React.Fragment>
            )
        }
    }



    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/" onClick={(e)=>redirect(e)}>Home <span className="sr-only">(current)</span></a>
                        </li>
                        {isLoggedIn()}
                    </ul>
                <span className="navbar-text">
                    {greeting}
                </span>
            </div>
        </nav>
    )
        
}

    

export default Navbar;
