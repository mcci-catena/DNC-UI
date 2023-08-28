import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Profile from './Profile.css';
import MainCard from './../../ui-component/cards/MainCard';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import Stack from '@mui/material/Stack';
import SettingsIcon from '@mui/icons-material/Settings';
import Swal from 'sweetalert2';

import { constobj } from '../../misc/constants';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

export default function BasicTabs() {
    const { DNC_URL } = { ...constobj };
    const [value, setValue] = React.useState(0);
    const [pwd, setPassword] = useState();
    const [formData, setFormData] = React.useState({});
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    let myuser = sessionStorage.getItem('myUser');
    console.log('MyUser: ', myuser);

    let myuobj = JSON.parse(myuser);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleProfile = () => {
        UpdateProfile();
    };
    const handlePassword = () => {
        let npwd = document.getElementById('snpwd').value;
        let cfnpwd = document.getElementById('cfnpwd').value;

        if (npwd !== cfnpwd) {
            Swal.fire('New Password and confirm password not matching');
        } else {
            UpdatePwd();
        }
    };

    async function UpdateProfile() {
        let myuser = sessionStorage.getItem('myUser');
        let myuobj = JSON.parse(myuser);

        let mydict = {};
        mydict['user'] = myuobj.user;
        mydict['level'] = myuobj.level;
        console.log('User Request: ', mydict);

        let udata = {};
        udata['name'] = document.getElementById('uname').value;
        udata['fname'] = document.getElementById('fname').value;
        udata['lname'] = document.getElementById('lname').value;
        udata['email'] = document.getElementById('email').value;

        mydict['udata'] = udata;

        let uresp = await UpdateUserProfile(myuobj.user, mydict);

        Swal.fire(uresp);
    }

    function UpdateUserProfile(cuser, mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };

            var url = new URL(DNC_URL + '/user/' + cuser);

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    async function UpdatePwd() {
        let myuser = sessionStorage.getItem('myUser');
        let myuobj = JSON.parse(myuser);

        let mydict = {};
        mydict['user'] = myuobj.user;
        mydict['level'] = myuobj.level;

        let udata = {};
        udata['ecpwd'] = document.getElementById('ecpwd').value;
        udata['npwd'] = document.getElementById('snpwd').value;

        mydict['udata'] = udata;

        let uresp = await UpdateUserPwd(mydict);

        Swal.fire(uresp);
    }

    function UpdateUserPwd(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };

            var url = new URL(DNC_URL + '/chpwd');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    return (
        <MainCard title="PERSONAL  INFORMATION ">
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '22ch' }
                }}
                noValidate
                autoComplete="off"
            >
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab style={{ color: 'darkblue' }} icon={<AccountCircleIcon />} label="ACCOUNT" {...a11yProps(0)} />
                    <Tab style={{ color: 'darkblue' }} icon={<LockResetOutlinedIcon />} label="CHANGE PASSWORD" {...a11yProps(1)} />
                </Tabs>

                <MainCard title="">
                    <TabPanel value={value} index={0}>
                        <div className="centered-box">
                            {' '}
                            {/* Container for centering */}
                            <TextField
                                className="tab1"
                                id="fname"
                                defaultValue={myuobj.firstName}
                                label="First Name"
                                variant="outlined"
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                            <h1> </h1>
                            <TextField
                                className="tab1"
                                defaultValue={myuobj.lastName}
                                id="lname"
                                label="Last Name"
                                variant="outlined"
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                            <h1> </h1>
                            <TextField
                                className="tab1"
                                defaultValue={myuobj.user}
                                id="uname"
                                label="User Name"
                                variant="outlined"
                                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            />
                            <h1> </h1>
                            <TextField
                                className="tab1"
                                defaultValue={myuobj.email}
                                id="email"
                                label="Email"
                                variant="outlined"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                            <div className="profilebutton0">
                                <button
                                    type="button"
                                    className="btn btn-primary text-uppercase mb-2 rounded-pill shadow-sm"
                                    onClick={handleProfile}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <div className="centered-box">
                            {' '}
                            {/* Container for centering */}
                            <TextField
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="tab1"
                                id="ecpwd"
                                type="password"
                                label="Current password"
                                variant="outlined"
                            />
                            <h1> </h1>
                            <TextField
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="tab1"
                                id="snpwd"
                                type="password"
                                label="New password"
                                variant="outlined"
                            />
                            <h1> </h1>
                            <TextField
                                name="password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="tab1"
                                id="cfnpwd"
                                type="password"
                                label="Confirm New password"
                                variant="outlined"
                            />
                            <div className="profilebutton">
                                <button
                                    type="button"
                                    className="btn btn-primary text-uppercase mb-2 rounded-pill shadow-sm"
                                    onClick={handlePassword}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </TabPanel>
                </MainCard>
            </Box>
        </MainCard>
    );
}
