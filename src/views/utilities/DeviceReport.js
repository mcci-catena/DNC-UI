import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useDemoData } from '@mui/x-data-grid-generator';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import TextField from '@mui/material/TextField';

const thcolumns = [
    { field: 'id', headerName: 'SINO', width: 100 },
    { field: 'installeddate', headerName: 'Installed Date', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'Last-Update', headerName: 'Last Update', width: 120 },
    { field: 'Status', headerName: 'Status', width: 100 },
    { field: 'org', headerName: 'Organization', width: 150 },
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

export default function TapHistory() {
    const BASE_URL = 'https://training.mcci.io/dncserverv';
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { data1, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6
    });

    const [data, setData] = useState([
        { id: 1, name: '', email: '', firstname: '', lastname: '', status: '', role: '', lastlogin: '', logout: '' }
    ]);

    useEffect(() => {
        // console.log("Use Effect")
        getUserInfo();
    }, []);

    async function getUserInfo() {
        const myuser = await getUserData();
        setData(myuser);
        console.log(myuser);
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
            var url = new URL(BASE_URL + '/user');

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
    function IconLabelTabs() {
        const [value, setValue] = React.useState(0);

        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
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

    function BasicTabs() {
        const [value, setValue] = React.useState(0);

        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
    }
    const handleSave = () => {
        //setOpen(true);
        UpdateSpot();
        console.log('My Child Comp: ', props);
    };

    const handleClose = () => {
        setOpen(false);
        console.log('My Child Comp: ', props.mydata.sdata);
        props.mydata.hcb();
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <MainCard title="DEVICE REPORT ">
                    <div>
                        <Box sx={{ width: '100%' }}>
                            <Box>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab style={{ color: 'darkblue' }} icon={<GroupIcon />} label="DEVICES" {...a11yProps(0)} />
                                    <Tab style={{ color: 'darkblue' }} icon={<PersonAddAlt1Icon />} label="ADD_DEVICES" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={value} index={0}>
                                <div style={{ height: 400, width: '110%', marginTop: 1, marginLeft: -20 }}>
                                    <DataGrid
                                        {...data1}
                                        loading={loading}
                                        slots={{ toolbar: GridToolbar }}
                                        rows={data}
                                        columns={thcolumns}
                                        pageSize={(2, 5, 10, 20)}
                                        rowsPerPageOptions={[10]}
                                        checkboxSelection
                                    />
                                </div>
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
                                    <TextField label="Name" id="outlined-size-normal" size="small" />
                                    <TextField label="First-Name" id="outlined-size-normal" size="small" />
                                    <TextField label="Last-Name" id="outlined-size-normal" size="small" />
                                    <TextField label="Email" id="outlined-size-normal" size="small" />
                                    <Box sx={{ '& button': { m: 0 } }}>
                                        <Stack style={{ marginLeft: '18px' }} direction="row" spacing={1}>
                                            <Button variant="contained" color="success">
                                                Save
                                            </Button>
                                            <Button variant="contained" color="success">
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </Box>
                                </TabPanel>
                            </Box>
                        </Box>
                    </div>
                </MainCard>
            </div>
        </div>
    );
}
