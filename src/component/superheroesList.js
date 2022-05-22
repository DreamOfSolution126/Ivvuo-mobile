import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import {fetchData} from '../actions';

class SuperHeroesList extends Component {

    componentWillMount(){
        this.props.fetchData()
    }

    renderUsers = () => {
        const { users } = this.props;
        if(users.data && users.data.length){
            return users.data.map( (i, index)=>{
                return <Text key={i._id}>{i.name} {i.last_name}</Text>
            } )
        }
        
    }

    render(){
        
        return (
            <View>
                <Text>Super Heroes List inicio</Text>
                <Text>{this.props.tabId}</Text>
                {this.renderUsers()}
                <Text>Super Heroes List Fin</Text>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return {
        superheroes: state.superheroes, 
        tabId:state.taId, 
        users:state.dataReducer}
}

const mapDispatchToProps = dispatch => {
    return {
        fetchData: ()=> dispatch(fetchData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SuperHeroesList)