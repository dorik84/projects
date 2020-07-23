import React from 'react';
import axios from 'axios';


const onSubmit = async (e)=> {
    e.preventDefault();
    let image = document.querySelectorAll("input")[0].files[0];
    const formData = new FormData();
    formData.append("image", image);
    await axios({
        url: "http://localhost:5000/upload/images",
        method: "post",
        data: formData,
        withCredentials: true
    }).then(res => {
        console.log(res.data);

    }).catch(err => console.log(err));
}

const UploadForm = (props) => {
    const page = props.data.page;
    if (page === "upload") {
        return (
            <div className="container">
                <form action="/upload/images" method="post" encType="multipart/form-data">
                    <div className="input-group">
                        <div className="custom-file">
                            <input name ="image" type="file" className="custom-file-input" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04"></input>
                            <label className="custom-file-label" htmlFor="inputGroupFile04">Choose file</label>
                        </div>   
                        <div className="input-group-append">
                            <input className="btn btn-outline-secondary" type="submit" id="inputGroupFileAddon04" onClick={(e)=>onSubmit(e)} />
                        </div>
                    </div>
                </form>
                <img src="" alt=""/>
            </div>
            
        )
    } else return null;
}

export default UploadForm;


