import React, { Component } from 'react';
import { Modal, View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { styles } from '../styles';
import { connect } from 'react-redux';
import { logOut, setMensaje } from '../actions';


class Mensajes extends Component {

    logoutApp = () => {
        AsyncStorage.clear();
        // this.props.logout();
    }

    render(){
        const { mensaje, modalVisible } = this.props
        return  <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => this.logoutApp() }
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>
                                {mensaje}
                            </Text>
                        
                            <View style={{ flexDirection:'row', justifyContent:'space-evenly'}}>
                                <Button 
                                    buttonStyle={styles.button_accent}
                                    containerStyle={styles.button}
                                    onPress={()=> this.props.setMensaje('', false) } 
                                    title="ENTENDIDO"
                                    titleStyle={styles.text_white} />
                            </View>
                        </View>
                    </View>
            </Modal>
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        logout: ()=> dispatch(logOut()),
        setMensaje: (mensaje, modalVisible) => dispatch(setMensaje(mensaje, modalVisible))
    }
}

export default connect(null, mapDispatchToProps)(Mensajes)