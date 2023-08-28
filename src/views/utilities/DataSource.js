import React, { useState, useEffect } from 'react';
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
import SettingsInputAntennaOutlinedIcon from '@mui/icons-material/SettingsInputAntennaOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';

const thcolumns = [
    { field: 'id', headerName: 'SINO', width: 80 },
    { field: 'dsname', headerName: 'Name', width: 100 },
    { field: 'dburl', headerName: 'URL', width: 200 },
    { field: 'dbname', headerName: 'DataBase-Name', width: 140 },
    { field: 'mmtname', headerName: 'Measurement-Name', width: 100 },
    { field: 'uname', headerName: 'User-Name', width: 100 },
    { field: 'pwd', headerName: 'Password', width: 100 },
    { field: 'user', headerName: 'User', width: 80 },

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
    const [date3, setDate3] = React.useState(null);

    const [dblist, setDblist] = React.useState([]);
    const [mmtlist, setMmtlist] = React.useState([]);

    const [seldb, setSelDb] = React.useState(null);
    const [selmmt, setSelMmt] = React.useState(null);

    const { data1, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6
    });
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
    };

    async function onsavesource() {
        alert('On submit');
        let srcdict = {};
        srcdict['dsname'] = document.getElementById('dsname_tin').value;
        srcdict['dburl'] = document.getElementById('dburl_tin').value;
        srcdict['dbname'] = seldb;
        srcdict['mmtname'] = selmmt;
        srcdict['uname'] = document.getElementById('dbuname_tin').value;
        srcdict['pwd'] = document.getElementById('dbpwd_tin').value;
        let dres = await setDataSource(srcdict);

        if (dres.error) {
            alert(dres.message);
        } else {
            alert(dres.message);
            navigate(-1);
        }
    }

    //passwordfield
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //refreshdbonclick
    const handleClickrefershdb = async () => {
        const mydbs = await getDbList();
        let mydblst = [];
        for (let i = 0; i < mydbs.length; i++) {
            let mydict = {};
            mydict['value'] = i;
            mydict['label'] = mydbs[i];
            mydblst.push(mydict);
        }
        setDblist(mydblst);
        console.log('My DBs ****', mydblst);
    };

    const handleClickrefershmmt = async () => {
        let mydb = null;
        const mymmts = await getMmtList(mydb);
        let mymmtlst = [];
        for (let i = 0; i < mymmts.length; i++) {
            let mydict = {};
            mydict['value'] = i;
            mydict['label'] = mymmts[i];
            mymmtlst.push(mydict);
        }
        setMmtlist(mymmtlst);
    };

    const [data, setData] = useState([
        {
            id: 1,
            dsname: '',
            dburl: '',
            dbname: '',
            mmtname: '',
            uname: '',
            pwd: '',
            user: ''
        }
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

    async function onchangeDb(e) {
        let mseldb = e.target.value;
        setSelDb(mseldb);
        console.log('Handle Read MMgt');
        const mymmts = await getMmtList(mseldb);
        let mymmtlst = [];
        for (let i = 0; i < mymmts.length; i++) {
            let mydict = {};
            mydict['value'] = i;
            mydict['label'] = mymmts[i];
            mymmtlst.push(mydict);
        }
        setMmtlist(mymmtlst);
    }

    async function onchangeMmt(e) {
        let mselmmt = e.target.value;
        setSelMmt(mselmmt);
    }

    function setDataSource(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(BASE_URL + '/dsrc');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function getDbList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            const mydict = {};
            mydict['dburl'] = 'http://influxdb:8086';

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(BASE_URL + '/getdbl');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.db_list);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function getMmtList(dbname) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            const mydict = {};
            mydict['dburl'] = 'http://influxdb:8086';
            mydict['dbname'] = dbname;

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(BASE_URL + '/getmmtl');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.mmt_list);
                })
                .catch((error) => {
                    reject(error);
                });
        });
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
            var url = new URL(BASE_URL + '/dsrc');

            let myulist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['dsname'] = item['dsname'];
                        myrow['dburl'] = item['dburl'];
                        myrow['dbname'] = item['dbname'];
                        myrow['mmtname'] = item['mmtname'];
                        myrow['uname'] = item['uname'];
                        myrow['pwd'] = item['pwd'];
                        myrow['user'] = item['user'];
                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // Tab bar function starts
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
    //end

    // add hardware function

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <MainCard title="Data Source">
                    <div>
                        <Box sx={{ width: '100%' }}>
                            <Box>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab
                                        style={{ color: 'darkblue' }}
                                        icon={<SettingsInputAntennaOutlinedIcon />}
                                        label="Data-Source"
                                        {...a11yProps(0)}
                                    />
                                    <Tab
                                        style={{ color: 'darkblue' }}
                                        icon={<AddCircleOutlinedIcon />}
                                        label="Add-Data Source"
                                        {...a11yProps(1)}
                                    />
                                </Tabs>
                            </Box>

                            {/* tab bar started for gateways */}
                            <TabPanel value={value} index={0}>
                                <div style={{ height: 400, width: '100%', marginTop: -1, marginLeft: -20 }}>
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

                            {/* tab bar for Add gateway */}
                            <TabPanel value={value} index={1}>
                                <Box
                                    component="form"
                                    sx={{
                                        '& .MuiTextField-root': { m: 2, width: '45ch' }
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField label="Name" id="dsname_tin" />
                                    <TextField label="URL" id="dburl_tin" />
                                    <TextField id="outlined-select-db" onChange={onchangeDb} select label=" DB-Name" helperText=" ">
                                        {dblist.map((option) => (
                                            <MenuItem key={option.value} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <Button style={{ marginTop: '18px' }} onClick={handleClickrefershdb} size="small" variant="contained">
                                        Refresh
                                    </Button>
                                    <br></br>
                                    <TextField
                                        id="outlined-select-mmt"
                                        onChange={onchangeMmt}
                                        select
                                        label=" Measurement-Name"
                                        helperText=" "
                                    >
                                        {mmtlist.map((option) => (
                                            <MenuItem key={option.value} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <Button size="small" style={{ marginTop: '20px' }} onClick={handleClickrefershmmt} variant="contained">
                                        Refresh
                                    </Button>
                                    <br></br>
                                    <TextField label="User-Name" id="dbuname_tin" />
                                    <FormControl sx={{ m: 1, width: '50ch' }} variant="outlined">
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            id="dbpwd_tin"
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                    </FormControl>
                                    <div style={{ marginLeft: '18px' }} class="position-absolute top-center">
                                        <Button onClick={onsavesource} type="button" variant="contained" class="btn btn-primary">
                                            {' '}
                                            Save
                                        </Button>
                                    </div>
                                </Box>
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                Item Three
                            </TabPanel>
                        </Box>
                    </div>
                </MainCard>
            </div>
        </div>
    );
}
