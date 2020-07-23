import React from 'react';


function Images(props) {

    let {images, page} = props.data;
    let album;

    if (page === "profile") {

        if (images && images.length > 0) {
            album = images.map( img => {
                const uri = "http://localhost:5000" + img;
                return <img src = {uri} alt = "" key = {img}/>
            })
        } else album = "no images";

    } else album = "";


    return (
        <div> {album} </div>
    );

}

export default Images;
