import React from 'react';
import { AsyncStorage } from 'react-native';
import { 
    INICIO_ACTVIDAD_FONDO,
    FIN_ACTVIDAD_FONDO,
    SET_COMPLETADO_ACTIVIDAD_FONDO,
    FETCHING_DATA, 
    FETCHING_DATA_SUCCESS, 
    FETCHING_DATA_FAILURE, 
    MENSAJE} from '../constants';
import loginApi from '../api/signin';
import getUserByEmailApi from '../api/getUserByEmail';
import getAccountIdToCenterApi from '../api/account/getAccountIdToCenter';
import getDataCenterToIdApi from '../api/center/getDataCenterToId';
import { getOrders, obtenerOrdenesTableroControl } from '../api/workshop/getOrders';
import { setToken, setCenterCode, centerCode } from '../token';
import { coordinadorCargaVideo, coordinadorCargaFoto } from '../api/video';
import { cargarArchivoS3, registrarAdjunto } from '../api/video/video.srv';
import { RNS3 } from 'react-native-s3-upload';


const saveToken = async (data) =>{
    
    try {
        let dataToSave = data;

        await AsyncStorage.setItem('token', JSON.stringify(dataToSave))

    } catch {
        setMensaje('Error al guardar el TOKEN', true)
    }
}

export let tokenExport = ""

export const selected_tab = (tadId) => {
    return {
        type: 'selected_tab',
        payload:tadId
    }
}

export const getData = (PATH) => {
    return {
        type: FETCHING_DATA+PATH
    }
}

export const getDataSuccess = (data, PATH) => {
    return {
        type:FETCHING_DATA_SUCCESS+PATH,
        data:data
    }
}

export const getDataFailure = (PATH) => {
    return {
        type:FETCHING_DATA_FAILURE+PATH
    }
}

export const logOut = (PATH) => {
    return {
        type:'USERLOGOUT'
    }
}

export const validateToken = () => { 
    return (dispatch) => {
        AsyncStorage.getItem('token')
        .then( (data)=> {
            let dataResult = JSON.parse(data)
            if(dataResult && dataResult.userEmail){
                let token = Object.assign({}, JSON.parse(data))
                setToken(token.token)
                dispatch(getDataSuccess(token, 'SIGNIN'))
                
                dispatch(getUserByEmail({email:token.userEmail, token:token.token}))
            }
        }).catch( error =>{
            console.log(error)
            dispatch(setMensaje('Error en la validación del token', true))
        } )
        
    }
}

export const login = (body) => {
    return (dispatch) => {
        dispatch(getData('SIGNIN'))
        
        loginApi(body)

        .then( (response) =>{
            
            saveToken(response)
            dispatch(getDataSuccess(response, 'SIGNIN'))

            dispatch(validateToken())
        })
        .catch( (error)=>{ 
            console.log(error) 
            dispatch(setMensaje('Error al iniciar Sesión', true))
        } )
    }
}

export const GetAccountIdToCenter = (body) => {
    return (dispatch) => {
        dispatch(getData('GETACCOUNTIDTOCENTER'))

        getAccountIdToCenterApi(body)
        .then( (response) =>{
            dispatch(getDataSuccess(response, 'GETACCOUNTIDTOCENTER'))
        })
        .catch( (error)=>{ 
            console.log(error) 
            dispatch(setMensaje('Error al obtener la información de la cuenta', true))
        } )
    }
}

export const GetOrders = ( body ) => {
    return (dispatch) => {
        dispatch(getData('ORDERS'))

        obtenerOrdenesTableroControl( body )
        .then( (response) =>{

            if (response.estatus) {
                dispatch(getDataSuccess(response.data, 'ORDERS'))
            } else {
                dispatch(setMensaje( response.resultadoOperacion, true))
                dispatch(getDataSuccess([], 'ORDERS'))
            }
            
        })
        .catch( (error)=>{ 
            console.log(error) 
            dispatch(setMensaje('Error al obtener las ordenes', true))
        } )
    }
}

export const GetDataCenterToId = (body) => {
    return (dispatch) => {
        
        dispatch(getData('GETDATACENTERTOID'))

        getDataCenterToIdApi(body)
        .then( (response) =>{
            setCenterCode(response.code)
            dispatch(getDataSuccess(response, 'GETDATACENTERTOID'))
            dispatch(GetOrders({center_code:response.code}))
            // dispatch(ObtenerOrdenesTableroDeControl({center_code: response.code}))
        })
        .catch( (error)=>{ 
            dispatch(setMensaje('Error al obtener la información del centro de servicio', true))
            console.log('Error Servicio: GETDATACENTERTOID')
            console.log(JSON.stringify(error))
         } )
    }
}

export const getUserByEmail = (body) => {
    return (dispatch) => {
        
        dispatch(getData('GETUSERBYEMAIL'))

        getUserByEmailApi(body)
        .then( (response) =>{
            
            dispatch(getDataSuccess(response, 'GETUSERBYEMAIL'))
            
            dispatch(GetAccountIdToCenter({id:response.account[0]}))
            dispatch(GetDataCenterToId({id:response.centers[0]}))
        })
        .catch( (error)=>{ 
            dispatch(
                setMensaje('Error al comprobar los datos del usuario, recuerde que sólo los usuario con el Rol autorizado pueden acceder a la aplicación móvil', 
                true)
            )
            dispatch(getDataSuccess({}, 'SIGNIN'))
            console.log(JSON.stringify(error))
         } )
    }
}

