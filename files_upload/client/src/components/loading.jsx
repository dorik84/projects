import React from 'react';

const Loading = () => {
    return ( 
        <div className="loading d-flex justify-content-center align-items-center">
            <button className="btn btn-link" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...
            </button>
        </div>
     );
}
 
export default Loading;