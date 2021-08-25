// Module: ClientScreen
// 
// Function:
//      Function to Client management
// 
// Version:
//    V2.02  Thu Jul 16 2021 10:30:00  muthup   Edit level 1
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

import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Alert, ScrollView,Image,Platform,TouchableOpacity,Modal,Picker} from 'react-native'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppBar from '../components/AppBar'
import AwesomeAlert from 'react-native-awesome-alerts';



const ClientScreen = ({navigation}) => {
  
  let [email, setEmail] = useState({ value: '', error: '' })
  let [password, setPassword] = useState({ value: '', error: '' })
  let [clientname, setclientname] = useState({ value: '', error: '' })
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [editsubmit, seteditsubmit] = useState(false)
  const [data, setData] = useState([])
  const [Api, setApi] = useState('')
  const tablearray=[];
  const edittablearray=[];
  const [devicestatus, setdevicestatus] = useState(false);
  const [textboxshow, settextboxshow] = useState(true);
  const [pickershow, setpickershow] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [tableHead, settableHead] =useState(['Client id', 'Client Name','Action'])
  const [tableData, settableData] = useState([])
  const [edittableData, setedittableData] = useState([])
  const [tag1, settag1] = useState('');
  const [tag2, settag2] = useState('');
  const [tag3, settag3] = useState('');
  const [dburl, seturl] = useState('');
  const [clientid, setclientid] = useState();
  const [dbusername, setdbusername] = useState('');
  const [db, setdb] = useState('');
  const [dbpassword, setdbpassword] = useState('');
  const [textInput, settextInput] = useState([]);
  const [inputData, setinputData] = useState([])
  const [modaltitle, setmodaltitle] = useState('');
  const anc='';

  const addTextInput = (index) => {
    let textarray = [];
    for (var i=0;i<textInput.length;i++)
    {
      textarray.push(textInput[i]);
    }
 
    textarray.push(<TextInput key={index}  label="Tag" valu={anc}
      onChangeText={(text) => addValues(text, index)} />);
     
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
  
  const getApitoken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const uname = await AsyncStorage.getItem('uname')
      if (token !== null && uname !== null) {
        setApi(token)
        fetchInventory(token);
       
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getApitoken()
  }, [])

  const editIconclicked=(rowData,index) =>{
    seteditsubmit(true) 
    setclientid(rowData[0])
    checkDeviceStatus(rowData[0]);
    setclientname({ value: ''+rowData[1]+'', error: '' })
    setmodaltitle("Edit Client");
    for(var i=0;i<edittableData.length;i++)
    {
      let cid=edittableData[i][0];
      if(cid==rowData[0])
      {
        seturl(edittableData[i][2]);
        setdb(edittableData[i][5]);
        setdbusername(edittableData[i][3]);
        setdbpassword(edittableData[i][4]);
        settag1(edittableData[i][6]);
        settag2(edittableData[i][7]);
        settag3(edittableData[i][8]);
      }
    }
    setIsDialogVisible(true);
  }

  const fetchInventory = (token) => {
    fetch('https://staging-dashboard.mouserat.io/dncserver/clients', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token.replace(/['"]+/g, '') + '',
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
        } else if (responseJson['message'] != null) {
          alert(JSON.stringify(responseJson['message']))
        }
       
        for(var i=0;i<responseJson.length;i++)
        {
          let dbdata=responseJson[i]['dbdata'];
          let cname  = responseJson[i].cname;
          let cid=responseJson[i].cid;
          let editarray=[];
          editarray.push(cid);
          editarray.push(cname);
          if(dbdata != undefined ) 
          {
            let url=dbdata.url;
            let user  = dbdata.user;
            let pwd=dbdata.pwd;
            let dbname=dbdata.dbname;
            editarray.push(url);
            editarray.push(user);
            editarray.push(pwd);
            editarray.push(dbname);
          }
          let taglist=responseJson[i].taglist;
          let array=[];
          array.push(cid);
          array.push(cname);
          array.push(cid);
          editarray.push(taglist[0]);
          editarray.push(taglist[1]);
          editarray.push(taglist[2]);
          edittablearray.push(editarray)
          tablearray.push(array);
          setedittableData(edittablearray); 
        
     }
    settableData(tablearray);
      })
    })
  }

  const checkDeviceStatus = (clientid) => {
    var url ='https://staging-dashboard.mouserat.io/dncserver/client-device-status/' + '' + clientid + ''
    const DELETEMethod = {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
    }
   
    fetch(url, DELETEMethod)
    .then(response => {
      const statusCode = response.status
      response.json().then(responseJson => {
      if (statusCode == 403) {
        alert('inavalid token/token expired')
        navigation.reset({index: 0,routes: [{ name: 'LoginScreen' }],})
      } else if (responseJson['message'] != null) {
        alert(JSON.stringify(responseJson['message']))
      }
      setdevicestatus(responseJson["devices_registered"])
      })
      })
    .catch(error => {
        console.error(error)
      })
      
  }
  const Deleteclient = (clientname) => {
    var url ='https://staging-analytics.weradiate.com/apidbm/client/' + '' + clientname + ''
    const DELETEMethod = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
    }

    fetch(url, DELETEMethod)
    .then(response => {
      const statusCode = response.status
      response.json().then(responseJson => {
      if (statusCode == 403) {
        alert('inavalid token/token expired')
        navigation.reset({index: 0,routes: [{ name: 'LoginScreen' }],})
      } else if (responseJson['message'] != null) {
        alert(JSON.stringify(responseJson['message']))
      }
      fetchInventory(Api);
      })
      })
    .catch(error => {
        console.error(error)
    })
    setshowAlert(false);
  }

  const updateclient = () => {
    setIsDialogVisible(false)
    let jsondata={};
    let taglist=[];
    taglist.push(tag1);
    taglist.push(tag2);
    taglist.push(tag3);
    for(var i=0;i<inputData.length;i++)
    {
      let data=inputData[i];
      taglist.push(data["text"]);
    }
    jsondata["cname"]=clientname.value;
    jsondata["url"]=dburl;
    jsondata["user"]=dbusername;
    jsondata["pwd"]=dbpassword;
    jsondata["dbname"]=db;
    jsondata["tlist"]=taglist;
    var url = 'https://staging-dashboard.mouserat.io/dncserver/client/'+'' + clientid + ''
    const putMethod = {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
        },
        body: JSON.stringify(jsondata),
    }
    fetch(url, putMethod).then(response => {
      const statusCode = response.status
      response.json().then(responseJson => {
      if (statusCode == 403) {
        alert('inavalid token/token expired')
        navigation.reset({index: 0,routes: [{ name: 'LoginScreen' }],})
      } else if (responseJson['message'] != null) {
        alert(JSON.stringify(responseJson['message']))
      } else {
        fetchInventory(Api);
      }
      })
      })
  }
  const getdatabase = () => {
    var url ='https://staging-dashboard.mouserat.io/dncserver/fetch-db-info' 
    const posetMethod = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        url: dburl,
        pwd:dbpassword,
        user:dbusername
      }),
    }
    fetch(url, posetMethod)
    .then(response => {
    const statusCode = response.status
    response.json().then(responseJson => {
    if (statusCode == 403) {
      alert('inavalid token/token expired')
      navigation.reset({index: 0,routes: [{ name: 'LoginScreen' }],})
    } else if (responseJson['message'] != null) {
      alert(JSON.stringify(responseJson['message']))
    }
    setData(responseJson["db_list"]);
        
    })
    })
    .catch(error => {
      console.error(error)
    })
  }
  const element = (cellData, index) => (
    <View style={{flexDirection:'row' }}>
      <TouchableOpacity onPress={()=>editIconclicked(cellData,index)}>
        <View>
          <Image source={require('../assets/edit.png')} fadeDuration={0} style={{ width: 20, height: 20 }}/>
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={()=>createButtonAlert({clientname:""+cellData[1]+""})}>
        <View >
          <Image source={require('../assets/delete.png')} fadeDuration={0} style={{ width: 20, height: 20 }}/>
        </View>
      </TouchableOpacity> */}
    </View>
  );

  const clientsubmitmange=()=>
  {
    if(editsubmit)
    {
      updateclient();
    }
    else{
      Addclient();
    }
  }

  const Adduserdilogvisible=() =>
  {
    seteditsubmit(false);
    setmodaltitle("Add Client")
    setclientname({ value: '', error: '' });
    seturl('');
    setdb('');
    setdbusername('');
    setdbpassword('');
    settag1('');
    settag2('');
    settag3('');
    setdevicestatus(false);
    setIsDialogVisible(true);
  }

  const Addclient = () => {
    setIsDialogVisible(false);
    
    let jsondata={};
    let taglist=[];
    taglist.push(tag1);
    taglist.push(tag2);
    taglist.push(tag3);
    for(var i=0;i<inputData.length;i++)
    {
      let data=inputData[i];
      taglist.push(data["text"]);
    }
    jsondata["cname"]=clientname.value;
    jsondata["url"]=dburl;
    jsondata["user"]=dbusername;
    jsondata["pwd"]=dbpassword;
    jsondata["dbname"]=db;
    jsondata["tlist"]=taglist;
    var url = 'https://staging-dashboard.mouserat.io/dncserver/client'
    const putMethod = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify(jsondata),
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
        } else {
        fetchInventory(Api);
        }
      })
    })
  }

  const databasebutton=()=>
  {
    if(textboxshow)
    {
      getdatabase();
      setpickershow(true);
      settextboxshow(false);
    }
    else{
      setpickershow(false);
      settextboxshow(true);
    }
  }

  return (
    <View>
      <AppBar navigation={navigation} title={"Client Mangement"}></AppBar>
      
        <Button mode="contained"  style={styles.button} onPress={Adduserdilogvisible}>Add Client</Button>
        <ScrollView  >
        <View style={{ marginTop:'5%', marginHorizontal: 20 }}> 
         
            <Table borderStyle={{borderColor: 'transparent'}}>
              <Row data={tableHead} style={styles.head}  textStyle={{margin: 6, color:'white', fontWeight: 'bold', textTransform: 'uppercase'}}/>
              {
                tableData.map((rowData, index) => (
                  <TableWrapper key={index}  style={[styles.row, index%2 && {backgroundColor: '#F8F7FA'}]}>
                    {
                      rowData.map((cellData, cellIndex) => (
                        <Cell  key={cellIndex} data={cellIndex === 2 ? element(rowData, index) : cellData} textStyle={styles.text}/>
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
        howProgress={false}
        itle="Delete Client"
        message={"Are you sure want to delete "+clientname.value+"?"}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="cancel"
        confirmText="delete "
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => setshowAlert(false)}
        onConfirmPressed={() =>Deleteclient (clientname.value)}
        />
      
      
     
      <Modal presentationStyle="overFullScreen" transparent={true} visible={isDialogVisible} >
        <ScrollView>
          <View style={{flex: 1,marginTop:'5%',justifyContent: 'center',alignItems: 'center',width: Platform.OS === 'web' ? '50%' : '80%', 
            marginLeft:Platform.OS === 'web' ? '25%' : '10%' ,
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            shadowColor: "#000000",
            shadowOpacity: 0.5,
            shadowRadius: 2,
            shadowOffset: {
              height: 1,
              width: 1
            },
            elevation: 3
          }}>
            <View style={{width: Platform.OS === 'web' ? '60%' : '90%', }}>
              <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                <Text style={{fontSize:20, fontWeight: 'bold', paddingTop: 10 }}>{modaltitle}</Text>
                <TextInput
                label="Enter Client Name"
                returnKeyType="next"
                value={clientname.value}
                onChangeText={text => setclientname({ value: text, error: '' })}
                autoCapitalize="none"
                autoCompleteType="username"
                textContentType="name"
                keyboardType="default"
                />
                <TextInput
                label="Enter DB URL"
                returnKeyType="next"
                value={dburl}
                onChangeText={text => seturl(text)}
                autoCapitalize="none"
                autoCompleteType="username"
                textContentType="name"
                keyboardType="default"
                />
                <TextInput
                label="DB User Name"
                returnKeyType="next"
                value={dbusername}
                onChangeText={text => setdbusername(text)}
                autoCapitalize="none"
                autoCompleteType="username"
                textContentType="name"
                keyboardType="default"
                />
                <TextInput
                label="DB Password"
                returnKeyType="done"
                value={dbpassword}
                onChangeText={text => setdbpassword(text)}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
                />
                {textboxshow && <TextInput
                label="Database Name"
                returnKeyType="next"
                value={db}
                onChangeText={text => setdb(text)}
                autoCapitalize="none"
                autoCompleteType="username"
                textContentType="name"
                keyboardType="default"
                />}
                {pickershow && <Picker
                selectedValue={db}
                style={{width: '100%',height: '100%',borderRadius: 5,borderWidth: 1, borderColor: '#560CCE',color: '#696C6E' }}
                onValueChange={itemValue => setdb(itemValue)}
                >
                {data.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
                </Picker>}
                <Text>-OR-</Text>
                <TouchableOpacity style={{backgroundColor:'#560CCE',alignItems: "center", padding: 10,borderRadius:25}} onPress={databasebutton}>
                  <Text style={{color:'white'}}>SELECT DATABASE</Text>
                </TouchableOpacity> 
                <TextInput
                label="Tag-1"
                returnKeyType="next"
                value={tag1}
                disabled={devicestatus}
                onChangeText={text => settag1(text )}
                autoCapitalize="none"
                autoCompleteType="username"
                textContentType="name"
                keyboardType="default"
                />
                <TextInput
                label="Tag-2"
                returnKeyType="next"
                value={tag2}
                disabled={devicestatus}
                onChangeText={text => settag2(text )}
                autoCapitalize="none"
                autoCompleteType="username"
                textContentType="name"
                keyboardType="default"
                />
                <TextInput
                label="Tag -3"
                returnKeyType="next"
                value={tag3}
                disabled={devicestatus}
                onChangeText={text => settag3(text )}
                autoCapitalize="none"
                autoCompleteType="username"
                textContentType="name"
                keyboardType="default"
                />
                {textInput.map((value,key) => {
                  return value
                })}
                <TouchableOpacity disabled={devicestatus} style={{backgroundColor:'#560CCE',alignItems: "center",padding: 10,borderRadius:25}} onPress={() => addTextInput(textInput.length)}>
                  <Text style={{color:'white'}}>ADD MORE TAGS</Text>
                </TouchableOpacity>  
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Button mode="contained"  style={{width: Platform.OS === 'web' ? '30%' : '40%',marginVertical: 10,paddingVertical: 2,}} onPress={clientsubmitmange}>Submit</Button>
                <Button mode="contained"  style={{width: Platform.OS === 'web' ? '30%' : '40%',marginVertical: 10,paddingVertical: 2,}} onPress={() => setIsDialogVisible(false)}>Cancel</Button>
              </View> 
            </View>
          </View>
        </ScrollView>
      </Modal>
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
  textInput: {
    height: 40,
    borderColor: 'black', 
    borderWidth: 1,
    margin: 20
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
  head: { height: 40, backgroundColor: '#560CCE' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#E8DCFC',borderWidth: 1, borderColor: '#C1C0B9' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  dataWrapper: { marginTop: -1 },
  btnText: { textAlign: 'center', color: '#fff' }

 
})

export default ClientScreen
