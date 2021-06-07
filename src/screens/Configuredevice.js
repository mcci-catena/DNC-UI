import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Alert, Picker ,ScrollView} from 'react-native'
import TextInput from '../components/TextInput'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Button from '../components/Button'
import { Dialog, Portal,Menu ,Appbar} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import  moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import AppBar from '../components/AppBar'
const Configuredevice = ({ navigation }) => {
  let [site, setsite] = useState([])
  let [pile, setpile] = useState([])
  let [hwid, sethwid] = useState([])
  
  let [servername, setServername] = useState({ value: '' })
  let [databasename, setdatabasename] = useState('')
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
  
  const [tableHead, settableHead] =useState(["S.No",'Site', 'Pile', 'Location','Harware id','Install Date','Remove Date'])
  const [tableData, settableData] = useState([]);
  const [widthArr, setwidthArr] = useState([50, 100, 100, 100, 200, 200, 200]);
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
        fetchtabledata(uname.replace(/['"]+/g, ''));
       // settableValue(uname);
      }
      else{
        console.log('Admin');
           settablehide(false);
      }
      
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getApitoken()
  }, [])

  
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
    const fetchtabledata = (itemValue) => {
     
      const url='https://staging-analytics.weradiate.com/apidbm/listalldev/'+''+itemValue+'';
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
          for(var i=0;i<responseJson.length;i++)
          {
              let j=i+1;
              
              let site=responseJson[i].site;
              let pile=responseJson[i].pile;
              
              let lname=responseJson[i].lname;
              let devid=responseJson[i].devid;
              let idate=responseJson[i].idate;
              let rdate=responseJson[i].rdate;
              let array=[];
              array.push(j);
              array.push(site);
              array.push(pile);
              array.push(lname);
              array.push(devid);
              array.push(idate);
              array.push(rdate);
             
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

  const fetchSitelist = itemValue => {
    var url = 'https://staging-analytics.weradiate.com/apidbm/listsite'
    console.log(url)
    console.log("Sitesitem"+itemValue);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        client: itemValue, 
      }),
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
          sites.push('Select the sites')

          for (var i = 0; i < responseJson.length; i++) {
            const json = responseJson[i].site

            sites.push(json)
          }
          console.log("Sitesitem"+sites);
          setsite(sites)
        })
      })
      .catch(error => {
        console.error(error)
      })
  }
  const AddDevice = () => {
    if (removesubmit) {
      setIsremoveDialogVisible(false)
     
      var url =
        'https://staging-analytics.weradiate.com/apidbm/rmdevice/' +
        '' +
        deviceValue +
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
          client: selectedValue,
          site: siteValue,
          pile: pileValue,
          id: deviceValue,
          location: locationValue,
          datetime: datevalue,
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
            navigation.reset({
              index: 0,
              routes: [{ name: 'Configuredevice' }],
            })
          })
        })
        .catch(error => {
          console.error(error)
        })
      setremovesubmit(false)
    } else if (replacesubmit) {
      setIsreplaceDialogVisible(false)

      var url =
        'https://staging-analytics.weradiate.com/apidbm/rpdevice/' +
        '' +
        deviceValue +
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
          client: selectedValue,
          site: siteValue,
          pile: pileValue,
          newdev: newdeviceValue,
          location: locationValue,
          datetime: datevalue,
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
      setreplacesubmit(false)
    } else if (deletesubmit) {
      setIsDialogVisible(false)

      var url =
        'https://staging-analytics.weradiate.com/apidbm/device/' +
        '' +
        deviceValue +
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
          client: selectedValue,
          site: siteValue,
          pile: pileValue,

          location: locationValue,
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
            navigation.reset({
              index: 0,
              routes: [{ name: 'Configuredevice' }],
            })
          })
        })
        .catch(error => {
          console.error(error)
        })

      setdeletesumbit(false)
    } else {

      setIsDialogVisible(false)
      var url = 'https://staging-analytics.weradiate.com/apidbm/device'
      console.log("new url:"+url);
      const postMethod = {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
        },
        body: JSON.stringify({
          client: selectedValue,
          site: siteValue,
          pile: pileValue,
          id: deviceValue,
          location: locationValue,
          datetime: datevalue,
        }),
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
  }

  const fetchPilelist = itemValue => {
    const url = 'https://staging-analytics.weradiate.com/apidbm/listpile'
    const postMethod = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        client: selectedValue,
        site: itemValue,
      }),
    }

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
          piles.push('Select the Piles')

          for (var i = 0; i < responseJson.length; i++) {
            const json = responseJson[i].pile
            piledbname['' + responseJson[i].pile + ''] = responseJson[i].dbname
            pilemeasname['' + responseJson[i].pile + ''] =
              responseJson[i].measname
            piles.push(json)
          }

          setpile(piles)
        })
      })
      .catch(error => {
        console.error(error)
      })
  }
  const fetchLocationlist = itemValue => {
    const url = 'https://staging-analytics.weradiate.com/apidbm/listlocation'
    const postMethod = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        client: selectedValue,
        site: siteValue,
        pile: itemValue,
      }),
    }

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
          locations.push('Select the location')

          for (var i = 0; i < responseJson.length; i++) {
            const json = responseJson[i].lname

            locations.push(json)
          }

          setlocation(locations)
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  const fetchDevicelist = selectedValue => {
    var url =
      'https://staging-analytics.weradiate.com/apidbm/listmdev/' +
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
          alert(JSON.stringify(responseJson));
          let hwids1 = responseJson['hwids']
    
          devices.push('Select the devices')
          for (let i = 0; i < hwids1.length; i++) {
            const activehwid = hwids1[i]
            hwids.push(activehwid)

            devices.push(activehwid['hwid'])
          }

          setdevice(devices)
          sethwid(hwids)
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  const fetchremoveDevicelist = itemValue => {
    
    var url = 'https://staging-analytics.weradiate.com/apidbm/listrmdev'
    console.log(url);
    const postmethod = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        client: selectedValue,
        site: siteValue,
        pile: pileValue,
        location: itemValue,
      }),
    }
    console.log(postmethod);
    fetch(url, postmethod)
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

          removedevices.push('Select the device')
          for (let i = 0; i < responseJson.length; i++) {
            const json = responseJson[i].devid

            removedevices.push(json)
          }

          setreplaceData(removedevices)
          sethwid(hwids)
        })
      })
      .catch(error => {
        console.error(error)
      })
  }
  const fetchdeleteDevicelist = itemValue => {
    
    var url = 'https://staging-analytics.weradiate.com/apidbm/listdevice'
    console.log(url);
    const postmethod = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        client: selectedValue,
        site: siteValue,
        pile: pileValue,
        location: itemValue,
      }),
    }
    console.log(postmethod);
    fetch(url, postmethod)
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

          devices.push('Select the device')
          for (let i = 0; i < responseJson.length; i++) {
            const json = responseJson[i].devid

            devices.push(json)
          }

          setdevice(devices)
          
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  const cliendropdownEnabled = itemValue => {
    setselectedValue(itemValue)
    if(itemValue!="Select the Clients")
    {
    fetchSitelist(itemValue)
    }
  }
  const sitedropdownEnabled = itemValue => {
 
    setsiteValue(itemValue)
    if(itemValue!="Select the sites")
    {
    fetchPilelist(itemValue)
    }
  }
  const piledropdownEnabled = itemValue => {
    setpileValue(itemValue);
    if(itemValue!="Select the Piles")
    {
    fetchLocationlist(itemValue)
    }
  }
  const locationdropdownEnabled = itemValue => {
    
    setlocationValue(itemValue)
    if(itemValue!="Select the location")
    {
    if (removedevicepicker ) {
      fetchremoveDevicelist(itemValue)
      setremovedevicepicker(false)
    }
    else if(deletesubmit)
    {
      fetchdeleteDevicelist(itemValue)
    }
     else {
      fetchDevicelist(selectedValue)
    }
  }
  }
  const decicedropdownEnabled = itemValue => {
  
    setdeviceValue(itemValue)
    if(itemValue!="Select the device" )
    {
      if(deletesubmit!=true)
      {
    fetchDevicelist(selectedValue);
    if (replacesubmit!=true && removesubmit!=true) {
      for (let i = 0; i < hwid.length; i++) {
        const date1 = hwid[i]
      
        if (date1['hwid'] == itemValue) {
          const datetime = date1['date']
          const date = moment(datetime).format('MM/DD/YYYY')
          const time = moment(datetime).format('HH:mm:ss')

          const datestringvalue = date + ',' + time

          setdatevalue(datestringvalue)
        }
      }
    }
  }
    }

    setdatetextVisible(true)
  }
  const removeDevice = () => {
    setselectedValue('');
    setsiteValue('');
    setpileValue('');
    setlocationValue('');
    setdeviceValue('');
    const dateformatvalue = moment(date-1).format('MM/DD/YYYY')
    const timevalue = moment(time).format('HH:mm:ss')
     const datestringvalue = dateformatvalue + ',' + timevalue;
     setdatevalue(datestringvalue);
    setremovedevicepicker(true)
    setIsremoveDialogVisible(true)
    setremovesubmit(true)
    
  }
  const addDevice = () => {
    setselectedValue('');
    setsiteValue('');
    setpileValue('');
    setlocationValue('');
    setdeviceValue('');
    setremovesubmit(false);
    setreplacesubmit(false);
    setIsDialogVisible(true)
  }
  const replaceDevice = () => {
    setselectedValue('');
    setsiteValue('');
    setpileValue('');
    setlocationValue('');
    setdeviceValue('');
    setreplacesubmit(true)
    setremovedevicepicker(true)
    setremovesubmit(false)
    setIsreplaceDialogVisible(true)
  }
  const deleteDevice = () => {
    setselectedValue('');
    setsiteValue('');
    setpileValue('');
    setlocationValue('');
    setdeviceValue('');
    setdeletesumbit(true)
    setreplacesubmit(false)
    setremovedevicepicker(false)
    setremovesubmit(false)
    setIsDialogVisible(true)
  }
  const newDevice = itemValue => {
    setnewdeviceValue(itemValue);
    if(itemValue!="Select the devices")
    {
    
     
    for (let i = 0; i < hwid.length; i++) {
      const date1 = hwid[i]
    
      if (date1['hwid'] == itemValue) {
        const datetime = date1['date']
        const date = moment(datetime).format('MM/DD/YYYY')
        const time = moment(datetime).format('HH:mm:ss')

        const datestringvalue = date + ',' + time

        setdatevalue(datestringvalue)
      }
    }
  }
  }
