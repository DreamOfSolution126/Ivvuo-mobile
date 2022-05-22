import React, { Component } from 'react';
import { 
    ActivityIndicator, 
    AsyncStorage, 
    Image,
    KeyboardAvoidingView,
    View } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import {login} from '../actions';

import { comp, styles } from '../styles';

let token = AsyncStorage.getItem('token')
class LoginScreen extends Component {
    constructor(props){
        super(props)
        this.state = {email:'', password:'', errorMessage:'', errorPassword:''}
    }
    onPressLogin = ()=> {
        if(!this.state.email){
            this.setState({errorMessage:'Por favor escribe un email'})
        } else if(!this.state.password){
            this.setState({errorMessage:'', errorPassword:'Por favor escribe una Contraseña'})
        } else {
            this.setState({errorMessage:'', errorPassword:''})
            this.props.login(this.state)
            
        }
    }

    render(){
        
        return (
            <KeyboardAvoidingView style={styles.bg} behavior='padding' enable>
                <View style={{flex:1, 
                    flexDirection:'column',
                    alignItems: 'stretch',
                    justifyContent: 'center'}}>
                        
                    <View style={{ flex:5, alignItems:"center", justifyContent:'flex-end' }}>
                        <Image
                            style={{ width: 177, height: 177 }}
                            source={ require('../../assets/logo_vertical.png')}/>
                    </View>
                    <View style={{flex:5, justifyContent:'flex-start', paddingHorizontal:15}}>
                        <Input
                            autoCapitalize="none"
                            autoCompleteType="email"
                            textContentType="emailAddress"
                            onChangeText={(email) => this.setState({email})}
                            containerStyle={styles.containerStyle}
                            inputContainerStyle={styles.inputContainer}
                            labelStyle={styles.text_secondary}
                            label='Email'
                            placeholder='Email'
                            leftIcon={
                                <Icon
                                  name='email'
                                  size={24}
                                  color={comp.secondary}
                                />
                              }
                            errorMessage={this.state.errorMessage}/>
                            
                        <Input
                            autoCapitalize="none"
                            secureTextEntry={true}
                            autoCompleteType="password"
                            textContentType="password"
                            onChangeText={(password) => this.setState({password})}
                            containerStyle={styles.containerStyle}
                            inputContainerStyle={styles.inputContainer}
                            label='Contraseña'
                            labelStyle={styles.text_secondary}
                            placeholder='Contraseña'
                            leftIcon={
                                <Icon
                                  name='lock'
                                  size={24}
                                  color={comp.secondary}
                                />
                            }
                            errorMessage={this.state.errorPassword}/>

                        <View style={{paddingHorizontal:12, marginTop:15, flexDirection:'row', justifyContent:'flex-start', alignItems:'stretch'}}>
                            <Button 
                                onPress={()=>this.onPressLogin()} 
                                type="clear"
                                title='INICIAR SESIÓN'
                                titleStyle={styles.text_primary}/>
                        </View>
                        { this.props.token.isFetching?
                            <ActivityIndicator size="large" color={comp.f} />:null}
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token:state.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        login: (state) => dispatch(login(state))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginScreen)