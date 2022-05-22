import {combineReducers} from 'redux';
import tabListreducer from './tabListReducer';
import signinReducer from './signinReducer';
import getUserByEmailReducer from './getUserByEmailReducer';
import getAccountIdToCenter from './account/getAccountIdToCenterReducer';
import getDataCenterToIdReducer from './center/getDataCenterToIdReducer';
import OrdersReducer from './workshop/OrdersReducer';
import OrdersSelectReducer from './workshop/OrderSelectReducer';
import mensajeDataReducer from './mensajes';
import indicadorActividadFondoReducer from './indicadorActividadFondo';

export default combineReducers({
    taId: tabListreducer,
    token:signinReducer,
    user:getUserByEmailReducer,
    account:getAccountIdToCenter,
    center: getDataCenterToIdReducer,
    orders: OrdersReducer,
    orderSelect:OrdersSelectReducer,
    mensaje: mensajeDataReducer,
    actividadFondo: indicadorActividadFondoReducer
})