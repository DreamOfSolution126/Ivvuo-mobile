import React from 'react';
import { BACKEND } from '../../constants';
import { AsyncStorage } from 'react-native';
import { token } from '../../token';
import Toast from 'react-native-simple-toast';

const PATH = 'orden/';

const asignarListado = async ( body ) => {
    try {
        const response = await fetch(`${BACKEND}${PATH}asignarListado`, {
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'authorization':'Bearer '+ token
            },
            body:JSON.stringify({
                idOrden: body.idOrden,
                idLista: body.idLista
            })
        })

        return response.json()

    } catch ( error ) {
        console.log(error)
        Toast.showWithGravity('Ocurrió un error al asignar la lista', Toast.LONG, Toast.BOTTOM)
    }
}

export {
    asignarListado
}