import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, Alert, Picker,ScrollView,Dimensions ,Image} from 'react-native'
import TextInput from '../components/TextInput'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Platform } from 'react-native';
import Button from '../components/Button'
import AwesomeAlert from 'react-native-awesome-alerts';
import { Dialog, Portal} from 'react-native-paper'
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import AsyncStorage from '@react-native-async-storage/async-storage'
import AppBar from '../components/AppBar'
const HomeScreen = ({ navigation }) => {

  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [username, setUsername] = useState({ value: '', error: '' })
  const [showAlert, setshowAlert] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [clientName, setclientName] = useState('');
  const [addUserdilog, setaddUserdilog] = useState(false)
  const [ClientVisible, setIsclientVisible] = React.useState(false)
  const [data, setData] = useState([])
  const [selectedValue, setselectedValue] = useState('')
  const [oldEmail, setoldEmail] = useState('')
  const [Api, setApi] = useState('')
  const [uname, setuname] = useState('')
  const [visible, setVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
 
  const tablearray=[];
  const clients = []
  const windowWidth = Dimensions.get('window').width;
 
  const [tableHead, settableHead] =useState(['Clien name', 'User', 'Email', 'Action'])
  const [tableData, settableData] = useState([]);

  const getApitoken = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      const uname = await AsyncStorage.getItem('uname')
      const usertype = await AsyncStorage.getItem('usertype')
      if (token !== null && uname !== null) {
        setApi(token)
        
        fetchInventory(token);
        checkuser(usertype);
        setuname(uname.replace(/['"]+/g, ''))
        fetchData(token);
        
      }
    
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getApitoken();
    
  }, [])

 
  const checkuser=(usertype)=>
  {
      usertype=JSON.stringify(usertype);
    
      if (usertype!='Admin')
      {
        setShouldShow(true)
      }
  }
  const createButtonAlert = ({username,email}) =>
  {

    setshowAlert(true);
   setUsername({ value: ''+username+'', error: '' })
   setEmail({ value: ''+email+'', error: '' })
  
    // Alert.alert(
    //   "Delete user",
    //   "Are you sure want to delete?",
    //   [
    //     {
    //       text: "Cancel",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel"
    //     },
    //     { text: "OK", onPress:()=>DeleteUser (username,email) }
    //   ]
    // )
 
  };
    const DeleteUser = (username,email) => {
        console.log("Assignvalue");
        console.log(username);
        console.log(email);
      var url =
        'https://staging-analytics.weradiate.com/apidbm/user/' +
        '' +
        username+
        ''
        console.log(JSON.stringify(url))
      const DELETEMethod = {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
        },
        body: JSON.stringify({
          email: email,
        }),
      }
      console.log(JSON.stringify(DELETEMethod))
      fetch(url, DELETEMethod)
        .then(response => {
          const statusCode = response.status
          console.log(JSON.stringify(response))
          response.text().then(responseJson => {
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
  
    const updateUser = () => {
      var url =
        'https://staging-analytics.weradiate.com/apidbm/user/' +
        '' +
        username.value +
        ''
  
      const putMethod = {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
        },
        body: JSON.stringify({
          email:oldEmail,
          email_new: email.value,
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
  
            
  
            
            setaddUserdilog(false);
            fetchInventory(Api);
          })
        })
        .catch(error => {
          console.error(error)
        })
    }
 const editIconclicked=(rowData,index) =>
 {
  setaddUserdilog(true);
   setclientName(rowData[0]);
   setUsername({ value: ''+rowData[1]+'', error: '' })
   setEmail({ value: ''+rowData[2]+'', error: '' })
   setoldEmail(rowData[2]);

  
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
      <TouchableOpacity onPress={()=>createButtonAlert({username:""+cellData[1]+"",email:""+cellData[2]+""})}>
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

const fetchInventory = (token) => {
  var url = 'https://staging-analytics.weradiate.com/apidbm/listuser'
  const getMethod = {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + token.replace(/['"]+/g, '') + '',
    },
  }

  fetch(url, getMethod).then(response => {
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
         let user=responseJson[i].user;
         let email=responseJson[i].email;
         let cid=responseJson[i].cid;
         let array=[];
         array.push(cname);
         array.push(user);
         array.push(email);
         array.push(cid);
         tablearray.push(array);
         
     }
     console.log(tablearray);
    })
   
    
    settableData(tablearray);
  })
}






  const fetchData = (token) => {
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


  const adduserbutton=() =>
  {
    setUsername({ value: '', error: '' })
    setEmail({ value: '', error: '' })
    setselectedValue('');
    setIsDialogVisible(true);
  }
  const Adduser = () => {
   
    setIsDialogVisible(false)

    var url = 'https://staging-analytics.weradiate.com/apidbm/cuser'
    const putMethod = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + Api.replace(/['"]+/g, '') + '',
      },
      body: JSON.stringify({
        cname: selectedValue,
        uname: username.value,
        pwd: password.value,
        email: email.value,
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
      fetchInventory(Api);
      })
    })
  }


  return (
    <View>
     
   
     <AppBar navigation={navigation} title={"User Management"}></AppBar>
      <Button
        mode="contained"
        style={styles.button}
        onPress={adduserbutton}
      >
        Add user
      </Button>
     

      <ScrollView  >
          
      <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={tableHead} style={styles.head}  textStyle={{margin: 6,color:'white'}}/>
          
          {
            tableData.map((rowData, index) => (
              <TableWrapper key={index}  style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell  key={cellIndex} data={cellIndex === 3 ? element(rowData, index) : cellData} textStyle={styles.text}/>
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
          title="Delete User"
          message={"Are you sure want to delete "+username.value+"?"}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="cancel"
          confirmText="delete "
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => setshowAlert(false)}
          onConfirmPressed={() =>DeleteUser (username.value,email.value)}
/>
      <Portal>
        <Dialog
          style={{ width: Platform.OS === 'web' ? '40%' : '80%', marginLeft:Platform.OS === 'web' ? '30%' : '10%',backgroundColor: '#F7F6E7' }}
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
        >
          <Dialog.Title
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Add User
          </Dialog.Title>
          <Dialog.Content
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width:"80%"
            }}
          >
            <View>
            <Picker
              selectedValue={selectedValue}
              style={{width: '100%',height:'20%'}} 
              onValueChange={itemValue => setselectedValue(itemValue)}
            >
              {data.map((value,key) => (
                <Picker.Item label={value} value={value} key={key} />
              ))}
            </Picker>
            <TextInput
              label="User name"
              returnKeyType="next"
              value={username.value}
              onChangeText={text => setUsername({ value: text, error: '' })}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
            />
            <TextInput
              label="Password"
              returnKeyType="done"
              value={password.value}
              onChangeText={text => setPassword({ value: text, error: '' })}
              secureTextEntry
            />
            <TextInput
              label="E-mail address"
              returnKeyType="done"
              value={email.value}
              onChangeText={text => setEmail({ value: text, error: '' })}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              
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
              onPress={Adduser}
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


      <Portal>
        <Dialog
          style={{ width: Platform.OS === 'web' ? '40%' : '80%', marginLeft:Platform.OS === 'web' ? '30%' : '10%',backgroundColor: '#F7F6E7' }}
          visible={addUserdilog}
          onDismiss={() => setaddUserdilog(false)}
        >
          <Dialog.Title
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Edit User
          </Dialog.Title>
          <Dialog.Content
            style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              width:"80%"
            }}
          >
            <View>
            
            <TextInput
              label="User name"
              returnKeyType="next"
              defaultValue={clientName}
              disabled={true}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
            />
           <TextInput
              label="User name"
              returnKeyType="next"
              defaultValue={username.value}
              disabled={true}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
            />
            <TextInput
              label="E-mail address"
              returnKeyType="done"
              value={email.value}
              onChangeText={text => setEmail({ value: text, error: '' })}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              
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
              onPress={updateUser}
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
              onPress={() => setaddUserdilog(false)}
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
    width: '30%',
    
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
  btnText: { textAlign: 'center', color: '#fff' }
})
export default HomeScreen
