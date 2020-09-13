import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const DeleteBtn = (props) => {

    const { setIsLoading, setFlashMsg, flashMsg, changeState, img} = props;
    const [imgToDelete, setImgToDelete] = useState(null);
    

    //sending request to delete the image, then retrieving response and change state
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


    //onDelete it sends request and gets new array of images and msg to display
    const onDelete = (e) => {
        setIsLoading(true);
        e.preventDefault();
        let link = img.original;
        console.log("url to delete "+imgToDelete);
        setImgToDelete(img.original);
    };
    
    return ( 
        <div className="btn btn-danger btn-sm" onClick = {(e) => {onDelete(e)}}><FontAwesomeIcon icon={faTrashAlt} /> Delete</div>
     );
}
 
export default DeleteBtn;
