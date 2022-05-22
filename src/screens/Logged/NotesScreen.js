import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Input, Text, Icon, ListItem } from 'react-native-elements';
import moment from 'moment';
import { updateOrder } from '../../api/workshop/getOrders';

import NavBar from '../../component/Header';
import { connect } from 'react-redux';
import { SetOrder } from '../../actions';

const { height } = Dimensions.get('screen');

class NotesScreen extends Component {
    constructor(props){
        super(props)
        this.state = { text:''}
    }

    renderNotes = () => {
        const { notes } = this.props.order;
        if(notes && notes.length>0){
            return notes.map( (i, index)=> {
                return (
                    <ListItem 
                        key={moment(i.date).format()+index}
                        title={i.text}
                        subtitle={i.date}
                    />
                )
            } )
        } else {
            return (
                <View style={{flex:1, paddingTop:height/3, alignContent:'center', justifyContent:'center', alignItems:'center', flexDirection:"column"}}>
                    <Icon name="comment" size={50} color="grey"/>
                    <Text h4 style={{color:"grey"}}>No hay solicitudes del cliente</Text>
                    <Text style={{color:"grey", textAlign:"center"}}>Puedes agregar solicitudes usando el campo inferior</Text>
                </View>
            )
        }
    }

    addNote = ()=> {

        const { order } = this.props;
        let temporalOrder = order;

        temporalOrder.notes.unshift({
            text:this.state.text,
            date: moment(new Date( Date.now() )).format(),
            user: this.props.userEmail.email
        })

        if(!temporalOrder.process[0].key){

            temporalOrder.process.unshift({
              id: Date.now().toString(),
              key: true,
              listId: temporalOrder.list._id,
              account_code: temporalOrder.list.account_code,
              icon: '<i class="fas fa-thumbtack"></i>',
              name: 'Diagnóstico',
              description: 'Solicitudes del cliente',
              weight: 100,
              index: 0,
              notifyCustomer: true,
              advanceValue: 0,
              checkList: []
            })

        }


        temporalOrder.process[0].checkList.push({
            id: Date.now().toString(),
            item: this.state.text,
            details:`Creada el ${moment(new Date( Date.now() )).format('DD-MM-YYYY hh:mm a')}`,
            asnwer_options:[
                {
                    value: 2,
                    answer: 'Ok'
                },
                {
                    value: 1,
                    answer: 'Regular'
                },
                {
                    value: 0,
                    answer: 'Urgente'
                },
                {
                    value: 99,
                    answer: 'N/A'
                }
            ],
            answer: {},
            attach: [],
            comments: [],
            parts: 0,
            mo: 0,
            total: 0,
            approved: '',
            listId: '',
            processId:'customProcess',
            account_code:'',
            weight:100,
            type:'inspection',
            quotation:{ parts:[], mo:[] } ,
            cotizacion: [],
            resQuotation:{ 
                status: '',
                date: new Date( Date.now() ),
                block: false
            },
            seeCustomer: true,
            index: 0
        })

        updateOrder(temporalOrder)
        .then( (data)=>{
            this.props.setOrder(temporalOrder)
            this.setState({text:''})
        })
        
    }


    render(){
        const { text } = this.state;
        return(
            <KeyboardAvoidingView style={{flex:1, justifyContent:'center', flexDirection:'column'}} behavior='padding' enable>
                <NavBar
                    center={this.props.order.id}
                    leftIcon={'home'}
                    leftAction={()=>this.props.navigation.navigate('Ordes')}
                    rightAction={()=>this.props.navigation.goBack()}
                    rightIcon={'arrow-back'}></NavBar>

                    <View style={{backgroundColor:"#eee", flex:1, flexDirection:'column'}}>
                        <ScrollView>
                            {this.renderNotes()}
                        </ScrollView>
                        <View style={{bottom:0, flexDirection:'row', backgroundColor:"#eee", borderWidth:0.5, borderColor:"#9c9c9c"}}>
                            <View style={{flex:10}}>
                                <Input
                                    value={text}
                                    onChangeText={(text)=>this.setState({text})}
                                    placeholder="Solicitud del cliente"
                                    containerStyle={styles.containerStyle}
                                    inputContainerStyle={styles.inputContainer} />
                            </View>
                            {text?<TouchableOpacity onPress={()=> this.addNote()} style={{flex:2, justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                                <Icon  name="add" size={26} color="blue"/>
                            </TouchableOpacity>:null}
                        </View>
                    </View>
            </KeyboardAvoidingView>
        )
    }
}

const mapStateToProps = state => {
    return {
        order: state.orderSelect.order,
        userEmail: state.user.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setOrder: (body) => dispatch(SetOrder(body))
    }
}

const styles= StyleSheet.create({
    containerStyle:{
        marginVertical:5
    },
    inputContainer:{
        borderWidth:0.5,
        borderRadius:18,
        borderColor:'#eee',
        paddingHorizontal:12,
        backgroundColor:"white"
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(NotesScreen)