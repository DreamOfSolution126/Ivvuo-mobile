import React from 'react';
import { createStackNavigator, createAppContainer, StackActions, NavigationActions} from 'react-navigation';

import OrdersScreen from '../../screens/Logged/OrdersScreen';
import OrdersDetailsScreen from '../../screens/Logged/OrdersDetailsScreen';
import ProcessDetailsScreen from '../../screens/Logged/ProcessDetails';
import ActivityScreen from '../../screens/Logged/ActivityScreen';
import NewOrderScreen from '../../screens/Logged/NewOrderScreen';

// import CameraComponent from '../../component/Camera';
import CamaraComponente from '../../component/v2/Camara';
import MenuScreen from '../../screens/Logged/MenuScreen';
import CommentsScreen from '../../screens/Logged/CommentsScreen';
import SearchOrders from '../../screens/Logged/SearchOrders';
import NotesScreen from '../../screens/Logged/NotesScreen';
import GalleryScreen from '../../screens/Logged/GalleryScreen';
import SelectListScreen from '../../screens/Logged/SelectListScreen';
import VisualizadorE from '../../screens/Logged/VisualizadorEvidencia';

const MainNavigation = createStackNavigator({
        Ordes:{
            screen:OrdersScreen
        },
        Details:{
            screen:OrdersDetailsScreen
        },
        Process:{
            screen:ProcessDetailsScreen
        },
        Activity:{
            screen:ActivityScreen
        },
        Comments:{
            screen:CommentsScreen
        },
        Camera:{
            screen:CamaraComponente
        },
        NewOrder:{
            screen:NewOrderScreen
        },
        Menu:{
            screen:MenuScreen
        },
        Search:{
            screen:SearchOrders
        },
        Notes:{
            screen:NotesScreen
        },
        Gallery:{
            screen: GalleryScreen
        },
        SelectList:{
            screen: SelectListScreen
        },
        VisualizadorEvidencia: {
            screen: VisualizadorE
        }
    },
    {   
        headerMode: 'none'
    })

const resetActions = StackActions.reset({
    index:0,
    actions:[NavigationActions.navigate({routeName:'Orders'})]
})


const app = createAppContainer(MainNavigation)

export default app