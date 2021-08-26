// Module: Logo.js
//
// Function:
//    Display the Logo
//
// Version:
//    V1.0.0  Mon Feb 08 2021 10:15:00 muthup   Edit level 3
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
import React from 'react'
import { Image, StyleSheet } from 'react-native'

const Logo = () => (
  <Image source={require('../assets/logo1.png')} style={styles.image} />
)

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 100,
    marginTop: '10%',
    marginLeft: '10%',
  },
})

export default Logo
