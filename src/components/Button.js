/*###############################################################################
// Module: Button.js
// 
// Function:
//      Function to export customize button
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
import { Button as PaperButton } from 'react-native-paper'
import { theme } from '../core/theme'

//Define the button componenets
const Button = ({ mode, style, ...props }) => (
  <PaperButton
    style={[
      styles.button,
      mode === 'outlined' && { backgroundColor: theme.colors.surface },
      style,
    ]}
    labelStyle={styles.text}
    mode={mode}
    {...props}
  />
)
//Define the style sheet for button
const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
    paddingVertical: 2,
    borderRadius:25,
   },
  text: {
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 26,
  },
})

export default Button
