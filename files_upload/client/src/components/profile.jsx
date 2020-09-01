import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Model_viewer from './model_viewer_three_fiber.jsx';
import Editor from './imageEditor.jsx';
import UploadForm from "./uploadForm.jsx";

import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faCubes, faTrashAlt, faEdit} from '@fortawesome/free-solid-svg-icons'



function Profile (props) {
    const {user, setIsLoading, changeState, setFlashMsg, flashMsg, images} = props;
    const [stateImages, setStateImages] = useState(images);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [imgToDelete, setImgToDelete] = useState(null);
    const [imgToModel, setImgToModel] = useState(null);
    const [imgToEdit, setImgToEdit] = useState(null);

    //onDelete it sends request and gets new array of images and msg to display
    const onDelete = (e) => {
        e.preventDefault();
        let link = e.currentTarget.parentNode.previousSibling.src.replace("http://localhost:5000", "");
        console.log("url to delete "+link);
        setImgToDelete(link);
    };

    //handler to show selected image on 3d Model
    const onShow = (e) => {
        e.preventDefault();  
        let link = e.currentTarget.parentNode.previousSibling.src;
        console.log("url to model " + link);
        setImgToModel(link);
        setIsLoading(true);
    }

    //handler to edit selected image
    const onEdit = (e) => {
        e.preventDefault();  
        let link = e.currentTarget.parentNode.previousSibling.src;
        console.log("url to edit " + link);
        setImgToEdit(link);   
    }

    //sending request to delete the image, then retrieving response and change state
    useEffect(()=>{
        setIsLoading(true);
        let isFetching = true;
        const fetchData = async () =>
        await axios({
            url: "http://localhost:5000/profile/delete",
            method: "DELETE",
            data: { image : imgToDelete},
            withCredentials: true
        })
        .then(res => { 
            console.log(res.data)
            
            if (isFetching){
                setFlashMsg([...flashMsg, {
                    text : res.data.msg,
                    timeStamp : Date.now(),
                    error: false
                }]);
                changeState(res.data);
                setIsLoading(false);
            }
        })
        .catch(err=>{
            console.log(err)
            if (isFetching && err.response){
                if ( err.response.status === 500) {
                    setFlashMsg([...flashMsg, {
                        text : "Connection problem has occured",
                        timeStamp : Date.now(),
                        error: true
                    }]);
                setIsLoading(false);
                }
            }
        })

        if (imgToDelete){
            fetchData();
        }

        return ()=> isFetching =false;
    },[imgToDelete])
    

    // it sends request upon initial rendering to pass autontication 
    // then it sets the global state with new data from the response
    useEffect(()=>{
        setIsLoading(true);
        let isFetching = true;
        const fetchData = async () =>
            await axios({
                method: "GET",
                withCredentials: true,
                url: "http://localhost:5000/profile"
            })
            .then(res => {
                console.log(res.data);
                if(isFetching && res.data.user) {
                    setIsAuthenticated(true);
                    changeState(res.data);
                    setIsLoading(false);
                }
            })
            .catch(err=>{
                console.log(err)
                if (isFetching && err.response){
                    if ( err.response.status === 500) {
                        setFlashMsg([...flashMsg, {
                            text : "Connection problem has occured",
                            timeStamp : Date.now(),
                            error: true
                        }]);
                    setIsLoading(false);
                    }
                }
            })
        
            fetchData();
            
            return ()=> isFetching = false;
    }, [stateImages])

    //function that renders images or null
    const renderImages = () => {
        let content = <h5><FontAwesomeIcon icon={faTimesCircle} /> no images</h5>;

        if (!isAuthenticated) content = "You are not authorized for this content. Please login first.";

        if (images && images.length > 0) {
            content = images.map( (img, key) => {
                return (
                <div className="card d-flex flex-column ml-2 mb-2" style={{width: 180}} key = {key}>
                    <img 
                        src = {"http://localhost:5000" + img} 
                        alt = "" 
                        className="card-img-top mx-auto d-block p-1 pb-0 rounded" 
                        style={{ height: 100, objectFit: "cover"}}
                    />
                    <div className="card-body d-flex justify-content-between p-1 ">
                        <div className="btn btn-primary btn-sm" onClick = {(e) => {onShow(e)}}><FontAwesomeIcon icon={faCubes} /> Show</div>
                        <div className="btn btn-info btn-sm" onClick = {(e) => {onEdit(e)}}><FontAwesomeIcon icon={faEdit} /> Edit</div>
                        <div className="btn btn-danger btn-sm" onClick = {(e) => {onDelete(e)}}><FontAwesomeIcon icon={faTrashAlt} /> Delete</div>
                    </div> 
                </div>
                )
            })
        }
        return (
            <>
                {content}
                <UploadForm {...props}/>
            </>)
    }

    return (
        <>
            {!user? <Redirect to="/" />: null}
            <div className="d-flex flex-row flex-wrap">{renderImages()}</div>
            
            {imgToModel ? <Model_viewer imgToModel={imgToModel} setImgToModel={setImgToModel} setIsLoading={setIsLoading} /> : null}
            <Editor changeState={changeState} setImgToEdit={setImgToEdit} imgToEdit={imgToEdit} setFlashMsg={setFlashMsg} flashMsg={flashMsg} setIsLoading={setIsLoading} />
        </>
    )
}

export default Profile;
