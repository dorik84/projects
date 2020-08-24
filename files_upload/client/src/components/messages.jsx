import React, {useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import {useTransition, animated} from 'react-spring'

const SingleMsg = (props) => {
    const {msg} = props;
    const transitions = useTransition(msg, null, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 }
    })
    return transitions.map(({ item, key, props }) => 
            <animated.div 
                key={key} 
                className = {item.error? "alert alert-danger p-1 m-1" : "alert alert-success p-1 m-1"} 
                style={props}>
                    { (item.error) ? < FontAwesomeIcon icon={faTimes} /> : < FontAwesomeIcon icon={faCheck} /> } {item.text}
            </animated.div>);
}
 

function Messages(props) {
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
            { flashMsg.map((msg,key) => <SingleMsg key={key} msg={msg}/> )}
        </div>
    )
}

export default Messages;