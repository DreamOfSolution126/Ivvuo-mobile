import React, { Component } from 'react';
import { View } from 'react-native';

import { connect } from 'react-redux';
import { logOut, validateToken } from '../../actions'
import LoggeNavigation from '../../navigation/logged';

class HomeScreen extends Component {
    constructor(props){
        super(props)
    }
    
    render(){
        
        return (
        <View style={{flex:1, backgroundColor:"#eee"}}>
            <LoggeNavigation></LoggeNavigation>
        </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        email: state.token.data.userEmail
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logOut: ()=> dispatch(logOut()),
        validateToken: ()=>dispatch(validateToken())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)