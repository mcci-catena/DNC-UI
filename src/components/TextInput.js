/*###############################################################################
// Module: TestInput.js
// 
// Function:
//      Function to export TestInput
// 
// Version:
//    V1.01  Fri July 14 2021 10:30:00  muthup   Edit level 1
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
//       1.01 Fri July 14 2021 10:30:00 muthup
//       Module created.
###############################################################################*/

import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { TextInput as Input } from 'react-native-paper'
import { theme } from '../core/theme'

const TextInput = ({ errorText, description, ...props }) => (
  <View style={styles.container}>
    <Input
      style={styles.input}
      selectionColor={theme.colors.primary}
      underlineColor="transparent"
      outlineColor={theme.colors.primary}
      mode="outlined"
      {...props}
    />
    {description && !errorText ? (
      <Text style={styles.description}>{description}</Text>
    ) : null}
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
)

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: theme.colors.surface,
  },
  description: {
    fontSize: 13,
    color: theme.colors.third,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.third,
    paddingTop: 8,
  },
})

export default TextInput
