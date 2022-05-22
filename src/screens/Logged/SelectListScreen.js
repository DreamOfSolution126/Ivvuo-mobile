import React, { Component } from 'react';
import { View, ScrollView, Text, RefreshControl, Modal } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import NavBar from '../../component/Header';
import { connect } from 'react-redux';
import { getProcess } from '../../api/process';
import PreLoaderComponent from '../../component/PreLoader';
import { styles } from '../../styles';
import { asignarListado } from '../../api/listas';
import Toast from 'react-native-simple-toast';

class SelectListScreen extends Component {
    state = {
        loading: false,
        listArray:[],
        refreshing:false,
        listSelect:{},
        modalVisible: false
    }

    componentDidMount(){
        this.obtenerProcesos();
    }

    obtenerProcesos = () => {
        this.setState({refreshing: true})
        getProcess({account_code:this.props.account.code})
        .then( data=>{
            this.setState({ listArray:data, refreshing:false })
        }).catch( error => {
            this.setState({ refreshing:false })
            console.log(error)
        })
    }

    asignarLista = async () => {
        try {
            await asignarListado( {
                idOrden: this.props.order._id,
                idLista: this.state.listSelect._id
            } )
            
            Toast.showWithGravity('La lista se asigno correctamente', Toast.LONG, Toast.BOTTOM)
            this.props.navigation.goBack()
        } catch ( error ) {
            console.log(error)
        }
    }

    renderList = () => {
        const { listArray } = this.state;
        
        if(listArray.length > 0){
            return listArray.map( (i, index) => {
                return <ListItem
                    key={index}
                    title={i.list}
                    subtitle={i.description}
                    bottomDivider
                    onPress={()=>{
                        this.setState({
                            modalVisible: true,
                            listSelect:i
                        })}}
                />
            } )
        }
    }

    renderModal = () => {
        const { modalVisible, listSelect } = this.state;
        return <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                        // console.log("Modal has been closed.");
                        }}
                    ><View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <Text style={styles.modalText}>
                        Ha seleccionado {listSelect.list} si confirma no podrá cambiar esta lista. Para continuar pulse sobre confirmar
                    </Text>
                    
                        <View style={{ flexDirection:'row', justifyContent:'space-evenly'}}>
                            <Button 
                                buttonStyle={styles.button_accent}
                                containerStyle={styles.button}
                                onPress={()=> this.setState({ modalVisible:false })} 
                                title="CANCELAR" type='outline'
                                titleStyle={styles.text_white} />
                            <Button 
                                buttonStyle={styles.button_primary}
                                containerStyle={styles.button}
                                onPress={()=> this.asignarLista() } 
                                title="CONFIRMAR" type='outline'
                                titleStyle={styles.text_primary} />
                        </View>
                    </View>
                </View>
                </Modal>
    }

    _onRefresh=()=>{
        this.setState({refreshing: true});
        this.obtenerProcesos();
        this.setState({refreshing: false})
      }

    render(){
        console.log(this.props.order._id)
        const { loading } = this.state;
        if(loading) return <PreLoaderComponent/>
        return (
            <View style={{backgroundColor: "#eee", flex:1, flexDirection:'column'}}>
                <NavBar
                    leftIcon={'home'}
                    leftAction={()=>this.props.navigation.navigate('Ordes')}
                    rightAction={()=>this.props.navigation.goBack()}
                    rightIcon={'arrow-back'}/>
                
                <ScrollView
                refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }>
                    {this.renderModal()}
                    {this.renderList()}
                </ScrollView>
            </View>
        )
    }
} 

const mapStateToProps = state => {
    return {
        account: state.account.data,
        order: state.orderSelect.order
    }
}

export default connect(mapStateToProps, null )(SelectListScreen)