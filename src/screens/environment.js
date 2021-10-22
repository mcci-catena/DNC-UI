/*****************************
* environment.js
* path: '/environment.js' 
******************************/

import Constants from "expo-constants";
import { Platform } from "react-native";



const ENV = {
 
 url: {
   apiUrl: "https://staging-dashboard.mouserat.io/dncserver",
   uiversion: "UI V1.0.1_5",
   
 }

};

const getEnvVars = () => {
    return ENV.url;
};

export default getEnvVars;