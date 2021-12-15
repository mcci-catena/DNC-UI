/*###############################################################################
// Module: Registerdevice
// 
// Function:
//      Function to register device for web
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
import { DateTimePicker } from 'react-rainbow-components';
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
  const [selectedValue, setselectedValue] = useState('')
  const [Api, setApi] = useState('')
  const [clientName, setclientName] = useState('')
  const [tablesclient, settablesclient] = useState('')
  const [dilogtitle,setdilogtitle]=useState('Add device');
  const [uname, setuname] = useState('')
  const [oldhwid, setoldhwid] = useState('')
  const [visible, setVisible] = useState(false);
  const [uservisible, setuserVisible] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [edit, setedit] = useState(null);
  const [shouldShow, setShouldShow] = useState(true);
  const[oldClient,setoldClient]=useState('');
  const[apiUrl,setapiUrl]=useState('');
  const [datevalue, setdatevalue] = useState(new Date())
  const [deviceoptionvalue, setdeviceoptionvalue] = useState([])
  const tablearray=[];
  const clients = [];
  const [tableHead, settableHead] =useState(["S.No","clients", 'Hardware ID','Dev ID','Dev EUI','DeviceId','Install Date','Remove Date','Action'])
  const [deviceoption,setdeviceoption]=useState(["Select device option","devID","devEUI"])
  const [deviceoptionselected,setdeviceoptionselected]=useState('')
  const [editdevicevalue,seteditdevicevalue]=useState('')
  const [deviceoptionvalueselected,setdeviceoptionvalueselected]=useState('')
  const [tableData, settableData] = useState([]);
  const [widthArr, setwidthArr] = useState([50,100,180,180,180,180,200, 200, 100]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(new Date());
  const dateformatvalue = moment(datevalue).utc().format('MM/DD/YYYY')
  const timevalue = moment(datevalue).utc().format('HH:mm:ss')
  const datestringvalue = dateformatvalue + ',' + timevalue
  const isFocused = useIsFocused();
  var devicevalue;
  
  //To get api token
  const getApitoken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const uname = await AsyncStorage.getItem('uname')
      const apiUrl = await AsyncStorage.getItem('apiUrl');
      setapiUrl(apiUrl);
      if (token !== null && uname !== null) {
        setApi(token)
        fetchClientlist(token,apiUrl);
        fetchtabledata(token,apiUrl);
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
      settablesclient('');
    }
  }, [isFocused])
  
  //To fetch table data
  const fetchtabledata =( token,apiUrl )=> {
    const url=apiUrl+'/listardev';
    const getMethod={
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token.replace(/['"]+/g, '') + '',
      },
    }
    
    fetch(url,getMethod ).then(response => {
      const statusCode = response.status;
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      response.json().then(responseJson => {
       if (responseJson['message'] != null) {
        alert(JSON.stringify(responseJson['message']))
      }
      for(var i=0;i<responseJson.length;i++)
      {
        let j=i+1;
        let client  = responseJson[i].client;
        let hwid=responseJson[i].hwid;
        let devID=responseJson[i].devID;
        let deviceID=responseJson[i].deviceid;
        let devEUI=responseJson[i].devEUI;
        let idate=responseJson[i].idate;
        let rdate=responseJson[i].rdate;
        let array=[];
        array.push(j);
        array.push(client);
        array.push(hwid);
        array.push(devID);
        array.push(devEUI);
        array.push(deviceID);
        array.push(idate);
        array.push(rdate);
        array.push(client);
        tablearray.push(array);
      }
      settableData(tablearray);
      })
    })
  }
  
  //To fetch clientlist
  const fetchClientlist = (token,apiUrl) => {
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
        clients.push('Select Client')
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
  
  //To add device manage
  const adddevicemange=()=>
  {
    setedit(false);
    setdilogtitle('Add device');
    if(deviceoptionselected!=='')
    {
      setHardwareid('');
      devicedropdownenabled(deviceoptionselected);
    }
    setIsDialogVisible(true);
    setidate('')
  }
  
  //To add device
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
        deviceid:deviceid,
        devID: devid,
        devEUI:deveui,
        datetime: datestringvalue,
     
      }),
    }
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
  
  //To action column property in table
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
    <TouchableOpacity onPress={()=>createButtonAlert({client:""+cellData[1]+"",hwid:""+cellData[2]+"",idate:""+cellData[8]+""})}>
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
  
  //To get row values from register device table
  const editIconclicked=(rowData,index) =>
  {
    console.log(rowData);
    setedit(true);
    setdilogtitle('Edit device');
    setclientName(rowData[1]);
    setoldClient(rowData[1]);
    setselectedValue(rowData[1]);
    setHardwareid(rowData[2]);
    setoldhwid(rowData[2]);
    setdevid(rowData[3]);
    setdeveui(rowData[4]);
    setdeviceid(rowData[5]);
    setidate(rowData[6]);
    var deviceselected;
    if((rowData[3]==null ||rowData[3]==undefined||rowData[3]=='')&&(rowData[5]==null ||rowData[5]==undefined||rowData[5]==''))
    {
      devicevalue=rowData[4]
      deviceselected='devEUI'
    }
    else if((rowData[4]==null ||rowData[4]==undefined||rowData[4]=='')&&(rowData[5]==null ||rowData[5]==undefined||rowData[5]=='')) 
    {
      devicevalue=rowData[3]
      deviceselected='devID'
    }
    else if((rowData[4]==null ||rowData[4]==undefined||rowData[4]=='')&&(rowData[3]==null ||rowData[3]==undefined||rowData[3]=='')) 
    {
      alert("You can't edit this device.please contact administrator");
      return;
    }
    setdeviceoptionselected(deviceselected);
    var url =apiUrl+'/getdev/'+rowData[1];  
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
    var dateutc = Date.parse(rowData[6]);
    const dateformatvalue = moment(dateutc).format('MM/DD/YYYY')
    const timevalue = moment(dateutc).format('HH:mm:ss')
    const datestringvalue = dateformatvalue + ',' + timevalue
    setdatevalue(datestringvalue);
    checkeditable(rowData[1] ,rowData[2])
  }

  //To create alert
  const createButtonAlert = ({client,hwid,idate}) =>
  {
    setshowAlert(true);
    setclientName(client);
    setHardwareid(hwid);
    setidate(idate);
  };
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
        if(responseJson['hwids']!=undefined){
          let hwids = responseJson['hwids'];
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
        }
      })
    })
    .catch(error => {
      console.error(error)
    })
  }

  //To client picker enabled 
  const clientpickerenabled=({ itemValue })=>
  {
    settablesclient( itemValue);
    setselectedValue(itemValue);
    if(itemValue=='All' ||itemValue =='Select the Clients')
    {
      let token=Api
      fetchtabledata(token,apiUrl);
    }
    else{
      var url =apiUrl+'/listardev/' +'' +itemValue +''
      fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
        },
      })
      .then(response => {
        const statusCode = response.status
        if (statusCode == 403) {
          alert('Session expired')
          Restart();;
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
            let devID=responseJson[i].devID;
            let devEUI=responseJson[i].devEUI;
            let deviceID=responseJson[i].deviceid;
            let idate=responseJson[i].idate;
            let rdate=responseJson[i].rdate;
            let array=[];
            array.push(j);
            array.push(client);
            array.push(hwid);
            array.push(devID);
            array.push(devEUI);
            array.push(deviceID);
            array.push(idate);
            array.push(rdate);
            array.push(client);
            tablearray.push(array);
          }
          settableData(tablearray);
        })
      })
    }
  }

  //To get clientwise table data
  const clientwisetableData = () => {
    if(tablesclient=='All' ||tablesclient =='Select the Clients' ||tablesclient==undefined||tablesclient==null)
    {
      let token=Api
      fetchtabledata(token,apiUrl);
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
            let devID=responseJson[i].devID;
            let devEUI=responseJson[i].devEUI;
            let deviceID=responseJson[i].deviceid;
            let idate=responseJson[i].idate;
            let rdate=responseJson[i].rdate;
            let array=[];
            array.push(j);
            array.push(client);
            array.push(hwid);
            array.push(devID);
            array.push(devEUI);
            array.push(deviceID);
            array.push(idate);
            array.push(rdate);
            array.push(client);
            tablearray.push(array);
            
        }

        settableData(tablearray);
      })
    })
  }
  }

  //To check submit option 
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
    setshowAlert(false);
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
    setIsDialogVisible(false)
    var url =apiUrl+'/regdev/' +'' +oldClient +'';

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
        devID: devid,
        devEUI: deveui,
        deviceid:deviceid,
        datetime: datestringvalue,
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
          
        })
      })
      .catch(error => {
        console.error(error)
      })
      clientwisetableData();
  }

  //To get the device data
  const devicedropdownenabled=(itemValue)=>
  {
    setdeviceoptionselected(itemValue);
    var url =apiUrl+'/getdev/'+selectedValue;  
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
      var mesasurementdata=[];
      mesasurementdata.push("select device id");
      if(responseJson["device_list"]!=undefined)
      {
        for(var i=0;i<responseJson["device_list"].length;i++)
        {
          mesasurementdata.push(responseJson["device_list"][i]);
      
        }
      }
      setdeviceoptionvalue(mesasurementdata);
     })
     })
     .catch(error => {
       console.error(error)
     })
  }
  
  //To get the device data
  const devicedropdownvalueenabled=(itemValue)=>
  {
    setdeviceoptionvalueselected(itemValue);
    if(deviceoptionselected=="devID")
    {
      setdevid(itemValue);
       setHardwareid(itemValue);
        
    }
    else if(deviceoptionselected=="deviceid")
    {
      setdeviceid(itemValue);
      setHardwareid(itemValue);
    }
    else{
      setdeveui(itemValue);
      setHardwareid(itemValue);
    }
  }
  return (
    <View>
      
     
      <AppBar navigation={navigation} title={"Register Device"}></AppBar>
      
      <View style={{flexDirection:'row'}}>
	  
      <Button
        mode="contained"
        style={styles.button}
        onPress={adddevicemange}
      >
        Add Device
      </Button>
	  
	  
    <Picker
    selectedValue={tablesclient}
    style={{width:'35%'}}
    onValueChange={itemValue => clientpickerenabled({ itemValue })}
  >
 
    {data.map((value,key) => (
	  
      <Picker.Item label={value} value={value} key={key} />
	  
	 
    ))}
	
  </Picker>
 
  </View>
     
      <View style={{ marginTop:'5%', marginHorizontal: '10%' }}> 
      <ScrollView horizontal={true} > 
      <View>
      <Table borderStyle={{borderColor: 'transparent'}}>
     
          <Row data={tableHead} style={styles.head} widthArr={widthArr} textStyle={{margin: 6,color:'white', fontWeight: 'bold', textTransform: 'uppercase'}}/>
      </Table>
      <ScrollView>
      <Table borderStyle={{borderColor: 'transparent'}}>
         {
            tableData.map((rowData, index) => (
              <TableWrapper key={index}   style={[styles.row, index%2 && {backgroundColor: '#F8F7FA'}]}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell  key={cellIndex} data={cellIndex === 8 ? element(rowData, index) : cellData} style={{width:widthArr[cellIndex]}}textStyle={styles.text}  />
                  ))
                }
              </TableWrapper>
            ))
          }
         
        </Table>
        </ScrollView>
        </View>
        </ScrollView>
        </View>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Delete Device"
          message={"Are you sure want to delete "+Hardwareid+"?"}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="cancel"
          confirmText="delete "
          confirmButtonColor="#DD6B55"
          cancelButtonColor="blue"
          onCancelPressed={() => setshowAlert(false)}
          onConfirmPressed={() =>Deletedevice (clientName,Hardwareid,idate)}
/>
      <Portal>
        <Dialog
          style={{ width: '40%', marginLeft: '30%' ,backgroundColor: '#F7F6E7'}}
          visible={isDialogVisible}
          
        >
          <Dialog.Title
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              
            }}
          >
            {dilogtitle}
          </Dialog.Title>
          <Dialog.Content
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width:'80%'
            }}
          >
            <View>
         
            
            <View style={{width: '100%', flex: 1, flexDirection: 'row', marginVertical: 15}} >
            <Picker
              selectedValue={selectedValue}
              style={{width: '100%'}} 
              onValueChange={itemValue => setselectedValue(itemValue)}
            >
			
              {data.map((value,key) => (
                <Picker.Item label={value} value={value} key={key} />
              ))}
			 
            </Picker>
           </View>
           <View style={{width: '100%', flex: 1, flexDirection: 'row', marginVertical: 15}} >
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
              <View style={{width: '100%', flex: 1, flexDirection: 'row', marginVertical: 15}} >
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
              maxLength={20}
              value={Hardwareid}
              onChangeText={text => setHardwareid(text)}
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
          />
              <DateTimePicker
            value={datevalue}
            minDate={new Date(2018, 0, 4)}
            maxDate={new Date(3020, 0, 4)}
            
            onChange={value =>setdatevalue(value)}
        />
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
