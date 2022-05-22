export default (state = 'Invidato', action) => {
    switch(action.type){
        case 'selected_tab':
            return action.payload;

        default:
            return state
    }
}