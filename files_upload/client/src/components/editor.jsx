
import React, {useEffect, useState, useRef} from 'react';
import FilerobotImageEditor from 'filerobot-image-editor';
import axios from 'axios';


const Editor = (props) => {
    const {changeState, setImgToEdit, imgToEdit,setFlashMsg,flashMsg,setIsLoading} = props;
    const [data, setData]=useState();


    const applyChanges = async (obj) => {
        console.log(obj.canvas);
        console.log("Editor after press "+imgToEdit);

        let imageBlob =  await new Promise(resolve => obj.canvas.toBlob(resolve, 'image/jpeg'))
        const formData = new FormData();
        // console.log(imgToEdit);
        formData.append("url", imgToEdit);
        formData.append("image", imageBlob, 'updated_image.jpeg');
        setData(formData);
        console.log( formData )
    }

    useEffect( ()=>{
        setIsLoading(true);
        let isFetching = true;

        const fetchData = async () =>
        await axios({
            url: "http://localhost:5000/upload/images",
            method: "patch",
            data: data,
            withCredentials: true
        })
        .then(res => {
            console.log(res.data);
            if (isFetching){
                setFlashMsg([...flashMsg, {
                    text : res.data.msg,
                    timeStamp : Date.now(),
                    error: false
                }]);
                changeState(res.data);
                setIsLoading(false);
                setImgToEdit(false);
            }
        })

        if (data ){
            console.log("isFetching")
            fetchData();
        }

        return ()=> isFetching = false;
    },[data])
    


    return ( 
        <FilerobotImageEditor
        show={imgToEdit}
        src={"http://localhost:5000"+imgToEdit}
        
        onClose={() => { 
            setIsLoading(false);
            setImgToEdit(false);
        }}
        config={{isLowQualityPreview: true, reduceBeforeEdit : {mode: 'auto'}, language:'en', tools:['adjust', 'effects', 'filters', 'rotate', 'crop', 'resize','shapes', 'image']
        }}
        onBeforeComplete={(img) => {applyChanges(img); return false}}
        onComplete ={()=> false}
      />
    );
}
 
export default Editor;