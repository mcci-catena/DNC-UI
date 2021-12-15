/*###############################################################################
// Module: AppBar.js
// 
// Function:
//      Function to export app bar
// 
// Version:
//    V1.01  Thu July 13 2021 10:30:00  muthup   Edit level 1
// 
//  Copyright notice:
//       This file copyright (C) 2021 by
//       MCCI Corporation
//       3520 Krums Corners Road
//       Ithaca, NY 14850
//       An unpublished work. All rights reserved.
// 
//       This file is proprietary information, and may not be disclosed or
//       copied without the prior permission of MCCI Corporation.
// 
//  Author:
//       muthup, MCCI July 2021
// 
//  Revision history:
//       1.01 Wed Thu July 13 2021 10:30:00 muthup
//       Module created.import React, { useState } from 'react'
###############################################################################*/

import React, { useState } from 'react'
import { View,Dimensions} from 'react-native';
import { Appbar ,Menu} from 'react-native-paper';

export default function AppBar({navigation,title}) {
  //initialize use sate variable
  const closeUser = () => setuserVisible(false);
  const openUser = () => setuserVisible(true);
  const [uservisible, setuserVisible] = useState(false);
  const windowWidth = Dimensions.get('window').width;

  //logout function
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
      <Menu visible={uservisible} onDismiss={closeUser} anchor={{ x: windowWidth, y: 50 }}>
        <Menu.Item   title="Logout" onPress={()=>changelogoutscreen()} />
      </Menu>
    </View>
);
}