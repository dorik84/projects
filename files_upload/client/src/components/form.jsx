import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './form.css';

import {useSpring, animated} from 'react-spring';
import { Redirect } from 'react-router-dom';

function Form(props) {
    let { user, page, changeState, setFlashMsg, flashMsg, setIsLoading} = props;

    const [requestUrl, setRequestUrl] = useState(null);
    const [formRecords, setformRecords] = useState(null);

    

   // applies some changes on initial page load depending on whether it is a "login" or "register" page
    useEffect(() => {
        let isLoading = true;
        let url = "http://localhost:5000/auth/login"
        if (page === "register") {
            url = "http://localhost:5000/auth/register";
        }
        if (isLoading)
            setRequestUrl(url);
            return () => isLoading = false;
    }, [page]);

    //reset form function
    const resetForm = () => {
        document.querySelectorAll('form')[0].reset();
        setFocusOnEmail(false);
        setFocusOnPassword (false);
    }

    //event handler upon clicking on submit button
    const onSubmit = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let myForm = document.getElementsByTagName('form')[0];
        const formData = new FormData(myForm);
        setformRecords(formData);
    }

    useEffect(()=>{
        let isFetching = true;

        const fetchData = async () => {
            await axios({
                url: requestUrl,
                method: "post",
                data: formRecords,
                withCredentials: true })
            .then ((res) => {
                console.log(res.data);
                resetForm();

                if (isFetching) {
                    //error handler for express validator errors
                    if(res.data.errors){

                        if (!Array.isArray(res.data.errors)) {
                            setFlashMsg([...flashMsg, {
                                text : res.data.errors,
                                timeStamp : Date.now(),
                                error: true
                                }]);
                        } else {
                            let newFlashMsg = [...flashMsg];
                            res.data.errors.forEach(err => {
                                if (err.msg!=="Invalid value")
                                newFlashMsg.push({
                                    text : err.msg,
                                    timeStamp : Date.now(),
                                    error: true
                                });
                            });
                            setFlashMsg(newFlashMsg);
                            }

                    } else {
                        setFlashMsg([...flashMsg, {
                            text : res.data.msg,
                            timeStamp : Date.now(),
                            error: false
                        }]);
                        changeState(res.data);

                    }
                    
                }
                setIsLoading(false);
            })
            .catch (err => {
                //error handler for anauthorized access or connection problem
                console.log(err.response);
                if (isFetching && err.response){
                    let errMsg = "";
                    if ( err.response.status === 401) {
                        errMsg =  "No match with provided credentials";
                    } else if ( err.response.status === 500) {
                        errMsg = "Connection problem has occured";
                    }
                    setFlashMsg([...flashMsg, {
                        text : errMsg,
                        timeStamp : Date.now(),
                        error: true
                    }]);
                    setIsLoading(false);
                }
            });
        }
        if (formRecords) {
            fetchData();   
        }
        return () => isFetching = false;
        
    },[formRecords])




    //----------------------rendering either register or login page
    let btnMsg = "Log In";

    if (page === "register")  {
        btnMsg = "Register";
    };


    //-----------------animation for input fields
    const [focusOnEmail,setFocusOnEmail]=useState(false);
    const [focusOnPassword,setFocusOnPassword]=useState(false);

    const emailProps = useSpring({
            transform:  focusOnEmail? 'translateY(-20px)':'translateY(0px)',
            color: focusOnEmail?'#03e9f4':'#fff' ,
            fontSize: focusOnEmail? '12px': '16px'
        })

    const passwordProps = useSpring({
            transform:  focusOnPassword? 'translateY(-20px)':'translateY(0px)',
            color: focusOnPassword?'#03e9f4':'#fff' ,
            fontSize: focusOnPassword? '12px': '16px'
        })
        
    const onBlurHandler = (e)=>{
        if(!e.currentTarget.value) {
            if(e.currentTarget.name == 'email')
                setFocusOnEmail(false);
            else
                setFocusOnPassword (false);
        }
    }


    return (
        <>
            {user? <Redirect to="/" />: null}
            <div className="login-box">
                <h2>{btnMsg}</h2>
                <form action={requestUrl} method="post">
                    <div className="user-box">
                        <input type="text" name="email" required="" onFocus={()=>setFocusOnEmail(true)} onBlur={(e)=>onBlurHandler(e)} />
                        <label ><animated.div style={emailProps}>Email</animated.div></label>
                    </div>
                    <div className="user-box">
                        <input type="password" name="password" required="" onFocus={()=>setFocusOnPassword(true)} onBlur={(e)=>onBlurHandler(e)} />
                        <label><animated.div style={passwordProps}>Password</animated.div></label>
                    </div>
                    <div type="submit" className="btn" onClick={(e)=>onSubmit(e)}  >
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        Submit
                    </div>
                </form>
            </div>
{/* //============================================================================= */}
            {/* <div className="container">
                <form className="col-6 pt-3" action={requestUrl} method="post">
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" className="form-control" id="exampleInputPassword1" />
                </div>

                    <input type="submit" className="btn btn-primary" onClick={(e)=>onSubmit(e)} value={btnMsg} />
                </form>
            </div> */}

        </>
    );

}

export default Form;
