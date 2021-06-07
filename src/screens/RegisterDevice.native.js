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
// import Datetime from 'react-datetime'
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import  moment from 'moment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker';
import AwesomeAlert from 'react-native-awesome-alerts';
import AppBar from '../components/AppBar';
const RegisterDevice = ({ navigation }) => {
  let [email, setEmail] = useState({ value: '', error: '' })
  let [password, setPassword] = useState({ value: '', error: '' })
  let [Hardwareid, setHardwareid] = useState('')
  let [deviceid, setdeviceid] = useState('')
  let [devid, setdevid] = useState('')
  let [deveui, setdeveui] = useState('')
  const [idate, setidate] = useState('')
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [data, setData] = useState([])
  const [selectedValue, setselectedValue] = useState('')
  const [Api, setApi] = useState('')
  const [clientName, setclientName] = useState('')
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
  const [tableHead, settableHead] =useState(["S.No","clents", 'Hardware ID', 'Device ID', 'Dev ID','Dev EUI','Install Date','Remove Date','Action'])
  const [tableData, settableData] = useState([]);
  const [widthArr, setwidthArr] = useState([50,100, 180, 180, 180, 180, 200, 200, 100]);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(new Date());



  
  const dateformatvalue = moment(date).format('MM/DD/YYYY')
  const timevalue = moment(time).format('HH:mm:ss')
  const datestringvalue = dateformatvalue + ',' + timevalue
 
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

  
 
  const getApitoken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const uname = await AsyncStorage.getItem('uname')
      if (token !== null && uname !== null) {
        setApi(token)
        fetchClientlist(token);
        fetchtabledata(token);
        setuname(uname.replace(/['"]+/g, ''))
        
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getApitoken()
  }, [])

  
  
  const fetchtabledata =( token )=> {
    const url='https://staging-analytics.weradiate.com/apidbm/listadev';
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

      response.json().then(responseJson => {
        if (statusCode == 403) {
          alert('inavalid token/token expired')
        } else if (responseJson['message'] != null) {
          alert(JSON.stringify(responseJson['message']))
        }
        console.log(JSON.stringify(responseJson))
        for(var i=0;i<responseJson.length;i++)
        {
            let j=i+1;
            let client  = responseJson[i].client;
            let hwid=responseJson[i].hwid;
            let deviceid=responseJson[i].deviceid;
            let devID=responseJson[i].devID;
            let devEUI=responseJson[i].devEUI;
            let idate=responseJson[i].idate;
            let rdate=responseJson[i].rdate;
            let array=[];
            array.push(j);
            array.push(client);
            array.push(hwid);
            array.push(deviceid);
            array.push(devID);
            array.push(devEUI);
            array.push(idate);
            array.push(rdate);
            array.push(client);
            tablearray.push(array);
            
        }

        settableData(tablearray);
      })
    })
  }
  const fetchClientlist = token => {
    fetch('https://staging-analytics.weradiate.com/apidbm/client', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token.replace(/['"]+/g, '') + '',
      },
    })
      .then(response => {
        const statusCode = response.status
        response.json().then(responseJson => {
          if (statusCode == 403) {
            alert('inavalid token/token expired')
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
          } else if (responseJson['message'] != null) {
            alert(JSON.stringify(responseJson['message']))
          }
          clients.push('Select the Clients')
          clients.push('All')

          for (var i = 0; i < responseJson.length; i++) {
            const json = responseJson[i].cname

            clients.push(json)
          }

          setData(clients)
          //alert(JSON.stringify(clients));
        })
      })
      .catch(error => {
        console.error(error)
      })
  }
  const adddevicemange=()=>
  {
    const dateformatvalue = moment(date).format('MM/DD/YYYY')
  const timevalue = moment(time).format('HH:mm:ss')
  const datestringvalue = dateformatvalue + ',' + timevalue
    setedit(false);
    setdatevalue(datestringvalue);
    setdilogtitle('Add device');
    setIsDialogVisible(true);
    
    setselectedValue('');
    setHardwareid('')
    setdeviceid('')
    setdevid('')
    setdeveui('')
    setidate('')
    
    
  }
  const Adddevice = () => {
    setIsDialogVisible(false)

    var url = 'https://staging-analytics.weradiate.com/apidbm/mdevice'
    console.log(url);
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
      const statusCode = response.status
      response.json().then(responseJson => {
        if (statusCode == 403) {
          alert('inavalid token/token expired')
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          })
        } else if (responseJson['message'] != null) {
          alert(JSON.stringify(responseJson['message']))
        }
        fetchtabledata(Api);
      })
    })
  }
  const element = (cellData, index) => (
    <View style={{flexDirection:'row'}}>
    <TouchableOpacity onPress={()=>editIconclicked(cellData,index)}>
      <View >
      <Image
       source={require('../assets/edit.png')}
      fadeDuration={0}
      style={{ width: 40, height: 40 }}
    />
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>createButtonAlert({client:""+cellData[1]+"",hwid:""+cellData[2]+"",idate:""+cellData[6]+""})}>
    <View >
    <Image
       source={require('../assets/delete.png')}
      fadeDuration={0}
      style={{ width: 40, height: 40 }}
    />
    </View>
  </TouchableOpacity>
  </View>
  );



  


  const editIconclicked=(rowData,index) =>
  {
    console.log(rowData);
    setedit(true);
    setdilogtitle('Edit device');
    setclientName(rowData[1]);
    setselectedValue(rowData[1]);
    setHardwareid(rowData[2]);
    setoldhwid(rowData[2]);
    setdeviceid(rowData[3]);
    setdevid(rowData[4]);
    setdeveui(rowData[5]);
    setidate(rowData[6]);
    var dateutc = Date.parse(rowData[6]);
    // var dateist=new Date(dateutc);
    // dateist.setHours(dateist.getHours() + 5); 
    // dateist.setMinutes(dateist.getMinutes() + 30);
    const dateformatvalue = moment(dateutc).format('MM/DD/YYYY')
    const timevalue = moment(dateutc).format('HH:mm:ss')
    const datestringvalue = dateformatvalue + ',' + timevalue
 
   setdatevalue(datestringvalue);
    checkeditable(rowData[1] ,rowData[2])
 
    
 
   
  }

  const createButtonAlert = ({client,hwid,idate}) =>
  {

    // Alert.alert(
    //   "Delete user",
    //   "Are you sure want to delete?",
    //   [
    //     {
    //       text: "Cancel",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel"
    //     },
    //     { text: "OK", onPress:()=>Deletedevice (client,hwid,idate) }
    //   ]
    // )
    setshowAlert(true);
    setclientName(client);
    setHardwareid(hwid);
    setidate(idate);

  };

  const checkeditable = ( clientName, Hardwareid) => {
    var url =
      'https://staging-analytics.weradiate.com/apidbm/listmdev/' +
      '' +
      clientName +
      ''
      console.log(url);
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
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
          } else if (responseJson['message'] != null) {
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

  const clientwisetableData = ({ itemValue }) => {
    
    setselectedValue( itemValue)
    if(itemValue=='All' ||itemValue =='Select the Clients')
    {
      let token=Api
      fetchtabledata(token);
    }
    else{
    var url =
      'https://staging-analytics.weradiate.com/apidbm/listadev/' +
      '' +
      itemValue +
      ''
    fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
    }).then(response => {
      const statusCode = response.status

      response.json().then(responseJson => {
        if (statusCode == 403) {
          alert('inavalid token/token expired')
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          })
        }
        if (responseJson['message'] != null) {
          alert(JSON.stringify(responseJson['message']))
        }
        console.log(JSON.stringify(responseJson[0]))
        for(var i=0;i<responseJson.length;i++)
        {
            let j=i+1;
            let client  = responseJson[i].client;
            let hwid=responseJson[i].hwid;
            let deviceid=responseJson[i].deviceid;
            let devID=responseJson[i].devID;
            let devEUI=responseJson[i].devEUI;
            let idate=responseJson[i].idate;
            let rdate=responseJson[i].rdate;
            let array=[];
            array.push(j);
            array.push(client);
            array.push(hwid);
            array.push(deviceid);
            array.push(devID);
            array.push(devEUI);
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
  
   const submitmangement=() =>
   {
     
     if(edit)
     {
       console.log("onedit");
       updateDevice(clientName,Hardwareid);
     }
     else
     {
      
      console.log("Adddevice");
       Adddevice();
     }
   }
  const Deletedevice = ( client, hwid, idate ) => {
    alert(JSON.stringify(client));
    alert(JSON.stringify(hwid));
    alert(JSON.stringify(idate));
    const date = moment(idate).format('MM/DD/YYYY')
    const time = moment(idate).format('HH:mm:ss')
    const datestringvalue = date + ',' + time
    var url =
      'https://staging-analytics.weradiate.com/apidbm/mdevice/' +
      '' +
      client +
      ''
      console.log(url);
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

      response
        .json()
        .then(responseJson => {
          if (statusCode == 403) {
            alert('inavalid token/token expired')
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
          } else if (responseJson['message'] != null) {
            alert(JSON.stringify(responseJson['message']))
          }
          fetchtabledata(Api);
        })
        .catch(error => {
          console.error(error)
        })
    })
    
  }
      
  const updateDevice = (client, currenthwid ) => {
    var url =
      'https://staging-analytics.weradiate.com/apidbm/mdevice/' +
      '' +
      client +
      ''
    
     console.log(url);
    const putMethod = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        hwid: oldhwid,
       
        nhwid: currenthwid,
        deviceid: deviceid,
        devID: devid,
        devEUI: deveui,
        datetime: datevalue,
      }),
    }
   console.log(JSON.stringify(putMethod));
    fetch(url, putMethod)
      .then(response => {
        const statusCode = response.status

        response.json().then(responseJson => {
          if (statusCode == 403) {
            alert('inavalid token/token expired')
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
          } else if (responseJson['message'] != null) {
            alert(JSON.stringify(responseJson))
          }
          fetchtabledata(Api);
        })
      })
      .catch(error => {
        console.error(error)
      })
      fetchtabledata(Api);
  }

  return (
    <View>
      
     
      <AppBar navigation={navigation} title={"Register Device"}></AppBar>
      
      <View style={{flexDirection:'row',height:"10%"}}>
	  
      <Button
        mode="contained"
        style={styles.button}
        onPress={adddevicemange}
      >
        Add Device
      </Button>
	  
	  
      <Picker
    selectedValue={selectedValue}
    
    onValueChange={itemValue => clientwisetableData({ itemValue })}
  >
 
    {data.map((value,key) => (
	  
      <Picker.Item label={value} value={value} key={key} />
	  
	 
    ))}
	
  </Picker>
 
  </View>
     
      
      <ScrollView horizontal={true} > 
      <Table borderStyle={{borderColor: 'transparent'}}>
     
          <Row data={tableHead} style={styles.head} widthArr={widthArr} textStyle={{margin: 6,color:'white'}}/>
          <ScrollView>
     
          {
            tableData.map((rowData, index) => (
              <TableWrapper key={index}   style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell  key={cellIndex} data={cellIndex === 8 ? element(rowData, index) : cellData} style={{width:widthArr[cellIndex]}}textStyle={styles.text}  />
                  ))
                }
              </TableWrapper>
            ))
          }
          </ScrollView>
       
        </Table>
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
          style={{ width: '90%', marginLeft: '5%' ,backgroundColor: '#F7F6E7'}}
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
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
            <Picker
              selectedValue={selectedValue}
              style={{width: '100%'}} 
              onValueChange={itemValue => setselectedValue(itemValue)}
            >
			
              {data.map((value,key) => (
                <Picker.Item label={value} value={value} key={key} />
              ))}
			 
            </Picker>
           
         <TouchableOpacity onPress={showDatepicker}>
          <Text style={{borderWidth:1}}>{datevalue}</Text>
        </TouchableOpacity>
        
         
    
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

            <TextInput
              label="Enter Device ID"
              returnKeyType="next"
              value={deviceid}
              onChangeText={text => setdeviceid(text)}
              autoCapitalize="none"
              autoCompleteType="street-address"
              textContentType="fullStreetAddress"
              keyboardType="web-search"
            />
            <TextInput
              label="Enter dev ID"
              returnKeyType="next"
              value={devid}
              onChangeText={text => setdevid(text)}
              autoCapitalize="none"
              autoCompleteType="street-address"
              textContentType="fullStreetAddress"
              keyboardType="web-search"
            />
            <TextInput
              label="Enter dev EUI"
              returnKeyType="next"
              value={deveui}
              onChangeText={text => setdeveui(text)}
              autoCapitalize="none"
              autoCompleteType="street-address"
              textContentType="fullStreetAddress"
              keyboardType="web-search"
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
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1',borderWidth: 1, borderColor: '#C1C0B9' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  dataWrapper: { marginTop: -1 },
  btnText: { textAlign: 'center', color: '#fff' },
  singleHead: { width: 100, height: 40}
})

export default RegisterDevice
