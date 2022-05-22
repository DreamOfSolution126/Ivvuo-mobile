import React from 'react';
import { API } from '../constants';
import Toast from 'react-native-simple-toast';
import { AsyncStorage } from 'react-native';


const PATH = 'getUserByEmail';
const token = AsyncStorage.getItem('token')

export default async ( body ) => {
    
    return await fetch(API+PATH, {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'authorization':'Bearer '+ body.token
        },
        body: JSON.stringify({
            email:body.email
        })
    }).then( (response) => response.json() )
    .then( (resJson)=>{
        
        if(resJson.role !== 'workshop_customer'){
            AsyncStorage.clear()
            Toast.showWithGravity(`El acceso a la app sólo está permitido al rol de Centro de Servicio`, Toast.LONG, Toast.BOTTOM)
            return new Error('Rol no permitido')
        }
        
        try {
            AsyncStorage.setItem('dataUser', JSON.stringify({data:resJson}))
        } catch(error){
            Toast.showWithGravity(error.message, Toast.LONG, Toast.BOTTOM)
        }
        return resJson
    } ).catch( (error)=>{

        console.log(JSON.stringify(error))
        Toast.showWithGravity('Error al obtener los datos, Compruebe su conexión a internet, o cierre sesión e inicie nuevamente', Toast.LONG, Toast.BOTTOM)
        return error
    } )
}