import React, { Component } from 'react';
import { TouchableOpacity, Text } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Material from '../constants/materialDesign';

export default class IconStatus extends Component {
    render(){
        const {answer, type, action, size} = this.props;
        let name = "circle";
        let color = Material.default;
        let showAnswer = ''
        if(type === 'inspection'){
            switch(answer.answer){
                case 'Ok':
                    name = "check-circle";
                    color = Material.ok;
                break;
                case 'Regular':
                    name = "exclamation-circle";
                    color = Material.regular;
                break;
                case 'Urgente':
                    name = "times-circle";
                    color = Material.urgente; 
                break;
                case 'N/A':
                    name = "minus-circle"
            }
        } else if(type === 'custom'){
            switch(answer.value){
                case 0:
                    name = "times-circle";
                    color = Material.urgente;
                break;
                case 1:
                    name = "exclamation-circle";
                    color = Material.regular;
                break;
                case 2:
                    name = "check-circle";
                    color = Material.ok; 
                break;
            }
            showAnswer = answer.answer;

        } else if(type === 'survey'){
            if(parseInt(answer.answer) > 8 ){
                name = "check";
                color = Material.ok;
            } else if(parseInt(answer.answer) > 6 && parseInt(answer.answer) < 9){
                name = "minus";
                color = Material.regular;
            } else if(parseInt(answer.answer) < 7){
                name = "times";
                color = Material.urgente;
            }
            showAnswer = answer.answer;

        } else if(type === 'check'){
            switch(answer.answer){
                case 'Cumple':
                    name = "check";
                    color = Material.ok;
                break;
                case 'No cumple':
                    name = "times";
                    color = Material.urgente;
                break;
                case 'N/A':
                    name = "ban";
                    color = Material.grey;
                break;
              
            }
        } else if ( type === 'revision' ){
            switch(answer.value){
                case 2:
                    name = "check-circle";
                    color = Material.ok;
                break;
                case 1:
                    name = "exclamation-circle";
                    color = Material.regular;
                break;
                case 0:
                    name = "times-circle";
                    color = Material.urgente; 
                break;
                case 99:
                    name = "minus-circle"
            }
        }
        return( 
            <TouchableOpacity activeOpacity={0.7} onPress={action} style={{alignItems:'center', padding:5}}>
                <Icon size={size ? size:26 } name={name} color={color}></Icon>
                {showAnswer?<Text style={{fontSize:10, fontWeight:"200"}}>{showAnswer}</Text>:null}
            </TouchableOpacity>
        )
    }
}