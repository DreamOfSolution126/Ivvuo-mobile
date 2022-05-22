import React, { Component } from 'react';
import { View, ProgressBarAndroid, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';

class IndicadorCarga extends Component {
    render(){

        if (!this.props.actividadFondo.cargando) {
            return null;
        }
        return (
            <View style={{
                justifyContent:'flex-start',
                flex:1,
                flexDirection:'row',
                alignItems:'center',
                backgroundColor:'white', 
                borderRadius:25, 
                paddingHorizontal:25, 
                paddingVertical: 20, 
                marginVertical: 20 }}>

                <View style={{ flex:2, alignContent:'center' }}>
                    <Icon name="cloud-upload" color='lightblue' style={{ marginLeft:50 }} />
                </View>
                
                <View style={{ flex:12, alignContent:'center', paddingHorizontal:20 }}>
                    <Text>({this.props.actividadFondo.itemsCargando}) Cargando... {this.props.actividadFondo.completado} </Text>
                    <ProgressBarAndroid styleAttr="Horizontal" />
                </View>
                
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        actividadFondo: state.actividadFondo
    }
}

export default connect(mapStateToProps, null )(IndicadorCarga)