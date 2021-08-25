// Module: Configuredevice
// 
// Function:
//      Function to devicr configuration for web
// 
// Version:
//    V1.0.0  Thu Jul 17 2021 10:30:00  muthup   Edit level 1
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

import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Alert, Picker ,ScrollView,Platform,Image} from 'react-native'
import TextInput from '../components/TextInput'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Button from '../components/Button'
import { Dialog, Portal,Menu ,Appbar} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import  moment, { utc } from 'moment'
import { DateTimePicker, RainbowThemeContainer } from 'react-rainbow-components';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import AppBar from '../components/AppBar'
import AwesomeAlert from 'react-native-awesome-alerts';
import { useIsFocused } from "@react-navigation/native";
const Configuredevice = ({ navigation }) => {
  let [hwid, sethwid] = useState([])
  const[lat,setlat]=useState('');
  const[long,setlong]=useState('');
  let [Hardwareid, setHardwareid] = useState('')
  const [datevalue, setdatevalue] = useState(new Date())
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isreplaceDialogVisible, setIsreplaceDialogVisible] = useState(false)
  const [newdeviceValue, setnewdeviceValue] = useState('')
  const [data, setData] = useState([])
  const [replacedata, setreplaceData] = useState([])
  const [selectedValue, setselectedValue] = useState('')
  const [deviceValue, setdeviceValue] = useState('')
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
  const [inputData, setinputData] = useState([])
  const[taglength,settaglength]=useState();
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){
      getApitoken();
      setselectedValue('');
    }
  }, [isFocused])
  const getApitoken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const uname = await AsyncStorage.getItem('uname')
      const usertype = await AsyncStorage.getItem('usertype')
      if (token !== null && uname !== null) {
        setApi(token)
        setuname(uname.replace(/['"]+/g, ''))
        fetchClientlist(token);
      }
      if (usertype == 'Client') {
        setpickerhide(false);
        setShouldShow(false);
      }
      else{
        settablehide(false);
      }
      
    } catch (e) {
      console.log(e)
    }
  }
  let textarray = [];
  const addTextInput = (index) => {
    let labelvalue=taglist[index]
    textarray.push(<TextInput key={index}  label={labelvalue}
    onChangeText={(text) => addValues(text,index)} />);
    settextInput(textarray);
  }
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
  
  const fetchtabledata = (itemValue) => {
    var taglist=[];
    let tableHead=[];
    let widthArr=[];
    taglist=clienttaglist[itemValue];
    settaglist(taglist);
    settaglength(taglist.length);
    tableHead.push("S.NO");
    widthArr.push(50);
    for(var i=0;i<taglist.length;i++)
    {
      tableHead.push(taglist[i]);
      widthArr.push(100);
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
    const url='https://staging-dashboard.mouserat.io/dncserver/listrmdev/'+''+itemValue+'';
    const getMethod={
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
    }
    fetch(url,getMethod ).then(response => {
    const statusCode = response.status
    response.json().then(responseJson => {
      if (statusCode == 403) {
        alert('inavalid token/token expired')
      } else if (responseJson['message'] != null) {
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
  const fetchClientlist = token => {
    fetch('https://staging-dashboard.mouserat.io/dncserver/clients', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token.replace(/['"]+/g, '') + '',
      },
    })
    .then(response => {
      const statusCode = response.status
      response.json().then(responseJson => {
        if (statusCode == 403) {
          alert('inavalid token/token expired')
          navigation.reset({index: 0,routes: [{ name: 'LoginScreen' }],})
        } else if (responseJson['message'] != null) {
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
  const ReplaceDevice=()=>
  {
    setIsreplaceDialogVisible(false);
    var url ='https://staging-dashboard.mouserat.io/dncserver/rpdev/' +'' +selectedValue +''
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
      const statusCode = response.status
      response.json().then(responseJson => {
        if (statusCode == 403) {
          alert('inavalid token/token expired')
          navigation.reset({index: 0,routes: [{ name: 'LoginScreen' }],})
        } else if (responseJson['message'] != null) {
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
  
  const AddDevice = () => {
    let requestdata={};
    requestdata["cname"]=selectedValue;
    requestdata["lat"]=lat;
    requestdata["long"]=long;
    requestdata["id"]=deviceValue;
    requestdata["datetime"]=datestringvalue;
    for(var i=0;i<taglength;i++)
    {  
      let textdata=inputData[i];
      requestdata[""+taglist[i]+""]=textdata["text"];
    }
    setIsDialogVisible(false)
    var url = 'https://staging-dashboard.mouserat.io/dncserver/device'
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
      const statusCode = response.status
      response.json().then(responseJson => {
      if (statusCode == 403) {
        alert('inavalid token/token expired')
        navigation.reset({index: 0,routes: [{ name: 'LoginScreen' }],})
      } else if (responseJson['message'] != null) {
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
  const fetchDevicelist = selectedValue => {
    var url ='https://staging-dashboard.mouserat.io/dncserver/listfrdev/' +'' +selectedValue +''
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
      response.json().then(responseJson => {
      if (statusCode == 403) {
        alert('inavalid token/token expired')
        navigation.reset({index: 0,routes: [{ name: 'LoginScreen' }],})
      } else if (responseJson['message'] != null) {
        alert(JSON.stringify(responseJson['message']))
      }
      let hwids1 = responseJson['hwids']
      devices.push('Select the devices')
      if(responseJson['message']!="No Devices registered under this client!"){
        for (let i = 0; i < hwids1.length; i++) {
          const activehwid = hwids1[i]
          hwids.push(activehwid)
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
  const element = (cellData, index) => (
    <View style={{flexDirection:'row'}}>
      <TouchableOpacity onPress={()=>createRemoveButtonAlert({hwid:""+cellData[taglength+1]+""})}>
        <View style={{ paddingRight: 10 }} >
          <Image  source={require('../assets/remove.png')}  fadeDuration={0}  style={{ width: 20, height: 20 }}/>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>createButtonAlert({hwid:""+cellData[taglength+1]+""})}>
        <View >
          <Image  source={require('../assets/delete.png')}  fadeDuration={0}  style={{ width: 20, height: 20 }}/>
        </View>
      </TouchableOpacity>
    </View>
  );
  const createButtonAlert = ({hwid}) =>
  {
    setshowAlert(true);
    setHardwareid(hwid);
  };
  const createRemoveButtonAlert = ({hwid}) =>
  {
    setshowRemoveAlert(true);
    setHardwareid(hwid);
  };
  const removeDevice = () => {
    setshowRemoveAlert(false);
    var url ='https://staging-dashboard.mouserat.io/dncserver/rmdev/' +'' +selectedValue +''
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
      const statusCode = response.status
      response.json().then(responseJson => {
      if (statusCode == 403) {
        alert('inavalid token/token expired')
        navigation.reset({index: 0,routes: [{ name: 'LoginScreen' }],})
      }else if (responseJson['message'] != null) {
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
  const addDevicebutton = () => {
    for(var i=0;i<taglength;i++)
    {
      addTextInput(i);
    }
    setIsDialogVisible(true)
  }
  const replaceDevice = () => {
    setIsreplaceDialogVisible(true)
  }
  const deleteDevice = () => {
    setshowAlert(false);
    var url ='https://staging-dashboard.mouserat.io/dncserver/device/' +'' +selectedValue +''
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
      const statusCode = response.status
      response.json().then(responseJson => {
      if (statusCode == 403) {
        alert('inavalid token/token expired')
        navigation.reset({index: 0,routes: [{ name: 'LoginScreen' }],})
      } else if (responseJson['message'] != null) {
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
    if(itemValue!="Select the Clients")
    {
      fetchtabledata(itemValue);
      settablehide(true);
      fetchDevicelist(itemValue)
    }
  }
  
  return (
    <View>
      <AppBar navigation={navigation} title={"Configure Device"}></AppBar>
      <View>
        <View style={{flexDirection:"row"}}>
          <Button mode="contained"  style={styles.button} onPress={() => addDevicebutton()}>New Device</Button>
          <Button mode="contained"  style={styles.button} onPress={() => replaceDevice()}>Replace Device</Button>
        </View>
        <View style={{ width: '20%',overflow: 'hidden', marginLeft: 'auto',marginRight: 'auto',marginTop: 10,marginBottom: 20 }}>
          <Picker
          selectedValue={selectedValue}
          style={{width: '100%', 
          height: '100%', 
          borderRadius: 30, 
          borderWidth: 1, 
          borderColor: '#560CCE',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingVertical: 10
          }}
          enabled={pickerhide}
          onValueChange={itemValue =>pickerenabled(itemValue)}
        >
          {data.map((value, key) => (
            <Picker.Item label={value} value={value} key={key} />
          ))}
          </Picker>
        </View>
        <View style={{ marginHorizontal: 'auto' }}>  
          <ScrollView horizontal={true} > 
            {tablehide && (   <Table borderStyle={{borderColor: 'transparent'}}>
            <Row data={tableHead} style={styles.head} widthArr={widthArr} textStyle={{margin: 6, color:'white', fontWeight: 'bold', textTransform: 'uppercase'}}/>
          <ScrollView>
          {
            tableData.map((rowData, index) => (
              <TableWrapper key={index}   style={[styles.row, index%2 && {backgroundColor: '#F8F7FA'}]}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell  key={cellIndex} data={cellIndex === taglength+4 ? element(rowData, index): cellData}  style={{width:widthArr[cellIndex]}}textStyle={styles.text}  />
                  ))
                }
              </TableWrapper>
            ))
          }
          </ScrollView>
       
            </Table>)}
          </ScrollView>
        </View>
        <AwesomeAlert
          show={showRemoveAlert}
          showProgress={false}
          title="Remove Device"
          message={"Are you sure want to remove "+Hardwareid+"?"}
          closeOnTouchOutside={true}
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
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="cancel"
          confirmText="delete "
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => setshowAlert(false)}
          onConfirmPressed={() =>deleteDevice()}
        />
        <View style={styles.centeredView}> 
          <Portal>
            <Dialog
            style={{ width: '40%', height: '80%', marginLeft:Platform.OS === 'web' ? '30%' : '10%' }}
            visible={isDialogVisible}
            
            >
            <Dialog.ScrollArea>
            <ScrollView contentContainerStyle={{paddingHorizontal: 24}}>
            <Dialog.Title
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop:'5%',
              marginBottom:'5%',
              backgroundColor: '#560CCE',
              color: '#FFFFFF',
              padding: 10,
              borderRadius: 40,
            }}
            >
            ADD DEVICE INFORMATION
            </Dialog.Title>
            <Dialog.Content
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width:'100%'
              }}
            >
              
            <View style={{ width: '100%', 
              height: 40,
              overflow: 'hidden', 
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 10,
              marginBottom: 10,
              alignSelf: 'center' }}>
              <Picker
               
                selectedValue={deviceValue}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 5, 
                  borderWidth: 1, 
                  borderColor: '#560CCE',
                  color: '#696C6E' 
                }}
                onValueChange={itemValue => setdeviceValue(itemValue)}
                >
                {device.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
            </View>

            <View style={{borderRadius: 5, borderWidth: 1, borderColor: '#560CCE',marginTop: 15,marginBottom: 10,}}>
              <DateTimePicker
              value={datevalue}
              minDate={new Date(2018, 0, 4)}
              maxDate={new Date(3020, 0, 4)}
              onChange={value =>setdatevalue(value)}
              style={{ width: '100%', height: '100%' }}
              />
            </View>
            <TextInput
              label="Enter lattitude"
              returnKeyType="next"
              value={lat}
              onChangeText={text => setlat(text)}
              autoCapitalize="none"
              autoCompleteType="street-address"
              textContentType="fullStreetAddress"
              keyboardType="web-search"
            />
            <TextInput
              label="Enter longtitude"
              returnKeyType="next"
              value={long}
              onChangeText={text => setlong(text)}
              autoCapitalize="none"
              autoCompleteType="street-address"
              textContentType="fullStreetAddress"
              keyboardType="web-search"
            />
            {textInput.map((value,key) => {
              return value
            })}
            </Dialog.Content>
            <Dialog.Actions>
              <Button mode="contained"  style={styles.button}onPress={AddDevice}>Submit</Button>
              <Button mode="contained"  style={styles.button} onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            </Dialog.Actions>
          </ScrollView>
        </Dialog.ScrollArea>
      </Dialog>
    </Portal>
    </View>
        

    <Portal>
      <Dialog
        style={{ width: Platform.OS === 'web' ? '40%' : '80%',backgroundColor: '#FFFFFF', marginHorizontal: 'auto',marginTop:'15%' }}
        visible={isreplaceDialogVisible}
        
      >
      <Dialog.Title
        style={{
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop:'5%',
        marginBottom:'5%',
        backgroundColor: '#560CCE',
        color: '#FFFFFF',
        padding: 10,
        borderRadius: 40,
        }}
      >
      REPLACE DEVICE INFORMATION
      </Dialog.Title>
      <Dialog.Content
        style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        width:'100%'
        }}
      >
      <View 
        style={{
        borderRadius: 5, 
        borderWidth: 1, 
        borderColor: '#560CCE',
        marginTop: 15,
        marginBottom: 10,
      }}>
        <DateTimePicker
        value={datevalue}
        minDate={new Date(2018, 0, 4)}
        maxDate={new Date(3020, 0, 4)}
        onChange={value =>setdatevalue(value)}
        />
      </View>
      <View style={{ width: '100%', 
            height: 40,
            overflow: 'hidden', 
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 10,
            marginBottom: 10,
            alignSelf: 'center' }}>
        <Picker
          selectedValue={deviceValue}
          style={{
          width: '100%',
          height: '100%',
          borderRadius: 5, 
          borderWidth: 1, 
          borderColor: '#560CCE',
          color: '#696C6E' 
          }}
          onValueChange={itemValue => setdeviceValue(itemValue)}
        >
        {replacedata.map((value, key) => (
          <Picker.Item label={value} value={value} key={key} />
        ))}
        </Picker>
      </View>
      <View style={{ width: '100%', 
            height: 40,
            overflow: 'hidden', 
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: 10,
            marginBottom: 10,
            alignSelf: 'center' }}>
        <Picker
          selectedValue={newdeviceValue}
          style={{
          width: '100%',
          height: '100%',
          borderRadius: 5, 
          borderWidth: 1, 
          borderColor: '#560CCE',
          color: '#696C6E' 
          }}
          onValueChange={itemValue => setnewdeviceValue(itemValue)}
        >
        {device.map((value, key) => (
          <Picker.Item label={value} value={value} key={key} />
        ))}
        </Picker>
      </View>

    </Dialog.Content>
    <Dialog.Actions>
      <Button mode="contained"  style={styles.button} onPress={ReplaceDevice}>Submit</Button>
      <Button mode="contained"  style={styles.button} onPress={() => setIsreplaceDialogVisible(false)}>Cancel</Button>
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
})
export default Configuredevice
