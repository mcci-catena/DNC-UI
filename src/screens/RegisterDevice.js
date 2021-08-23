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
//    const [datevalue, setdatevalue] = useState(new Date())
  const [visible, setVisible] = useState(false);
  const [uservisible, setuserVisible] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [edit, setedit] = useState(null);
  const [shouldShow, setShouldShow] = useState(true);
  const[oldClient,setoldClient]=useState('');
  const [datevalue, setdatevalue] = useState(new Date())
  const tablearray=[];
  const clients = [];
  const [tableHead, settableHead] =useState(["S.No","clients", 'Hardware ID','Measurement Name','Field Name','Device ID', 'Dev ID','Dev EUI','Install Date','Remove Date','Action'])
  const [tableData, settableData] = useState([]);
  const [widthArr, setwidthArr] = useState([50,100, 180, 180,180,180, 180, 180, 200, 200, 100]);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState(new Date());



  const dateformatvalue = moment(datevalue).utc().format('MM/DD/YYYY')
  const timevalue = moment(datevalue).utc().format('HH:mm:ss')
  const datestringvalue = dateformatvalue + ',' + timevalue
  const isFocused = useIsFocused();
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
    if(isFocused){
     
    getApitoken();
    settablesclient('');
    
    }
  }, [isFocused])

  
  
  const fetchtabledata =( token )=> {
    const url='https://staging-dashboard.mouserat.io/dncserver/listardev';
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
            let mmname=responseJson[i].mmname;
            let fdname=responseJson[i].fdname;
            let array=[];
            array.push(j);
            array.push(client);
            array.push(hwid);
            array.push(mmname);
            array.push(fdname);
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
    fetch('https://staging-dashboard.mouserat.io/dncserver/clients', {
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
         
        })
      })
      .catch(error => {
        console.error(error)
      })
  }
  const adddevicemange=()=>
  {

    setedit(false);
    setdilogtitle('Add device');
    setIsDialogVisible(true);
    setHardwareid('')
    setdeviceid('')
    setdevid('')
    setdeveui('')
    setidate('')
    
    
  }
  const Adddevice = () => {
    setIsDialogVisible(false)

    var url = 'https://staging-dashboard.mouserat.io/dncserver/regdev'
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
        datetime: datestringvalue,
        mmname:measName,
        fdname:fieldName
      }),
    }
 
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
        clientwisetableData();
      })
    })
  }
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
    setdeviceid(rowData[5]);
    setdevid(rowData[6]);
    setdeveui(rowData[7]);
    setidate(rowData[8]);
    setmeasName(rowData[3])
    setfieldName(rowData[4])
    var dateutc = Date.parse(rowData[8]);
    const dateformatvalue = moment(dateutc).format('MM/DD/YYYY')
    const timevalue = moment(dateutc).format('HH:mm:ss')
    const datestringvalue = dateformatvalue + ',' + timevalue
    setdatevalue(datestringvalue);
    checkeditable(rowData[1] ,rowData[2])
 
}

  const createButtonAlert = ({client,hwid,idate}) =>
  {
    setshowAlert(true);
    setclientName(client);
    setHardwareid(hwid);
    setidate(idate);

  };

  const checkeditable = ( clientName, Hardwareid) => {
    var url =
      'https://staging-dashboard.mouserat.io/dncserver/listfrdev/' +
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
  const clientpickerenabled=({ itemValue })=>
  {
    settablesclient( itemValue);
    setselectedValue(itemValue);
    if(itemValue=='All' ||itemValue =='Select the Clients')
    {
      let token=Api
      fetchtabledata(token);
    }
    else{
    var url =
      'https://staging-dashboard.mouserat.io/dncserver/listardev/' +
      '' +
      itemValue +
      ''
    console.log(url);  
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
          alert(JSON.stringify("test"+responseJson['message']))
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
            let mmname=responseJson[i].mmname;
            let fdname=responseJson[i].fdname;
            let array=[];
            array.push(j);
            array.push(client);
            array.push(hwid);
            array.push(mmname);
            array.push(fdname);
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
  const clientwisetableData = () => {

     
   
    if(tablesclient=='All' ||tablesclient =='Select the Clients' ||tablesclient==undefined||tablesclient==null)
    {
      let token=Api
      fetchtabledata(token);
    }
    else{
    var url =
      'https://staging-dashboard.mouserat.io/dncserver/listardev/' +
      '' +
      tablesclient +
      ''
    console.log(url);  
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
          alert(JSON.stringify("test"+responseJson['message']))
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
            let mmname=responseJson[i].mmname;
            let fdname=responseJson[i].fdname;
            let array=[];
            array.push(j);
            array.push(client);
            array.push(hwid);
            array.push(mmname);
            array.push(fdname);
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
       updateDevice(selectedValue,Hardwareid);
     }
     else
     {
      
      console.log("Adddevice");
       Adddevice();
     }
   }
  const Deletedevice = ( client, hwid, idate ) => {
    
    setshowAlert(false);
    const date = moment(idate).format('MM/DD/YYYY')
    const time = moment(idate).format('HH:mm:ss')
    const datestringvalue = date + ',' + time
    var url =
      'https://staging-dashboard.mouserat.io/dncserver/regdev/' +
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
          
            clientwisetableData();
         
        })
        .catch(error => {
          console.error(error)
        })
    })
    
  }
      
  const updateDevice = (client, currenthwid ) => {
  
    setIsDialogVisible(false)
    var url =
      'https://staging-dashboard.mouserat.io/dncserver/regdev/' +
      '' +
      oldClient +
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
        nclient:client,
        nhwid: currenthwid,
        deviceid: deviceid,
        devID: devid,
        devEUI: deveui,
        datetime: datestringvalue,
        mmname:measName,
        fdname:fieldName
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
          //fetchtabledata(Api);
        })
      })
      .catch(error => {
        console.error(error)
      })
      
        
        clientwisetableData();
     
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
     
      <View style={{ marginTop:'5%', marginHorizontal: 20 }}> 
      <ScrollView horizontal={true} > 
      <Table borderStyle={{borderColor: 'transparent'}}>
     
          <Row data={tableHead} style={styles.head} widthArr={widthArr} textStyle={{margin: 6,color:'white', fontWeight: 'bold', textTransform: 'uppercase'}}/>
          <ScrollView>
     
          {
            tableData.map((rowData, index) => (
              <TableWrapper key={index}   style={[styles.row, index%2 && {backgroundColor: '#F8F7FA'}]}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell  key={cellIndex} data={cellIndex === 10 ? element(rowData, index) : cellData} style={{width:widthArr[cellIndex]}}textStyle={styles.text}  />
                  ))
                }
              </TableWrapper>
            ))
          }
          </ScrollView>
       
        </Table>
        </ScrollView>
        </View>
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
          style={{ width: '40%', marginLeft: '30%' ,backgroundColor: '#F7F6E7'}}
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
         
            
             
            <Picker
              selectedValue={selectedValue}
              style={{width: '100%'}} 
              onValueChange={itemValue => setselectedValue(itemValue)}
            >
			
              {data.map((value,key) => (
                <Picker.Item label={value} value={value} key={key} />
              ))}
			 
            </Picker>

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
              <DateTimePicker
            value={datevalue}
            minDate={new Date(2018, 0, 4)}
            maxDate={new Date(3020, 0, 4)}
            
            onChange={value =>setdatevalue(value)}
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
             <TextInput
              label="Enter Measurement Name"
              returnKeyType="next"
              value={measName}
              onChangeText={text => setmeasName(text)}
              autoCapitalize="none"
              autoCompleteType="street-address"
              textContentType="fullStreetAddress"
              keyboardType="web-search"
            />
            <TextInput
              label="Enter Field Name"
              returnKeyType="next"
              value={fieldName}
              onChangeText={text => setfieldName(text)}
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
  head: { height: 40, backgroundColor: '#560CCE' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#E8DCFC',borderWidth: 1, borderColor: '#C1C0B9' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  dataWrapper: { marginTop: -1 },
  btnText: { textAlign: 'center', color: '#fff' },
  singleHead: { width: 100, height: 40}
})

export default RegisterDevice
