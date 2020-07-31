import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { CSSTransitionGroup } from 'react-transition-group'

function Form(props) {
    let { page, changeState} = props;

    const [requestUrl, setRequestUrl] = useState(null);
    const [flashMsg, setFlashMsg] = useState([]);
    const [formRecords, setformRecords] = useState(null);
    
    React.useEffect(() => {
        let url = "http://localhost:5000/auth/login"
        if (page === "register") {
            url = "http://localhost:5000/auth/register";
        }
        setRequestUrl(url);
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
                    setFlashMsg([...flashMsg, res.data.msg || res.data.errors]);
                    changeState(res.data);
                }
            })
            .catch (err => {
                if (isFetching) {
                console.log(err);
                setFlashMsg([...flashMsg, err]);
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

    //render flash messages and delete them in 5 sec
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
        <>
                <CSSTransitionGroup
                    transitionName="example"
                    transitionEnterTimeout ={500}
                    transitionLeaveTimeout ={500}
                    transitionEnter={true}
                    transitionLeave={true}>
                    {renderMessages}
                </CSSTransitionGroup>

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
