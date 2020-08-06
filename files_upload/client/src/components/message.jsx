import React, {useEffect} from 'react';
import { CSSTransitionGroup } from 'react-transition-group';



function Message(props) {
    const {flashMsg, setFlashMsg } = props;

    useEffect(() => {
        let timer;
        if (flashMsg.length > 0) {
            timer = setInterval(()=>{
                setFlashMsg(
                    [...flashMsg].filter(msg => {
                        return Date.now() - msg.timeStamp <= 5000 
                    })
                )
            },1000)
        }
        return  () => clearTimeout(timer);
    },[flashMsg])



    return (
        <>
        { flashMsg.map((msg,key)=> {
            return (
                <div key = {key} className = "alert alert-success" role = "alert">{msg.text}</div>
            )
        })}
        </>
        // <CSSTransitionGroup
        //     transitionName="example"
        //     transitionEnterTimeout ={500}
        //     transitionLeaveTimeout ={500}
        //     transitionEnter={true}
        //     transitionLeave={true}>
        //     {flashMsg.map((msg,key)=> {
        //         return (
        //             <div key = {key} className = "alert alert-success" role = "alert">{msg.text}</div>
        //         )
        //     })}
        // </CSSTransitionGroup>

    )
}

export default Message;