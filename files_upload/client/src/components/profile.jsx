import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Model_viewer from './model_viewer.jsx';


function Profile (props) {
    const {images, flashMsg} = props.state;
    const {setIsLoading, changeState, setFlashMsg} = props;

    // const {images, changeState, setIsLoading, setFlashMsg } = props;
    const [isAuthenticated, SetIsAuthenticated] = useState(false);
    const [imgToDelete, setImgToDelete] = useState(null);
    const [imgToModel, setImgToModel] = useState(null);

    //onDelete it sends request and gets new array of images and msg to display
    const onDelete = (e) => {
        e.preventDefault();
        let link = e.target.parentNode.previousSibling.src.replace("http://localhost:5000", "");
        console.log("url to delete "+link);
        setImgToDelete(link);
    };

    //handler to show selected image on 3d Model
    const onImage = (e) => {
        e.preventDefault();
        let link = e.target.parentNode.previousSibling.src;
        console.log("url to model" + link);
        setImgToModel(link);
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
                    timeStamp : Date.now() 
                }]);
                changeState(res.data);
                setIsLoading(false);
            }
        })
        .catch(err=>{
            console.log(err)
            if (isFetching){
                setIsLoading(false);
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
                    SetIsAuthenticated(true);
                    changeState(res.data);
                    setIsLoading(false);
                }
            })
            .catch (err => {
                console.log(err)
                if(isFetching ) {
                    setIsLoading(false);
                }
            });
        
            fetchData();
            
            return ()=> isFetching = false;
    }, [])

    //function that renders images or null
    const renderImages = () => {
        let content = "no images";
        if (!isAuthenticated) content = "You are not authorized for this content. Please login first.";
        if (images && images.length > 0) {
            content = images.map( (img, key) => {
                return (
                <div className="card d-flex flex-column" style={{width: 150}} key = {key}>
                    <img 
                        src = {"http://localhost:5000" + img} 
                        alt = "" 
                        className="card-img-top mx-auto d-block p-1 pb-0 rounded" 
                        style={{ height: 100, objectFit: "cover"}}
                    />
                    <div className="card-body d-flex justify-content-between p-1 ">
                        <div className="btn btn-primary btn-sm" onClick = {(e) => {onImage(e)}}>Show</div>
                        <div className="btn btn-danger btn-sm" onClick = {(e) => {onDelete(e)}}>Delete</div>
                    </div> 
                </div>
                )
            })
        }
        return content
    }


    return (
        <>
            <div className="d-flex flex-row">{renderImages()}</div>
            {imgToModel ? <Model_viewer imgToModel={imgToModel}/> : null}
        </>
    )
}

export default Profile;
