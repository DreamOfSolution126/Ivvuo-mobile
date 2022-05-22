import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import GallerySwiper from 'react-native-gallery-swiper';
import Toast from 'react-native-simple-toast';
import { Text, Button, Badge, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { SetOrder, SelectActivity, ReintentarCargarArchivosRegistrados } from '../../actions';
import NavBar from '../../component/Header';
import IconStatus from '../../component/IconStatus';
import { setActivityAnswer } from '../../api/workshop/getOrders';
import { styles, comp } from '../../styles';
import IndicadorCarga from '../../component/v2/IndicadorCarga';
import moment from 'moment';
import Titulo from '../../component/v2/Titulos';

const { height } = Dimensions.get('screen')

class ActivityScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            renderizarGaleria: false
        }
    }

    componentDidMount(){
        this.setState({
            renderizarGaleria: true
        })
    }

    renderAnswerOptions = () =>{
        let { asnwer_options, answer, type } = this.props.activity;
        
        if(asnwer_options && asnwer_options.length>0){

            return asnwer_options.map( (i, index) => {
                return <Button  
                    key={`${i.value}` + index}
                    containerStyle={{ marginVertical:5 }}
                    type={ i.answer===answer.answer ? 'solid' : 'outline'}
                    title={i.answer}
                    onPress={()=> this.setAnswer(i)}
                    buttonStyle={{ 
                        backgroundColor: i.value===0 && i.answer===answer.answer ? '#dc3545' : //rojo
                        i.value===1 && i.answer===answer.answer ? '#ffc107': //amarillo
                        i.value===2 && i.answer===answer.answer ? '#28a745' : //verde
                        i.value===99 && i.answer===answer.answer ? '#6c757d': 
                        'white'
                    }}
                />
            } )
        }
    }

    setAnswer = (answer)=>{
        const { order, pIndex, aIndex } = this.props;
        let temporalOrder = order;
        temporalOrder.process[pIndex].checkList[aIndex].answer = answer;

        setActivityAnswer(order._id, pIndex, aIndex, answer)
        .then( (data)=>{
            this.props.setOrder(temporalOrder);
            Toast.showWithGravity('Se han guardado los cambios', Toast.LONG, Toast.BOTTOM);
        } ).catch( error =>{
            console.log(error)
            Toast.showWithGravity(error.message, Toast.LONG, Toast.BOTTOM);
        })
        
    }

    renderImage = () => {
        const { attach } = this.props.activity;
        const { renderizarGaleria } = this.state;

        if (attach && attach.length>0) {
            console.log('Adjuntos: ', attach);
           return <View style={{flex:1, marginVertical:16, backgroundColor:'white', borderRadius:25, paddingHorizontal:7, paddingVertical:10}}>
                    { attach.map( (i, index) => {
                        if (i.type === 'jpg' && i.cargado.estatus) {
                            return <ListItem
                                key={'jpg'+index}
                                onPress={()=> this.props.navigation.navigate({ routeName:'VisualizadorEvidencia', params:{ evidenciaSeleccionada:i, index: index } })}
                                title={'Evidencia '+ (index+1) }
                                subtitle={moment(i.date).format('DD MM YYYY hh:mm:ss a')}
                                leftAvatar={{ source: { uri: i.url }}}
                                badge={{ 
                                    value: i.type, 
                                    textStyle: { color: 'white', marginVertical:5, textTransform:'uppercase' }, containerStyle: { padding:5} }}
                            />
                        } else if (i.type === 'mp4' && i.cargado.estatus) {
                            return <ListItem
                                key={'mp4'+index}
                                onPress={()=> this.props.navigation.navigate({ routeName:'VisualizadorEvidencia', params:{ evidenciaSeleccionada:i, index: index } })}
                                title={'Evidencia '+ (index+1) }
                                subtitle={moment(i.date).format('DD MM YYYY hh:mm:ss a')}
                                leftIcon={{ name:'play-circle-filled', size:44}}
                                badge={{ 
                                    value: i.type, 
                                    textStyle: { color: 'white', marginVertical:5, textTransform:'uppercase' }, containerStyle: { padding:5} }}
                            />
                        } else if ( i.type === 'jpg' && !i.cargado.estatus ) {
                            return <ListItem
                                key={'jpg'+index}
                                onPress={ ()=> this.props.reintentarCarga({
                                    id: this.props.order._id,
                                    indexActividad: this.props.aIndex,
                                    indexProceso: this.props.pIndex,
                                    adjuntos: this.props.activity.attach,
                                    
                                    uri: i.cargado.url,
                                    name: i.name,
                                    type: 'image/jpg'
                                })}
                                title={'Pendiente de carga '+ (index+1) }
                                subtitle={moment(i.date).format('DD MM YYYY hh:mm:ss a')}
                                leftElement={
                                    <Icon name="arrow-circle-o-up" size={34} color={comp.secondary} ></Icon>
                                }
                                badge={{ 
                                    value: i.type, 
                                    textStyle: { color: 'white', marginVertical:5, textTransform:'uppercase' }, containerStyle: { padding:5} }}
                            />
                        } else if ( i.type === 'mp4' && !i.cargado.estatus ) {
                            return <ListItem
                                key={'mp4'+index}
                                onPress={ ()=> this.props.reintentarCarga({
                                    id: this.props.order._id,
                                    indexActividad: this.props.aIndex,
                                    indexProceso: this.props.pIndex,
                                    adjuntos: this.props.activity.attach,
                                    
                                    uri: i.cargado.url,
                                    name: i.name,
                                    type: 'video/mp4'
                                })}
                                title={'Pendiente de carga '+ (index+1) }
                                subtitle={moment(i.date).format('DD MM YYYY hh:mm:ss a')}
                                leftElement={
                                    <Icon name="arrow-circle-o-up" size={34} color={comp.secondary} ></Icon>
                                }
                                badge={{ 
                                    value: i.type, 
                                    textStyle: { color: 'white', marginVertical:5, textTransform:'uppercase' }, containerStyle: { padding:5} }}
                            />
                        }
                            
                        
                    } )}
                </View>
        } else {
            return <View style={{flex:1, marginVertical:16, backgroundColor:'white', borderRadius:25, paddingHorizontal:7, paddingVertical:10}}>
                <ListItem
                        title='Imagenes'
                        leftIcon={{ name:'camera'}}
                        badge={{ value: attach.length, textStyle: { color: 'white', marginVertical:5 }, containerStyle: { padding:5} }}
                    />
                <View style={{ height:height/6, marginLeft:7, marginRight:7, padding:10, borderRadius:25, borderWidth:0.8, borderColor:'white', flexDirection:'column', flex:1, alignItems:'center', justifyContent:'center', alignContent:'center'}}>
                    <Icon size={30} name="camera"/>
                    <Text style={{fontSize:16}}>Aún no hay imágenes ni videos</Text>
                    <Button 
                        onPress={()=> this.props.navigation.navigate('Camera')} 
                        type='outline' 
                        title="Abrir la camara" />
                </View>
                
            </View>
        }
    }

    renderComments = () => {
        const { comments } = this.props.activity;
        if(comments && comments.length){
            return <View style={{flex:1, marginVertical:16, backgroundColor:'white', borderRadius:25, paddingHorizontal:7, paddingVertical:10}}>
            {comments.map( (i)=> {
                return <ListItem
                    key={i.date}
                    title={i.text}
                    onPress={()=>this.props.navigation.navigate('Comments')}
                    chevron
                />
            })}
            </View>
        } else {
            return <View style={{flex:1, marginVertical:16, backgroundColor:'white', borderRadius:25, paddingHorizontal:7, paddingVertical:10}}>
                <ListItem
                    title={'Agregar comentarios'}
                    onPress={()=>this.props.navigation.navigate('Comments')}
                    leftIcon={{ name:"chat-bubble"}}
                    chevron
                />
            </View>
        }
    }

    pasarEntreActividades = (direccion) => {
        const indexActividadActual = this.props.aIndex;
        const actvidadesDisponibles = this.props.process.checkList.length
        this.setState({
            renderizarGaleria: false
        })
        if(direccion === 'adelante') {
            if( indexActividadActual + 1 === actvidadesDisponibles ) {
                console.log( 'No se puede seguir adelante')
            } else {
                this.props.selectActiviy( indexActividadActual + 1 )
                setTimeout( ()=> {
                    this.setState({
                        renderizarGaleria: true
                    })
                }, 1000 )
                
            }
        } else if( direccion === 'atras') {
            if( indexActividadActual - 1 === -1 ) {
                console.log( 'No se puede seguir atras')
            } else {
                this.props.selectActiviy( indexActividadActual - 1 )
            }
        }
        
    }

    botonSiguiente = () => {
        const indexActividadActual = this.props.aIndex;
        const actvidadesDisponibles = this.props.process.checkList.length
        
        if( indexActividadActual + 1 !== actvidadesDisponibles ) {
            return (<TouchableOpacity onPress={()=> this.pasarEntreActividades('adelante')} style={{flex:1, marginVertical:8, alignItems:'center', justifyAlign:'center'}}>
            <View>
                <Icon name="arrow-right" size={20}></Icon>
            </View>
            <Text style={styles.textIcon}>Siguiente</Text>
        </TouchableOpacity>)
        } else if( indexActividadActual - 1 !== -1 ) {
            return (<TouchableOpacity onPress={()=> this.props.navigation.navigate('Process')} style={{flex:1, marginVertical:8, alignItems:'center', justifyAlign:'center'}}>
            <View>
                <Icon name="list-ol" size={20}></Icon>
            </View>
            <Text style={styles.textIcon}>Proceso</Text>
        </TouchableOpacity>)
        }

        return null
    }

    
    render(){
        const { item, details, comments, attach, answer, type } = this.props.activity;
        
        return (
            <View style={{flex:1}}>
                <NavBar
                center={this.props.order.id}
                leftIcon={'home'}
                leftAction={()=>this.props.navigation.navigate('Ordes')}
                rightAction={()=>this.props.navigation.goBack()}
                rightIcon={'arrow-back'}></NavBar>
                
                <View style={{backgroundColor:"#eee", flex:1, flexDirection:'column'}}>
                    <IndicadorCarga />
                    <View style={{backgroundColor:'white', borderRadius:25, paddingHorizontal:7, paddingVertical:10, marginTop:5}}>
                        <ListItem
                            leftElement={<IconStatus size={26} answer={answer} type={type} />}
                            title={item}
                            subtitle={details}
                        />
                    </View>
                    <ScrollView>
                        
                        
                        <View>
                            <Titulo titulo="Evidencias" />
                            {this.renderImage()}
                        </View>

                        <View style={{
                            justifyContent:'space-evenly',
                            flex:1,
                            justifyContent:'center', 
                            alignItems: 'stretch'}}>

                            <Titulo titulo="Opciones de respuesta" />

                            <ScrollView horizontal={false} style={{ marginHorizontal:5 }}>
                                {this.renderAnswerOptions()}
                            </ScrollView>
                        </View>
                        <View style={{marginBottom:60, marginTop:10}}>
                            <Titulo titulo="Comentarios" />
                            {this.renderComments()}
                        </View>
                    </ScrollView>

                    <View style={{shadowColor: "#000", shadowOffset: {width: 0,height: 5}, shadowOpacity: 0.34, shadowRadius: 6.27, elevation: 10, backgroundColor:'#fff', marginTop:15, flexDirection:'row', justifyContent:'space-between', position:'absolute', alignSelf:'flex-end', bottom:0}}>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Comments')} style={{flex:1, marginVertical:8, alignItems:'center', justifyContent:'center'}}>
                            <View>
                                <Icon name="comments" size={20}></Icon>
                                {comments.length>0? <Badge value={comments.length} containerStyle={{ position: 'absolute', top: -4, right: -6 }} status="error"></Badge>:null}
                            </View>
                            <Text style={styles.textIcon}>Comentarios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.props.navigation.navigate('Camera')} style={{flex:1, marginVertical:8, alignItems:'center', justifyAlign:'center'}}>
                            <View>
                                <Icon name="camera" size={20}></Icon>
                                {this.props.activity.attach.length>0? <Badge value={this.props.activity.attach.length} containerStyle={{ position: 'absolute', top: -4, right: -6 }} status="error"></Badge>:null}
                            </View>
                            <Text style={styles.textIcon}>Camara</Text>
                        </TouchableOpacity>
                        {this.botonSiguiente()}
                    </View>
                </View>
            </View>
        )
    }
}


const mapStateToProps = state => {
    return {
        actividadFondo: state.actividadFondo,
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
        selectActiviy:(index)=>dispatch(SelectActivity(index)),
        reintentarCarga: (payload) => dispatch(ReintentarCargarArchivosRegistrados(payload))
    }
}

const Container = connect(mapStateToProps, mapDispatchToProps)(ActivityScreen)
export default Container