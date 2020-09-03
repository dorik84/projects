import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './uploadForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const UploadForm = (props) => {
 
    const {setIsLoading, setFlashMsg, flashMsg, changeState} = props;

    // const [lbl, setLbl] = useState("Choose File...");
    const [formData, setFormData] = useState (null);
    // create form and fetch data
    
    
    const onSubmit = (e) => {
        
        e.preventDefault();
        const imgForm = new FormData();
        let image = document.querySelectorAll("input")[0].files[0];
        imgForm.append("image", image);
        setFormData(imgForm);
    }

    useEffect( ()=>{
        setIsLoading(true);
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
                setFlashMsg([...flashMsg, {
                    text : res.data.msg,
                    timeStamp : Date.now(),
                    error: res.data.error
                }]);
                
                if (!res.data.error) {
                    changeState(res.data);
                }
                setIsLoading(false);  
            }
        })
        .catch(err => {
            if (isFetching && err.response){
                if ( err.response.status === 500) {
                    setFlashMsg([...flashMsg, {
                        text : "Connection problem has occured",
                        timeStamp : Date.now(),
                        error: true
                    }]);
                }
                setIsLoading(false);
            }
        });
        }
        if(formData){
            fetchingData();
        }
        
        return () => {isFetching = false;
                        setIsLoading(false);} 
    },[formData])



    return (
        <>
            <form 
                action="/upload/images" 
                method="post" 
                encType="multipart/form-data" 
                className="ml-2 upload_form">
                    <input 
                        name ="image" 
                        type="file" 
                        className="file_input" 
                        id="inputGroupFile04" 
                        aria-describedby="inputGroupFileAddon04" 
                        onChange ={(e)=>{ onSubmit(e) }}>
                    </input>
                    <label 
                        className="file_label" 
                        htmlFor="inputGroupFile04">
                            <FontAwesomeIcon icon={faPlusCircle} />
                    </label>
            </form>
        </>
    )
}

export default UploadForm;


