import React, { Component, Fragment } from 'react';
import { ActivityIndicator, Dimensions, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { Video } from 'expo-av';
import NavBar from '../../component/Header';
import { connect } from 'react-redux';
import moment from 'moment';

const { height, width } = Dimensions.get('screen')

class VisualizadorEvidencia extends Component {
    constructor(props){
        super(props)
        this.state = {
            evidenciaSeleccionada: null,
            index: 0,
            width: 0,
            height: 0,
            screenWidth: width,
            videoPaused: true,
            heightScaled: height/2
        }
    }

    async componentDidMount(){
        
        const evidenciaSeleccionada = this.props.navigation.getParam('evidenciaSeleccionada')
        const index = this.props.navigation.getParam('index')
        if(evidenciaSeleccionada){
            this.setState({
                evidenciaSeleccionada: evidenciaSeleccionada,
                index: index
            })
        }
    }

    renderEvidencias = () => {
        const { evidenciaSeleccionada } = this.state;

        
        if ( evidenciaSeleccionada ) {
            if ( evidenciaSeleccionada.type === 'jpg' ) {

                
                Image.getSize( evidenciaSeleccionada.url, (width, height) => {this.setState({width, height})});

                return <View style={{ 
                    alignContent:'center', 
                    alignItems:'center', 
                    width: width,
                    height: height
                    }}>
                    <Image 
                    style={{
                        // width: this.state.width, 
                        width: '100%', 
                        height: '100%', 
                        resizeMode: 'contain'
                    }} 
                    
                    source={{ uri: evidenciaSeleccionada.url }} />
                </View>
            } else if (evidenciaSeleccionada.type === 'mp4' ) {

                return <View style={{alignItems:'center'}}>

                    <Video
                        style={{
                            width: this.state.screenWidth,
                            height: this.state.heightScaled
                        }}
                        source={{ uri: evidenciaSeleccionada.url }}
                        resizeMode='cover'
                        paused={ this.state.videoPaused }
                        useNativeControls={true}
                        onReadyForDisplay={ (response) => {
                            // console.log('onReadyForDisplay: ', response )
                            // console.log('onReadyForDisplay.naturalSize: ', response?.naturalSize )
                            const { width, height } = response.naturalSize;
                            const heightScaled = height * (this.state.screenWidth / width);

                            this.setState({
                                heightScaled,
                                videoPaused: false,
                            });
                        }}
                        />
                </View>
            }
        }
    }

    renderTituloImagen = () => {
        const { evidenciaSeleccionada, index } = this.state;

        if ( evidenciaSeleccionada ) {
            return <Fragment>
                <Text h4 style={{ marginHorizontal:25 }}>
                    Evidencia { index + 1}
                </Text>
                <Text style={{ marginHorizontal:25 }}>
                    Hora de carga: {moment(evidenciaSeleccionada.date).format('DD-MM-YYYY hh:mm a')}
                </Text>
                {/* <Text style={{ marginHorizontal:25 }}>
                    URL: {evidenciaSeleccionada.url}
                </Text> */}
            </Fragment>
        }
    }

    renderButtons = () => {
        return <View style={{ flexDirection:'row', justifyContent:'space-between', backgroundColor:'red'}}>
            <TouchableOpacity>
                <Text>Atras</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <Text>Siguiente</Text>
            </TouchableOpacity>
        </View>
    }

    render () {
        const { evidenciaSeleccionada, index } = this.state;
        return (
        <View style={{ flex: 1, flexDirection: 'column'}}>
            <NavBar
                center={this.props.order.id}
                leftIcon={'home'}
                leftAction={()=>this.props.navigation.navigate('Ordes')}
                rightAction={()=>this.props.navigation.goBack()}
                rightIcon={'arrow-back'}></NavBar>
            <ScrollView>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent:'space-around', alignItems:'stretch'}}>
                    
                    {this.renderEvidencias()}
                    {this.renderTituloImagen()}
                    {/* {this.renderButtons()} */}
                </View>
            </ScrollView>
            
            
        </View>
        )
    }
}


const mapStateToProps = state => {
    return {
        order: state.orderSelect.order,
        pIndex: state.orderSelect.processIndex,
        aIndex: state.orderSelect.activityIndex,
        process: state.orderSelect.order.process[state.orderSelect.processIndex],
        activity: state.orderSelect.order.process[state.orderSelect.processIndex].checkList[state.orderSelect.activityIndex]
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setOrder: (order)=>dispatch(SetOrder(order)),
        selectActiviy:(index)=>dispatch(SelectActivity(index))
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(VisualizadorEvidencia)
export default Container