/*###############################################################################
// Module: passwordValidator.js
// 
// Function:
//      Function to validate the password
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

export function passwordValidator(password) {
  if (!password || password.length <= 0) {
    return "Password can't be empty."
  }

  return ''
}
