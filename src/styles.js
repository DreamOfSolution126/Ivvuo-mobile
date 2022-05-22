import React from 'react'
import { StyleSheet } from 'react-native';

const colors = {
    primary:'#1D96C4',
    secondary:'#106384',
    light:'#59ADD4',
    dark:'#002937',
    grey:'#eee',
    white:'white'
}

export const comp = {
    primary:'#1D96C4',
    secondary:'#106384',
    light:'#59ADD4',
    dark:'#002937',
    grey:'#eee',
    white:'white',
    a: '#18226d',
    b: '#2e398a',
    c: '#311744',
    d: '#5a1c71',
    e: '#5b1635',
    f: '#9f1149'
}

export const styles = StyleSheet.create({
    bg: {
        backgroundColor: colors.grey,
        flex:1,
        flexDirection:'column',
        justifyContent:'center', 
    },
    bgDark:{
        backgroundColor: colors.dark
    },
    button: {
        borderRadius:25
    },
    button_primary:{
        borderColor: colors.primary,
        borderWidth:2,
        borderRadius:25,
        paddingHorizontal:15,
        paddingVertical:12
    },
    button_danger:{
        backgroundColor: comp.f,
        borderColor: comp.f,
        borderWidth:2,
        borderRadius:25,
        paddingHorizontal:15,
        paddingVertical:12
    },
    button_accent:{
        borderColor: comp.f,
        backgroundColor: comp.f,
        borderWidth:2,
        borderRadius:25,
        paddingHorizontal:15,
        paddingVertical:12
    },
    containerStyle:{
        marginVertical: 5
    },
    header:{
        backgroundColor: colors.dark,
        justifyContent:'space-around'
    },
    headerIcons:{
        color: colors.light
    },
    headerLeftTouchable:{
        backgroundColor: colors.dark, 
        padding:5, 
        marginHorizontal:15, 
        borderRadius:25},
    inputContainer:{
        borderWidth:1,
        borderRadius:25,
        borderColor: colors.secondary,
        marginVertical:5,
        paddingHorizontal:15,
        paddingVertical:5,
        minHeight: 30
    },
    menuList:{
        backgroundColor: colors.white
    },
    menuTitle:{
        fontWeight:'bold',
        color: colors.primary
    },
    orderDetailsTitle:{
        color: colors.primary, 
        fontWeight:'bold', 
        fontSize:30
    },
    orderDetailsModel:{
        color: colors.primary,
        fontWeight:'bold',
        textTransform:'uppercase'
    },
    text_accent:{
        color: comp.f
    },
    text_primary:{
        color: colors.primary
    },
    text_light:{
        color: colors.light
    },
    text_white:{
        color: colors.white
    },
    text_secondary:{
        color: colors.secondary
    },
    text_dark:{
        color: colors.dark
    },
    textCompF:{
        color: comp.f
    },
    textBold:{
        fontWeight:'bold'
    },
    centeredView: {
        flex: 1,
        flexDirection:'column',
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        flexDirection:'column',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
        textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
        modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
})