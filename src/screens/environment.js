/*****************************
* environment.js
* path: '/environment.js' (root of your project)
******************************/

import Constants from "expo-constants";
import { Platform } from "react-native";



const ENV = {
 
 url: {
   apiUrl: "https://staging-dashboard.mouserat.io/dncserver",
   amplitudeApiKey: "[Enter your key here]",
   
 }

};

const getEnvVars = () => {
    return ENV.url;
};

export default getEnvVars;