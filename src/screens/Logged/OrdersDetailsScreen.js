import React, { Component } from 'react';
import { View, ScrollView, ProgressBarAndroid, StyleSheet } from 'react-native';
import { Text, ListItem, Button, Icon } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { SelectProcess, SelectOrder, setMensaje } from '../../actions';
import NavBar from '../../component/Header';
import { styles, comp } from '../../styles';
import { getOrderById } from '../../api/workshop/getOrders';
import { VISUAL_ASIGNACION } from '../../constants';
import Asignaciones from '../../component/v2/Asignados';
import IndicadorCarga from '../../component/v2/IndicadorCarga';
import PreLoader from '../../component/PreLoader';
import CampanasServicio from '../../component/v2/Campanas-servicio';
import { consultaVin } from '../../api/campanas-servicio/campanas-servicio';

class OrdersDetailsScreen extends Component {

    state = {
        loading: true,
        listo: false,
        campanas: []
    }

    componentDidMount = () => {
        this.getOrder();
    }

    getOrder = async () => {
        
        this.setState({loading: true})
        try {
            const order = await getOrderById({ id: this.props.order._id})
            this.props.selectOrder(order)
            this.setState({ loading: false, listo: true })
            await this.consultarCampanas()

        } catch ( error ) {
            this.setState({ loading: false, listo: true })
            this.props.modalMensaje('Ocurrio un error al obtener la orden', true )
            
        }
    }
    
    renderProcess = ()=> {
        const { process } = this.props.order;
        if(process && process.length>0){
            return process.map( (i, index)=> {
                let activitysCompleted = 0;
                let completed = true;
                let totalActivity = i.checkList.length;
                i.checkList.map( (j)=>{
                    
                    if(j.answer && !j.answer.answer){
                        completed = false;
                    } else {
                        activitysCompleted += 1
                    }
                })
                const progress = activitysCompleted/totalActivity;
                
                return <ListItem
                    onPress={()=> {this.props.selectProcess(index); this.props.navigation.navigate('Process')}}
                    key={i.id? i.id:index+Math.random()}
                    title={i.name}
                    subtitle={
                        <View>
                            <Text style={{ color:'#6c757d'}}>{i.description}</Text>
                            <Asignaciones modo={VISUAL_ASIGNACION.ABREVIADO} asignado={i.asignado} />   
                        </View>
                        
                    }
                    chevron={!completed}
                    checkmark={completed}
                    bottomDivider={process.length-1 !== index}
                    rightElement={<ProgressBarAndroid styleAttr="Horizontal" progress={progress||0} indeterminate={false} />}
                    // badge={{ value:i.checkList.length, textStyle: { color: 'white' } }}
                />
            } )
        }
    }

    consultarCampanas = async () => {
        const { vin } = this.props.order;
        let respuestaCampanas;
        try {
            respuestaCampanas = await consultaVin({
                vin: vin
            })
            if ( respuestaCampanas.estatus ) {
                this.setState({
                    campanas: respuestaCampanas.data.campanas
                })
            }
        } catch (error) {
            console.error('Error al consultar las campanas de servicio: ', error)
        }
    }

    renderCampanasServicio = () => {

        const { campanas } = this.state;

        if ( campanas && campanas.length > 0 ) {
            return campanas.map( (i, index) => {
                return <CampanasServicio 
                    key={`${i.codigo}-${index}`}
                    tipo={i.tipo}
                    codigo={i.codigo}
                    nombre={i.nombre}/>
            } )
        } else {
            return null;
        }
        
        
        
    }

    SelectList = () => {
        const { order } = this.props;
        
        if (order.list?.list) {
            return <Button 
                        buttonStyle={styles.button_primary}
                        containerStyle={styles.button}
                        onPress={()=> this.props.navigation.navigate('Notes')} 
                        title="Solicitudes" type='outline' />
        } else {
            return <Button 
                        buttonStyle={styles.button_primary}
                        containerStyle={styles.button}
                        onPress={()=> this.props.navigation.navigate('SelectList')} 
                        title="Seleccionar" type='outline' />
        }
    }