export const SelectOrder = (order) => {
    return {
        type:'SELECTORDER',
        data:order 
    }
}

export const SelectProcess = (index) => {
    return {
        type:'PROCESSORDER',
        processIndex:index
    }
}

export const SelectActivity = (index)=> {
    return {
        type:'ACTIVITYORDER',
        activityIndex:index
    }
}

export const SetOrder = (order) => {
    return {
        type:'SETORDER',
        order: order
    }
}

export const setMensaje = ( mensaje, modalVisible ) => {
    return {
        type: MENSAJE,
        mensaje: mensaje,
        modalVisible: modalVisible
    }
}

export const SetActividadFondo = ( evento, completado ) => {
    return {
        type: evento,
        completado: completado
    }
}

export const CargarVideo = ( payload ) => {
    return async (dispatch) => {
        dispatch( SetActividadFondo(INICIO_ACTVIDAD_FONDO) )

        let resultado
        try {
            resultado = await coordinadorCargaVideo( payload )
            dispatch( SetOrder(resultado.data ))
            dispatch( SetActividadFondo(FIN_ACTVIDAD_FONDO))
        } catch ( error ) {
            dispatch( SetActividadFondo(FIN_ACTVIDAD_FONDO))
        }
        

    }
}

export const CargarFoto = ( payload ) => {
    return async (dispatch) => {
        dispatch( SetActividadFondo(INICIO_ACTVIDAD_FONDO) )

        let resultado

        try {
            resultado = await coordinadorCargaFoto( payload )
            dispatch( SetOrder(resultado.data ))
            dispatch( SetActividadFondo(FIN_ACTVIDAD_FONDO))
        } catch ( error ) {
            dispatch( SetActividadFondo(FIN_ACTVIDAD_FONDO))
        }
    }
}

export const CargarArchivos = ( payload ) => {
    // id: this.state.orderId,
    // indexActividad: this.state.activityIndex,
    // indexProceso: this.state.processIndex,
    // adjuntos: adjuntos,
    
    // uri: video.uri,
    // name: video.filename,
    // type: type
    return async ( dispatch ) => {
        dispatch( SetActividadFondo(INICIO_ACTVIDAD_FONDO) )
        let resRegistrarCargaInicial

        try {
            resRegistrarCargaInicial = await registrarAdjunto( payload )
        } catch (error) {
            dispatch( setMensaje('Ocurrio un problema, por favor revise su conexion a internet e intentelo nuevamente', true ))
        }

        let resCargarArchivoS3
        try {
            resCargarArchivoS3 = await cargarArchivoS3( payload )
        } catch (error) {
            dispatch( SetActividadFondo(FIN_ACTVIDAD_FONDO))
            dispatch( setMensaje('Ocurrio un problema mientras cargabamos este archivo', true ))
        }

        console.log('resCargarArchivoS3: ', resCargarArchivoS3)
        console.log('payload.adjuntos: ', payload.adjuntos)
        payload.adjuntos.map( (i) => {
            if(i.name === resCargarArchivoS3.key ) {
                i.url = resCargarArchivoS3.location;
                i.cargado.estatus = true;
            }
        } )

        let resRegistrarCargaFinal;
        try {
            resRegistrarCargaFinal = await registrarAdjunto( payload )
            dispatch( SetOrder(resultado.data ))
            dispatch( SetActividadFondo(FIN_ACTVIDAD_FONDO))
        } catch (error) {
            dispatch( SetActividadFondo(FIN_ACTVIDAD_FONDO))
        }
    }
}

export const ReintentarCargarArchivosRegistrados = ( payload ) => {

    // id: this.state.orderId,
    // indexActividad: this.state.activityIndex,
    // indexProceso: this.state.processIndex,
    // adjuntos: adjuntos,
    
    // uri: video.uri,
    // name: video.filename,
    // type: type

    
    return async ( dispatch ) => {
        dispatch( SetActividadFondo(INICIO_ACTVIDAD_FONDO) )
        console.log('Reintentar carga: ', {
            uri: payload.url,
            name: payload.name,
            type: payload.type
        } );
        let resCargarArchivoS3
        try {
            resCargarArchivoS3 = await cargarArchivoS3( payload )

            console.log('resCargarArchivoS3', resCargarArchivoS3)
        } catch (error) {
            console.log('Error recarga: ', error )
            dispatch( setMensaje('Ocurrio un problema mientras cargabamos este archivo', true ))
            dispatch( SetActividadFondo(FIN_ACTVIDAD_FONDO))
            return;
        }

        payload.adjuntos.map( (i) => {
            if(i.name === resCargarArchivoS3.key ) {
                i.url = resCargarArchivoS3.location;
                i.cargado.estatus = true;
            }
        } )

        let resRegistrarCargaFinal;
        try {
            resRegistrarCargaFinal = await registrarAdjunto( payload )
            dispatch( SetOrder(resultado.data ))
            dispatch( SetActividadFondo(FIN_ACTVIDAD_FONDO))
        } catch (error) {
            dispatch( SetActividadFondo(FIN_ACTVIDAD_FONDO))
        }
    }
}

export const setTokenAuto = ( token ) => {
    return {
        type:'SETTOKEN',
        data: token
    }
}






