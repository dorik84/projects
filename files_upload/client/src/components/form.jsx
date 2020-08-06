import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Redirect} from 'react-router-dom';

function Form(props) {
    let { user, page, changeState, setFlashMsg, flashMsg} = props;

    const [requestUrl, setRequestUrl] = useState(null);
    const [formRecords, setformRecords] = useState(null);
    
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
        document.querySelectorAll('form')[0].reset()
    }

    //event handler upon clicking on submit button
    const onSubmit = (e) => {
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
                    
                    if(res.data.errors){

                        if (!Array.isArray(res.data.errors)) {
                            setFlashMsg([...flashMsg, 
                                {text : res.data.errors,
                                 timeStamp : Date.now() }]);
                        } else {
                            let newFlashMsg = [...flashMsg];
                            res.data.errors.forEach(err => {
                                newFlashMsg.push({
                                    text : err.msg,
                                    timeStamp : Date.now()
                                });
                            });
                            setFlashMsg(newFlashMsg);
                            }

                    } else {
                        setFlashMsg([...flashMsg, {
                            text : res.data.msg,
                            timeStamp : Date.now() 
                        }]);
                        changeState(res.data);
                    }
                }
            })
            .catch (err => {
                // console.log(err.response);
                if (isFetching && err.response && err.response.status === 401) {
                    setFlashMsg([...flashMsg, {
                        text : "No match with provided credentials",
                        timeStamp : Date.now() 
                    }]);
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


    return (
        <>
            {user? <Redirect to='/' /> : null}

            <div className="container">
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
            </div>
        </>
    );

}

export default Form;
