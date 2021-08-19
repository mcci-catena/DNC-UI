
import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Alert, Picker ,ScrollView,Platform,Image} from 'react-native'
import TextInput from '../components/TextInput'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Button from '../components/Button'
import { Dialog, Portal,Menu ,Appbar} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import  moment, { utc } from 'moment'
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import AppBar from '../components/AppBar'
import AwesomeAlert from 'react-native-awesome-alerts';
import DateTimePicker from '@react-native-community/datetimepicker';
const Configuredevice = ({ navigation }) => {
  let [site, setsite] = useState([])
  let [pile, setpile] = useState([])
  let [hwid, sethwid] = useState([])
  const[lat,setlat]=useState('');
  const[long,setlong]=useState('');
  let [servername, setServername] = useState({ value: '' })
  let [Hardwareid, setHardwareid] = useState('')
  let [pilename, setpilename] = useState('')
  let [measurementname, setmeasurementname] = useState('')
  const [datevalue, setdatevalue] = useState(new Date())
  let [removedevicepicker, setremovedevicepicker] = useState(false)
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [isreplaceDialogVisible, setIsreplaceDialogVisible] = useState(false)
  const [isremoveDialogVisible, setIsremoveDialogVisible] = useState(false)
  const [removesubmit, setremovesubmit] = useState(false)
  const [replacesubmit, setreplacesubmit] = useState(false)
  const [deletesubmit, setdeletesumbit] = useState(false)
  const [ClientVisible, setIsclientVisible] = React.useState(false)
  const [newdeviceValue, setnewdeviceValue] = useState('')
  const [datetextVisible, setdatetextVisible] = useState(false)
  const [piletextVisible, setpiletextVisible] = useState(false)
  const [pilebuttonVisible, setpilebuttonVisible] = useState(true)
  const [locationbuttonVisible, setlocationbuttonVisible] = useState(true)
  const [data, setData] = useState([])
  const [replacedata, setreplaceData] = useState([])
  const [selectedValue, setselectedValue] = useState('')
  const [siteValue, setsiteValue] = useState('')
  const [pileValue, setpileValue] = useState('')
  const [locationValue, setlocationValue] = useState('')
  const [deviceValue, setdeviceValue] = useState('')
  const [Api, setApi] = useState('')
  const [uname, setuname] = useState('')
  const [location, setlocation] = useState([])
  let [device, setdevice] = useState([])
  const [siteservername, setsiteservername] = useState({})
  const [tableValue, settableValue] = useState('')
  const [piledbname, setpiledbname] = useState({})
  const [pilemeasname, setpilemeasname] = useState({})
  const [visible, setVisible] = useState(false);
  const [uservisible, setuserVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const [showAlert, setshowAlert] = useState(false);
  const [showRemoveAlert, setshowRemoveAlert] = useState(false);
  const clients = []
  const sites = []
  const piles = []
  const locations = []
  const devices = []
  const removedevices = []
  const removedevicesdate = {}
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
  const getApitoken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const uname = await AsyncStorage.getItem('uname')
      const usertype = await AsyncStorage.getItem('usertype')
      if (token !== null && uname !== null) {
        setApi(token)
        setuname(uname.replace(/['"]+/g, ''))
        fetchClientlist(token)
      }
      if (usertype == 'Client') {
        console.log('Client');
        setpickerhide(false);
        setShouldShow(false);
        
      }
      else{
        console.log('Admin');
           settablehide(false);
      }
      
    } catch (e) {
      console.log(e)
    }
  }
  let inputProps = {
    placeholder: 'Date and time',
    className: 'datetime',
  }
  useEffect(() => {
    getApitoken()
  }, [])

  
  const [textInput, settextInput] = useState([]);
  const [inputData, setinputData] = useState([])
  const[taglength,settaglength]=useState();
 

  
 let textarray = [];
 const addTextInput = (index) => {
     let label=taglist[index]
     textarray.push(<TextInput key={index}  label="Tag"
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
            navigation.reset({
              index: 0,
              routes: [{ name: 'LoginScreen' }],
            })
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
  var url =
  'https://staging-dashboard.mouserat.io/dncserver/rpdev/' +
  '' +
  selectedValue +
  ''
  console.log("repalce url:"+url);
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
console.log("replace:"+JSON.stringify(postMethod));
fetch(url, postMethod)
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
      navigation.reset({
        index: 0,
        routes: [{ name: 'Configuredevice' }],
      })
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
      console.log("new url:"+url);
      const postMethod = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
        },
        body: JSON.stringify(requestdata),
      }
      console.log("new url:"+JSON.stringify(postMethod));
      fetch(url, postMethod)
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
            fetchtabledata(selectedValue);
          })
        })
        .catch(error => {
          console.error(error)
        })
    
  }

 

  const fetchDevicelist = selectedValue => {
    
    var url =
      'https://staging-dashboard.mouserat.io/dncserver/listfrdev/' +
      '' +
      selectedValue +
      ''
     
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
         
          let hwids1 = responseJson['hwids']
    
          devices.push('Select the devices')
          if(responseJson['message']!="No Devices registered under this client!")
          {
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
      <View style={{ paddingRight: 10 }}>
      <Image
       source={require('../assets/remove.png')}
      fadeDuration={0}
      style={{ width: 20, height: 20 }}
    />
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>createButtonAlert({hwid:""+cellData[taglength+1]+""})}>
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
    var url =
    'https://staging-dashboard.mouserat.io/dncserver/rmdev/' +
    '' +
    selectedValue +
    ''
    console.log("remove url:"+url);
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
  console.log("remove url:"+JSON.stringify(postMethod));
  fetch(url, postMethod)
    .then(response => {
      const statusCode = response.status
      response.json().then(responseJson => {
        if (statusCode == 403) {
          alert('inavalid token/token expired')
          navigation.reset({
            index: 0,
            routes: [{ name: 'LoginScreen' }],
          })
        }
       
         else if (responseJson['message'] != null) {
          alert(JSON.stringify(responseJson['message']))
        }
        fetchtabledata(selectedValue);
      })
    })
    .catch(error => {
      console.error(error)
    })
    
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
    var url =
        'https://staging-dashboard.mouserat.io/dncserver/device/' +
        '' +
        selectedValue +
        ''
        console.log("delete url:"+url);
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
      console.log("repalce url:"+JSON.stringify(postMethod));
      fetch(url, postMethod)
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
            fetchtabledata(selectedValue);
          })
        })
        .catch(error => {
          console.error(error)
        })
  }

