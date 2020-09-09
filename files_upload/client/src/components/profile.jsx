import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Model_viewer from './model_viewer_three_fiber.jsx';
import Editor from './editor.jsx';
import UploadForm from "./uploadForm.jsx";
import SingleImage from './singleImage.jsx';

import { Redirect } from 'react-router-dom';





function Profile (props) {
    const {user, setIsLoading, changeState, setFlashMsg, flashMsg, images} = props;
    const [stateImages, setStateImages] = useState();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [imgToModel, setImgToModel] = useState(null);
    const [imgToEdit, setImgToEdit] = useState(null);

    // useEffect(()=>{
    //     setStateImages(images);
    // },[])
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
    }, [])

    //function that renders images or null
    const renderImages = () => {
        let content =  
            <div className="card d-flex flex-column ml-2 mb-2" style={{width: 180}} >
                <img 
                    src = {"http://localhost:5000/noimages.jpg"} 
                    alt = "" 
                    className="card-img-top mx-auto d-block p-1 pb-0 rounded" 
                    style={{ height: "100%", objectFit: "contain"}}
                />
            </div>
    

        if (!isAuthenticated) content = "You are not authorized for this content. Please login first.";
         
        if (images && images.length > 0) {

            content = images.map( (img, key) => { 
                return (
                    <SingleImage img={img} key={img} setImgToModel={setImgToModel} setImgToEdit={setImgToEdit} {...props} />
                )
            })
        }

        return (
            <>
                {content}
                <UploadForm setIsLoading={setIsLoading} {...props}/>
            </>)
    }

    return (
        <>
            {!user? <Redirect to="/" />: null}

            <div className="d-flex flex-row flex-wrap">{renderImages()}</div>

            {imgToModel ?
                <Model_viewer imgToModel={imgToModel} setImgToModel={setImgToModel} setIsLoading={setIsLoading} /> 
                : null}

            <Editor changeState={changeState} setImgToEdit={setImgToEdit} imgToEdit={imgToEdit} setFlashMsg={setFlashMsg} flashMsg={flashMsg} setIsLoading={setIsLoading} />
        </>
    )
}

export default Profile;
