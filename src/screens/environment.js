/*###############################################################################
// Module: environment.js
// 
// Function:
//      Function to decolare the environment variables
// 
// Version:
//    V1.01  Mon Oct 18 2021 10:30:00  muthup   Edit level 1
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
//       muthup, MCCI Oct 2021
// 
//  Revision history:
//       1.01 Mon Oct 18 2021 10:30:00 muthup
//       Module created.
###############################################################################*/

import Constants from "expo-constants";
import { Platform } from "react-native";

const ENV = {
  url: {
    uiversion: "UI V1.1.0",
  }
};
const getEnvVars = () => {
    return ENV.url;
};
export default getEnvVars;