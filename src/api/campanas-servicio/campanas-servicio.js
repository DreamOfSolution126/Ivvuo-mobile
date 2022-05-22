import { BACKEND } from '../../constants';

export const consultaVin = async ( payload ) => {

    return await fetch( BACKEND+'v2/campanas-servicio/consultaVin', {
        method: 'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json'
        },
        body: JSON.stringify( payload )
    }).then( (response)=> response.json())
    .then( (resJson)=>{

        return resJson;

    }).catch( (error)=>{

        return error;
    })
}