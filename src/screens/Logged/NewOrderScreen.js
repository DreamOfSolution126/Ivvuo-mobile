import React, { Component, Fragment } from 'react';
import { View, StyleSheet, Picker, Dimensions, KeyboardAvoidingView, SafeAreaView, ScrollView} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import { Input, Text, Icon, Button, colors } from 'react-native-elements';
import Toast from 'react-native-simple-toast';

import { connect } from 'react-redux';
import { getProcess } from '../../api/process';
import { newOrder } from '../../api/workshop/getOrders';
import PreLoaderComponent from '../../component/PreLoader';
import { SelectOrder, GetOrders} from '../../actions';
import NavBar from '../../component/Header';
const { width } = Dimensions.get('window');
const widthFixed = width * 0.12;
import { styles, comp } from '../../styles';

const initialState = {
    buttonLoading:false,
    order:{},
    listArray:[], 
    loading:true,
    errorMessagePlate:'',
    errorMessageId:'',
    errorMessageVIN:'',
    kiolometers: '',
    vin: ''
}
class NewOrderScreen extends Component {
    constructor(props){
        super(props)
        this.state = initialState
    }
    componentDidMount(){
        // console.log( this.props.user )
        this.obtenerProcesos()
    }

    obtenerProcesos = () => {
        getProcess({account_code:this.props.account.code})
        .then( data=>{
            this.setState({ listArray:data, loading:false })
        }).catch( error => {
            console.log(error)
        })
    }

    createOrder = () => {
        this.setState({ buttonLoading: true })
        const { plate, id, list, listArray, kiolometers, vin } = this.state;
        
        let listSelect = {};
        if(!plate){
            this.setState({errorMessagePlate:'Por favor completa la placa', buttonLoading: false})
            return;
        }
        if(!this.props.center.generateOrAuto && !id){
            this.setState({errorMessageId:'Por favor completa el número de orden', buttonLoading: false})
            return;
        }
        if(!list){
            this.setState({buttonLoading: false})
            return Toast.showWithGravity('Por favor elige un proceso de la lista desplegable', Toast.LONG, Toast.BOTTOM)
        }
        for(let i of listArray){
            if(i._id == list){
                listSelect = i;
            }
        }

        const nameUser = this.props.user.name+' '+this.props.user.last_name

        this.setState({
            order:{
                id:id,
                accountId: this.props.account._id,
                centerId: this.props.center._id,
                center_code: this.props.center.code,
                create: new Date( Date.now() ),
                account_code: this.props.account.code,
                address_center: this.props.center.address,
                account: this.props.account.name,
                center: this.props.center.name,
                nit_account: this.props.account.nit,
                logo: this.props.account.logo,
                address_account: this.props.account.address_account,
                city_account: this.props.account.city_account,
                country_account: this.props.account.country_account,
                generateOrAuto: this.props.center.generateOrAuto,
                telephone_account: this.props.account.telephone_account,
                kiolometers: kiolometers,
                plate: plate,
                list: listSelect,
                vin: vin,
                creadoBy: {
                    nombres: nameUser, 
                    email: this.props.user.email, 
                    id: this.props.user._id
                },
                status: {}

            }
        }, ()=>{
            newOrder(this.state.order)
            .then( data=>{
                this.setState(initialState)
                Toast.showWithGravity('Se ha creado la orden con exito', Toast.LONG, Toast.BOTTOM)
                this.props.selectOrder(data);
                this.props.getOrders({center_code: this.props.center.code})
                setTimeout( ()=>{
                    this.props.navigation.navigate('Details')
                }, 2000 )
                
            } ).catch( error =>{
                Toast.showWithGravity('Ocurrió un error al crear la OR', Toast.LONG, Toast.BOTTOM)
            })
        })
    }

