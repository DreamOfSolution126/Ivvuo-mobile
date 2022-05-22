import React, { Component } from 'react'
import { View, Text, ActivityIndicator, ScrollView, Dimensions } from 'react-native'
import { Image, Card, Button, Icon } from 'react-native-elements'
import moment from  'moment'
import NavBar from '../../component/Header';
import { styles } from '../../styles';
import { Video } from 'expo-av';
const { height, width } = Dimensions.get('screen')

class GalleryScreen extends Component {
    constructor(props){
        super(props)
        this.state = {

            attach:[]
        }
    }
    
    componentDidMount(){
        
        const attach = this.props.navigation.getParam('attach')
        if(attach){
            this.setState({
                attach: attach
            })
        }
    }

    renderImage = () => {
        const { attach } = this.state

        return attach.map( (i, index) => {
            if ( i.type === 'jpg') {
                return <Card
                            key={i.url+index}
                            title={`Evidencia ${index+1}`}
                            image={{uri:i.url}}>
                            <Text style={{marginBottom: 10}}>
                                <Text style={styles.text_secondary}>Hora de carga certificada</Text> {moment(i.date).format('DD-MM-YYYY h:m:s a')}
                            </Text>
                        </Card>
            } else {
                return <Card
                    key={i.url+index}
                    title={`Evidencia ${index+1}`}
                >
                    <Video
                        isBuffering
                        source={{ uri: i.url }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay={false}
                        isLooping={false}
                        useNativeControls={true}
                        style={{ width: 300, height: 300 }}
                    />
                    <Text style={{marginBottom: 10}}>
                        <Text style={styles.text_secondary}>Hora de carga certificada</Text> {moment(i.date).format('DD-MM-YYYY h:m:s a')}
                    </Text>
                </Card>
            }
        } )
    }

    render(){
        
        return (
            <View style={{flex:1, justifyContent:'center', flexDirection:'column'}}>
                <NavBar
                    center={'Galeria'}
                    leftIcon={'home'}
                    leftAction={()=>this.props.navigation.navigate('Ordes')}
                    rightAction={()=>this.props.navigation.goBack()}
                    rightIcon={'arrow-back'}/>
                <View style={{flex:1, justifyContent:'center', alignItems:'stretch', flexDirection:'column'}}>
                    <ScrollView> 
                        {this.renderImage()}
                    </ScrollView>
                </View>
                
                
            </View>
        )
    }
}

export default GalleryScreen