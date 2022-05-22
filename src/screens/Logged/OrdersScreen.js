import React, { Component } from 'react';
import { View, ScrollView, ProgressBarAndroid, Dimensions, RefreshControl } from 'react-native';
import { ListItem, Text, Button  } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationEvents } from 'react-navigation';
import { connect } from 'react-redux';
import { SelectOrder, GetOrders } from '../../actions';
import { centerCode } from '../../token';
import moment from 'moment';
import NavBar from '../../component/Header';
import { styles, comp } from '../../styles';
import IndicadorCarga from '../../component/v2/IndicadorCarga';

const { height } = Dimensions.get('screen');
class OrderScreen extends Component {
  constructor(props){
    super(props)
    this.state = { orders:[], orderIndex:{}, refreshing:false }
  }

  componentDidUpdate(preProps){
    if(this.props.orderSelect.edit !== preProps.orderSelect.edit){
      this.props.getOrdes({center_code: centerCode})
    }
  }
  
  renderItems = () => {
    
    if( this.props.orders && this.props.orders.length) {

      // console.log('Ordenes: ', this.props.orders )
      return this.props.orders.map( (i, index) => {
        return <ListItem 
          key={i._id}
          title={
            <View style={{ flex:1, flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
              { i.emailEnviado.estatus ? <Icon color="#59ADD4" size={12} name='paper-plane'/> : null }
              <Text style={{ fontSize:16 }}> {i.id ? i.id : i.or }</Text>
            </View>
          }
          subtitle={`${
            i.vehiculo?.placa ? i.vehiculo?.placa: 'Sin Placa'
          } - ${
            moment(i.fechaCreacion).format('DD-MM-YYYY hh:mm a')}`
          }
          subtitleStyle={{ textTransform:'uppercase'}}
          bottomDivider={this.props.orders.length-1 > index}
          chevron={true}
          onPress={()=>{ 
            this.props.SelectOrder({_id: i._id}); 
            this.setState({ orderIndex:index }); this.props.navigation.navigate('Details')}}
          rightElement={
            <ProgressBarAndroid 
              color='#59ADD4' 
              styleAttr="Horizontal" 
              progress={ i.procesos?.avanceProceso || 0} 
              indeterminate={false} />
            }
          leftIcon={{ name: i.estatus?.cerrado?.estatus ? 'lock' : 'lock-open' }}
        />
      } )
    } else {
      return <View style={{flex:1, paddingTop:height/4, justifyContent:'flex-end', alignItems:'center', flexDirection:"column"}}>
        <Icon name="book" size={50} color="#59ADD4"/>
        <Text h4 style={{color:"grey"}}>No hay Ordenes</Text>
        <Text style={{color:"grey", textAlign:"center", marginTop: 20, marginBottom: 20 }}>Puedes crear una orden pulsando sobre el boton crear orden</Text>
        <Button 
          onPress={()=>this.props.navigation.navigate('NewOrder')} 
          title=" Crear una orden"
          type="outline"
          />
      </View>
    }
  }

  _onRefresh=()=>{
    this.setState({refreshing: true});
    this.props.getOrdes({plate:''})
    this.setState({refreshing: false})
  }
    
  render(){
    
      return(
          <View style={{ backgroundColor:comp.dark,  flex:1}}>
            
            <NavBar 
              leftIcon={'menu'}
              leftAction={()=>this.props.navigation.navigate('Menu')} 

              subRightIcon={'search'} 
              subRightAction={()=>this.props.navigation.navigate('Search')}


              rightAction={()=>this.props.navigation.navigate('NewOrder')}
              rightIcon={'add'}/>
              {this.props.isFetching?<ProgressBarAndroid styleAttr="Horizontal" />:null}
            <View style={{ backgroundColor:'white',  flex:1,
              // borderRadius:25,
              paddingHorizontal:7,
              paddingVertical:16 }}>
                <IndicadorCarga />
                <ScrollView
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                    />
                  }
                >
                  {this.renderItems()}
                </ScrollView>
            </View>
                
          </View>
      )
  }
}

const mapStateToProps = state => {
  return {
    orders: state.orders.data,
    isFetching: state.orders.isFetching,
    orderSelect: state.orderSelect
  }
}

const mapDispatchToProps = dispatch => {
  return {
    SelectOrder: ( order )=> dispatch(SelectOrder(order)),
    getOrdes: ( body ) => dispatch(GetOrders(body))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderScreen);