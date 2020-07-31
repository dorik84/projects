import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { CSSTransitionGroup } from 'react-transition-group'

function Profile (props) {
    const {images, changeState} = props;

    const [isAuthenticated, SetIsAuthenticated] = useState(false);
    // const [innerImages, setInnerImages] = useState (null);
    const [flashMsg, setFlashMsg] = useState([]);
    const [imgToDelete, setImgToDelete] = useState(null);

    //onDelete it sends request and gets new array of images and msg to display
    const onDelete = (e) => {
        let link = e.target.parentNode.previousSibling.src.replace("http://localhost:5000", "");
        console.log("url to delete "+link);
        setImgToDelete(link);
    };

    useEffect(()=>{
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
            
            // setInnerImages(res.data.images);
            if (isFetching){
                // SetIsAuthenticated(true);
                setFlashMsg([...flashMsg, res.data.msg]);
                changeState(res.data);
            }
        });

        if (imgToDelete){
            fetchData();
        }

        return ()=> isFetching =false;
    },[imgToDelete])
    

    // it sends request upon initial rendering to pass autontication 
    // then it sets the global state with new data from the response
    useEffect(()=>{
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
                }
            })
            .catch (err => console.log(err));
        
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
                <div className="card" style={{width: 180}} key = {key}>
                    <img src = {"http://localhost:5000" + img} alt = "" className="card-img-top" style={{width: 170, height: 170, objectFit: "cover"}}/>
                    <div className="card-body">
                        <div className="btn btn-primary" onClick = {(e) => {onDelete(e)}}>Delete</div>
                    </div> 
                </div>
                )
            })
        }
        return content
    }

    //renders massages and deletes them in 5 sec
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
            <h4>Your Profile Page</h4>
            <CSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout ={500}
                transitionLeaveTimeout ={500}
                transitionEnter={true}
                transitionLeave={true}>
                {renderMessages}
            </CSSTransitionGroup>
            
            <div className="d-flex flex-row">{renderImages()}</div>
        </>
    )
}

export default Profile;
