import React from 'react';

function Message(props) {
    const {flashMsg} = props

    return (
        <>
            {/* <h3>{content}</h3> */}
            { flashMsg ? <div className="alert alert-secondary" role="alert">{flashMsg}</div> : null }
        </>
    )
}

export default Message;