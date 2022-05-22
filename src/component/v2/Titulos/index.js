import React, { Component } from 'react';
import { Text } from 'react-native-elements';
import { View } from 'react-native';

class Titulos extends Component {
    render() {
        const { titulo, subtitulo } = this.props;
        return (
            <View style={{ flex: 1, flexDirection:'column', paddingHorizontal:20, marginVertical:20 }}>
                <Text h4>{ titulo ? titulo: 'Titulo'}</Text>
                {subtitulo ? <Text>{ subtitulo ? subtitulo: 'Subtitulo'}</Text> : null }
            </View>
        )
    }
}

export default Titulos;