const pickerenabled=(itemValue) =>
{
  console.log(itemValue);

    setselectedValue(itemValue);

    if(itemValue!="Select the Clients")
    {
      
    fetchtabledata(itemValue);
    settablehide(true);
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
          onPress={() => addDevice()}
        >
          New Device
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => removeDevice()}
        >
          Remove Device
        </Button>
        </View>
        <View style={{flexDirection:"row"}}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => replaceDevice()}
        >
          Replace Device
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => deleteDevice()}
        >
          Delete Device
        </Button>
        </View>
        <Picker
                selectedValue={selectedValue}
                style={{width: '30%',marginLeft: 'auto',
                marginRight: 'auto'}}
                enabled={pickerhide}
                onValueChange={itemValue =>pickerenabled(itemValue)}
              >
                {data.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
        <ScrollView horizontal={true} > 
        {tablehide && (   <Table borderStyle={{borderColor: 'transparent'}}>
     
          <Row data={tableHead} style={styles.head} widthArr={widthArr} textStyle={{margin: 6,color:'white'}}/>
          <ScrollView>
     
          {
            tableData.map((rowData, index) => (
              <TableWrapper key={index}   style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell  key={cellIndex} data={cellData} style={{width:widthArr[cellIndex]}}textStyle={styles.text}  />
                  ))
                }
              </TableWrapper>
            ))
          }
          </ScrollView>
       
        </Table>)}
        </ScrollView>
        <Portal>
          <Dialog
            style={{ width: '90%', marginLeft: '5%',backgroundColor: '#F7F6E7' }}
            visible={isDialogVisible}
            onDismiss={() => setIsDialogVisible(false)}
          >
            <Dialog.Title
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Add Device Information
            </Dialog.Title>
            <Dialog.Content
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width:'75%'
              }}
            >
              <Picker
                selectedValue={selectedValue}
                style={{width: '100%'}}
                onValueChange={itemValue => cliendropdownEnabled(itemValue)}
              >
                {data.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
             

              <Picker
                selectedValue={siteValue}
                style={{width: '100%'}}
                onValueChange={itemValue => sitedropdownEnabled(itemValue)}
              >
                {site.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
               <Picker
                selectedValue={pileValue}
                style={{
                  width: '100%'

                }}
                onValueChange={itemValue => piledropdownEnabled(itemValue)}
              >
                {pile.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
              <Picker
                selectedValue={locationValue}
                style={{
                  width: '100%'

                }}
                onValueChange={itemValue => locationdropdownEnabled(itemValue)}
              >
                {location.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
              <Picker
                //  enabled={false}
                selectedValue={deviceValue}
                style={{
                  width: '100%'

                }}
                onValueChange={itemValue => decicedropdownEnabled(itemValue)}
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
                onPress={AddDevice}
              >
                Submit
              </Button>
              <Button
                mode="contained"
                style={styles.button}
                onPress={() => setIsDialogVisible(false)}
              >
                Cancel
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog
            style={{ width: '90%', marginLeft: '5%',backgroundColor: '#F7F6E7' }}
            visible={isremoveDialogVisible}
            onDismiss={() => setIsremoveDialogVisible(false)}
          >
            <Dialog.Title
              style={{
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Remove Device Information
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
          <Text style={{borderWidth:1}}>{datevalue}</Text>
        </TouchableOpacity>
        
              <Picker
                selectedValue={selectedValue}
                style={{
                  width: '100%'
                }}
                onValueChange={itemValue => cliendropdownEnabled(itemValue)}
              >
                {data.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>

              <Picker
                selectedValue={siteValue}
                style={{
                  width: '100%'
                }}
                onValueChange={itemValue => sitedropdownEnabled(itemValue)}
              >
                {site.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
              <Picker
                selectedValue={pileValue}
                style={{
                  width: '100%'
                }}
                onValueChange={itemValue => piledropdownEnabled(itemValue)}
              >
                {pile.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
              <Picker
                selectedValue={locationValue}
                style={{
                  width: '100%'
                }}
                onValueChange={itemValue => locationdropdownEnabled(itemValue)}
              >
                {location.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
              <Picker
                
                selectedValue={deviceValue}
                style={{
                  width: '100%'
                }}
                onValueChange={itemValue => decicedropdownEnabled(itemValue)}
              >
                {replacedata.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                mode="contained"
                style={styles.button}
                onPress={AddDevice}
              >
                Submit
              </Button>

              <Button
                mode="contained"
                style={styles.button}
                onPress={() => setIsremoveDialogVisible(false)}
              >
                Cancel
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Portal>
          <Dialog
            style={{ width: '90%', marginLeft: '5%',backgroundColor: '#F7F6E7' }}
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
              <Picker
                selectedValue={selectedValue}
                style={{
                  width: '100%'
                }}
                onValueChange={itemValue => cliendropdownEnabled(itemValue)}
              >
                {data.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>

              <Picker
                selectedValue={siteValue}
                style={{
                  width: '100%'
                }}
                onValueChange={itemValue => sitedropdownEnabled(itemValue)}
              >
                {site.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
              <Picker
                selectedValue={pileValue}
                style={{
                  width: '100%'
                }}
                onValueChange={itemValue => piledropdownEnabled(itemValue)}
              >
                {pile.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
              <Picker
                selectedValue={locationValue}
                style={{
                  width: '100%'
                }}
                onValueChange={itemValue => locationdropdownEnabled(itemValue)}
              >
                {location.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
              </Picker>
              <Picker
                selectedValue={deviceValue}
                style={{
                  width: '100%'
                }}
                onValueChange={itemValue => decicedropdownEnabled(itemValue)}
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
                onValueChange={itemValue => newDevice(itemValue)}
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
                onPress={AddDevice}
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
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1',borderWidth: 1, borderColor: '#C1C0B9' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  dataWrapper: { marginTop: -1 },
  btnText: { textAlign: 'center', color: '#fff' },
  singleHead: { width: 100, height: 40}
})
export default Configuredevice
