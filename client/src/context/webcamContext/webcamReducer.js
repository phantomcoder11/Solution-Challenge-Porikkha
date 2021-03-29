import { CHECK_WEB } from '../types';

export default (state,{type,payload})=>{
   switch(type){
        case CHECK_WEB:
            return {
                ...state,
                check_web_cam:payload
            }
        
        default:
            return state;
   }
}