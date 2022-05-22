import React, { Component } from 'react';

import { Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import { Button, Badge } from 'react-native-elements';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';

import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

import { connect } from 'react-redux';
import { SetOrder, SetActividadFondo, CargarVideo, CargarFoto, setMensaje, CargarArchivos } from '../.././../actions';
import { styles } from '../../../styles';
import { Video } from 'expo-av';
import moment from 'moment';
// import { registrarAdjunto, cargarArchivoS3 } from '../../../api/video/video.srv';



const ratiosOrder = {
    '4:3': '16:9',
    '16:9': '4:3',
};

const flashModeOrder = {
    off: 'torch',
    torch: 'off',
};

let videoACargar
const datosCargaVideo = {
    data: {
        orden: {},
        id: '',
        indexActividad: '',
        indexProceso: '',
        token: '',
        adjuntos: []
    }
}

let fotoACargar
const datosCargaFoto = {
    data: {
        orden: {},
        id: '',
        indexActividad: '',
        indexProceso: '',
        token: '',
        adjuntos: []
    }
}

class CamaraComponente extends Component {

    constructor(props){
        super(props)
        this.state = { 
            hasPermissionCamara: null,
            hasPermissionGrabarAudio: null,
            hasPermissionRolloCamara: null,
            type: Camera.Constants.Type.back,
            video: null,
            fotografia: null,
            contador: 0,
            grabando: false,
            intervalo: null,
            photoUri:'',
            photo:null,
            uploading:false,
            orderId:'', activityIndex:'', processIndex:'', token:'',
            attach:[],
            order:{},

            flash: 'off',
            autoFocus: 'on',
            type: 'back',
            whiteBalance: 'auto',
            ratio: '16:9',
            ratios: [],
            ratioId: 0,
            pictureSize: undefined,
            pictureSizes: [],
            pictureSizeId: 0,
            pictureTakeStartTime: undefined,
            cargandoFoto: false,
            uploadId: ''
        }
        
    }

    async UNSAFE_componentWillMount() {

        console.log('Componente Camara activado')
        
        const permisoCamara = await Permissions.askAsync(Permissions.CAMERA);
        
        this.setState({ 
            hasPermissionCamara: permisoCamara.status === 'granted',
        });

        const permisoAudio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        
        this.setState({ 
            hasPermissionGrabarAudio: permisoAudio.status === 'granted'
        });

        const permisosRolloCamara = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
        this.setState({ 
            hasPermissionRolloCamara: permisosRolloCamara.status === 'granted'
        });

    }

    solicitarPermisos =  async () => {
        const permisoCamara = await Permissions.askAsync(Permissions.CAMERA);
        
        this.setState({ 
            hasPermissionCamara: permisoCamara.status === 'granted',
        });

        const permisoAudio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        
        this.setState({ 
            hasPermissionGrabarAudio: permisoAudio.status === 'granted'
        });

        const permisosRolloCamara = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        
        // const permisosRolloCamara = await Permissions.askAsync(Permissions.);
        this.setState({ 
            hasPermissionRolloCamara: permisosRolloCamara.status === 'granted'
        });
    }
    
    static navigationOptions = {
        header:null
    };

    componentDidMount() {

       
        
        const orderId = this.props.order._id
        const activityIndex = this.props.aIndex;
        const processIndex = this.props.pIndex;
        const token = this.props.token;
        const attach = this.props.activity.attach;
        const order = this.props.order;
        
        this.setState({
            orderId:orderId, 
            activityIndex:activityIndex, 
            processIndex:processIndex,
            token:token, 
            attach:attach,
            order:order
         });
    }
    
    takePicture = async ()=>{
        
        if (this.camera) {

            const data = await this.camera.takePictureAsync({
                skipProcessing: false,
                quality: 1,
                exif: false,
                base64: false
            })
 
            const asset = await MediaLibrary.createAssetAsync( data.uri )


            this.setState({
                photoUri: asset.uri, 
                photo: asset, 
                fotografia: asset 
            })

        }
    }

    tomarVideo = async () => {

        if ( this.camera ) {
            this.setState({ grabando: true }, async () => {

                let video
                const dispositivo = Platform.select({
                    android: Constants.deviceName
                })
                if ( dispositivo === 'SM-P600' ) {
                    try {
                        video = await this.camera.recordAsync({
                            maxDuration: this.props.datosCuenta.generales.video.duracion
                        })
                    } catch ( error ) {
                        console.log('Error al capturar el video: ', error );
                        // this.props.mensaje('Error al capturar el video, por favor intente nuevamente', true );
                    }
                } else {
                    try {
                        video = await this.camera.recordAsync({ 
                            quality: Camera.Constants.VideoQuality["4:3"],
                            maxDuration: this.props.datosCuenta.generales.video.duracion
                        })
                    } catch ( error ) {
                        console.log('Error al capturar el video: ', error )
                        // this.props.mensaje('Error al capturar el video, por favor intente nuevamente', true );
                    }
                }
                this.setState({ video })
            })
            
        }
    }

    detenerGrabacion = async () => {
        if ( this.camera ) {
            this.setState({
                grabando: false,
                contador: 0
            }, async () => {
                this.camera.stopRecording()
            })
            
        }
    }
    
    guardarVideo = async () => {
        const { video } = this.state;
        const asset = await MediaLibrary.createAssetAsync( video.uri )
        if ( asset ) {
            this.setState({ video: null, cargandoForo: false })
            await this.guardarVideoEnServidor(asset)
            
        }
    }

    eliminarVideo = () => {
        this.setState({ video: null })
    }

    toggleVideo = () => {
        const { grabando } = this.state;

        if ( grabando ) {
            this.detenerGrabacion()
            clearInterval(this.state.intervalo)
        } else {
            this.setState({
                intervalo: setInterval( () => {
                    this.setState({ contador: this.state.contador + 1  })
                }, 1000)
            })
                
            this.tomarVideo()
        }
    }

    onPictureSaved = async () => {
        const { fotografia } = this.state;
        this.setState({
            photoUri: '', 
            photo: null, 
            newPhotos: true,
            cargandoFoto: false
        }, () => {
            this.savePhotoOnServer(fotografia)
        })
        
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



    savePhotoOnServer= async ( photo )=>{
        
        const extension = photo.filename.split('.')[1];
        const type = photo.mediaType + '/' + extension

        const adjuntos = this.state.attach;
        adjuntos.push({
            url: '',
            type: photo.filename.split('.')[1],
            name: photo.filename,
            date: new Date( Date.now() ),
            cargado: {
                url: photo.uri,
                estatus: false
            }
        })

        this.props.cargaArchivos({
            id: this.state.orderId,
            indexActividad: this.state.activityIndex,
            indexProceso: this.state.processIndex,
            adjuntos: adjuntos,

            uri: photo.uri,
            name: photo.filename,
            type: type
        })

    }

    guardarVideoEnServidor = async ( video ) => {

        console.log('video.mediaType: ', video.mediaType)
        const extension = video.filename.split('.')[1];
        const type = video.mediaType + '/' + extension


        // version 2 carga de videos

        const adjuntos = this.state.attach;
        adjuntos.push({
            url: '',
            type: video.filename.split('.')[1],
            name: video.filename,
            date: new Date( Date.now() ),
            cargado: {
                url: video.uri,
                estatus: false
            }
        })

        this.props.cargaArchivos({
            id: this.state.orderId,
            indexActividad: this.state.activityIndex,
            indexProceso: this.state.processIndex,
            adjuntos: adjuntos,
            
            uri: video.uri,
            name: video.filename,
            type: type
        })

    }

    toggleRatio = () => {
        this.setState({ ratio: ratiosOrder[this.state.ratio] });
        this.collectPictureSizes(ratiosOrder[this.state.ratio]);
    }

    previousPictureSize = () => this.changePictureSize(1);
    nextPictureSize = () => this.changePictureSize(-1);
    toggleFlash = () => this.setState({ flash: flashModeOrder[this.state.flash] });

    changePictureSize = direction => {
        let newId = this.state.pictureSizeId + direction;
        const length = this.state.pictureSizes.length;
        if (newId >= length) {
          newId = 0;
        } else if (newId < 0) {
          newId = length -1;
        }
        this.setState({ pictureSize: this.state.pictureSizes[newId], pictureSizeId: newId });
    }

    collectPictureSizes = async (ratio) => {
        ratio = ratio || this.state.ratio;
        if (this.camera) {
            const pictureSizes = await this.camera.getAvailablePictureSizesAsync(ratio);

            let pictureSizeId = 0;
            if (Platform.OS === 'ios') {
            pictureSizeId = pictureSizes.indexOf('High');
            } else {
            // returned array is sorted in ascending order - default size is the largest one
            // pictureSizeId = pictureSizes.length-1;
            pictureSizeId = 0;
            }
            this.setState({ pictureSizes, pictureSizeId, pictureSize: pictureSizes[pictureSizeId] });
        }
    };

    comprobarIntervalo = () => {
        if ( this.state.contador === this.props.datosCuenta.generales.video.duracion ) {
            
            this.detenerGrabacion()
            clearInterval( this.state.intervalo )
        }
    }

    botonesCamara = () => {
        const { grabando, attach } = this.state;

        if ( grabando ) {
            return <View style={{flexDirection:'row', justifyContent:'space-around'}}>
                    
                    <TouchableOpacity
                        onPress={ ()=>{this.toggleVideo()}}
                        style={{
                        alignSelf: 'center',
                        alignItems: 'center',
                        bottom:45,
                        padding: 10
                        }}>
                        <View>
                            <Icon name={grabando ? "stop-circle" : "play-circle"} size={64} color="white"/>
                            <Badge
                                value={<Text style={{margin:5}}>{ moment(this.state.contador, 'ss').format('mm:ss') }</Text>}
                                status="error"
                                containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                            />
                        </View>
                    </TouchableOpacity>

                </View>
        } else {
            return <View style={{flexDirection:'row', justifyContent:'space-around'}}>
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

            {this.props.datosCuenta.generales.video.activo? <TouchableOpacity
                onPress={ ()=>{this.toggleVideo()}}
                style={{
                alignSelf: 'center',
                alignItems: 'center',
                bottom:45,
                padding: 10
                }}>
                <View>
                    <Icon name={grabando ? "stop-circle" : "play-circle"} size={64} color="white"/>
                    {grabando ? <Badge
                        value={<Text style={{margin:5}}>{ moment(this.state.contador, 'ss').format('mm:ss') }</Text>}
                        status="error"
                        containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                    /> : null }
                </View>
            </TouchableOpacity>: null }

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
        }
    }

    render(){
        const { 
            hasPermissionCamara, 
            hasPermissionGrabarAudio, 
            hasPermissionRolloCamara, 
            photoUri, 
            loading,
            type,
            video
        } = this.state

        if( hasPermissionCamara === null || hasPermissionGrabarAudio === null || hasPermissionRolloCamara === null ) {
            return <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                
                    <Text>Permisos</Text>
                    <Text>
                        No es posible utilizar las funciones de la camara sin antes conceder permisos.
                    </Text>
                    <Button title="Permisos" onPress={ ()=> this.solicitarPermisos() } />
                
            </View>
        }

        if( hasPermissionCamara === false || hasPermissionGrabarAudio === false || hasPermissionRolloCamara === false) {
            return <View style={{flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        
                    <Text>Permisos</Text>
                    <Text>
                        No es posible utilizar las funciones de la camara sin antes conceder permisos.
                    </Text>
                    <Button title="Permisos" onPress={ ()=> this.solicitarPermisos() } />
                
            </View>
        }


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
                                    onPress={ ()=> this.setState({ cargandoFoto: true }, ()=>{ this.onPictureSaved() } )}
                                    title=" GUARDAR " 
                                    loadingProps={{size:"small", color:"#0000ff"}}
                                    style={{marginHorizontal:15}}
                                    loading={this.state.cargandoFoto}
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

        if (video && video.uri) {
            return (
                <View style={{ flex: 1, flexDirection:'column'}}>
                    <View style={{
                        flex:1,
                        backgroundColor: 'black',
                        flexDirection:'column',
                        justifyContent: 'space-between'
                    }}>
                        <Video
                        source={{ uri: video.uri }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        useNativeControls={true}
                        style={{ flex:1, width: '100%', height: 'auto', marginBottom:60 }}
                        />

                        <View style={{ 
                            flexDirection:'row', 
                            justifyContent: 'center', 
                            alignContent:'center',
                            alignItems:'center',
                            bottom:30,
                            backgroundColor: 'black'
                            }}>
                            
                            <View style={{marginHorizontal:5}}>
                                <Button
                                    onPress={ ()=> this.eliminarVideo()}
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
                                    onPress={ ()=> this.setState({ cargandoForo: true }, ()=> { this.guardarVideo() })  }
                                    title=" Guardar video " 
                                    style={{marginHorizontal:15}}
                                    loading={ this.state.cargandoForo}
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
                    style={{ flex: 1 }}
                    onCameraReady={this.collectPictureSizes}
                    ratio={this.state.ratio}
                    pictureSize={this.state.pictureSize}
                    quality={0.1} 
                    type={type}
                    flashMode={this.state.flash}
                    ref={ ref => {this.camera = ref}} 
                    style={{ flex: 1 }} 
                    type={type}
                    >
                    <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        flexDirection: 'column',
                        justifyContent:'space-between'
                    }}>
                        <View style={{ flexDirection:'row', justifyContent:'space-around'}}>
                            <TouchableOpacity
                                onPress={this.previousPictureSize}
                                style={{
                                alignSelf: 'center',
                                alignItems: 'center',
                                top:45,
                                padding:10
                                }}
                                >
                                <Ionicons name="md-arrow-dropleft" size={26} color="white"></Ionicons>
                            </TouchableOpacity>
                            <View style={{ 
                                alignSelf: 'center',
                                alignItems: 'center',
                                top:45,
                                padding:10
                             }}>
                                <Text style={{color: 'white'}}>{this.state.pictureSize}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={this.nextPictureSize}
                                style={{
                                alignSelf: 'center',
                                alignItems: 'center',
                                top:45,
                                padding:10
                                }}
                                >
                                <Ionicons name="md-arrow-dropright" size={26} color="white"></Ionicons>
                            </TouchableOpacity>

                            <TouchableOpacity
                                // onPress={this.toggleRatio}
                                style={{
                                alignSelf: 'center',
                                alignItems: 'center',
                                top:45,
                                padding:10
                                }}
                                >
                                 <Text style={{color: 'white'}}>Duracion: {this.props.datosCuenta.generales.video.duracion}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={this.toggleRatio}
                                style={{
                                alignSelf: 'center',
                                alignItems: 'center',
                                top:45,
                                padding:10
                                }}
                                >
                                 <Text style={{color: 'white'}}>Ratio: {this.state.ratio}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={this.toggleFlash}
                                style={{
                                alignSelf: 'center',
                                alignItems: 'center',
                                top:45,
                                padding:10
                                }}
                                >
                                 <Ionicons name="md-flash" size={26} color="white"></Ionicons>
                            </TouchableOpacity>
                        </View>
                        {this.botonesCamara()}
                        
                    </View>
                    {this.comprobarIntervalo()}
                </Camera>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        datosCuenta: state.account.data,
        order: state.orderSelect.order,
        pIndex:state.orderSelect.processIndex,
        aIndex:state.orderSelect.activityIndex,
        token:state.token.data.token,
        activity: state.orderSelect.order.process[state.orderSelect.processIndex].checkList[state.orderSelect.activityIndex]
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setOrder: (order)=> dispatch(SetOrder(order)),
        setActividadFondo: ( evento ) => dispatch( SetActividadFondo( evento ) ),
        // cargarVideo: ( payload ) => dispatch( CargarVideo( payload )),
        // cargarFoto: ( payload ) => dispatch( CargarFoto( payload )),
        cargaArchivos: ( payload ) => dispatch( CargarArchivos( payload ) )
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(CamaraComponente)

