import React, { Component } from 'react';
import { View, ActivityIndicator, Text, ImageBackground } from 'react-native';
import { styles, comp } from '../styles';


export default class PreLoaderComponent extends Component {
    render(){
        return(
            <View 
                style={{
                    flex:1, 
                    flexDirection:'column', 
                    justifyContent:'center', 
                    alignContent:'center', 
                    alignItems:'center'}}>

                    <ActivityIndicator size="large" color={comp.dark} />
                    <Text style={styles.text_dark}>
                        Cargando...
                    </Text>

            </View>
        )
    }
}