const PATH = 'ORDER';
const initialState = {
    order:{ process:[] },
    processIndex:0,
    activityIndex:0,
    edit:0
}

export default OrderSelectReducer = (state = initialState, action)=>{
    switch(action.type){
        case 'SELECT'+PATH:
            return {
                ...state,
                order: action.data,
                edit:0
            }
        case 'PROCESS'+PATH:
            return {
                ...state,
                processIndex:action.processIndex
            }
        case 'ACTIVITY'+PATH:
            return {
                ...state,
                activityIndex:action.activityIndex
            }
        case 'SETORDER':
            return {
                ...state,
                order:{ 
                    ...state.order, 
                    notes:Object.assign(state.order.notes, action.order.notes), 
                    process: Object.assign(state.order.process, action.order.process) 
                },
                edit: state.edit + 1
            }
        case 'USERLOGOUT':
            return {
                initialState
            }
        default:
            return state;
    }
}