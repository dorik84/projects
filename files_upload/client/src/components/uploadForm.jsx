import React, {useEffect, useState} from 'react';
import axios from 'axios';


const UploadForm = (props) => {

    const {setIsLoading, setFlashMsg, flashMsg} = props;

    const [lbl, setLbl] = useState("Choose File...");
    const [formData, setFormData] = useState (null);
    // create form and fetch data
    
    
    const onSubmit = (e) => {
        setIsLoading(true);
        e.preventDefault();
        const imgForm = new FormData();
        let image = document.querySelectorAll("input")[0].files[0];
        imgForm.append("image", image);
        setFormData(imgForm);
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
                setFlashMsg([...flashMsg, {
                    text : res.data.msg,
                    timeStamp : Date.now() 
                }]);
                setLbl ("Choose File...");
                setIsLoading(false);
            }
        }).catch(err => {
            if (isFetching) {
                console.log(err);
                setFlashMsg([...flashMsg, {
                    text : err.msg,
                    timeStamp : Date.now() 
                }]);
                setIsLoading(false);
            }
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


        return (
            <>
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


