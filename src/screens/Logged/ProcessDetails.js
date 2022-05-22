import React, { Component } from 'react';
import { View, ScrollView, ProgressBarAndroid } from 'react-native';
import { Text, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { SelectActivity, SetOrder } from '../../actions';
import Toast from 'react-native-simple-toast';
import IconStatus from '../../component/IconStatus';
import NavBar from '../../component/Header';
import { setActivityAnswer } from '../../api/workshop/getOrders';
import Asignaciones from '../../component/v2/Asignados';
import { VISUAL_ASIGNACION } from '../../constants'

class ProcessDetailsScreen extends Component {

    constructor(props){
        super(props)
        this.state = { progress:0 }

    }

    renderActivitys = ()=> {
        const { checkList } = this.props.process;
        if(checkList && checkList.length>0){

            return checkList.map( (i, index)=>{

                return <ListItem
                    onPress={()=>{ this.props.selectActiviy(index); this.props.navigation.navigate('Activity')}}
                    key={i.id? i.id:Math.random()+index}
                    title={i.item}
                    subtitle={i.details}
                    bottomDivider={checkList.length-1 !== index}
                    rightElement={
                        <IconStatus
                        animating={true}
                            action={()=> this.setAnswer(index, i.asnwer_options)}
                            answer={i.answer}
                            type={i.type}
                        />
                    }
                />
            } )

        }
    }

    setAnswer = (index, asnwer_options) =>{
        const { order, pIndex } = this.props;
        let temporalOrder = order;
        temporalOrder.process[pIndex].checkList[index].answer = asnwer_options[0];
        setActivityAnswer(order._id, pIndex, index, asnwer_options[0])
        .then( success =>{
            this.props.setOrder(temporalOrder);
            Toast.showWithGravity('Se han guardado los cambios', Toast.LONG, Toast.BOTTOM);
        } ).catch( error => {
            Toast.showWithGravity(error.message, Toast.LONG, Toast.BOTTOM);
        })
    }
    render(){
        const { name, description, checkList, asignado } = this.props.process;

        let totalItems = checkList.length;
        let completed = 0;
        let progress = 0;
        for(let i of checkList){
            if(i.answer && i.answer.answer){
                completed += 1;
            }
        }
        progress = completed / totalItems;
        return (
            <View style={{flex:1}}>
                <NavBar
                    center={this.props.order.id}
                    leftIcon={'home'}
                    leftAction={()=>this.props.navigation.navigate('Ordes')}
                    rightAction={()=>this.props.navigation.goBack()}
                    rightIcon={'arrow-back'}/>

                <View style={{backgroundColor:"#eee", flex:1, flexDirection:'column'}}>
                <ScrollView>
                    <View style={{backgroundColor:'#eee', borderRadius:25, paddingHorizontal:7, paddingVertical:20}}>
                        <View>
                            <Text h4>{name}</Text>
                            <Text>{description}</Text>
                            <Asignaciones modo={VISUAL_ASIGNACION.NOMBRES} asignado={asignado} />
                            <ProgressBarAndroid
                            styleAttr="Horizontal"
                            indeterminate={false}
                            progress={progress|| 0}
                            />
                        </View>
                    </View>

                    <View  style={{backgroundColor:'white', marginTop:15, borderRadius:25, paddingHorizontal:7, paddingVertical:20}}>
                        {this.renderActivitys( )}
                    </View>
                </ScrollView>
            </View>
            </View>

        )
    }
}

const mapStateToProps = state => {
    return {
        order: state.orderSelect.order,
        pIndex: state.orderSelect.processIndex,
        process: state.orderSelect.order.process[state.orderSelect.processIndex]

    }
}
const mapDispatchToProps = dispatch => {
    return {
        selectActiviy:(index)=>dispatch(SelectActivity(index)),
        setOrder:(order)=>dispatch(SetOrder(order))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProcessDetailsScreen)