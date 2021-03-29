import React from 'react'
import Loader from "react-loader-spinner";

const LoaderC = () => {
    return (
            <tr style={{color:'black'}}>
               <td></td>
               <td><Loader
                    
                    type="ThreeDots"
                    color="#4fc3f7"
                    height={100}
                    width={100}
                    /></td>   
                <td></td>
                    
           </tr>
    )
}

export default LoaderC;
