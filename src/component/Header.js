import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Header, Icon, colors } from 'react-native-elements';
import { styles, comp } from '../styles';

class NavBar extends Component {
    constructor(props){
        super(props)
    }

    rightComponent = (rightIcon, rightAction, subRightIcon, subRightAction)=>{
        return <View style={{flexDirection:'row', justifyContent:'space-around', paddingVertical:-5}}>
            {subRightAction && subRightIcon?<TouchableOpacity  activeOpacity={0.1} onPress={subRightAction} style={{marginHorizontal:15, borderRadius:25}}>
                <Icon name={subRightIcon} color={colors.grey5}/>
            </TouchableOpacity>:null}
            <TouchableOpacity  activeOpacity={0.1} onPress={rightAction} style={{marginHorizontal:15, borderRadius:25}}>
                <Icon name={rightIcon} color={colors.grey5} />
            </TouchableOpacity>
        </View>
    }

    leftComponent = (leftIcon, leftAction) => {
        return <View style={{flexDirection:'row', justifyContent:'space-around', paddingVertical:-5}}>
        <TouchableOpacity activeOpacity={0.1} onPress={leftAction} style={styles.headerLeftTouchable}>
            <Icon name={leftIcon} color={comp.light} />
        </TouchableOpacity>
    </View>
    }
    render(){
        const {center, leftIcon, rightAction, leftAction, rightIcon, subRightIcon, subRightAction } = this.props;
        return(
            <Header
            statusBarProps={{ barStyle: 'light-content' }}
            leftComponent={this.leftComponent(leftIcon, leftAction)}
            centerComponent={{ text:center? '#'+center.toUpperCase():'IVVUO', style: { fontSize:24, color: colors.grey5, fontWeight:'bold' } }}
            // rightComponent={{ icon:rightIcon, color: 'blue', onPress:rightAction }}
            rightComponent={this.rightComponent(rightIcon, rightAction, subRightIcon, subRightAction)}
            rightContainerStyle={{flex:2}}
            leftContainerStyle={{flex:2}}
            containerStyle={ styles.header }
            />
        )
    }
}

export default NavBar