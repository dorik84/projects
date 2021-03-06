import React, {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit} from '@fortawesome/free-solid-svg-icons';

const EditBtn = (props) => {

    const { img, setImgToEdit} = props;

    //handler to edit selected image
    const onEdit = (e) => {
        e.preventDefault();  
        console.log("url to edit " + img.original);
        setImgToEdit({url: img.original, name: img.name});   
    }

    return ( <div className="btn btn-info btn-sm" onClick = {(e) => {onEdit(e)}}><FontAwesomeIcon icon={faEdit} /> Edit</div> );
}
 
export default EditBtn;
