import { DOMAIN, BACKEND } from '../../constants';
import Toast from 'react-native-simple-toast';
import { RNS3 } from 'react-native-s3-upload';
import { SetActividadFondo } from '../../actions';
import { SET_COMPLETADO_ACTIVIDAD_FONDO } from '../../constants';


const options = {
    // keyPrefix: "uploads/",
    ACL: 'public-read',
    bucket: "ivvuo01",
    region: "us-east-2",
    accessKey: "AKIAI2JJXZOTVMLTSQ3A",
    secretKey: "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",
    successActionStatus: 201
}

export const cargarArchivoS3 = async ( payload ) => {

    const options = {
        ACL: 'public-read',
        bucket: "ivvuo01",
        region: "us-east-2",
        accessKey: "AKIAI2JJXZOTVMLTSQ3A",
        secretKey: "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",
        successActionStatus: 201
    }

    const file = {
        uri: payload.uri,
        name: payload.name,
        type: payload.type
    }

    // RNS3.put(file, options)
    // .progress((e) => {
    //     SetActividadFondo( SET_COMPLETADO_ACTIVIDAD_FONDO, e.loaded / e.total )
    //     console.log(e.loaded / e.total)
    // }); // or console.log(e.percent)
 
    return RNS3.put(file, options).then(response => {
        if (response.status !== 201)
          throw new Error("Failed to upload image to S3");
        console.log(response.body);
        /**
         * {
         *   postResponse: {
         *     bucket: "your-bucket",
         *     etag : "9f620878e06d28774406017480a59fd4",
         *     key: "uploads/image.png",
         *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
         *   }
         * }
         */

        return response.body.postResponse;
    });
    RNS3.put(file, option)
    .abort();
}

export const registrarAdjunto = async ( payload ) => {
    const data = payload;
    console.log('Data: ', data );
    return await fetch( BACKEND + 'api/workshop/setActivityAny', {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'authorization':'Bearer '+ data.token
        },
        body:JSON.stringify({
            _id: data.id,
            activityIndex: data.indexActividad,
            processIndex: data.indexProceso,
            setName:'attach',
            value: data.adjuntos
        })
    }).then( (response)=> response.json() )
    .then( (responseJson)=>{
        
        Toast.showWithGravity('Genial! Se guardado la evidencia', Toast.LONG, Toast.BOTTOM)
        return responseJson;
    } ).catch( (error)=>{
        
        Toast.showWithGravity('Ocurrio un error al guardar la evidencia', Toast.LONG, Toast.BOTTOM)
        return error 
    } )
}