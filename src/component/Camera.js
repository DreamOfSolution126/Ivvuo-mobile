import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-elements';
// import { FileSystem, Camera, Constants } from 'expo';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

import Toast from 'react-native-simple-toast';
import { DOMAIN } from '../constants';

import { connect } from 'react-redux';
import { SetOrder } from '../actions';
import { styles } from '../styles';

const landmarkSize = 2;
class CameraComponent extends Component {
    
    constructor(props){
        super(props)
        this.state = {
            hasCameraPermission: (async () => {
                const { status } = await Camera.requestPermissionsAsync();
                return status === 'granted';
              }),
            type: Camera.Constants.Type.back,
            photoUri:'',
            photo:null,
            uploading:false,
            orderId:'', activityIndex:'', processIndex:'', token:'',
            attach:[],
            order:{}
        };
    }

    static navigationOptions = {
        header:null
    };

    async UNSAFE_componentWillMount() {
        const orderId = this.props.order._id
        const activityIndex = this.props.aIndex;
        const processIndex = this.props.pIndex;
        const token = this.props.token;
        const attach = this.props.activity.attach;
        const order = this.props.order;
        
        this.setState({ 
            // hasCameraPermission: status === 'granted', 
            orderId:orderId, activityIndex:activityIndex, 
            processIndex:processIndex,
            token:token, 
            attach:attach,
            order:order
         });
    }

    takePicture = ()=>{
        if (this.camera) {
            this.camera.takePictureAsync({ skipProcessing: false }).then( (data)=>{
                this.setState({
                    photoUri:data.uri, 
                    photo:data
                })
            })

          }
    }
    onPictureSaved = async () => {
        const { photo } = this.state;
        this.savePhotoOnServer(photo)
        
        this.setState({ newPhotos: true });
    }

    takeOtherPicture=()=>{
        const orderId = this.props.order._id;
        const token = this.props.token;
        const attach = this.props.activity.attach;
        const order = this.props.order;
        this.setState({
            photoUri:'', 
            photo:null,
            orderId:orderId,
            token:token, 
            attach:attach,
            order:order})
    }



    savePhotoOnServer=(photo)=>{
        let uploadData = new FormData();
        this.setState({loading:true});
        uploadData.append('item', 'itemdeprueba')
        uploadData.append('file', {type:'image/jpg', uri:photo.uri, name:'imagendeprueba.jpg'} )
        fetch('https://ivvuo.com/upload.php',{
            method:'POST',
            body: uploadData
        }).then( (response)=> response.json())
        .then( (resJson)=>{
            if(resJson.status){
                
                this.updateActivity(resJson);
                this.takeOtherPicture();
                
            } else {
                Toast.showWithGravity(error.message, Toast.LONG, Toast.BOTTOM)
            }
        }).catch( (error)=>{
            Toast.showWithGravity(error.message, Toast.LONG, Toast.BOTTOM)
        })
    }

    updateActivity=(data)=>{
        
        
        let temporal = this.state.attach;
        temporal.push({
            url:DOMAIN+'uploads/'+data.generatedName,
            type:data.originalName.split('.',2)[1],
            name:data.originalname,
            date: new Date( Date.now() )
        })
        this.setState({attach:temporal})
        
        const { orderId, activityIndex, processIndex, token, order } = this.state;
            let temporalOrder = order;
            temporalOrder.process[processIndex].checkList[activityIndex].attach = temporal;
            
        fetch('https://mecappserver.herokuapp.com/api/workshop/setActivityAny', {
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json',
                'authorization':'Bearer '+ token
            },
            body:JSON.stringify({
                _id:orderId,
                activityIndex: activityIndex,
                processIndex: processIndex,
                setName:'attach',
                value:temporal
            })
        }).then( (response)=> response.json() )
        .then( (responseJson)=>{
            this.setState({loading:false});
            
            this.props.setOrder(temporalOrder)
            Toast.showWithGravity('Genial! Se guardado la Imagen', Toast.LONG, Toast.BOTTOM)
            
        } ).catch( (error)=>{
            console.log(error)
            Toast.showWithGravity('Ocurrio un error al actualizar la Orden', Toast.LONG, Toast.BOTTOM)
        } )
    }

    async render(){
        const { hasCameraPermission, photoUri, loading, attach } = this.state;
        if (hasCameraPermission === null) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            this.setState({hasCameraPermission: status === 'granted'})
            
            return (<View style={{flex:1, justifyContent:'center', alignItems:'center', alignContent:'center'}}>
                        <Text>Los permisos de la camara son NULL</Text>
                    </View>);
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            if(photoUri){
                return (
                    <View style={{ flex: 1 }}>
                        
                        <View style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                            justifyContent:'center'
                        }}>
                            <Image style={{ flex: 1 }} source={{uri:photoUri}}></Image>
                            <View style={{ flexDirection:'row', justifyContent:'space-between', position:'absolute', bottom:45}}>
                                
                                <View style={{marginHorizontal:5}}>
                                    <Button
                                        onPress={ ()=> this.takeOtherPicture()}
                                        title=" ELIMINAR "
                                        buttonStyle={styles.button_danger}
                                        containerStyle={styles.button}
                                        icon={
                                            <Icon
                                              name="trash"
                                              size={20}
                                              color="white"
                                            />
                                    }></Button>
                                </View>
                                <View style={{marginHorizontal:5}}>
                                    <Button 
                                        onPress={ ()=> this.onPictureSaved()}
                                        title=" GUARDAR " 
                                        style={{marginHorizontal:15}}
                                        loading={loading}
                                        buttonStyle={styles.button_primary}
                                        containerStyle={styles.button}
                                        icon={
                                            <Icon
                                              name="save"
                                              size={20}
                                              color="white"
                                            />
                                    }></Button>
                                </View>
                                
                            </View>
                            
                        </View>
                    </View>
                    
                )
            }
            return (
                <View style={{ flex: 1 }}>
                    <Camera 
                        pictureSize="800x600" 
                        ratio="4:3" 
                        quality={0.1} 
                        ref={ ref =>{this.camera = ref}} style={{ flex: 1 }} type={this.state.type} ratio="16:9">
                        <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            flexDirection: 'column',
                            justifyContent:'flex-end'
                        }}>
                            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                                <TouchableOpacity
                                    onPress={ ()=>{this.props.navigation.goBack()}}
                                    style={{
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    bottom:45,
                                    padding:10
                                    }}
                                    >
                                    <Ionicons name="md-close" size={26} color="white"></Ionicons>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={ ()=>{this.takePicture()}}
                                    style={{
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    bottom:45,
                                    padding:10
                                    }}
                                    >
                                    <Ionicons name="md-radio-button-off" size={64} color="white"></Ionicons>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={ ()=>{this.props.navigation.navigate({routeName:'Gallery', params:{ attach:attach}})}}
                                    style={{
                                    alignSelf: 'center',
                                    alignItems: 'center',
                                    bottom:45,
                                    padding:10
                                    }}>
                                    <Ionicons name="md-apps" size={26} color="white"></Ionicons>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                    </Camera>
                </View>
            );
        }
  }
}

const mapStateToProps = state => {
    return {
        order: state.orderSelect.order,
        pIndex:state.orderSelect.processIndex,
        aIndex:state.orderSelect.activityIndex,
        token:state.token.data.token,
        activity: state.orderSelect.order.process[state.orderSelect.processIndex].checkList[state.orderSelect.activityIndex]
    }
}

const matDispatchToProps = dispatch => {
    return {
        setOrder: (order)=> dispatch(SetOrder(order))
    }
}

export default connect(mapStateToProps, matDispatchToProps)(CameraComponent)