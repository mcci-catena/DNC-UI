// Module: AppBar.js
//
// Function:
//    Display the appbar 
//
// Version:
//    V1.0.0  Mon Feb 08 2021 10:15:00 muthup   Edit level 1
//
// Copyright notice:
//   This file copyright (C) 2020-2021 by
//
//       MCCI Corporation
//       3520 Krums Corners Road
//        Ithaca, NY  14850
//
//   An unpublished work.  All rights reserved.
//
//   This file is proprietary information, and may not be disclosed or
//   copied without the prior permission of MCCI Corporation
//
// Author:
//   Muthupandi Pandiyaraj, MCCI Corporation March 2021
//
import React, { useState } from 'react'
import { View, Text  ,Alert,Dimensions} from 'react-native';
import { Appbar ,Menu} from 'react-native-paper';

export default function AppBar({navigation,title}) {
  const closeUser = () => setuserVisible(false);
  const openUser = () => setuserVisible(true);
  const [uservisible, setuserVisible] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const changepassscreen=()=>
  {
    navigation.navigate('Changepassword');
    closeUser();
  }
  const changelogoutscreen=()=>
  {
    navigation.navigate('LoginScreen');
    closeUser();
  }
  return (
    <View >
    <Appbar.Header> 
<Appbar.Action icon={require('../assets/menu.png')} onPress={()=>navigation.toggleDrawer()} />   

<Appbar.Content style={{alignItems:'center'}} title={title} />
<Appbar.Action icon={require('../assets/user.png')}  onPress={openUser} />

</Appbar.Header> 

    
    <Menu
      visible={uservisible}
      onDismiss={closeUser}
      anchor={{ x: windowWidth, y: 50 }}>
      {/* <Menu.Item    title="Change password" onPress={()=>changepassscreen()}/> */}
      <Menu.Item   title="Logout" onPress={()=>changelogoutscreen()} />
   
    </Menu>
    </View>

  );
}
