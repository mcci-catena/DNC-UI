/*###############################################################################
// Module: Configuredevice.native.js
// 
// Function:
//      Function to device configuration for app
// 
// Version:
//    V1.02  Tue Dec 01 2021 10:30:00  muthup   Edit level 2
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
//       1.01 Wed July 16 2021 10:30:00 muthup
//       Module created.
//       1.02 Tue Dec 01 2021 10:30:00 muthup
//       Fixed issues #2 #3 #4 #5 #6 #7
###############################################################################*/

import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Alert, Picker ,ScrollView,Platform,Image,TextInput} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Button from '../components/Button'
import { Dialog, Portal,Menu ,Appbar} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import  moment, { utc } from 'moment'
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import AppBar from '../components/AppBar'
import AwesomeAlert from 'react-native-awesome-alerts';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useIsFocused } from "@react-navigation/native";
import {Restart} from 'fiction-expo-restart';
import { theme } from '../core/theme'
const Configuredevice = ({ navigation }) => {
  let [hwid, sethwid] = useState([])
  const[lat,setlat]=useState('12.44');
  const[long,setlong]=useState('24.44');
  let [Hardwareid, setHardwareid] = useState('')
  const [datevalue, setdatevalue] = useState(new Date())
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isreplaceDialogVisible, setIsreplaceDialogVisible] = useState(false)
  const [newdeviceValue, setnewdeviceValue] = useState('')
  const [data, setData] = useState([])
  const [replacedata, setreplaceData] = useState([])
  const [selectedValue, setselectedValue] = useState('')
  const [deviceValue, setdeviceValue] = useState('')
  const [olddata, setolddata] = useState([]);
  const [dilogtitle, setdilogtitle] = useState('ADD DEVICE INFORMATION');
  const [editdevice, seteditdevice] = useState(false);
  const [Api, setApi] = useState('')
  const [uname, setuname] = useState('')
  let [device, setdevice] = useState([])
  const [shouldShow, setShouldShow] = useState(true);
  const [showAlert, setshowAlert] = useState(false);
  const [showRemoveAlert, setshowRemoveAlert] = useState(false);
  const clients = []
  const devices = []
  const removedevices = []
  const hwids = []
  const [pickerhide, setpickerhide] = useState(true)
  const [tablehide, settablehide] = useState(true)
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(new Date());
  const tablearray=[];
  const [clienttaglist,setclienttaglist]=useState({});
  const[taglist,settaglist]=useState([]);
  const [tableHead, settableHead] =useState([])
  const [tableData, settableData] = useState([]);
  const [widthArr, setwidthArr] = useState([]);
  const [textInput, settextInput] = useState([]);
  const[apiUrl,setapiUrl]=useState('');
  const [inputData, setinputData] = useState([])
  const[taglength,settaglength]=useState();
  let textarray = [];

  //To get api token from session
  const getApitoken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const uname = await AsyncStorage.getItem('uname')
      const usertype = await AsyncStorage.getItem('usertype');
      const apiUrl = await AsyncStorage.getItem('apiUrl');
      setapiUrl(apiUrl);
      if (token !== null && uname !== null) {
        setApi(token)
        setuname(uname.replace(/['"]+/g, ''))
        fetchClientlist(token,apiUrl)
      }
      if (usertype == 'Client') {
        setShouldShow(false);
      }
      settablehide(false);
      } catch (e) {
      console.log(e)
    }
  }
  //This function is used to fetch and update the values before execute other function
  const isFocused = useIsFocused();
    useEffect(() => {
    if(isFocused){
      getApitoken();
      setselectedValue('');
    }
  }, [isFocused])

  //To add Textinput dynamically
  const addTextInput = (index) => {
    let labelvalue=taglist[index]
    textarray.push(<View style={styles.textboxview}>
    <Text style={styles.textboxtextview}>{labelvalue +" :"}</Text>
    <TextInput key={index} style={styles.input} label={labelvalue}
    onChangeText={(text) => addValues(text,index)} /></View>);
    settextInput(textarray);
  }

  //To get values from dynamic textinput
  const addValues = (text, index) => {
    let dataArray = inputData;
    let checkBool = false;
    if (dataArray.length !== 0){
      dataArray.forEach(element => {
      if (element.index === index ){
        element.text = text;
        checkBool = true;
      }
    });
  }
  if (checkBool){
    setinputData(dataArray);
  }
  else {
    dataArray.push({'text':text,'index':index});
    setinputData(dataArray);
  }
  }
  const dateformatvalue = moment(datevalue).utc().format('MM/DD/YYYY')
  const timevalue = moment(datevalue).utc().format('HH:mm:ss')
  const datestringvalue = dateformatvalue + ',' + timevalue

  //To get datepicker value
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

  //To fetch table data
  const fetchtabledata = (itemValue) => {
    var taglist=[];
    let tableHead=[];
    let widthArr=[];
    taglist=clienttaglist[itemValue];
    settaglist(taglist);
    tableHead.push("S.NO");
    widthArr.push(50);
    if(taglist!=undefined)
    {
      settaglength(taglist.length);
      for(var i=0;i<taglist.length;i++)
      {
        tableHead.push(taglist[i]);
        widthArr.push(100);
      }
    }
    tableHead.push("Hardware id")
    tableHead.push("Install Date")
    tableHead.push("Remove Date")
    tableHead.push("Action")
    widthArr.push(200);
    widthArr.push(200);
    widthArr.push(200);
    widthArr.push(200);
    settableHead(tableHead);
    setwidthArr(widthArr);
    const url=apiUrl+'/listadev/'+''+itemValue+'';
    const getMethod={
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
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
        removedevices.push('Select the device')
        for(var i=0;i<responseJson.length;i++)
        {
          let j=i+1;
          let hwid=responseJson[i].hwid;
          let idate=responseJson[i].idate;
          let rdate=responseJson[i].rdate;
          let array=[];
          array.push(j);
          removedevices.push(hwid)
          for(var l=0;l<taglist.length;l++)
          {
            let tag=taglist[l];
            let data=responseJson[i][""+tag+""]
            array.push(data);
          }
          array.push(hwid);
          array.push(idate);
          array.push(rdate);
          array.push(rdate);
          tablearray.push(array);
        }
        settableData(tablearray);
        setreplaceData(removedevices)
        })
        })
    }

    //To fetch client list
    const fetchClientlist = (token,apiUrl) => {
      fetch(apiUrl+'/clients', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token.replace(/['"]+/g, '') + '',
        },
      })
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
          clients.push('Select the Clients')
          let taglist={}
          for (var i = 0; i < responseJson.length; i++) {
            const json = responseJson[i].cname
            taglist[json]=responseJson[i].taglist;
            clients.push(json)
          }
          setclienttaglist(taglist);
          setData(clients)
        })
      })
      .catch(error => {
        console.error(error)
      })
    }

    //To Replace the device
    const ReplaceDevice=()=>
    {
      setIsreplaceDialogVisible(false);
      const dateformatvalue = moment(new Date()).utc().format('MM/DD/YYYY')
      const timevalue = moment(new Date()).utc().format('HH:mm:ss')
      const datestringvalue = dateformatvalue + ',' + timevalue
      var url =apiUrl+'/rpdev/' +'' +selectedValue +''
      const postMethod = {
        method: 'POST',
         headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        nhwid: newdeviceValue,
        hwid: deviceValue,
        datetime: datestringvalue,
      }),
      }
  
      fetch(url, postMethod)
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
          fetchtabledata(selectedValue);
          fetchDevicelist(selectedValue);
      })
    })
    .catch(error => {
      console.error(error)
    })
    }

  //To configure the device
  const AddDevice = () => {
    if(editdevice)
    {
      let requestdata={};
      let newd={};
      let otherd={};
      requestdata['hwid']=deviceValue;
      for(var i=0;i<taglength;i++)
      {  
        let textdata=inputData[i];
        let oldtags=olddata[0]['tags'];
        if(textdata !=undefined)
        {
          for(var j=0;j<taglength;j++)
          {
            if(textdata.index==oldtags[j].index)
            {
              newd[""+taglist[j]+""]=textdata["text"];
            }
          }
        }
        otherd[""+taglist[i]+""]=oldtags[i].text;
      }
      requestdata['newd']=newd;
      requestdata['otherd']=otherd;
      setIsDialogVisible(false)
      var url = apiUrl+'/device/'+selectedValue
      const postMethod = {
        method: 'PUT',
        headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify(requestdata),
      }
      console.log(JSON.stringify(postMethod))
      fetch(url, postMethod)
      .then(response => {
      const statusCode = response.status;
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      if(statusCode == 200)
      {
        alert('Updated Successfully')
      }
      response.json().then(responseJson => {
      if (responseJson['message'] != null) {
        alert(JSON.stringify(responseJson['message']))
      }
      fetchtabledata(selectedValue);
      fetchDevicelist(selectedValue);
    })
    })
    .catch(error => {
      console.error(error)
    })
    }
    else{
      let requestdata={};
      requestdata["cname"]=selectedValue;
      requestdata["lat"]=12.34;
      requestdata["long"]=13.30;
      requestdata["id"]=deviceValue;
      requestdata["datetime"]=datestringvalue;
      for(var i=0;i<taglength;i++)
      {  
        let textdata=inputData[i];
        if(textdata==undefined)
        {
          alert("Please fill the all information");
          return;
        }
        else{
          requestdata[""+taglist[i]+""]=textdata["text"];
        }
      }
      setIsDialogVisible(false)
      var url = apiUrl+'/device'
      const postMethod = {
        method: 'POST',
        headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
        },
        body: JSON.stringify(requestdata),
      }
      fetch(url, postMethod)
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
        fetchtabledata(selectedValue);
        fetchDevicelist(selectedValue);
      })
      })
      .catch(error => {
        console.error(error)
      })
    }
  }

  //To fetch device list
  const fetchDevicelist = selectedValue => {
    var url =apiUrl+'/listfrdev/' +'' +selectedValue +''
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
      const statusCode = response.status;
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      response.json().then(responseJson => {
        if (responseJson['message'] != null) {
        alert(JSON.stringify(responseJson['message']))
        }
        let hwids1 = responseJson['hwids']
        devices.push('Select the devices')
        if(responseJson['message']!="No Devices registered under this client!"){
        for (let i = 0; i < hwids1.length; i++) {
          let devicedate={};
          const activehwid = hwids1[i];
          devicedate['hwid']=activehwid['hwid'];
          devicedate['date']=activehwid['date'];
          hwids.push(devicedate)
          devices.push(activehwid['hwid'])
        }
      }
      setdevice(devices)
      sethwid(hwids)
    })
    })
    .catch(error => {
      console.error(error)
    })
  }

  //To Add action columns in table
  const element = (cellData, index) => (
    <View style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={()=>createRemoveButtonAlert({hwid:""+cellData[taglength+1]+"",removedate:cellData[taglength+3]})}>
        <View style={{ paddingRight: 10 }} >
          <Text style={{color:'blue'}}>Remove</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() =>replaceDevice({hwid:""+cellData[taglength+1]+"",removedate:cellData[taglength+3]})}>
        <View style={{ paddingRight: 10 }} >
          <Text style={{color:'blue'}}>Replace</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>createButtonAlert({hwid:""+cellData[taglength+1]+""})}>
        <View style={{ paddingRight: 10 }} >
          <Text style={{color:'blue'}}>Delete</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>editclicked(cellData)}>
        <View style={{ paddingRight: 10 }} >
          <Text style={{color:'blue'}}>Edit</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
  const createButtonAlert = ({hwid}) =>
  {
    setshowAlert(true);
    setHardwareid(hwid);
  };

  //To get edit row details
  const editclicked=(cellData)=>
  {
    setdilogtitle("EDIT DEVICE INFORMATION");
    seteditdevice(true);
    setdatevalue(cellData[taglength+2]);
    setdeviceValue(cellData[taglength+1])
    textarray=[];
    settextInput(textarray);
    let olddata=[];
    let olddataset={};
    olddataset['Hardwareid']=cellData[taglength+1];
    olddataset['Date']=cellData[taglength+1];
    let tags=[];
    for(var i=0;i<taglength;i++)
    {
      tags.push({index:i,text:cellData[i+1]})
      let index=i;
      let labelvalue=taglist[i]
      textarray.push(<View style={styles.textboxview}>
        <Text style={styles.textboxtextview}>{labelvalue +" :"}</Text>
        <TextInput key={index} style={styles.input} defaultValue={cellData[i+1]} label={labelvalue}
      onChangeText={(text) => addValues(text,index)} /></View>);
      settextInput(textarray);
    }
    olddataset['tags']=tags;
    olddata.push(olddataset);
    setolddata(olddata)
    setIsDialogVisible(true)
  }

  //To show remove button alert
  const createRemoveButtonAlert = ({hwid,removedate}) =>
  {
    if(removedate===null)
    {
      setshowRemoveAlert(true);
      setHardwareid(hwid);
    }
    else{
      alert("This device was already removed");
    }  
  };

  //To remove the device 
  const removeDevice = () => {
    setshowRemoveAlert(false);
    const dateformatvalue = moment(new Date()).utc().format('MM/DD/YYYY')
    const timevalue = moment(new Date()).utc().format('HH:mm:ss')
    const datestringvalue = dateformatvalue + ',' + timevalue
    var url =apiUrl+'/rmdev/' +'' +selectedValue +''
    const postMethod = {
      method: 'PUT',
      headers: {
      'Content-type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        hwid: Hardwareid,
        datetime: datestringvalue,
      }),
    }
    fetch(url, postMethod)
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
      fetchtabledata(selectedValue);
      fetchDevicelist(selectedValue);
    })
    })
    .catch(error => {
      console.error(error)
    })
  }

  //To get last register device information
  const addDevicebutton = () => {
    if(selectedValue=='')
      {
        alert("Please Select Client")
      }
      else{
        setdatevalue(new Date());
        textarray=[];
        seteditdevice(false);
        setdilogtitle("ADD DEVICE INFORMATION");
        for(var i=0;i<taglength;i++)
        {
          addTextInput(i);
        }
        setIsDialogVisible(true)
      }
  }

  //To replace the device
  const replaceDevice = ({hwid,removedate}) => {
    if(removedate===null)
    {
      setdeviceValue(hwid);
      setIsreplaceDialogVisible(true);
    }
    else{
      alert("This device was already removed");
    } 
  }
  
  //To delete the device
  const deleteDevice = () => {
    setshowAlert(false);
    var url =apiUrl+'/device/' +'' +selectedValue +''
    const postMethod = {
      method: 'DELETE',
      headers: {
      'Content-type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
    },
    body: JSON.stringify({
      hwid: Hardwareid,
    }),
    }
    fetch(url, postMethod)
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
        fetchtabledata(selectedValue);
    })
    })
    .catch(error => {
      console.error(error)
    })
    fetchDevicelist(selectedValue);
  }
  const pickerenabled=(itemValue) =>
  {
    setselectedValue(itemValue);
    if(itemValue!="Select Client")
   {
      fetchtabledata(itemValue);
      settablehide(true);
      fetchDevicelist(itemValue)
    }
  }
  const devicepickerenable=(itemValue)=>
  {
    setdeviceValue(itemValue);
    let deviceinfo=hwid.find(x =>x.hwid ==itemValue)
  setdatevalue(deviceinfo['date']);
  } 
  return (
    <View>
      <AppBar navigation={navigation} title={"Configure Device"}></AppBar>
      <View>
        <View style={{flexDirection:"row"}}>
            <Button mode="contained"  style={styles.button} onPress={() => addDevicebutton()}>Add Device</Button>
        </View>
        <View style={{ width: '50%',borderRadius: 10, borderWidth: 1, borderColor: '#560CCE', overflow: 'hidden', marginLeft: 'auto',marginRight: 'auto',marginTop: 10, marginBottom: 20 }}>
          <Picker selectedValue={selectedValue} style={{width: '100%'}} onValueChange={itemValue =>pickerenabled(itemValue)}>
                {data.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
          </Picker>
        </View>
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>   
          <ScrollView> 
            <ScrollView horizontal={true} > 
              {tablehide && (   <Table borderStyle={{borderColor: 'transparent'}}>
              <Row data={tableHead} style={styles.head} widthArr={widthArr} textStyle={{margin: 6, color:'white', fontWeight: 'bold', textTransform: 'uppercase' }}/>
              {tableData.map((rowData, index) => (
              <TableWrapper key={index}   style={[styles.row, index%2 && {backgroundColor: '#F8F7FA'}]}>
                {rowData.map((cellData, cellIndex) => (
                <Cell  key={cellIndex} data={cellIndex === taglength+4 ? element(rowData, index): cellData}  style={{width:widthArr[cellIndex]}}textStyle={styles.text}  />
                ))
                }
              </TableWrapper>
              ))}
              </Table>)}
            </ScrollView>
          </ScrollView>
        </View>
        <AwesomeAlert
          show={showRemoveAlert}
          showProgress={false}
          title="Remove Device"
          message={"Are you sure want to remove "+Hardwareid+"?"}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="cancel"
          confirmText="Remove "
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => setshowRemoveAlert(false)}
          onConfirmPressed={() =>removeDevice()}
        />
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
          onCancelPressed={() => setshowAlert(false)}
          onConfirmPressed={() =>deleteDevice()}
        />
        <Portal>
          <Dialog
          style={{ width: '90%',backgroundColor: '#FFFFFF'}}
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
          >
            <Dialog.ScrollArea>
            <ScrollView style={{ marginTop: 5, marginBottom: 5, width: '100%' }} contentContainerStyle={{paddingHorizontal: 0 }}>
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
            <View style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', height: 45 }}>
              {show && (<DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
            />        
            )} 
            <TouchableOpacity onPress={showDatepicker}>
              <Text style={{borderWidth:1}}>{datestringvalue}</Text>
            </TouchableOpacity>
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
          {!editdevice&& <Picker
          selectedValue={deviceValue}
          style={{
          width: '100%',
          height: 40,
          color: '#696C6E'
          }}
          onValueChange={itemValue => devicepickerenable(itemValue)}
          >
            {device.map((value, key) => (
              <Picker.Item label={value} value={value} key={key} />
            ))}
          </Picker>}
          {editdevice&&<TextInput
            label="Enter lattitude"
            returnKeyType="next"
            value={deviceValue}
            style={styles.input}
            disabled={true}
            autoCapitalize="none"
            autoCompleteType="street-address"
            textContentType="fullStreetAddress"
            keyboardType="web-search"
          />}
        </View>
        {textInput.map((value,key) => {
          return value
        })}
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          mode="contained"
          style={styles.dialogbutton}
          onPress={AddDevice}
        >
          Submit
        </Button>
        <Button
          mode="contained"
          style={styles.dialogbutton}
          onPress={() => setIsDialogVisible(false)}
        >
          Cancel
        </Button>
      </Dialog.Actions>
      </ScrollView>
      </Dialog.ScrollArea>
    </Dialog>
    </Portal>
    <Portal>
      <Dialog
        style={{ width: Platform.OS === 'web' ? '40%' : '80%', marginLeft:Platform.OS === 'web' ? '30%' : '10%' ,backgroundColor: '#F7F6E7'}}
        visible={isreplaceDialogVisible}
        onDismiss={() => setIsreplaceDialogVisible(false)}
      >
        <Dialog.Title style={{marginLeft: 'auto',marginRight: 'auto',}}>Replace Device Information</Dialog.Title>
        <Dialog.Content style={{marginLeft: 'auto',marginRight: 'auto',width:'80%'}}>
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
          <TouchableOpacity onPress={showDatepicker}>
            <Text style={{borderWidth:1}}>{datestringvalue}</Text>
          </TouchableOpacity>
          <Picker
            selectedValue={deviceValue}
            style={{
              width: '100%'
              }}
              onValueChange={itemValue => setdeviceValue(itemValue)}
          >
            {replacedata.map((value, key) => (
              <Picker.Item label={value} value={value} key={key} />
            ))}
          </Picker>
          <Picker
            selectedValue={newdeviceValue}
            style={{
              width: '100%'
            }}
            onValueChange={itemValue => setnewdeviceValue(itemValue)}
          >
            {device.map((value, key) => (
              <Picker.Item label={value} value={value} key={key} />
            ))}
          </Picker>
        </Dialog.Content>
      <Dialog.Actions>
        <Button
          mode="contained"
          style={styles.button}
          onPress={ReplaceDevice}
        >
          Submit
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => setIsreplaceDialogVisible(false)}
        >
          Cancel
        </Button>
      </Dialog.Actions>
    </Dialog>
    </Portal>
    </View>
  </View>
  )
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: '#606070',
    flexDirection: 'row',
    display: 'flex',
  },
  button: {
    width: '40%',
    marginVertical: 10,
    paddingVertical: 2,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dialogbutton: {
    width: '40%',
    marginTop: 0,
    marginBottom: 20,
    paddingVertical: 2,
    marginLeft: 'auto',
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
  form: {
    width: '500px',
    padding: '10px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  head: { height: 40, backgroundColor: '#560CCE' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#E8DCFC',borderWidth: 1, borderColor: '#C1C0B9' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  dataWrapper: { marginTop: -1 },
  btnText: { textAlign: 'center', color: '#fff' },
  singleHead: { width: 100, height: 40},
  centeredView: {
    flex: 1,
    marginVertical: 10
  },
  input: {
    width: '100%',
    height: 40,
	borderColor: theme.colors.primary,
    borderWidth: 2,
    padding: 10,
    backgroundColor: theme.colors.surface,
  },
  textboxview:{
    width: '100%',
    marginVertical: 12,
    flexDirection:'column'
  },
  textboxtextview:{
    color:theme.colors.primary
  }
})
export default Configuredevice
