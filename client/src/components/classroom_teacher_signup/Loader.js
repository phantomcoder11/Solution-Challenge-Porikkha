import React from 'react'
import Loader from "react-loader-spinner";
import '../../css/classhall.css';

const NoResults = () => {
    return (
        <div style={{color:'white',fontSize:'2rem',marginTop:"100px"}}>
                <Loader
                
                 type="ThreeDots"
                 color="#4fc3f7"
                 height={100}
                 width={100}
             />
        </div>
    )
}
export default NoResults;