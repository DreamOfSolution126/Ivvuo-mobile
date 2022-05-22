import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ListItem, Text, Input, Button, Icon} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import NavBar from '../../component/Header';
import moment from 'moment';
import { connect } from 'react-redux';
import { setActivityAny } from '../../api/workshop/getOrders';
import { SetOrder } from '../../actions';

const { height } = Dimensions.get('screen');
class CommentsScreen extends Component {
    constructor(props){
        super(props)
        this.state = { text:''}
    }
    
    addComment = ()=>{
        const { order, pIndex, aIndex, email } = this.props;
        const { text } = this.state;

        let temporalOrder = order;
        temporalOrder.process[pIndex].checkList[aIndex].comments.unshift({
            date:new Date( Date.now()),
            text:text,
            user:email
        })

        setActivityAny(order._id, pIndex, aIndex, temporalOrder.process[pIndex].checkList[aIndex].comments, 'comments')
        .then( (data)=>{
            this.setState({text:''})
            this.props.setOrder(temporalOrder);
            Toast.showWithGravity('Se han guardado los cambios', Toast.LONG, Toast.BOTTOM);
        } ).catch( error =>{
            console.log(error)
            Toast.showWithGravity(error.message, Toast.LONG, Toast.BOTTOM);
        })
    }

    deletComment = (toDelet) => {
        const { order, pIndex, aIndex } = this.props;
        let temporalOrder = order;
        const indexComment = temporalOrder.process[pIndex].checkList[aIndex].comments.indexOf(toDelet);
        // console.log(indexComment)
        temporalOrder.process[pIndex].checkList[aIndex].comments.splice(indexComment, 1);
        setActivityAny(order._id, pIndex, aIndex, temporalOrder.process[pIndex].checkList[aIndex].comments, 'comments')
        .then( (data)=>{
            this.setState({text:''})
            this.props.setOrder(temporalOrder);
            Toast.showWithGravity('Se han guardado los cambios', Toast.LONG, Toast.BOTTOM);
        } ).catch( error =>{
            console.log(error)
            Toast.showWithGravity(error.message, Toast.LONG, Toast.BOTTOM);
        })
    }

    renderComments = ()=>{
        if(this.props.activity.comments && this.props.activity.comments.length>0){
            return this.props.activity.comments.map( (i, index)=>{
                return <ListItem 
                            key={index+i.date}
                            title={i.text}
                            subtitle={moment(i.date).format('DD MMMM YYYY')}
                            rightIcon={<Icon name="delete" color="blue" onPress={()=>this.deletComment(i)} />}
                        />
            } )
        } else {
            return <View style={{flex:1, paddingTop:height/3, alignContent:'center', justifyContent:'center', alignItems:'center', flexDirection:"column"}}>
                        <Icon name="comment" size={50} color="blue"/>
                        <Text h4 style={{color:"grey"}}>No hay comentarios</Text>
                        <Text style={{color:"grey", textAlign:"center"}}>Puedes agregar comentarios usando el campo inferior</Text>
                        
                    </View>
        }
    }
    render(){
        const { text } = this.state;
        return(
            <KeyboardAvoidingView style={{flex:1, justifyContent:'center', flexDirection:'column'}} behavior='padding' enable>
                <View style={{flex:1}}>
                    <NavBar
                    center={this.props.order.id}
                    leftIcon={'home'}
                    leftAction={()=>this.props.navigation.navigate('Ordes')}
                    rightAction={()=>this.props.navigation.goBack()}
                    rightIcon={'arrow-back'}></NavBar>
                    <View style={{backgroundColor:"#eee", flex:1, flexDirection:'column'}}>
                        <ScrollView>
                            {this.renderComments()}
                        </ScrollView>
                        <View style={{bottom:0, flexDirection:'row', backgroundColor:"#eee", borderWidth:0.5, borderColor:"#9c9c9c"}}>
                            <View style={{flex:10}}>
                                <Input
                                    value={text}
                                    onChangeText={(text)=>this.setState({text})}
                                    placeholder="Comentario"
                                    containerStyle={styles.containerStyle}
                                    inputContainerStyle={styles.inputContainer} />
                            </View>
                            {text?<TouchableOpacity onPress={()=> this.addComment()} style={{flex:2, justifyContent:'center', alignContent:'center', alignItems:'center'}}>
                                <Icon  name="send" size={26} color="blue"/>
                            </TouchableOpacity>:null}
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.email,
        order: state.orderSelect.order,
        pIndex: state.orderSelect.processIndex,
        aIndex: state.orderSelect.activityIndex,
        process: state.orderSelect.order.process[state.orderSelect.processIndex],
        activity: state.orderSelect.order.process[state.orderSelect.processIndex].checkList[state.orderSelect.activityIndex]
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setOrder: (order)=>dispatch(SetOrder(order))
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

export default connect(mapStateToProps, mapDispatchToProps)(CommentsScreen)