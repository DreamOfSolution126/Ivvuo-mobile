import React from 'react';
import { API } from '../../constants';
import { AsyncStorage } from 'react-native';
import { token } from '../../token';

const PATH = 'process/';


async function getProcess( body ){
    return await fetch(API+PATH+'getList', {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'authorization':'Bearer '+ token
        },
        body: JSON.stringify({
            account_code: body.account_code
        })
    }).then( (response) => response.json() )
    .then( (resJson)=>{
        
        return resJson
    } ).catch( (error)=>{
        console.log(error)
        return error
    } )
}

export {
    getProcess
}