    render(){
        const { listArray, loading, buttonLoading } = this.state;
        
        if(loading){
            return (<Fragment>
                <NavigationEvents onDidFocus={() => this.obtenerProcesos()} />
                <PreLoaderComponent/>
            </Fragment>
            )
        }
        return (
            <SafeAreaView style={{ flex: 1, justifyContent:'center' }}>
                <ScrollView
                    style={{ 
                        flex:1, 
                        backgroundColor:'#eee',
                        flexDirection:'column'
                        }}>
                    <NavBar
                        leftIcon={'home'}
                        leftAction={()=>this.props.navigation.navigate('Ordes')}
                        rightAction={()=>this.props.navigation.goBack()}
                        rightIcon={'arrow-back'}></NavBar>

                    <View style={{ flexDirection:'column', margin:14 }}>
                        <Text h4 style={styles.text_dark}>Nueva orden</Text>
                        {!this.props.center.generateOrAuto?<Input
                            type="text"
                            onChangeText={(id) => this.setState({id})}
                            containerStyle={styles.containerStyle}
                            inputContainerStyle={styles.inputContainer}
                            label='Número de orden'
                            placeholder='número de orden'
                            errorMessage={this.state.errorMessageId}
                            leftIcon={
                                <Icon
                                name='bookmark'
                                size={24}
                                color={comp.f}
                                />
                            }
                        />:null}

                        <Input
                            type="number"
                            keyboardType="number-pad"
                            onChangeText={(kiolometers) => this.setState({kiolometers})}
                            containerStyle={styles.containerStyle}
                            inputContainerStyle={styles.inputContainer}
                            label='Kilometraje'
                            placeholder='Kilometraje'
                            leftIcon={
                                <Icon
                                name='directions-car'
                                size={24}
                                color={comp.f}
                                />
                            }
                        />

                        <Input
                            type="text"
                            keyboardType="web-search"
                            onChangeText={(plate) => this.setState({plate})}
                            containerStyle={styles.containerStyle}
                            inputContainerStyle={styles.inputContainer}
                            label='Placa'
                            placeholder='Placa'
                            errorMessage={this.state.errorMessagePlate}
                            leftIcon={
                                <Icon
                                name='directions-car'
                                size={24}
                                color={comp.f}
                                />
                            }
                        />

                        <Input
                            type="text"
                            keyboardType="web-search"
                            onChangeText={(vin) => this.setState({vin})}
                            containerStyle={styles.containerStyle}
                            inputContainerStyle={styles.inputContainer}
                            label='VIN'
                            placeholder='VIN'
                            leftIcon={
                                <Icon
                                name='directions-car'
                                size={24}
                                color={comp.f}
                                />
                            }
                        />

                        <Picker
                            style={styles.inputs}
                            mode="dropdown"
                            selectedValue={this.state.list}
                            onValueChange={(itemValue)=> this.setState({list:itemValue})}
                            itemStyle={{ backgroundColor: "grey", color: "blue", fontFamily:"Ebrima", fontSize:17 }}
                            >
                            <Picker.Item label="Elige un lista de Proceso"></Picker.Item>
                            {listArray.map((item, index) => {
                                return (< Picker.Item label={item.list} value={item._id} key={index} />);
                            })}
                        </Picker>

                        <View style={{marginTop:14, alignContent:'stretch', flexDirection:'row', justifyContent:'flex-end'}}>
                            <Button
                                buttonStyle={styles.button_primary}
                                containerStyle={styles.button}
                                onPress={()=> this.createOrder()}
                                loading={buttonLoading}
                                disabled={buttonLoading}
                                type='outline'
                                title="CREAR ORDEN"
                                titleStyle={styles.text_primary}
                            />
                        </View>
                    </View>
                    
                </ScrollView>
            </SafeAreaView>
            
        )
    }
}

const mapStateToprops = state => {
    return {
        account: state.account.data,
        center: state.center.data,
        user: state.user.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        selectOrder: (order)=> dispatch(SelectOrder(order)),
        getOrders: (body)=> dispatch(GetOrders(body))
    }
}

export default connect(mapStateToprops, mapDispatchToProps)(NewOrderScreen);