import { BACKEND } from '../../constants';
import { token } from '../../token';

export const iniciarCarga = async ( payload ) => {
    // payload = {
    //     contentType: string,
    //     key: string
    // }
    return await fetch( BACKEND+'iniciarCarga', {
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