/*###############################################################################
// Module: ClientScreen.js
// 
// Function:
//      Function to Client management screen
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
import { View, StyleSheet, Text, Alert, ScrollView,Image,Platform,TouchableOpacity,Modal,Picker} from 'react-native'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppBar from '../components/AppBar'
import AwesomeAlert from 'react-native-awesome-alerts';
import {Restart} from 'fiction-expo-restart';

const ClientScreen = ({navigation}) => {
  
  let [email, setEmail] = useState({ value: '', error: '' })
  let [password, setPassword] = useState({ value: '', error: '' })
  let [clientname, setclientname] = useState({ value: '', error: '' })
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [editsubmit, seteditsubmit] = useState(false)
  const [data, setData] = useState([])
  const [measdata, setmeasdata] = useState([])
  const [Api, setApi] = useState('')
  const tablearray=[];
  const edittablearray=[];
  const [devicestatus, setdevicestatus] = useState(false);
  const [textboxshow, settextboxshow] = useState(true);
  const [pickershow, setpickershow] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [tableHead, settableHead] =useState(['Client id', 'Client Name','Taglist','DBname','measurement','Action'])
  const [widthArr, setwidthArr] = useState([100,150,250,150,175,100]);
  const [tableData, settableData] = useState([])
  const [edittableData, setedittableData] = useState([])
  const [tag1, settag1] = useState('');
  const [dburl, seturl] = useState('http://influxdb:8086');
  const [meas, setmeas] = useState('');
  const [clientid, setclientid] = useState();
  const [dbusername, setdbusername] = useState('');
  const [db, setdb] = useState('');
  const [dbpassword, setdbpassword] = useState('');
  const [textInput, settextInput] = useState([]);
  const [inputData, setinputData] = useState([])
  const [clientwisetag, setclientwisetag] = useState([])
  const [modaltitle, setmodaltitle] = useState('');
  const [apiUrl,setapiUrl]=useState('');
  const anc='';

  //To add Textinput dynamicallay
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

  //To get values from TextInput
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

  //To get api token and session data
  const getApitoken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const uname = await AsyncStorage.getItem('uname')
      const apiUrl = await AsyncStorage.getItem('apiUrl');
      setapiUrl(apiUrl)
      if (token !== null && uname !== null) {
        setApi(token)
        fetchInventory(token,apiUrl);
       
      }
    } catch (e) {
      console.log(e)
    }
  }
  //This function is used to fetch and update the values before execute other function
  useEffect(() => {
    getApitoken()
  }, [])

  //To get edit rows data in table
  const editIconclicked=(rowData,index) =>{
    setdevicestatus(false);
    seteditsubmit(true) ;
    settextInput([]);
    setclientid(rowData[0])
    getdatabase();
    dbdropdownenaled(rowData[3])
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
        let clienttag=[];
        for(var j=6;j<edittableData[i].length;j++)
        {
          clienttag.push(edittableData[i][j])
        }
        setclientwisetag(clienttag)
        settag1(edittableData[i][6]);
        setmeas(rowData[4])
      }
    }
    setIsDialogVisible(true);
  }

  //To get client list
  const fetchInventory = (token,apiUrl) => {
    fetch(apiUrl+'/clients', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token.replace(/['"]+/g, '') + '',
      },
    }).then(response => {
      const statusCode = response.status;
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      response.json().then(responseJson => {
       if (responseJson['message'] != null) {
          alert(JSON.stringify(responseJson['message']))
        }
        if(responseJson.length!=undefined){
          
        for(var i=0;i<responseJson.length;i++)
        {
          let tagstring='';
          let dbdata=responseJson[i]['dbdata'];
          let cname  = responseJson[i].cname;
          let cid=responseJson[i].cid;
          let editarray=[];
          editarray.push(cid);
          editarray.push(cname);
          if(responseJson[i]['dbdata'] != undefined ) 
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
          if(responseJson[i].taglist!=undefined)
          {
            let taglist=responseJson[i].taglist;
            editarray.push(taglist[0]);
            if(taglist.length!=undefined)
            {
              tagstring=taglist[0]
              for(var j=1;j<taglist.length;j++)
              {
                tagstring=tagstring+", "+taglist[j]
                editarray.push(taglist[j]);
              }
            }
          }
          array.push(tagstring);
          array.push(dbdata.dbname);
          array.push(dbdata.mmtname);
          array.push(cid);
          edittablearray.push(editarray)
          tablearray.push(array);
          setedittableData(edittablearray); 
      }
    }
    settableData(tablearray);
      })
    })
  }

  //To delete the client 
  const Deleteclient = (clientname) => {
    var url =apiUrl+'/client/' + '' + clientname + ''
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
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      response.json().then(responseJson => {
    if (responseJson['message'] != null) {
        alert(JSON.stringify(responseJson['message']))
      }
      fetchInventory(Api,apiUrl);
      })
      })
    .catch(error => {
        console.error(error)
    })
    setshowAlert(false);
  }

  //To update the client 
  const updateclient = () => {
    setIsDialogVisible(false)
    let jsondata={};
    jsondata["cname"]=clientname.value;
    jsondata["url"]=dburl;
    jsondata["user"]=dbusername;
    jsondata["pwd"]=dbpassword;
    jsondata["dbname"]=db;
    jsondata["tlist"]=clientwisetag;
    jsondata["mmtname"]=meas;
    var url = apiUrl+'/client/'+'' + clientid + ''
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
      const statusCode = response.status;
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      response.json().then(responseJson => {
      if (responseJson['message'] != null) {
        alert(JSON.stringify(responseJson['message']))
      } else {
        fetchInventory(Api,apiUrl);
      }
      })
      })
  }

  //To get DB list
  const getdatabase = () => {
    var url =apiUrl+'/fetch-db-info' 
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
    const statusCode = response.status;
    if (statusCode == 403) {
      alert('Session expired')
      Restart();
    }
    response.json().then(responseJson => {
      if (responseJson['message'] != null) {
        alert(JSON.stringify(responseJson['message']))
    }
    var dblist=[];
    dblist.push("select database");
    if(responseJson["db_list"]!=undefined)
    {
      for(var i=0;i<responseJson["db_list"].length;i++)
      {
        dblist.push(responseJson["db_list"][i]);
      }
    }
    setData(dblist);
    })
    })
    .catch(error => {
      console.error(error)
    })
  }

  //To showing delete and edit icon in table
  const element = (cellData, index) => (
    <View style={{flexDirection:'row' }}>
      <TouchableOpacity onPress={()=>editIconclicked(cellData,index)}>
        <View>
          <Image source={require('../assets/edit.png')} fadeDuration={0} style={{ width: 20, height: 20 }}/>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>createButtonAlert(cellData)}>
        <View >
          <Image source={require('../assets/delete.png')} fadeDuration={0} style={{ width: 20, height: 20 }}/>
        </View>
      </TouchableOpacity>
    </View>
  );

  //To shows alert
  const createButtonAlert = (cellData) =>
  {
    setclientname({ value: ''+cellData[1]+'', error: '' })
    setclientid(cellData[0])
    setshowAlert(true);
  };

  //To get dilog submit option
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

  //To dilog box hide/show purpose 
  const Adduserdilogvisible=() =>
  {
    seteditsubmit(false);
    setmodaltitle("Add Client")
    setclientname({ value: '', error: '' });
    settag1('');
    setdevicestatus(true);
    setIsDialogVisible(true);
  }

  // Add client data to server
  const Addclient = () => {
    setIsDialogVisible(false);
    let jsondata={};
    let taglist=[];
    taglist.push(tag1);

    if(inputData.length!=undefined)
    {
      for(var i=0;i<inputData.length;i++)
      {
        let data=inputData[i];
        taglist.push(data["text"]);
      }
    }
    jsondata["cname"]=clientname.value;
    jsondata["url"]=dburl;
    jsondata["user"]=dbusername;
    jsondata["pwd"]=dbpassword;
    jsondata["dbname"]=db;
    jsondata["mmtname"]=meas;
    jsondata["tlist"]=taglist;
    var url = apiUrl+'/client'
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
      const statusCode = response.status;
      if (statusCode == 403) {
        alert('Session expired')
        Restart();
      }
      response.json().then(responseJson => {
        if (responseJson['message'] != null) {
          alert(JSON.stringify(responseJson['message']))
        } else {
        fetchInventory(Api,apiUrl);
        settextInput([]);
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

  //For dropdown option purpose
  const dbdropdownenaled=(itemValue)=>
  {
    setdb(itemValue);
    var url =apiUrl+'/fetch-mmt-info' 
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
        user:dbusername,
        dbn:itemValue
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
    mesasurementdata.push("select mesurement");
    if(responseJson["mmt_list"]!=undefined)
    {
      for(var i=0;i<responseJson["mmt_list"].length;i++)
      {
        mesasurementdata.push(responseJson["mmt_list"][i]);
      }
    }
    setmeasdata(mesasurementdata);
  })
  })
  .catch(error => {
    console.error(error)
  })
  }
  return (
    <View>
      <AppBar navigation={navigation} title={"Client Mangement"}></AppBar>
      <Button mode="contained"  style={styles.button} onPress={Adduserdilogvisible}>Add Client</Button>
      <ScrollView  >
        <View style={{ marginHorizontal: 'auto' }}>  
          <ScrollView horizontal={true} > 
            <Table borderStyle={{borderColor: 'transparent'}}>
              <Row data={tableHead} style={styles.head}  widthArr={widthArr} textStyle={{margin: 6, color:'white', fontWeight: 'bold', textTransform: 'uppercase'}}/>
              <ScrollView>
              {
                tableData.map((rowData, index) => (
                  <TableWrapper key={index}  style={[styles.row, index%2 && {backgroundColor: '#F8F7FA'}]}>
                    {
                      rowData.map((cellData, cellIndex) => (
                        <Cell  key={cellIndex} data={cellIndex === 5 ? element(rowData, index) : cellData} style={{width:widthArr[cellIndex]}} textStyle={styles.text}/>
                      ))
                    }
                  </TableWrapper>
                ))
              }
              </ScrollView>
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
      <AwesomeAlert
      show={showAlert}
      howProgress={false}
      title="Delete Client"
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
                 <TouchableOpacity style={{backgroundColor:'#560CCE',alignItems: "center", padding: 10,borderRadius:25}} onPress={databasebutton}>
                  <Text style={{color:'white'}}>Get Database</Text>
                </TouchableOpacity>
            
                <View style={{width: '100%', flex: 1, flexDirection: 'row', marginVertical: 15}} >
                  <Picker 
                  selectedValue={db}
                  style={{width: '100%', borderRadius: 5,borderWidth: 1, borderColor: '#560CCE',color: '#696C6E' }}
                  onValueChange={itemValue => dbdropdownenaled(itemValue)}
                  >
                      {data.map((value, key) => (
                  <Picker.Item label={value} value={value} key={key} />
                ))}
                  </Picker>
                  
                </View>
                <View style={{width: '100%', flex: 1, flexDirection: 'row', marginVertical: 10}}>
                  <Picker 
                  selectedValue={meas}
                  style={{width: '100%', borderRadius: 5,borderWidth: 1, borderColor: '#560CCE',color: '#696C6E' }}
                  onValueChange={itemValue => setmeas(itemValue)}
                  >
                      {measdata.map((value, key) => (
                       <Picker.Item label={value} value={value} key={key} />
                      ))}
                  </Picker>
                 
                </View>
                
                {devicestatus&&<TextInput
                label="Tag-1"
                returnKeyType="next"
                value={tag1}
                
                onChangeText={text => settag1(text )}
                autoCapitalize="none"
                autoCompleteType="username"
                textContentType="name"
                keyboardType="default"
                />}
              
             {textInput.map((value,key) => {
                  return value
                })}
               {devicestatus&& <TouchableOpacity  style={{backgroundColor:'#560CCE',alignItems: "center",padding: 10,borderRadius:25}} onPress={() => addTextInput(textInput.length)}>
                  <Text style={{color:'white'}}>ADD MORE TAGS</Text>
                </TouchableOpacity> 
                } 
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
    width: Platform.OS === 'web' ? '20%' : '40%',
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
