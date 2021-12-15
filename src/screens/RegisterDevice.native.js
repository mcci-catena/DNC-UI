/*###############################################################################
// Module: RegisterDevice
// 
// Function:
//      Function to register device for App
// 
// Version:
//    V1.02  Thu Jul 22 2021 10:30:00  muthup   Edit level 1
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
//       1.01 Wed July 22 2021 10:30:00 muthup
//       Module created.
//       1.02 Tue Dec 01 2021 10:30:00 muthup
//       Fixed issues #2 #3 #4 #5 #6 #7
###############################################################################*/

import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  Text,
  Alert,
  Picker,
  TouchableOpacity,ScrollView,Image,Platform
} from 'react-native'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { Dialog, Portal,Menu ,Appbar} from 'react-native-paper'
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import  moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker';
import AwesomeAlert from 'react-native-awesome-alerts';
import AppBar from '../components/AppBar';
import { useIsFocused } from "@react-navigation/native";
import {Restart} from 'fiction-expo-restart';
const RegisterDevice = ({ navigation }) => {
  let [email, setEmail] = useState({ value: '', error: '' })
  let [password, setPassword] = useState({ value: '', error: '' })
  let [Hardwareid, setHardwareid] = useState('')
  let [deviceid, setdeviceid] = useState('')
  let [devid, setdevid] = useState('')
  let [deveui, setdeveui] = useState('')
  let [measName, setmeasName] = useState('')
  let [fieldName, setfieldName] = useState('')
  const [idate, setidate] = useState('')
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [data, setData] = useState([])
  const [tablesclient, settablesclient] = useState('')
  const [selectedValue, setselectedValue] = useState('')
  const [Api, setApi] = useState('')
  const [clientName, setclientName] = useState('')
  const [oldClient, setoldClient] = useState('')
  const [dilogtitle,setdilogtitle]=useState('Add device');
  const [uname, setuname] = useState('')
  const [oldhwid, setoldhwid] = useState('')
   const [datevalue, setdatevalue] = useState(new Date())
  const [visible, setVisible] = useState(false);
  const [uservisible, setuserVisible] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [edit, setedit] = useState(null);
  const [shouldShow, setShouldShow] = useState(true);
  const tablearray=[];
  const clients = [];
  const [tableHead, settableHead] =useState(["clents", 'Hardware ID', 'Action'])
  const [tableData, settableData] = useState([]);
  const [deviceData, setdeviceData] = useState([]);
  const [widthArr, setwidthArr] = useState([100, 180, 100]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(new Date());
  const dateformatvalue = moment(date).utc().format('MM/DD/YYYY')
  const timevalue = moment(time).utc().format('HH:mm:ss')
  const datestringvalue = dateformatvalue + ',' + timevalue
  const [deviceoption,setdeviceoption]=useState(["Select device option","devID","devEUI"])
  const [deviceoptionselected,setdeviceoptionselected]=useState('')
  const [deviceoptionvalueselected,setdeviceoptionvalueselected]=useState('')
  const[apiUrl,setapiUrl]=useState('');
  const [deviceoptionvalue, setdeviceoptionvalue] = useState([])
  const isFocused = useIsFocused();
  var devicevalue;

  //To set the onchange date value in text box
  const onChange = (event, selectedValue) => {
    setShow(Platform.OS === 'ios');
    if (mode == 'date') {
      const currentDate = selectedValue || new Date();
      setDate(currentDate);
      setMode('time');
      setShow(Platform.OS !== 'ios'); 
    } else {
      const selectedTime = selectedValue || new Date();
      setTime(selectedTime);
      setShow(Platform.OS === 'ios'); 
      setMode('date'); 
    }
    setdatevalue(datestringvalue);
  };
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode('date');
  };

  //To get api token
  const getApitoken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const uname = await AsyncStorage.getItem('uname')
      const apiUrl = await AsyncStorage.getItem('apiUrl');
      setapiUrl(apiUrl);
      if (token !== null && uname !== null) {
        setApi(token)
        fetchClientlist(apiUrl,token);
        fetchtabledata(apiUrl,token);
        setuname(uname.replace(/['"]+/g, ''))
        
      }
    } catch (e) {
      console.log(e)
    }
  }

  //UseEffect used to execute first this function then only other function works
  useEffect(() => {
    if(isFocused){
     
    getApitoken();
    settablesclient(' ');
    }
  }, [isFocused])
  
  //To get fetchtable data
  const fetchtabledata =( apiUrl,token )=> {
    const url=apiUrl+'/listardev';
    
    const getMethod={
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token.replace(/['"]+/g, '') + '',
      },
    }
    console.log(url);
    console.log(getMethod);
    fetch(url,getMethod ).then(response => {
      const statusCode = response.status
      if (statusCode == 403) {
        alert('Session expired');
        Restart();
      }
      response.json().then(responseJson => {
         if (responseJson['message'] != null) {
          alert(JSON.stringify(responseJson['message']))
        }
        console.log(JSON.stringify(responseJson))
        for(var i=0;i<responseJson.length;i++)
        {
            let j=i+1;
            let client  = responseJson[i].client;
            let hwid=responseJson[i].hwid;
            let devID=responseJson[i].devID;
            let devEUI=responseJson[i].devEUI;
            let idate=responseJson[i].idate;
            let rdate=responseJson[i].rdate;
            let mmname=responseJson[i].mmname;
            let fdname=responseJson[i].fdname;
            let array=[];
            let deviceArray=[];
            array.push(client);
            array.push(hwid);
            deviceArray.push(hwid);
            deviceArray.push(devID);
            deviceArray.push(devEUI);
            deviceArray.push(idate);
            deviceArray.push(rdate);
            array.push(client);
            tablearray.push(array);
            deviceData.push(deviceArray)
        }
        settableData(tablearray);
        setdeviceData(deviceData);
      })
    })
  }

  //To fetch the client list
  const fetchClientlist = (apiUrl,token) => {
    fetch(apiUrl+'/clients', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token.replace(/['"]+/g, '') + '',
      },
    })
    .then(response => {
      const statusCode = response.status;
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      response.json().then(responseJson => {
        if (responseJson['message'] != null) {
          alert(JSON.stringify(responseJson['message']))
        }
        clients.push('Select the Clients')
        clients.push('All')
        for (var i = 0; i < responseJson.length; i++) {
          const json = responseJson[i].cname
          clients.push(json)
        }
        setData(clients)
      })
    })
    .catch(error => {
      console.error(error)
    })
  }

  //To add new device manage function
  const adddevicemange=()=>
  {
    const dateformatvalue = moment(date).utc().format('MM/DD/YYYY')
    const timevalue = moment(time).utc().format('HH:mm:ss')
    const datestringvalue = dateformatvalue + ',' + timevalue
    setedit(false);
    setdatevalue(datestringvalue);
    setdilogtitle('Add device');
    setIsDialogVisible(true);
  }

  //To add new device
  const Adddevice = () => {
    setIsDialogVisible(false)
    var url = apiUrl+'/regdev'
  
    const putMethod = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        client: selectedValue,
        hwid: Hardwareid,
        deviceid: deviceid,
        devID: devid,
        devEUI: deveui,
        datetime: datevalue,
       
      }),
    }
    console.log(putMethod);
    fetch(url, putMethod).then(response => {
      const statusCode = response.status;
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      response.json().then(responseJson => {
          if (responseJson['message'] != null) {
          alert(JSON.stringify(responseJson['message']))
        }
        clientwisetableData();
      })
    })
  }

  //To add action columns in table row
  const element = (cellData, index) => (
    <View style={{flexDirection:'row'}}>
    <TouchableOpacity onPress={()=>editIconclicked(cellData,index)}>
      <View style={{ paddingRight: 10 }}>
      <Image
       source={require('../assets/edit.png')}
      fadeDuration={0}
      style={{ width: 20, height: 20 }}
    />
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>createButtonAlert({client:""+cellData[0]+"",hwid:""+cellData[1]+""})}>
    <View >
    <Image
       source={require('../assets/delete.png')}
      fadeDuration={0}
      style={{ width: 20, height: 20 }}
    />
    </View>
  </TouchableOpacity>
  </View>
  );

  //To get the details on edit table row
  const editIconclicked=(rowData,index) =>
  {
    console.log(rowData);
    var dateutc;
    setedit(true);
    setdilogtitle('Edit device');
    setclientName(rowData[0]);
    setoldClient(rowData[0])
    setHardwareid(rowData[1]);
    setoldhwid(rowData[1]);
    var deviceselected;
    for(i=0;i<deviceData.length;i++)
    {
      if(deviceData[i][0]==rowData[1])
      {
        setdevid(deviceData[i][1]);
        setdeveui(deviceData[i][2]);
        setidate(deviceData[i][3]);
        if(deviceData[i][1]==null ||deviceData[i][1]==undefined||deviceData[i][1]=='')
        {
          devicevalue=deviceData[i][2]
          deviceselected='devEUI'
        }
        else if(rowData[4]==null ||rowData[4]==undefined||rowData[4]=='') 
        {
          devicevalue=rowData[3]
          deviceselected='devID'
        }
        setdeviceoptionselected(deviceselected);
        var url =apiUrl+'/getdev/'+rowData[0];  
      const posetMethod = {
       method: 'POST',
       headers: {
         'Content-type': 'application/json',
         Accept: 'application/json',
         Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
       },
       body: JSON.stringify({
         type:deviceselected
       }),
     }
    fetch(url, posetMethod)
     .then(response => {
     const statusCode = response.status;
     if (statusCode == 403) {
      alert('Session expired')
      Restart();
    } 
    response.json().then(responseJson => {
      if (responseJson['message'] != null) {
        alert(JSON.stringify(responseJson['message']))
      }
      let mesasurementdata=responseJson["device_list"];
      mesasurementdata.push(devicevalue);
      setdeviceoptionvalue(mesasurementdata);
    })
    })
    .catch(error => {
      console.error(error)
    })
    setdeviceoptionvalueselected(devicevalue);
    dateutc = Date.parse(deviceData[i][3]);
    }
  }
  const dateformatvalue = moment(dateutc).format('MM/DD/YYYY')
  const timevalue = moment(dateutc).format('HH:mm:ss')
  const datestringvalue = dateformatvalue + ',' + timevalue
  setdatevalue(datestringvalue);
  checkeditable(rowData[0] ,rowData[1])
  }

  //To create button alert
  const createButtonAlert = ({client,hwid}) =>
  {
    setshowAlert(true);
    setclientName(client);
    setHardwareid(hwid);
    for(i=0;i<deviceData.length;i++)
    {
      if(deviceData[i][0]==hwid)
      {
        setidate(deviceData[i][4]);
      }
    }
  };

  //To check device is editable or not
  const checkeditable = ( clientName, Hardwareid) => {
    var url =apiUrl+'/listfrdev/' +'' +clientName +''
    
    const Getmethod = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
    }

    fetch(url, Getmethod)
      .then(response => {
        const statusCode = response.status
        if (statusCode == 403) {
          alert('Session expired')
          Restart();
        }
        response.json().then(responseJson => {
        if (responseJson['message'] != null) {
            alert(JSON.stringify(responseJson['message']))
          }
          console.log(JSON.stringify(responseJson));
          let hwids = responseJson['hwids']
          let result1 = false
          for (let i = 0; i < hwids.length; i++) {
            const activehwid = hwids[i]
            if (activehwid['hwid'] == Hardwareid) {
              result1 = true
            }
          }

          if (result1) {
           setIsDialogVisible(true)
           } else {
            alert('This device is already assigned to a location by the Client')
            setIsDialogVisible(false)
          }
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  //To get device details
  const clientpickerenabled=({ itemValue })=>
  {
    let tablearray=[];
    settablesclient( itemValue);
    setselectedValue(itemValue);
    if(itemValue=='All' ||itemValue =='Select the Clients')
    {
      let token=Api
      fetchtabledata(apiUrl,token);
    }
    else{
    var url =apiUrl+'/listardev/' +'' +itemValue +''
      
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
    }).then(response => {
      const statusCode = response.status
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      response.json().then(responseJson => {
        
        if (responseJson['message'] != null) {
          alert(JSON.stringify("test"+responseJson['message']))
        }
        console.log(JSON.stringify(responseJson[0]))
        for(var i=0;i<responseJson.length;i++)
        {
          let j=i+1;
          let client  = responseJson[i].client;
          let hwid=responseJson[i].hwid;
          let array=[];
          array.push(client);
          array.push(hwid);
          array.push(client);
          tablearray.push(array);
            
        }

        settableData(tablearray);
      })
    })
    }
  }

  //To get the clientwise table data
  const clientwisetableData = () => {
    if(tablesclient=='All' ||tablesclient =='Select the Clients' ||tablesclient==undefined||tablesclient==null)
    {
      let token=Api
      fetchtabledata(apiUrl,token);
    }
    else{
    var url =apiUrl+'/listardev/' +'' +tablesclient +''
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
    }).then(response => {
      const statusCode = response.status
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      response.json().then(responseJson => {
        
        if (responseJson['message'] != null) {
          alert(JSON.stringify(responseJson['message']))
        }
        console.log(JSON.stringify(responseJson[0]))
        for(var i=0;i<responseJson.length;i++)
        {
            let j=i+1;
            let client  = responseJson[i].client;
            let hwid=responseJson[i].hwid;
            let array=[];
            array.push(client);
            array.push(hwid);
            array.push(client);
            tablearray.push(array);
        }

        settableData(tablearray);
      })
    })
  }
  }

  //To manage the submit option
  const submitmangement=() =>
  {
    if(edit)
    {
      console.log("onedit");
      updateDevice(selectedValue,Hardwareid);
    }
    else
    {
      console.log("Adddevice");
       Adddevice();
    }
  }

  //To delete the device
  const Deletedevice = ( client, hwid, idate ) => {
    setshowAlert(false)
    const date = moment(idate).format('MM/DD/YYYY')
    const time = moment(idate).format('HH:mm:ss')
    const datestringvalue = date + ',' + time
    var url =apiUrl+'/regdev/' +'' +client +''
 
    const DELETEMethod = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({ hwid: hwid, datetime: datestringvalue }),
    }
    console.log(JSON.stringify(DELETEMethod));
    fetch(url, DELETEMethod).then(response => {
      const statusCode = response.status
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      response
        .json()
        .then(responseJson => {
           if (responseJson['message'] != null) {
            alert(JSON.stringify(responseJson['message']))
          }
          clientwisetableData();
        })
        .catch(error => {
          console.error(error)
        })
    })
    
  }
  
  //To update the device
  const updateDevice = (client, currenthwid ) => {
    setIsDialogVisible(false);
    var url =apiUrl+'/regdev/' +'' +oldClient +''
    const putMethod = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
    },
    body: JSON.stringify({
      hwid: oldhwid,
      nclient:client,
      nhwid: currenthwid,
      deviceid: deviceid,
      devID: devid,
      devEUI: deveui,
      datetime: datevalue,
      mmname:measName,
      fdname:fieldName
    }),
    }
    console.log(JSON.stringify(putMethod));
    fetch(url, putMethod)
    .then(response => {
    const statusCode = response.status
    if (statusCode == 403) {
      alert('Session expired')
      Restart();
    }
    response.json().then(responseJson => {
    if (responseJson['message'] != null) {
      alert(JSON.stringify(responseJson))
    }
    clientwisetableData();
    })
    })
    .catch(error => {
      console.error(error)
    })
  }

  //To get the device device details
  const devicedropdownenabled=(itemValue)=>
  {
    setdeviceoptionselected(itemValue);
    var url =apiUrl+'/getdev/'+selectedValue;  
    alert(JSON.stringify(url));
    const posetMethod = {
      method: 'POST',
       headers: {
         'Content-type': 'application/json',
         Accept: 'application/json',
         Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
       },
       body: JSON.stringify({
         type:itemValue
       }),
     }
   
     fetch(url, posetMethod)
     .then(response => {
     const statusCode = response.status;
     if (statusCode == 403) {
      alert('Session expired')
      Restart();
    } 
     response.json().then(responseJson => {
    if (responseJson['message'] != null) {
       alert(JSON.stringify(responseJson['message']))
     }
    
     let mesasurementdata=responseJson["device_list"];
    
     mesasurementdata=mesasurementdata.splice(0,0,"select device id");
     setdeviceoptionvalue(responseJson["device_list"]);
     
     })
     })
     .catch(error => {
       console.error(error)
     })
  }

  //To get the device details
  const devicedropdownvalueenabled=(itemValue)=>
  {
    setdeviceoptionvalueselected(itemValue);
    if(deviceoptionselected=="devID")
    {
      setdevid(itemValue)
        
    }
    else{
      setdeveui(itemValue)
    }
  }
  return (
    <View>
      <AppBar navigation={navigation} title={"Register Device"}></AppBar>
      <View style={{flexDirection:"row"}}>
      <Button mode="contained" style={styles.button} onPress={adddevicemange}>Add Device</Button>
	    <Picker selectedValue={tablesclient} style={{width: '35%'}} onValueChange={itemValue => clientpickerenabled({ itemValue })}>
        {data.map((value,key) => (
	      <Picker.Item label={value} value={value} key={key} />
	      ))}
      </Picker>
    </View>
  <ScrollView > 
      <View style={{ marginLeft: 'auto', marginRight: 'auto', paddingTop: 20 }}>
      
      <Table borderStyle={{borderColor: 'transparent'}}>
        <Row data={tableHead} style={styles.head} widthArr={widthArr} textStyle={{ margin: 6, color:'white', fontWeight: 'bold', textTransform: 'uppercase' }}/>
      </Table> 
      <Table borderStyle={{borderColor: 'transparent'}}> 
         {
            tableData.map((rowData, index) => (
              
              <TableWrapper key={index}   style={[styles.row, index%2 && {backgroundColor: '#F8F7FA'}]}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell  key={cellIndex} data={cellIndex === 2 ? element(rowData, index) : cellData} style={{width:widthArr[cellIndex]}}textStyle={styles.text}  />
                  ))
                }
              </TableWrapper>
             
            ))
          }
       
       </Table> 
        
        </View>
        </ScrollView>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Delete Device"
          message={"Are you sure want to delete "+Hardwareid+"?"}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="cancel"
          confirmText="delete "
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => setshowAlert(false)}
          onConfirmPressed={() =>Deletedevice (clientName,Hardwareid,idate)}
