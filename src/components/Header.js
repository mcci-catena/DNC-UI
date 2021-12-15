/*###############################################################################
// Module: Header.js
// 
// Function:
//      Function to export header
// 
// Version:
//    V1.01  Thu July 13 2021 16:30:00  muthup   Edit level 1
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
//       1.01 Thu July 13 2021 16:30:00 muthup
//       Module created.
###############################################################################*/

import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

const Header = props => <Text style={styles.header} {...props} />

const styles = StyleSheet.create({
  header: {
    fontSize: 21,
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 0,
  },
})

export default Header
