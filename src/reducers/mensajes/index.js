import { MENSAJE } from '../../constants';

const initialState = {
    mensaje:'Bienvenido a IVVUO',
    modalVisible: false
}

export default mensajeDataReducer = ( state=initialState, action ) => {
    switch( action.type ){
        case MENSAJE:
            return {
                mensaje: action.mensaje,
                modalVisible: action.modalVisible
            }
        default: return state
    }
}