/>
      <Portal>
        <Dialog
          style={{ width: '90%', marginLeft: '5%' ,backgroundColor: '#FFFFFF'}}
          visible={isDialogVisible}
          
        >
          <Dialog.Title
            style={{
              fontSize: 15,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop:'5%',
              marginBottom:'10%',
              backgroundColor: '#560CCE',
              color: '#FFFFFF',
              padding: 10,
              borderRadius: 40,
            }}
          >
            {dilogtitle}
          </Dialog.Title>
          <Dialog.Content
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width:'100%'
            }}
          >
            <View>
         
            
            <View style={{ width: '100%', 
                height: 40,
                borderRadius: 5, 
                borderWidth: 1, 
                borderColor: '#560CCE', 
                overflow: 'hidden', 
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 10,
                marginBottom: 10,
                alignSelf: 'center' }}>
              <Picker
              selectedValue={selectedValue}
              style={{
                width: '100%',
                height: 40,
                color: '#696C6E'
              }}
              onValueChange={itemValue => setselectedValue(itemValue)}
              >
			
              {data.map((value,key) => (
                <Picker.Item label={value} value={value} key={key} />
              ))}
			 
              </Picker>
            </View>
            <View style={{ width: '100%', 
                height: 40,
                borderRadius: 5, 
                borderWidth: 1, 
                borderColor: '#560CCE', 
                overflow: 'hidden', 
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 10,
                marginBottom: 10,
                alignSelf: 'center' }}>
              <Picker
              selectedValue={deviceoptionselected}
              style={{width:'100%'}}
              onValueChange={itemValue => devicedropdownenabled( itemValue )}
              >
                {deviceoption.map((value,key) => (
	                <Picker.Item label={value} value={value} key={key} />
	              ))}
	            </Picker>
            </View>
            <View style={{ width: '100%', 
                height: 40,
                borderRadius: 5, 
                borderWidth: 1, 
                borderColor: '#560CCE', 
                overflow: 'hidden', 
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 10,
                marginBottom: 10,
                alignSelf: 'center' }}>
            <Picker
              selectedValue={deviceoptionvalueselected}
              style={{width:'100%'}}
              onValueChange={itemValue => devicedropdownvalueenabled( itemValue )}
              >
                {deviceoptionvalue.map((value,key) => (
	                <Picker.Item label={value} value={value} key={key} />
	              ))}
	          </Picker>

              </View>
              
             
        
            <TextInput
              label="Enter Hardware ID"
              returnKeyType="next"
              maxLength={50}
              value={Hardwareid}
              onChangeText={text => setHardwareid(text)}
              autoCapitalize="none"
              autoCompleteType="street-address"
              textContentType="fullStreetAddress"
              keyboardType="web-search"
            />
         <TouchableOpacity onPress={showDatepicker}>
          <Text style={{borderWidth:1}}>{datevalue}</Text>
        </TouchableOpacity>
           
        {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}  
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              style={{
                width: '30%',
                marginVertical: 10,
                paddingVertical: 2,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              onPress={submitmangement}
            >
              Submit
            </Button>
            <Button
              mode="contained"
              style={{
                width: '30%',
                marginVertical: 10,
                paddingVertical: 2,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              onPress={() => setIsDialogVisible(false)}
            >
              Cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: '#606070',
    flexDirection: 'row',
  },
  button: {
    width: '35%',
	
    marginVertical: 5,
    paddingVertical: 2,
    marginLeft: '15%',
    marginRight: 'auto',
  },
  row: {
    flexDirection: 'row',
  },
  dilog: {
    width: '40%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dilog_content: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  touchopacity: {
    color: 'white',
    fontSize: 20,
    padding: 10,
  },
  picker: {
    width: 100,
    backgroundColor: '#FFF0E0',
    borderColor: 'black',
    borderWidth: 1,
  },
  head: { height: 40, backgroundColor: '#560CCE' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#E8DCFC',borderWidth: 1, borderColor: '#C1C0B9' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  dataWrapper: { marginTop: -1 },
  btnText: { textAlign: 'center', color: '#fff' },
  singleHead: { width: 100, height: 40}
})

export default RegisterDevice
