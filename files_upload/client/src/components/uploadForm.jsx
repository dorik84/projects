import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { CSSTransitionGroup } from 'react-transition-group'


const UploadForm = (props) => {

    const setIsLoading = props.setIsLoading;

    const [flashMsg, setFlashMsg] = useState ([]);
    const [lbl, setLbl] = useState("Choose File...");
    const [formData, setFormData] = useState (null);
    // create form and fetch data
    
    
    const onSubmit = async (e)=> {
        setIsLoading(true);
        e.preventDefault();
        const imgForm = new FormData();
        let image = document.querySelectorAll("input")[0].files[0];
        imgForm.append("image", image);
        await setFormData(imgForm);
    }

    useEffect( ()=>{
        let isFetching = true;
        
        const fetchingData = async() => {
        await axios({
            url: "http://localhost:5000/upload/images",
            method: "post",
            data: formData,
            withCredentials: true
        })
        .then(res => {
            console.log(res.data);
            if (isFetching) {
                setFlashMsg([...flashMsg, res.data.msg]);
                setLbl ("Choose File...");
                setIsLoading(false);
            }
        }).catch(err => {
            console.log(err);
            setFlashMsg([...flashMsg, err.msg]);
            setIsLoading(false);
        });
    }
        if(formData){
            fetchingData();
        }
        
        return () => isFetching = false;
    },[formData])

    //set name of the uploading file in the input field
    const changeLbl = (e) => {
        const fileName = e.target.value;
        setLbl (fileName);
    }

    //show flash masseges and delete them in 5 sec
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
                <div className=" pt-3 container">
                    <form action="/upload/images" method="post" encType="multipart/form-data">
                        <div className="input-group">
                            <div className="custom-file">
                                <input name ="image" type="file" className="custom-file-input" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" onChange ={(e)=>{changeLbl(e)}}></input>
                                <label className="custom-file-label" htmlFor="inputGroupFile04">{lbl}</label>
                            </div>   
                            <div className="input-group-append">
                                <input className="btn btn-outline-secondary" type="submit" id="inputGroupFileAddon04" onClick={(e)=>onSubmit(e)} />
                            </div>
                        </div>
                    </form>
                    <img src="" alt=""/>
                </div>
            </>
        )
}

export default UploadForm;


