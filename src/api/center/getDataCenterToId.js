import { API } from '../../constants';
import { token } from '../../token';

const PATH = 'center/getDataCenterToId';

export default async ( body ) => {
    return await fetch(API+PATH, {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'authorization':'Bearer '+ token
        },
        body: JSON.stringify({
            id: body.id
        })
    }).then( (response) => response.json() )
    .then( (resJson)=>{        
        return resJson
    } ).catch( (error)=>{
        console.log(error)
        return error
    } )
}