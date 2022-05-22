import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import LoginScreen from './LoginScreen';
import HomeScreen from './Logged/HomeScreen';
import PreLoader from '../component/PreLoader';
import Mensajes from '../component/Mensajes';

import { getUserByEmail, validateToken, setTokenAuto } from '../actions';
import { AsyncStorage, View, Button } from 'react-native';
class MainScreen extends Component {
    constructor(props){
        super(props)
        this.state = { token:{}, loading:true}
    }
    componentDidMount = async ()=>{
        const response = await AsyncStorage.getItem('token')
        if( response ) {
            this.props.setToken(JSON.parse(response))
            this.props.validateToken();
        }
        this.setState({ 
            token:this.props.token,
            loading:false
        })
    }
    
    render(){
        const { loading, token } = this.state;
        const { mensaje, modalVisible } = this.props.mensaje
        // console.log(this.props.token)
        if(loading){
            return <PreLoader></PreLoader>
        }

        if(this.props.token && this.props.token.data.message === "Te has logueado correctamente"){
            return <Fragment>
                    <HomeScreen style={{backgroundColor:"#eee", flex:1}}></HomeScreen>
                    <Mensajes mensaje={mensaje} modalVisible={modalVisible} />
                </Fragment>
        } else {
            return (
                <Fragment>
                    <LoginScreen></LoginScreen>
                    <Mensajes mensaje={mensaje} modalVisible={modalVisible} />
                </Fragment>
            )
        }
        
    }
} 



const mapStateToProps = state => {
    
    return {
        token: state.token,
        user: state.user,
        mensaje: state.mensaje
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUserByEmail: (body) => dispatch(getUserByEmail(body)),
        validateToken: () => dispatch(validateToken()),
        setToken: ( token ) => dispatch(setTokenAuto( token ))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)

