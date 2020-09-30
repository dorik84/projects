import React from 'react';

const Loading = (props) => {
    const {progress} = props;
    return ( 
        <div className="loading d-flex justify-content-center align-items-center">
            <button className="btn btn-link" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading... {progress}
            </button>
        </div>
     );
}
 
export default Loading;