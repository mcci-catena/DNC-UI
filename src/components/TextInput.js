// Module: TextInput
//
// Function:
//    Display the TextInput
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
import { BorderColor } from '@material-ui/icons'
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
    //borderColor: '#560CCE',
    //borderColor: theme.colors.primary,
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