    ordenBloqueada = () => {
        const { status } = this.props.order;

        if( status && status.cerrado.estatus){
            return <View style={{ 
                backgroundColor:'white', 
                marginTop:15, 
                borderRadius:25, 
                paddingHorizontal:20, 
                paddingVertical:16}}>
                    <Icon name='lock' size={40} iconStyle={{color: comp.f}} />
                    <Text h4 style={{ textAlign:'center', color: comp.primary}}>Orden Cerrada</Text>
                    <Text style={{ textAlign:'center'}}>
                        Está orden se encuentra cerrada, para continuar 
                        editando debe abrirla en el tablero de control
                    </Text>
                    {this.renderProcesos()}
            </View>
        } else {
            return null
        }
        
    }

    renderProcesos = () => {
        const { process } = this.props.order;
    }




    render(){
        if ( this.state.loading || !this.state.listo ) {
            return <PreLoader></PreLoader>
        }
        
        const { order } = this.props;
        const { status } = order
        return (
            <View style={{backgroundColor:"#eee", flex:1, flexDirection:'column'}}>
                <NavigationEvents onDidFocus={()=> this.getOrder() } />
                <NavBar
                    leftIcon={'home'}
                    leftAction={()=>this.props.navigation.navigate('Ordes')}
                    rightAction={()=>this.props.navigation.goBack()}
                    rightIcon={'arrow-back'}></NavBar>
                <ScrollView>
                    <IndicadorCarga />

                    {this.renderCampanasServicio()}
                    <View style={{backgroundColor:'white', borderRadius:25, paddingHorizontal:0, paddingVertical:20}}>
                        <ListItem
                            title={order.id}
                            titleStyle={ styles.orderDetailsTitle }
                            subtitle="Número de Orden"
                        />
                        <View style={{paddingHorizontal:14, flexDirection:'row', justifyContent:"space-between"}}>
                            <Text style={styles.orderDetailsModel}>{order.brand} {order.model} {order.year}</Text>
                            <Text style={{fontWeight:"bold", textTransform:'uppercase'}}>{order.plate}</Text>
                        </View>
                        {order.kiolometers||order.vin?<View style={{paddingHorizontal:14}}>
                            <Text>KM. {order.kiolometers}</Text>
                            <Text>VIN. {order.vin}</Text>
                        </View>:null}
                        <View style={{marginTop:15, paddingHorizontal:14}}>
                            {order.name||order.last_name?<Text style={{textTransform:'uppercase'}}>{order.name} {order.last_name}</Text>:null}
                            {order.nit?<Text>{order.nit}</Text>:null}
                            {order.telephone?<Text>{order.telephone}</Text>:null}
                            {order.email?<Text>{order.email}</Text>:null}
                        </View>
                    </View>

                    <View style={{flexDirection:'row', justifyContent:'space-between', borderRadius:25, paddingHorizontal:14, paddingVertical:20}}>
                        {/* <Text style={{color:'blue'}}>{order.list.list}</Text>
                        <Button title="Solicitudes" type='outline' /> */}
                        
                    </View>

                    {!status.cerrado.estatus? <ListItem
                        title={order?.list?.list || 'Aún no se ha seleccionado'}
                        subtitle="Lista de procesos"
                        rightElement={this.SelectList()} /> : null}

                    {!status.cerrado.estatus?<View  style={{backgroundColor:'white', marginTop:15, borderRadius:25, paddingHorizontal:7, paddingVertical:16}}>
                        {this.renderProcess()}
                    </View> : null }
                    {this.ordenBloqueada()}
                </ScrollView>
            </View>
        )
    }
}
const mapStateToProps = state => {
    return {
        order: state.orderSelect.order
    }
}
const mapDispatchToProps = dispatch => {
    return {
        selectProcess: (index) => dispatch(SelectProcess(index)),
        selectOrder: (order) => dispatch(SelectOrder(order)),
        modalMensaje: (mensaje, visible) => dispatch(setMensaje(mensaje, visible))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OrdersDetailsScreen)