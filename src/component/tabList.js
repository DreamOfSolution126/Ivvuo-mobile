import React, { Component } from 'react';
import {Text, View, Button } from 'react-native';
import * as actions from '../actions';

import { connect } from 'react-redux';

class TabList extends Component {

    renderUsers = () => {
        const { users } = this.props;
        if(users.data && users.data.length){
            return users.data.map( (i, index)=>{
                return <Text key={i._id}>{i.name} {i.last_name}</Text>
            } )
        }
        
    }

    render(){
        return(
            <View>
                <Text>{this.props.tadId}</Text>
                <View style={{ flexDirection:'row', justifyContent:'space-around'}}>
                    <Button onPress={()=> this.props.selected_tab('Logueado')} title="Logueado"></Button>
                    <Button onPress={()=> this.props.selected_tab('Invitado')} title="Invitado"></Button>
                    
                </View>
                {this.renderUsers()}
            </View>
        )
    }
}

const mapStateToProps = state => {
    return { tadId : state.taId, users: state.dataReducer}
}

export default connect(mapStateToProps, actions)(TabList)