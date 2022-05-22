
import { DOMAIN, BACKEND } from '../../constants';
import Toast from 'react-native-simple-toast';

export const cargarVideoService = async ( uploadData ) => {
    // return await fetch('https://ivvuo.com/upload_video.php',{
    return await fetch( BACKEND + 'upload',{ // upload usando AWS S3
        method:'POST',
        body: uploadData
    }).then( (response)=> response.json())
    .then( (resJson)=>{

        return resJson;

    }).catch( (error)=>{

        return error;
    })

}

export const cargarFotoService = async ( uploadData ) => {

    return await fetch( BACKEND + 'upload',{
            method:'POST',
            body: uploadData
        }).then( (response)=> response.json())
        .then( (resJson)=>{

            return resJson;
        }).catch( (error)=>{

            return error;
        

        })
}

export const actualizarOrdenVideo = async ( payload ) => {
    const data = payload;
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

export const coordinadorCargaVideo = async ( payload ) => {

    const videoACargar = payload.videoACargar;
    const datosCargaVideo = Object.assign( {}, payload.datosCargaVideo )

    try {

        const respuestaCargaVideo = await cargarVideoService( videoACargar )

        datosCargaVideo.data.adjuntos.push({
            url: respuestaCargaVideo.Location,
            type: respuestaCargaVideo.Key.split('.')[1],
            name: respuestaCargaVideo.Key,
            date: new Date( Date.now() )
        })

        datosCargaVideo.data.orden.process[datosCargaVideo.data.indexProceso].checkList[datosCargaVideo.data.indexActividad].attach = datosCargaVideo.data.adjuntos;

        await actualizarOrdenVideo( datosCargaVideo.data )

        return {
            estatus: true,
            resultadoOperacion: 'Video cargado con exito',
            data: datosCargaVideo.data.orden
        }

    } catch (error) {
        return {
            estatus: false,
            resultadoOperacion: 'Error al cargar el video'
        }
    }
}

export const coordinadorCargaFoto = async ( payload ) => {
    
    const fotoACargar = payload.fotoACargar
    const datosCargaFoto = Object.assign( {}, payload.datosCargaFoto )

    try {
        

        const respuestaCargaFoto = await cargarFotoService( fotoACargar )

        datosCargaFoto.data.adjuntos.push({
            url: respuestaCargaFoto.Location,
            type: respuestaCargaFoto.Key.split('.')[1],
            name: respuestaCargaFoto.Key,
            date: new Date( Date.now() )
        })

        datosCargaFoto.data.orden.process[datosCargaFoto.data.indexProceso].checkList[datosCargaFoto.data.indexActividad].attach = datosCargaFoto.data.adjuntos;

        await actualizarOrdenVideo( datosCargaFoto.data )

        return {
            estatus: true,
            resultadoOperacion: 'Fotografia cargado con exito',
            data: datosCargaFoto.data.orden
        }
    } catch ( error ) {
        return {
            estatus: false,
            resultadoOperacion: 'Error al cargar la foto'
        }
    }
}