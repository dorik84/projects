import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes} from '@fortawesome/free-solid-svg-icons';





const ShowBtn = (props) => {
    const { setImgToModel, setIsLoading, img} = props;

    //handler to show selected image on 3d Model
    const onShow = (e) => {
        e.preventDefault();  
        let link = `http://localhost:5000/` + img;
        console.log("url to model " + link);
        setImgToModel(link);
        setIsLoading(true);
    }

    return ( 
        <div className="btn btn-primary btn-sm" onClick = {(e) => {onShow(e)}}><FontAwesomeIcon icon={faCubes} /> Show</div>
    );
}
 
export default ShowBtn;

