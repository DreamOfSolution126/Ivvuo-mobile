import React from 'react';
import { AsyncStorage } from 'react-native';
import Toast from 'react-native-simple-toast';
import { API } from '../constants'


export default async (body)=> {
    try {
        let email = body.email.trim()

        const response = await fetch(API+'signin', {
                method:'POST',
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password:body.password
                })
            })
            
        const data = await response.json()
        
        if(!data.token){
            Toast.showWithGravity(data.message, Toast.LONG, Toast.BOTTOM)
        }

        await AsyncStorage.setItem('token', JSON.stringify({data:data}))

        return data

    } catch ( e ) {
        const error = await e.json()
        
        if(error.mensaje){
            Toast.showWithGravity(error.message, Toast.LONG, Toast.BOTTOM)
        } else {
            Toast.showWithGravity(JSON.stringify(error), Toast.LONG, Toast.BOTTOM)
        }
        
        return error
    }
    // let email = body.email.trim()
    // return await fetch(API+'signin', {
    //     method:'POST',
    //     headers:{
    //         'Accept':'application/json',
    //         'Content-Type':'application/json'
    //     },
    //     body: JSON.stringify({
    //         email: email,
    //         password:body.password
    //     })
    // }).then( (response) => response.json() )
    // .then( (resJson)=>{
    //     Toast.showWithGravity(resJson.message, Toast.LONG, Toast.BOTTOM)
    //     try {
    //         await AsyncStorage.setItem('token', JSON.stringify({data:resJson}))
    //     } catch(error){
    //         Toast.showWithGravity(error.message, Toast.LONG, Toast.BOTTOM)
    //     }
    //     return resJson
        
    // } ).catch( (error)=>{
    //     Toast.showWithGravity(error, Toast.LONG, Toast.BOTTOM)
    //     return error
    // } )
}
