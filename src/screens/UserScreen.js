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
import { emailValidator } from '../helpers/emailValidator'
import { getapiurl } from './Geturl'
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
  const [shouldShow, setShouldShow] = useState(false);
  const [otpshow, setotpshow] = useState(false);
  const [otpalert, setotpalert] = useState(false);
  const tablearray=[];
  const clients = []
  const windowWidth = Dimensions.get('window').width;
 
  const [tableHead, settableHead] =useState(['User', 'Email', 'Action'])
  const [tableData, settableData] = useState([]);
  
  const [alertmessage, setalertmessage] = useState('');
  
  const [otp, setotp] = useState('');
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

  const onverifyPressed = () => {
    
     
    const emailError = emailValidator(email.value)
    if (emailError) {
     
      setEmail({ ...email, error: emailError })
       
      return
    }
    
    var emaildata={};
    emaildata['uname']=username.value;
    emaildata['email']=email.value;
    emaildata['mode']='usignup';
    emaildata['status']='non-verified';
    const url = 'https://staging-dashboard.mouserat.io/dncserver/send-otp'
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emaildata),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson)
        setotpshow(true);
        setalertmessage(JSON.stringify(responseJson.message));
        setotpalert(true);
     
       
      })
      .catch(error => {
        console.error(error)
      })
      
  }
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
  
};
    const DeleteUser = (username,email) => {
        console.log("Assignvalue");
        console.log(username);
        console.log(email);
      var url =
        'https://staging-dashboard.mouserat.io/dncserver/delete-user/' +
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
        'https://staging-dashboard.mouserat.io/dncserver/update-user/' +
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
          pwd: password.value,
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
  

  // setclientName(rowData[0]);
  setPassword({ value:'', error: '' })
   setUsername({ value: ''+rowData[0]+'', error: '' })
   setEmail({ value: ''+rowData[1]+'', error: '' })
   setoldEmail(rowData[1]);
   setaddUserdilog(true);
  
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
      <TouchableOpacity onPress={()=>createButtonAlert({username:""+cellData[0]+"",email:""+cellData[1]+""})}>
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
  
  var url = 'https://staging-dashboard.mouserat.io/dncserver/list-user'
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
         
         let user=responseJson[i].uname;
         let email=responseJson[i].email;
         let cid=responseJson[i].cid;
         let array=[];
       
         array.push(user);
         array.push(email);
         array.push(cid);
         tablearray.push(array);
         
     }
     settableData(tablearray);
     console.log(tablearray);
    })
   
    
  
  })
}






  const fetchData = (token) => {
   
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
    setUsername({ value: '', error: '' });
    setEmail({ value: '', error: '' });
    setPassword({ value:'', error: '' });
    setselectedValue('');
    setIsDialogVisible(true);
  }
  const Adduser = () => {
   
    setIsDialogVisible(false)

    var url = 'https://staging-dashboard.mouserat.io/dncserver/usignup'
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
        otpnum:otp,
        mode: "usignup"
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
      
      })
    })

    fetchInventory(Api);
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
     
      <View style={{ marginLeft: '10', marginRight: '10', paddingTop: 20 }}>
      <ScrollView  >
          
      <Table borderStyle={{borderColor: 'transparent'}}>
          <Row data={tableHead} style={styles.head}  textStyle={{margin: 6,color:'white',fontWeight: 'bold', textTransform: 'uppercase'}}/>
          
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
      
        </ScrollView>
</View>
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
          style={{ width: Platform.OS === 'web' ? '40%' : '80%', backgroundColor: '#FFFFFF',marginLeft:Platform.OS === 'web' ? '30%' : '10%' }}
          visible={isDialogVisible}
          onDismiss={() => setIsDialogVisible(false)}
        >
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
            <TouchableOpacity style={{backgroundColor:'#ff0000',width: Platform.OS === 'web' ? '25%' : '50%',marginLeft:'37.5%', padding: 10,borderRadius:25,alignItems:'center'}} onPress={onverifyPressed}>
          <Text style={{color:'#FFFFFF'}}>Verify</Text>
        </TouchableOpacity>
        {otpshow && (  <TextInput
       
       label="Type here your otp"
       returnKeyType="next"
       value={otp.value}
       onChangeText={text => setotp(text)}
       
     />)}

<AwesomeAlert
          show={otpalert}
          showProgress={false}
          title="Alert"
          message={alertmessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
        
          confirmText="ok "
          confirmButtonColor="#DD6B55"
        
          onConfirmPressed={() =>setotpalert(false)}
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
              //defaultValue={username.value}
              value={username.value}
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
             <TextInput
              label="Password"
              returnKeyType="next"
              value={password.value}
              onChangeText={text => setPassword({ value: text, error: '' })}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
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
  head: { height: 40, backgroundColor: '#560CCE' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#E8DCFC',borderWidth: 1, borderColor: '#C1C0B9' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  dataWrapper: { marginTop: -1 },
  btnText: { textAlign: 'center', color: '#fff' }
})
export default HomeScreen
