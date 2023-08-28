import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useDemoData } from '@mui/x-data-grid-generator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { constobj } from './../../../misc/constants';
import ListOrgUser from './listorguser';
import OrgAddUser from './orgadduser';

const thcolumns = [
    { field: 'id', headerName: 'S.No', width: 40 },
    { field: 'name', headerName: 'Name', width: 90 },
    { field: 'email', headerName: 'Email', width: 170 },
    { field: 'firstname', headerName: 'First Name', width: 100 },
    { field: 'lastname', headerName: 'Last Name', width: 100 },
    { field: 'role', headerName: 'Role', width: 80 },
    { field: 'status', headerName: 'Status', width: 70 },
    { field: 'lastlogin', headerName: 'Last Login', width: 200 },
    { field: 'logout', headerName: 'Logout', width: 100 },

    {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
            const isInEditMode = [id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
                return [
                    <GridActionsCellItem icon={<SaveIcon />} label="Save" />,
                    <GridActionsCellItem icon={<CancelIcon />} label="Cancel" className="textPrimary" color="inherit" />
                ];
            }

            return [
                <GridActionsCellItem icon={<EditIcon />} label="Edit" className="textPrimary" color="inherit" />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" color="inherit" />
            ];
        }
    }
];

export default function OrgUser() {
    const { DNC_URL } = { ...constobj };

    const [value, setValue] = React.useState(0);
    const [uemail, setUemail] = React.useState('');

    const [myalert, setMyalert] = useState(false);
    const [myalertmsg, setMyalertMsg] = useState('');
    const [msgtype, setMsgtype] = useState('error');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [data, setData] = useState([
        { id: 1, name: '', email: '', firstname: '', lastname: '', status: '', role: '', lastlogin: '', logout: '' }
    ]);

    useEffect(() => {
        let myOrg = sessionStorage.getItem('myOrg');
        getUserInfo();
    }, []);

    async function getUserInfo() {
        const myuser = await getUserData();
        setData(myuser);
    }

    // get User data
    function getUserData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/user');

            let myulist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['name'] = item['name'];
                        myrow['email'] = item['email'];
                        myrow['firstname'] = item['firstName'];
                        myrow['lastname'] = item['lastName'];
                        myrow['role'] = item['role'];
                        myrow['status'] = item['status'];
                        myrow['lastlogin'] = item['lastLogin']['login'];
                        myrow['logout'] = item['lastLogin']['logout'];
                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
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

    // Request for sending signup link to the given email ID
    function sendInviteLink(userEmail) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var udata = JSON.stringify({ fcode: 'nusu', email: userEmail });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: udata
            };

            var url = new URL(DNC_URL + '/slink');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const onChangeEmail = (event) => {
        setUemail(event.target.value);
    };

    function showAlert(msg, mtype) {
        setMsgtype(mtype);
        setMyalertMsg(msg);
        setMyalert(true);
        setTimeout(() => {
            setMyalert(false);
        }, 3000);
    }

    const handleInviteLink = async () => {
        try {
            const myresp = await sendInviteLink(uemail);
            showAlert(myresp, 'success');
        } catch (error) {
            showAlert(error, 'error');
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <MainCard title="USERS ">
                    <div>
                        <Box sx={{ width: '100%' }}>
                            <Box>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab style={{ color: 'darkblue' }} icon={<GroupIcon />} label="Users" {...a11yProps(0)} />
                                    <Tab style={{ color: 'darkblue' }} icon={<PersonAddAlt1Icon />} label="Add Users" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={value} index={0}>
                                <ListOrgUser />
                            </TabPanel>
                            <Box
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': { m: 2, width: '25ch' }
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TabPanel value={value} index={1}>
                                    <OrgAddUser />
                                </TabPanel>
                            </Box>
                        </Box>
                    </div>
                </MainCard>
            </div>
        </div>
    );
}
