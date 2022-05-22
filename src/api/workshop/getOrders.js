import { API, BACKEND } from '../../constants';
import { token, centerCode } from '../../token';
import moment from 'moment'

const PATH = 'workshop/';

async function getOrders( body ) {
    
    
    return await fetch(API+PATH+'getOrders', {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'authorization':'Bearer '+ token
        },
        body: JSON.stringify({
            plate: body.plate? body.plate : '',
            limit: 20,
            skip: 0,
            center_code: centerCode,
            dateInit: body.dateInit? body.dateInit: moment().subtract( 8, 'days').format('YYYY-MM-DD'),
            dateEnd: body.dateEnd? body.dateEnd: moment().format('YYYY-MM-DD')
        })
    }).then( (response) => response.json() )
    .then( (resJson)=>{
        
        return resJson
    } ).catch( (error)=>{
        console.log(error)
        return error
    } )
}

async function obtenerOrdenesTableroControl ( body ) {

    const dateInit = body.dateInit? body.dateInit: moment().subtract( 8, 'days').format('YYYY-MM-DD')
    const dateEnd = body.dateEnd? body.dateEnd: moment().format('YYYY-MM-DD')
    const placa = body.plate? body.plate : ''

    return await fetch( `${BACKEND}orden/obtenerOrdenesTableroControl`, {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'authorization':'Bearer '+ token
        },
        body: JSON.stringify({
            plate: placa,
            limit: 20,
            center_code: centerCode,
            dateInit: dateInit,
            dateEnd: dateEnd,
            skip: 0
        })
    }).then( async (response) => await response.json() )
    .then( (resJson)=>{

        return resJson
    } ).catch( (error)=>{
        
        return error
    } )
}

async function setActivityAnswer(orderId, processIndex, activityIndex, answer){

    return await fetch(API+PATH+'setActivityAnswer', {
        method:'POST',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer' + token
        },
        body:JSON.stringify({
            _id:orderId,
            activityIndex: activityIndex,
            processIndex: processIndex,
            answer:answer
        })
    } ).then( ( response )=> response.json() )
    .then( (responseJson)=>{
        
        return responseJson
    }).catch( (error)=>{
        console.log(error)
        return error
    })
}

async function setActivityAny(orderId, processIndex, activityIndex, value, setName){
    return await fetch(API+PATH+'setActivityAny', {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'authorization':'Bearer '+ token
        },
        body: JSON.stringify({
            _id:orderId,
            activityIndex: activityIndex,
            processIndex: processIndex,
            value:value,
            setName:setName
        })
    }).then( ( response )=> response.json() )
    .then( (responseJson)=>{
        
        return responseJson
    }).catch( (error)=>{
        console.log(error)
        return error
    })
}

async function newOrder( body ){
    return await fetch(API+PATH+'newOrder', {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'authorization':'Bearer '+ token
        },
        body: JSON.stringify(body)
    }).then( ( response )=> response.json() )
    .then( (responseJson)=>{
        
        return responseJson
    }).catch( (error)=>{
        console.log(error)
        return error
    })
}

async function updateOrder( body ){
    return await fetch(API+PATH+'updateOrder', {
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'authorization':'Bearer '+ token
        },
        body: JSON.stringify(body)
    }).then( ( response )=> response.json() )
    .then( (responseJson)=>{
        
        return responseJson
    }).catch( (error)=>{
        
        return error
    })
}

async function getOrderById( body ){

    return await fetch ( API+PATH+'getOrderById', {
        method: 'POST',
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'authorization':'Bearer '+ token
        },
        body: JSON.stringify(body)
    }).then( async (response) => await response.json() )
    .then( (resJson)=>{
        
        return resJson
    } ).catch( (error)=>{
        
        return error
    } )
}

export {
    getOrders,
    obtenerOrdenesTableroControl,
    getOrderById,
    setActivityAnswer,
    setActivityAny,
    newOrder,
    updateOrder
}