const pickerenabled=(itemValue) =>
{
  console.log(itemValue);

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
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => addDevicebutton()}
        >
          New Device
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => replaceDevice()}
        >
          Replace Device
        </Button>
        </View>
       
        <View style={{ width: '50%', 
                borderRadius: 10, 
                borderWidth: 1, 
                borderColor: '#560CCE', 
                overflow: 'hidden', 
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: 10,
                marginBottom: 20 }}>
        <Picker
                selectedValue={selectedValue}
                style={{width: '100%'}}
                enabled={pickerhide}
                onValueChange={itemValue =>pickerenabled(itemValue)}
              >
                {data.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
              </View>
            
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>    
        <ScrollView horizontal={true} > 
        {tablehide && (   <Table borderStyle={{borderColor: 'transparent'}}>
     
          <Row data={tableHead} style={styles.head} widthArr={widthArr} textStyle={{margin: 6, color:'white', fontWeight: 'bold', textTransform: 'uppercase' }}/>
          <ScrollView>
     
          {
            tableData.map((rowData, index) => (
              // #F7F6E7
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
          onConfirmPressed={() =>removeDevice}
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
        <Portal>
          <Dialog
            // style={{ width: Platform.OS === 'web' ? '40%' : '80%', marginLeft:Platform.OS === 'web' ? '30%' : '10%' ,backgroundColor: '#F7F6E7',height:'auto'}}
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
              ADD DEVICE INFORMATION
            </Dialog.Title>
            <Dialog.Content
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width:'100%'
              }}
            >
              
              <View style={{ width: '100%', marginLeft: 'auto', marginRight: 'auto', height: 45 }}>
              {show && (
        // <View style={{ marginLeft: 'auto', marginRight: 'auto', height: 50 }}>
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
                //  enabled={false}
                selectedValue={deviceValue}
                style={{
                  width: '100%',
                  height: 40,
                  color: '#696C6E'
                }}
                onValueChange={itemValue => setdeviceValue(itemValue)}
              >
                {device.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
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
            <Dialog.Title
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Replace Device Information
            </Dialog.Title>
            <Dialog.Content
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width:'80%'
              }}
            >
              
        
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
          {/* <Text style={{borderWidth:1}}>{datevalue}</Text> */}
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
                //  enabled={false}
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
   // border: '5px solid gray',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  // #808B97
  head: { height: 40, backgroundColor: '#560CCE' },
  text: { margin: 6 },
  // #FFF1C1
  row: { flexDirection: 'row', backgroundColor: '#E8DCFC',borderWidth: 1, borderColor: '#C1C0B9' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  dataWrapper: { marginTop: -1 },
  btnText: { textAlign: 'center', color: '#fff' },
  singleHead: { width: 100, height: 40}
})
export default Configuredevice
