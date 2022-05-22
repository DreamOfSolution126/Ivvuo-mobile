import {FETCHING_DATA, FETCHING_DATA_SUCCESS, FETCHING_DATA_FAILURE} from '../../constants';

const PATH = 'ORDERS';
const initialState = {
    data:[],
    isFetching:false,
    error:false
}

export default OrdersReducer = (state = initialState, action) => {
    switch(action.type){
        case FETCHING_DATA+PATH:
            return {
                ...state, 
                data: [], 
                isFetching:true
            }
        case FETCHING_DATA_SUCCESS+PATH:
            return {
                ...state,
                data:action.data,
                isFetching: false
            }
        case FETCHING_DATA_FAILURE+PATH:
            return {
                ...state,
                isFetching:false,
                error:true
            }
        case 'USERLOGOUT':
            return {
                initialState
            }
        default:  return state
    }
}