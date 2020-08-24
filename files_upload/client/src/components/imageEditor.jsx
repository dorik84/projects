
import React, {useEffect, useState, useRef} from 'react';
import FilerobotImageEditor from 'filerobot-image-editor';
import axios from 'axios';

const Editor = (props) => {
    const {imgToEdit} = props;

    


    const fetchingData = async(obj) => {
        console.log(obj.canvas);
        
        const imgForm = new FormData();
        imgForm.append("image", ( obj.canvas.toDataURL() ));
        await axios({
            url: "http://localhost:5000/upload/images",
            method: "post",
            data: imgForm,
            withCredentials: true
        })
        .then(res => {
            console.log(res.data);
        })
    }
    return ( 
        <FilerobotImageEditor
        show={true}
        src={imgToEdit}
        onClose={() => { }}
        
        config={{isLowQualityPreview: true, reduceBeforeEdit : {
            mode: 'auto'
          }}}
          onComplete={(img) => fetchingData(img)}
      />
    );
}
 
export default Editor;