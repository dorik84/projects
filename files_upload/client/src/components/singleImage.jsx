import React, {useState, useEffect} from 'react';
import ShowBtn from './showBtn.jsx';
import DeleteBtn from './deleteBtn.jsx';
import EditBtn from './editBtn.jsx';
import {useTransition, animated} from 'react-spring';

const SingleImage = (props) => {

    const { img, setImgToModel, setIsLoading, setImgToEdit, flashMsg, setFlashMsg, changeState } = props;

    useEffect(()=>console.log (img),[])
    
    const transitions = useTransition(true, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        // config:{duration: 1000}
    })

    return ( 
        transitions.map(({ item, key, props }) => 
        item && <animated.div style={props} key = {img}>
            <div 
                className="card d-flex flex-column ml-2 mb-2" 
                style={{width: 180}} >
                
                    <img 
                        src = {"http://localhost:5000" + img.replace('/uploads', '/uploads/thumbnail')} 
                        alt = "" 
                        className="card-img-top mx-auto d-block p-1 pb-0 rounded" 
                        style={{ height: "100px", objectFit: "cover"}}
                    />
                    <div className="card-body d-flex justify-content-between p-1 ">
                        <ShowBtn  img={img} setImgToModel={setImgToModel} setIsLoading={setIsLoading} />
                        <EditBtn img={img} setImgToEdit={setImgToEdit} />
                        <DeleteBtn img={img} setIsLoading={setIsLoading} flashMsg={flashMsg} setFlashMsg={setFlashMsg} changeState={changeState}/>
                    </div> 
            </div>
        </animated.div> )
    )
}
 
export default SingleImage;

