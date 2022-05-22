import { INICIO_ACTVIDAD_FONDO, FIN_ACTVIDAD_FONDO, SET_COMPLETADO_ACTIVIDAD_FONDO } from '../../constants';

const estadoInicial = {
    cargando: false,
    itemsCargando: 0,
    completado: 0
}

export default indicadorActividadFondo = ( state=estadoInicial, action ) => {
    switch ( action.type ) {
        case INICIO_ACTVIDAD_FONDO:
            return {
                cargando: true,
                itemsCargando: state.itemsCargando + 1
            }
        case FIN_ACTVIDAD_FONDO:
            return {
                itemsCargando: state.itemsCargando - 1,
                cargando: state.itemsCargando - 1 === 0 ? false : true
            }
        case SET_COMPLETADO_ACTIVIDAD_FONDO:
            return {
                ...state,
                completado: action.completado
            }
        default: 
            return state
    }
}