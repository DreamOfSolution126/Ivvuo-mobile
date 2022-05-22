import React from 'react';
import { FETCHING_DATA, FETCHING_DATA_SUCCESS, FETCHING_DATA_FAILURE } from '../constants';
import { AsyncStorage } from 'react-native';
const PATH = 'SIGNIN'

const initialState = {
    data:{ message:'' },
    isFetching:false,
    error:false
}  
export default dataReducer = (state = initialState, action) => {
    switch(action.type){
        case 'VALIDATETOKEN':
            return {
                ...state,
                data:action.data,
                isFetching:false
            }
        case FETCHING_DATA+PATH:
            return {
                ...state, 
                data: [], 
                isFetching:true
            }
        case FETCHING_DATA_SUCCESS+PATH:
            return {
                ...state,
                data: action.data,
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
                data:{ message:'' },
                isFetching:false,
                error:false
            }
        case 'SETTOKEN':
            return {
                ...state,
                data: action.data,
            }
        default:  return state
    }
}