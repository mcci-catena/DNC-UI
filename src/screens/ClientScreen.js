import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Alert, ScrollView,Image,Platform,TouchableOpacity,Modal} from 'react-native'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { Dialog, Portal} from 'react-native-paper'
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
  const [selectedValue, setselectedValue] = useState('')
  const [Api, setApi] = useState('')
  const [uname, setuname] = useState('')
  const [dilogtitle, setdilogtitle] = useState('Add client')
  const tablearray=[];
  const [visible, setVisible] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [tableHead, settableHead] =useState(['Clien id', 'ClientName','Action'])
  const [tableData, settableData] = useState([])
  const openMenu = () => setVisible(true);
  const [uservisible, setuserVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const [oldClientname, setoldClientname] = useState('');
  const closeMenu = () => setVisible(false);
  const openUser = () => setuserVisible(true);
  const closeUser = () => setuserVisible(false);
  
  const [textInput, settextInput] = useState([]);
  const [inputData, setinputData] = useState([])
 
 

 
 const addTextInput = (index) => {
 
  let textarray = [];
  for (var i=0;i<textInput.length;i++)
  {
    textarray.push(textInput[i]);
  }
 
    textarray.push(<TextInput key={index}  label="Tag"
      onChangeText={(text) => addValues(text, index)} />);
     
      settextInput(textarray);
  }

  

 const addValues = (text, index) => {
    // let dataArray = inputData;
    let dataArray = [];
  for (var i=0;i<inputData.length;i++)
  {
    dataArray.push(inputData[i]);
  }
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
      setinputData({
      inputData: dataArray
    });
  }
  else {
    dataArray.push({'text':text,'index':index});
    setinputData({
      inputData: dataArray
    });
  }
  }
  
  const getApitoken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const uname = await AsyncStorage.getItem('uname')
      if (token !== null && uname !== null) {
        setApi(token)
        fetchInventory(token);
        setuname(uname.replace(/['"]+/g, ''))
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getApitoken()
  }, [])
  const editIconclicked=(rowData,index) =>
 {
  seteditsubmit(true) 
  setclientname({ value: ''+rowData[1]+'', error: '' })
  setoldClientname(rowData[1]);
  setdilogtitle('Edit Client');
  setIsDialogVisible(true);
  
}
  const createButtonAlert = ({clientname}) =>
  {
    setclientname({ value: ''+clientname+'', error: '' });
   
    setshowAlert(true);

    
  };
    const fetchInventory = (token) => {
    fetch('https://staging-analytics.weradiate.com/apidbm/client', {
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
      
         let cname  = responseJson[i].cname;
         let cid=responseJson[i].cid;
         let array=[];
         array.push(cid);
         array.push(cname);
         array.push(cid);
         tablearray.push(array);
         
     }
    
    settableData(tablearray)
      })
    })
  }

    const Deleteclient = (clientname) => {
    var url =
      'https://staging-analytics.weradiate.com/apidbm/client/' + '' + clientname + ''
    console.log(url);
    const DELETEMethod = {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
    }
    console.log(DELETEMethod);
    fetch(url, DELETEMethod)
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

       

          fetchInventory(Api);
        })
      })
      .catch(error => {
        console.error(error)
      })
      setshowAlert(false);
  }


    const updateclient = () => {
    var url =
      'https://staging-analytics.weradiate.com/apidbm/client/' +
      '' +
      oldClientname +
      ''
     
    const putMethod = {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        name: clientname.value,
      }),
    }
    
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
            alert(JSON.stringify(responseJson['message']))
          }
          fetchInventory(Api);
        
        })
      })
      .catch(error => {
        console.error(error)
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
    <TouchableOpacity onPress={()=>createButtonAlert({clientname:""+cellData[1]+""})}>
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
  setclientname({ value: '', error: '' });
  setdilogtitle('Add Client');
  setIsDialogVisible(true);

}
  const Addclient = () => {
    setIsDialogVisible(false)

    var url = 'https://staging-analytics.weradiate.com/apidbm/client'
    const putMethod = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        name: clientname.value,
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
        } else {
        fetchInventory(Api);
        }
      })
    })
  }

  return (
    <View>
     
     <AppBar navigation={navigation} title={"Client Mangement"}></AppBar>
     <ScrollView  >
      <Button
        mode="contained"
        style={styles.button}
        onPress={Adduserdilogvisible}
      >
        Add Client
      </Button>
      
      <ScrollView  >
          
          <Table borderStyle={{borderColor: 'transparent'}}>
              <Row data={tableHead} style={styles.head}  textStyle={{margin: 6,color:'white'}}/>
              
              {
                tableData.map((rowData, index) => (
                  <TableWrapper key={index}  style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}>
                    {
                      rowData.map((cellData, cellIndex) => (
                        <Cell  key={cellIndex} data={cellIndex === 2 ? element(rowData, index) : cellData} textStyle={styles.text}/>
                      ))
                    }
                  </TableWrapper>
                ))
              }
              
            </Table>
          
        </ScrollView>
     
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Delete Client"
          message={"Are you sure want to delete "+clientname.value+"?"}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="cancel"
          confirmText="delete "
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => setshowAlert(false)}
          onConfirmPressed={() =>Deleteclient (clientname.value)}
        />
      <Portal>
      
        <Dialog
          style={{ width: Platform.OS === 'web' ? '40%' : '80%', marginLeft:Platform.OS === 'web' ? '30%' : '10%' ,backgroundColor: '#F7F6E7'}}
          visible={false}
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
          <Dialog.ScrollArea>
            <ScrollView>
          <Dialog.Content
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width:"80%",flex: 1
            }}
          >
       

            
       <View style={{flex:1}}>
             
            <TextInput
              style={{height:25,width:"75%"}}
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
             style={{height:25,width:"75%"}}
              label="Enter DB URL"
              returnKeyType="next"
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
            
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />
            <TextInput
            style={{height:25,width:"75%"}}
              label="DB User Name"
              returnKeyType="next"
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
            
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />
             <TextInput
              style={{height:25,width:"75%"}}
           label="DB Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      < View style={{flexDirection:'row',flext:1}}>
      
       <TextInput
       style={{height:25,width:"75%"}}
              label="Database Name"
              returnKeyType="next"
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
             
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />

       
       
      
        <TouchableOpacity style={{height:25,width:"25%"}}onPress={() => addTextInput(textInput.length)}>Select Database</TouchableOpacity>
        
    </View>
    <TextInput
     style={{height:25,width:"75%"}}
              label="DB User Name"
              returnKeyType="next"
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
            
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />
            <TextInput
            style={{height:25,width:"75%"}}
              label="DB User Name"
              returnKeyType="next"
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
            
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />
            < View style={{flexDirection:'row',flext:1}}>
            <TextInput
            style={{height:25,width:"75%"}}
              label="DB User Name"
              returnKeyType="next"
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
            
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />

    <TouchableOpacity  style={{height:25,width:"25%"}} onPress={() => addTextInput(textInput.length)}>Add</TouchableOpacity>
    </View>
       {textInput.map((value,key) => {
          return value
        })}
         
            
            
         </View> 
          </Dialog.Content>
          </ScrollView>
          </Dialog.ScrollArea>
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
              onPress={clientsubmitmange}
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
      </ScrollView>
      <Modal presentationStyle="overFullScreen" transparent={true} visible={isDialogVisible}>
      <ScrollView>
         <View style={{
            flex: 1,
            marginTop:'5%',
            justifyContent: 'center',
            alignItems: 'center',
            width: Platform.OS === 'web' ? '50%' : '80%', 
            marginLeft:Platform.OS === 'web' ? '25%' : '10%' ,
            backgroundColor: '#F7F6E7',
               
        }}>
            <View style={{width: Platform.OS === 'web' ? '60%' : '90%', }}>
             <View style={{
               flex:1,
                justifyContent: 'center',
                alignItems: 'center',
              
               
           }}>
          
               <Text style={{fontSize:25}}>Add Client</Text>
               
           
             
                
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
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
            
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />
            <TextInput
           
              label="DB User Name"
              returnKeyType="next"
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
            
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />
             <TextInput
              
           label="DB Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
     
   
       <TextInput
    
              label="Database Name"
              returnKeyType="next"
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
             
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />

       
       
      <Text>-OR-</Text>
 
       <TouchableOpacity style={{backgroundColor:'#0000FF',alignItems: "center", padding: 10,borderRadius:25}} onPress={() => alert("1")}>
          <Text style={{color:'white'}}>Select Database</Text>
        </TouchableOpacity> 
  
    <TextInput
  
              label="Tag -1"
              returnKeyType="next"
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
            
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />
            <TextInput
           
              label="Tag-2"
              returnKeyType="next"
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
            
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />
    
            <TextInput
         
              label="Tag -3"
              returnKeyType="next"
              value={clientname.value}
           
              onChangeText={text => setclientname({ value: text, error: '' })}
            
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="name"
              keyboardType="default"
            />

<TouchableOpacity style={{backgroundColor:'#0000FF',alignItems: "center",padding: 10,borderRadius:25}} onPress={() => addTextInput(textInput.length)}>
          <Text style={{color:'white'}}>Add more tags</Text>
        </TouchableOpacity>
            
   
       {textInput.map((value,key) => {
          return value
        })}
         
            
           
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between'}}>
         <Button
              mode="contained"
              style={{
                width: Platform.OS === 'web' ? '30%' : '40%',
                marginVertical: 10,
                paddingVertical: 2,
               
                
              }}
              onPress={clientsubmitmange}
            >
              Submit
            </Button>
            <Button
              mode="contained"
              style={{
                width: Platform.OS === 'web' ? '30%' : '40%',
                marginVertical: 10,
                paddingVertical: 2,
              
              }}
              onPress={() => setIsDialogVisible(false)}
            >
              Cancel
            </Button></View> 
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
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1',borderWidth: 1, borderColor: '#C1C0B9' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  dataWrapper: { marginTop: -1 },
  btnText: { textAlign: 'center', color: '#fff' },
 
})

export default ClientScreen
