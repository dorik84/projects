import React, {useState, useEffect} from 'react';
import axios from 'axios';


function Profile (props) {
    const {user, images, changeState} = props;

    const [isAuthenticated, SetIsAuthenticated] = useState(false);
    const [innerUser, setInnerUser] = useState(null);
    const [innerImages, setInnerImages] = useState (null);

    const onDelete = async (e) => {
        console.log("btn clicked");
        let link = e.target.parentNode.previousSibling.src.replace("http://localhost:5000", "") ;
        console.log("url to delete "+link);
        await axios({
            url: "http://localhost:5000/profile/delete",
            method: "POST",
            data: { image : link},
            withCredentials: true
        })
        .then(res => { 
            console.log(res.data)
            // setInnerImages(res.images);
            changeState(res.data);
        });
    };


    useEffect(()=>{
        const fetchingData = async () => {
            await axios({
                method: "GET",
                withCredentials: true,
                url: "http://localhost:5000/profile"
            })
            .then(res => {

                if(res.data.user) {
                    // setInnerUser(res.data.user);
                    // setInnerImages(res.data.images);
                    SetIsAuthenticated(true);
                    changeState(res.data);
                }
            })
        }
        fetchingData();
    }, [])


    const renderImages = () => {
        let content = "no images";
        if (isAuthenticated && images && images.length > 0) {
            content = images.map( (img, key) => {
                return (
                <div className="card" style={{width: 180}} key = {key}>
                    <img src = {"http://localhost:5000" + img} alt = "" className="card-img-top" />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <div className="btn btn-primary" onClick = {(e) => {onDelete(e)}}>Delete</div>
                    </div> 
                </div>
                )
            })
        }
        return content;
    }
    return <div className="d-flex flex-row">{renderImages()}</div>;
}

export default Profile;
