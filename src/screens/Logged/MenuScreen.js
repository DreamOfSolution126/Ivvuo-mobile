import React, { Component } from 'react';
import { View, ActivityIndicator, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import { Image, ListItem, Text, colors } from 'react-native-elements';
import NavBar from '../../component/Header';
import moment from 'moment';
import { connect } from 'react-redux';
import { logOut } from '../../actions/';
import { styles, comp } from '../../styles';

const { height, width } = Dimensions.get('window');

class MenuScreen extends Component {
    
    
    logoutApp = async () => {
        await AsyncStorage.clear();
        this.props.logout();
    }
    menu = [
        {
            title: 'Ordenes',
            icon:'list',
            onPress:()=>this.props.navigation.navigate('Ordes')
        },
        {
            title: 'Nueva orden',
            icon:'add',
            onPress:()=>this.props.navigation.navigate('NewOrder')
        },
        {
            title: 'Buscar orden',
            icon:'search',
            onPress:()=>this.props.navigation.navigate('Search')
        },
        {
            title: 'Cerrar sesión',
            icon:'exit-to-app',
            onPress:()=>this.logoutApp()
        }
    ]
    renderMenu = ()=> {
        return this.menu.map( (i, index)=>{
            return <ListItem
                containerStyle={styles.menuList}
                key={index+i}
                title={i.title}
                titleStyle={ styles.menuTitle}
                leftIcon={{name:i.icon, iconStyle:{ color: comp.f,}}}
                onPress={i.onPress}
                chevron={true}
                bottomDivider={ this.menu.length-1 == index || this.menu.length-1 > index}
                topDivider={ 0 == index }
            />
        })
    }

    userData = () => {
        const { name, last_name } = this.props.user
        
        let nombre = name? name:'';
        nombre += ' ';
        nombre += last_name? last_name:'';
        return nombre
    }
    render(){
        const { logo, name, nit, address } = this.props.account;
        const { email } = this.props.user;
        
        return(
            <View style={{ 
                backgroundColor:'#fff',  
                flex:1}}>
                <ScrollView style={{ backgroundColor:'#fff',  flex:1}}>   
                    <NavBar
                        leftIcon={'home'}
                        leftAction={()=>this.props.navigation.navigate('Ordes')}
                        rightAction={()=>this.props.navigation.goBack()}
                        rightIcon={'arrow-back'}></NavBar>

                    {logo?<View style={{marginTop:15, backgroundColor:'#fff', flex:3, flexDirection:'column', justifyContent:'space-around'}}>
                        <View style={{flex:3, justifyContent:'center', alignSelf:'center', alignContent:'center'}}>
                            <Image
                                source={{ uri:logo.url }}
                                containerStyle={{ width:150, height:150 }}
                                style={{ width: '100%', height: 'auto',  alignContent:'center', justifyContent:'center', alignSelf:'center', margin:'auto'}}
                                PlaceholderContent={<ActivityIndicator />}
                            />
                        </View>
                    </View>:null}
                    <View style={{marginTop:15, flex:1, justifyContent:'center', alignSelf:'center', alignContent:'center'}}>
                        <Text h4 style={{textAlign:'center'}}>{name}</Text>
                        <Text style={{textAlign:'center', textTransform:'capitalize', fontWeight:'bold'}}> {this.userData()} </Text>
                        <Text style={{textAlign:'center'}}> {email} </Text>
                    </View>
                    <ScrollView style={{marginTop:15}}>
                        <View style={{ backgroundColor:'#fff',  flex:1,
                            borderRadius:25,
                            paddingHorizontal:7,
                            paddingVertical:16 }}>
                                
                                {this.renderMenu()}     
                        </View>
                    </ScrollView>
                    <View style={{flex:1, marginVertical:15, alignItems:'center', justifyContent:'flex-end'}}>
                        <Text>
                            IVVUO {moment().format('YYYY')}
                        </Text>
                        <Text>
                            Versión 2.0.1.9
                        </Text>
                    </View>
                </ScrollView>
            </View>
            
        )
    }
}

const mapStateToProps = state => {
    return {
        account: state.account.data,
        center: state.center.data,
        user: state.user.data
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        logout: ()=> dispatch(logOut())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuScreen)