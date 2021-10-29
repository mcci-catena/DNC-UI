/*****************************
* environment.js
* path: '/environment.js' 
******************************/

import Constants from "expo-constants";
import { Platform } from "react-native";



const ENV = {
 
 url: {
   
   uiversion: "UI V1.0.1",
   
 }

};

const getEnvVars = () => {
    return ENV.url;
};

export default getEnvVars;