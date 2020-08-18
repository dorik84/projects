import React, {useEffect} from 'react';
// import { CSSTransitionGroup } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'



function Message(props) {
    const {flashMsg, setFlashMsg } = props;

    useEffect(() => {
        let timer;
        if (flashMsg.length > 0) {
            timer = setInterval(()=>{
                setFlashMsg(
                    [...flashMsg].filter(msg => {
                        return Date.now() - msg.timeStamp <= 20000 
                    })
                )
            },1000)
        }
        return  () => clearTimeout(timer);
    },[flashMsg])



    return (
        <div className = "flashMsgContainer">
            { flashMsg.map((msg,key)=> {
                return (
                    <div 
                        key = {key}
                        className = {msg.error? "alert alert-danger p-1 m-1" : "alert alert-success p-1 m-1"} 
                        style={{ fontSize: 10}}
                        role = "alert">
                            {(msg.error)?<FontAwesomeIcon icon={faTimes} />:<FontAwesomeIcon icon={faCheck} />} { msg.text}
                    </div>
                )
            })}
        </div>
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