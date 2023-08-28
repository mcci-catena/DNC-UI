import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import Autocomplete from '@mui/material/Autocomplete';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { constobj } from './../../misc/constants';

const statusoptions = ['Active-UP', 'Active-DN', 'Active-NiU', 'Moved', 'Not-Active'];
const remarkoptions = ['Hw Change', 'Location Change', 'Org Change'];
const modeloptions = ['MultiTech', 'Heltec', 'Sigfox'];
const locoptions = ['WeRadiate', 'MCCI', 'Tresca'];

const technology = [
    { id: 1, value: 'Sigfox', label: 'Sigfox' },
    { id: 2, value: 'LoRaWAN', label: 'LoRaWAN' }
];
const network = [
    { value: 'TTN', label: 'TTN' },
    { value: 'Helium', label: 'Helium' },
    { value: 'machineQ', label: 'machineQ' },
    { value: 'Senet', label: 'Senet' },
    { value: 'Senra', label: 'Senra' },
    { value: 'Swisscom', label: 'Swisscom' },
    { value: 'Chirpstack', label: 'Chirpstack' },
    { value: 'Generic', label: 'Generic' },
    { value: 'Actility', label: 'Actility' }
];
const useStyles = makeStyles((theme) => ({
    dialogWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
    },
    dialogCard: {
        width: '100%',
        padding: theme.spacing(3),
        borderRadius: theme.spacing(2),
        backgroundColor: '#f5f5f5',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        [theme.breakpoints.down('sm')]: {
            width: '90%'
        }
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: theme.spacing(2)
    },
    updateButton: {
        backgroundColor: '#4caf50',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#d32f2f'
        },
        width: '48%'
    },
    appendButton: {
        backgroundColor: '#4ca',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#43a047'
        },
        width: '48%'
    },
    cancelButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#43a047'
        },
        width: '48%'
    }
}));
export default function EditDevice(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);

    const [selOrg, setSelOrg] = useState(props.mydata.sdata.orgid);
    const [selLoc, setSelLoc] = useState(props.mydata.sdata.location);
    const [selRemarks, setSelRemarks] = useState(props.mydata.sdata.remarks);
    const [selStatus, setSelStatus] = useState(props.mydata.sdata.status);
    const [selModel, setSelModel] = useState(props.mydata.sdata.model); // Set an initial valid value or empty string
    const [selTech, setSelTech] = useState(props.mydata.sdata.tech); // Set an initial valid value or empty string
    const [selNw, setSelNw] = useState(props.mydata.sdata.network); // Set an initial valid value or empty string
    const [selDate, setSelDate] = useState(new Date(props.mydata.sdata.adate)); // State for DateTimePicker

    const [myorgs, setMyorgs] = useState([]);
    const [myorglocs, setMyorglocs] = useState([]);

    const classes = useStyles();

    let myorg = sessionStorage.getItem('myOrg');

    let myuser = sessionStorage.getItem('myUser');
    let myuobj = JSON.parse(myuser);

    let dnhold = 'Device';
    if (myuobj.ccode == 'WR') {
        dnhold = 'SSU';
    }

    async function techChange(e) {
        setSelTech(e.target.value);
    }

    async function nwChange(e) {
        setSelNw(e.target.value);
    }

    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };

    const handleUpdate = () => {
        let edata = {
            name: props.mydata.sdata.name,
            hwid: props.mydata.sdata.hwid,
            simmk: props.mydata.sdata.simmk,
            ssusc: props.mydata.sdata.ssusc,
            tech: props.mydata.sdata.tech,
            network: props.mydata.sdata.network,
            model: props.mydata.sdata.model,
            status: props.mydata.sdata.status,
            orgid: props.mydata.sdata.orgid,
            location: props.mydata.sdata.location,
            remarks: props.mydata.sdata.remarks,
            adate: props.mydata.sdata.adate
        };
        let ndata = {
            name: props.mydata.sdata.name,
            hwid: props.mydata.sdata.hwid,
            simmk: document.getElementById('simmk').value,
            ssusc: document.getElementById('ssusc').value,
            tech: selTech,
            network: selNw,
            model: selModel,
            status: selStatus,
            orgid: selOrg,
            location: selLoc,
            remarks: selRemarks,
            adate: selDate
        };
        updateGw({ edata: edata, ndata: ndata });
        props.mydata.hcb();
        setOpen(false);
    };

    const handleAppend = () => {
        let gwdata = {
            name: props.mydata.sdata.name,
            hwid: props.mydata.sdata.hwid,
            simmk: document.getElementById('simmk').value,
            ssusc: document.getElementById('ssusc').value,
            tech: selTech,
            network: selNw,
            model: selModel,
            status: selStatus,
            orgid: selOrg,
            location: selLoc,
            remarks: selRemarks,
            adate: selDate
        };

        appendGw({ gwdata: gwdata });
        props.mydata.hcb();
        setOpen(false);
    };

    async function appendGw(mydict) {
        try {
            let sresp = await appendGwData(mydict);

            Swal.fire({
                title: 'Gateway Appended',
                text: 'Gateway Appended successfully',
                icon: 'success'
            });
        } catch (err) {
            Swal.fire({
                text: err.message
            });
        }
    }

    function appendGwData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');

            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);

            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/agwmr');

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

    async function updateGw(mydict) {
        try {
            let sresp = await updateGwData(mydict);

            Swal.fire({
                title: 'Gateway Updated',
                text: 'Gateway Updated successfully',
                icon: 'success'
            });
        } catch (err) {
            Swal.fire({
                text: err.message
            });
        }
    }

    function updateGwData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');

            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);

            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/gwmr');

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

    async function getSpotInfo(myorg) {
        const myclients = await getClientData();
        setMyorgs(myclients);
        // const myspot = await getSpotData(myorg);
        // console.log('Locations for the Org: ', myorg, myspot);
        // setMyorglocs(myspot);
    }
    const handleDateChange = (date) => {
        setSelDate(date);
    };

    function getClientData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/org');

            let myslist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Real Data: ', data);
                    let myloc = [];
                    data.forEach((item) => {
                        myloc.push(item.name);
                    });
                    resolve(myloc);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function getSpotData(myorg) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/spot/' + myorg);

            let myslist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Real Data: ', data);
                    let myloc = [];
                    data.forEach((item) => {
                        myloc.push(item.sname);
                    });
                    resolve(myloc);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const modelChange = async (e, nv) => {
        setSelModel(nv);
    };

    const statusChange = async (e, nv) => {
        setSelStatus(nv);
    };

    const orgChange = async (e, nv) => {
        setSelOrg(nv);
        // const myspot = await getSpotData(nv);
        // setMyorglocs(myspot);
    };

    const locChange = async (e, nv) => {
        setSelLoc(nv);
    };

    const remChange = async (e, nv) => {
        setSelRemarks(nv);
    };
    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    useEffect(() => {
        let myorg = sessionStorage.getItem('myOrg');
        // setSelOrg(myorg);
        getSpotInfo(props.mydata.sdata.orgid);
    }, []);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                className={classes.dialogWrapper}
            >
                <div className={classes.dialogCard}>
                    <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                        {`Manage Gayeway - ${props.mydata.sdata.name}`}
                    </DialogTitle>
                    <DialogContent>
                        <Box
                            component="form"
                            sx={{
                                '& .MuiTextField-root': { m: 1, width: '45ch' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem">
                                {/* {/ {/ First Column /} /} */}
                                <TextField
                                    style={{ width: '100%' }}
                                    id="gwname"
                                    value={props.mydata.sdata.name}
                                    label="Name"
                                    size="small"
                                />
                                <TextField style={{ width: '100%' }} id="hwid" value={props.mydata.sdata.hwid} label="Hwid" size="small" />
                            </Box>
                            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem">
                                {/* {/ {/ Second Column /} /} */}
                                <Autocomplete
                                    freeSolo
                                    options={modeloptions}
                                    value={selModel}
                                    onChange={modelChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{ width: '100%', marginTop: '10%' }}
                                            id="model"
                                            label="Model"
                                            size="small"
                                            onChange={(e) => setSelModel(e.target.value)}
                                        />
                                    )}
                                />
                                <TextField
                                    style={{ width: '100%', marginTop: '10%' }}
                                    id="simmk"
                                    defaultValue={props.mydata.sdata.simmk}
                                    label="SIM card Make"
                                    size="small"
                                />

                                <TextField
                                    style={{ width: '100%', marginTop: '10%' }}
                                    id="gwtech"
                                    select
                                    label=" Technology"
                                    helperText=" "
                                    value={selTech}
                                    size="small"
                                    onChange={techChange}
                                >
                                    {technology.length > 0 &&
                                        technology.map((option) => (
                                            <MenuItem key={option.id} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                </TextField>
                                <TextField
                                    style={{ width: '100%', marginTop: '10%' }}
                                    id="gwnw"
                                    select
                                    size="small"
                                    label=" Network"
                                    helperText=" "
                                    value={selNw}
                                    onChange={nwChange}
                                >
                                    {technology.length > 0 &&
                                        (selTech === 'Sigfox' ? (
                                            <MenuItem key="Sigfox" value="Sigfox">
                                                Sigfox
                                            </MenuItem>
                                        ) : (
                                            network.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))
                                        ))}
                                </TextField>
                            </Box>

                            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem">
                                {/* {/ {/ Third Column /} /} */}

                                <Autocomplete
                                    freeSolo
                                    options={myorgs}
                                    defaultValue=""
                                    value={selOrg}
                                    onChange={orgChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{ width: '100%', marginTop: '-3%' }}
                                            label="Organization/Client"
                                            size="small"
                                            onChange={(e) => setSelOrg(e.target.value)}
                                        />
                                    )}
                                />
                                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem">
                                    {/* {/ {/ Fourth Column /} /} */}
                                    <Autocomplete
                                        freeSolo
                                        options={locoptions}
                                        onChange={locChange}
                                        defaultValue=""
                                        value={selLoc}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                style={{ width: '220%', marginTop: '-7%' }}
                                                label="Location"
                                                size="small"
                                                onChange={(e) => setSelLoc(e.target.value)}
                                            />
                                        )}
                                    />
                                </Box>
                                <Autocomplete
                                    freeSolo
                                    options={statusoptions}
                                    onChange={statusChange}
                                    value={selStatus}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{ width: '100%' }}
                                            label="Status"
                                            size="small"
                                            onChange={(e) => setSelStatus(e.target.value)}
                                        />
                                    )}
                                />
                                <TextField
                                    style={{ width: '100%' }}
                                    id="ssusc"
                                    defaultValue={props.mydata.sdata.ssusc}
                                    label={`${dnhold}s connected`}
                                    size="small"
                                />
                                <Autocomplete
                                    freeSolo
                                    options={remarkoptions}
                                    value={selRemarks}
                                    onChange={remChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{ width: '100%', marginTop: '5%' }}
                                            label="Remarks"
                                            size="small"
                                            onChange={(e) => setSelRemarks(e.target.value)}
                                        />
                                    )}
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="Select In Date/Time"
                                        value={selDate}
                                        onChange={handleDateChange}
                                        renderInput={(params) => (
                                            <TextField
                                                size="small"
                                                {...params}
                                                style={{
                                                    width: '100%',
                                                    marginTop: '5%' // Adjust the width as needed
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Box display="flex" justifyContent="center" marginTop="30px">
                                {/* {/ {/ Append Button /} /} */}
                                <Button
                                    style={{ marginRight: '1rem' }}
                                    onClick={handleAppend}
                                    size="small"
                                    variant="contained"
                                    className={classes.appendButton}
                                >
                                    Append
                                </Button>

                                {/* {/ {/ Update Button /} /} */}
                                <Button
                                    style={{ marginRight: '1rem' }}
                                    onClick={handleUpdate}
                                    size="small"
                                    variant="contained"
                                    className={classes.updateButton}
                                >
                                    Update
                                </Button>

                                {/* { {/ Cancel Button /} } */}
                                <Button onClick={handleCancel} size="small" variant="contained" className={classes.cancelButton}>
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </DialogContent>
                </div>
            </Dialog>
        </div>
    );
}
