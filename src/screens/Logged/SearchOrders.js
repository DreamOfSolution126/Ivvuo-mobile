import React, { Component } from 'react';
import { View, Dimensions, KeyboardAvoidingView } from 'react-native';
import { Input, Button, Text, Icon } from 'react-native-elements';
import NavBar from '../../component/Header';
import { connect } from 'react-redux';
import { styles } from '../../styles';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

import { GetOrders } from '../../actions';

const { height } = Dimensions.get('screen');
class SearchOrdersScreen extends Component {
    constructor(props){
        super(props)
        this.state = { 
            plate:'', 
            loading:false,
            dateInit: moment().subtract( 8, 'days').format('YYYY-MM-DD'),
            dateEnd: moment().format('YYYY-MM-DD'),
            isDatePickerVisible: false,
            typeDate:''
        }
    }

    showDatePicker = (typeDate) => {
        
        this.setState({
            isDatePickerVisible: true,
            typeDate: typeDate
        })
    };
     
    hideDatePicker = () => {
        this.setState({
            isDatePickerVisible: false
        })
    };

    handleConfirm = (date) => {
        const { typeDate } = this.state;
        if(typeDate === 'init') {
            this.setState({
                dateInit: moment( date ).format('YYYY-MM-DD'),
                isDatePickerVisible: false
            });
        }
        if(typeDate === 'end') {
            this.setState({
                dateEnd: moment( date ).format('YYYY-MM-DD'),
                isDatePickerVisible: false
            })
        }
    };

    searchOrder = () => {
        const { plate, dateInit, dateEnd } = this.state;
        if(plate){

        }
        this.setState({loading:true})
        this.props.getOrders({
            plate: this.converUppercase(plate),
            dateInit: dateInit,
            dateEnd: dateEnd
        })
        setTimeout( ()=>{
            this.setState({loading:false})
            this.props.navigation.navigate('Ordes')
        }, 1500 )

    }

    converUppercase = (text)=>{
        if(text){
            return text.toUpperCase()
        } else {
            return text
        }
    }
    render(){
        const { dateEnd, dateInit, loading, isDatePickerVisible } = this.state;
        return (

            <View style={{ backgroundColor:'#eee',  flex:1}}>
                <KeyboardAvoidingView 
                    style={{
                        flex:1, 
                        backgroundColor:'#eee', 
                        justifyContent:'center', 
                        flexDirection:'column'}} behavior='padding' enable>
                <NavBar
                    leftIcon={'home'}
                    leftAction={()=>this.props.navigation.navigate('Ordes')}
                    rightAction={()=>this.props.navigation.goBack()}
                    rightIcon={'arrow-back'}/>

                <View style={{
                    flex:1, 
                    paddingHorizontal:12, 
                    paddingTop:30,
                    flexDirection:"column"}}>
                    
                    <View style={{ 
                        flex:1,
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent:'space-around'}}>
                        <Text h4 style={{ }}>{dateInit}</Text>
                        <Text h4 style={{ }}>{dateEnd}</Text>
                    </View>

                    <View style={{ 
                        flex:1,
                        flexDirection:'row',
                        justifyContent:'space-around'}}>
                        <Button 
                            title="FECHA INICIAL"
                            titleStyle={styles.text_primary}
                            buttonStyle={styles.button_primary}
                            containerStyle={styles.button}
                            onPress={()=>this.showDatePicker('init')}
                            type="outline" />
                        <Button 
                            title="FECHA FINAL"
                            titleStyle={styles.text_primary}
                            buttonStyle={styles.button_primary}
                            containerStyle={styles.button}
                            onPress={()=>this.showDatePicker('end')}
                            type="outline" />
                    </View>

                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        onConfirm={(date)=>this.handleConfirm(date)}
                        onCancel={this.hideDatePicker}
                    />

                    <View style={{ 
                        flex:3,
                        flexDirection:'column',
                        justifyContent:'flex-start'}}>
                        <Input  
                            onChangeText={ (plate)=>this.setState({plate}) } 
                            placeholder="Placa" 
                            containerStyle={styles.containerStyle}
                            label='Placa'
                            labelStyle={styles.text_secondary}
                            inputContainerStyle={styles.inputContainer}/>

                        <Button 
                            loading={loading} 
                            onPress={()=>this.searchOrder()} 
                            buttonStyle={styles.button_primary}
                            containerStyle={styles.button}
                            title="Buscar" 
                            titleStyle={styles.text_primary}
                            type="outline"/>
                    </View>
                </View>
                </KeyboardAvoidingView>
                
            </View>
        )
         
    }
}

const mapStateToProps = state => {
    return {
        orders: state.orders.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getOrders:(body)=>dispatch(GetOrders(body))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchOrdersScreen)