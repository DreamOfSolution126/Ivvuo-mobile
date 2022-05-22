import React, { Component, Fragment } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View } from 'react-native'
import { Text, Badge } from 'react-native-elements';
import { VISUAL_ASIGNACION } from '../../../constants';

class AsignadosComponent extends Component {

    renderBages = ( ) => {
        const { asignado, modo } = this.props

        if( !asignado || asignado.length === 0 ) return null

        if ( modo === VISUAL_ASIGNACION.NOMBRES ) {
            return asignado.map( (i) => {
                return (
                    <Badge 
                        key={i.id}
                        value={
                            <View style={{ 
                                flexDirection:'row', 
                                padding:10, 
                                // marginHorizontal:10,
                                justifyContent:'space-between', 
                                }}>
                                <Icon name="thumb-tack" size={15} color="white" style={{ marginRight:5 }}></Icon>
                                <Text style={{ color:'white', textTransform:'uppercase'}}>{i.nombres}</Text>
                            </View>
                        }
                    />
                )
            } )
        } else if ( modo === VISUAL_ASIGNACION.ABREVIADO ) {

            
            return asignado.map( (i) => {
                const auxNombres = i.nombres.split(' ')
                const nombre = auxNombres[0][0]
                const apellido = auxNombres[1][0]
                const abreviatura = nombre + apellido
                
                return (
                    <Badge 
                        key={i.id}
                        
                        value={
                            <View style={{ 
                                flexDirection:'row', 
                                padding:10, 
                                justifyContent:'space-between',
                                }}>
                                <Text style={{ color:'white', textTransform:'uppercase'}}>{abreviatura}</Text>
                            </View>
                        }
                    />
                )
            } )
        }
        
    }

    render(){
        
        return (
            <View style={{ flexDirection:'row', marginVertical:10, flexWrap:'wrap',}}>
                {this.renderBages( )}
            </View>
            
        )
    }
}

export default AsignadosComponent