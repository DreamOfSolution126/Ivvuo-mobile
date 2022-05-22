import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Badge } from 'react-native-elements';


class CampanasServicio extends Component {

    render() {
        const { codigo, nombre, tipo } = this.props;
        return (
            <View style={{
                backgroundColor:'white', 
                borderRadius:25, 
                paddingHorizontal:14, 
                paddingTop:10, 
                marginVertical:14,
                flexDirection:"column",
                justifyContent:"flex-start",
                alignItems:"flex-start",
                borderColor:""

                }}>
                    <View style={{
                        flexDirection:"row",
                        justifyContent:"flex-start",
                    }}>
                        <Badge value={tipo} status="error" />
                        <Text style={{
                            fontWeight:"bold"
                        }}>Campaña pendiente: {codigo}</Text>
                    </View>
                    
                    <View>
                        <Text style={{
                            padding:14
                        }}>
                             {nombre}
                        </Text>
                    </View>
                
                

            </View>
        )
    }
}

export default CampanasServicio