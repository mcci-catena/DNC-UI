import React, { useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Autocomplete from '@mui/material/Autocomplete';

import { constobj } from '../../misc/constants';
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
const technology = [
    { id: 1, value: 'Sigfox', label: 'Sigfox' },
    { id: 2, value: 'LoraWAN', label: 'LoRaWAN' }
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
const bandRegion = [
    { value: 'IN', label: 'IN' },
    { value: 'AU', label: 'AU' },
    { value: 'EU', label: 'EU' },
    { value: 'JP', label: 'JP' },
    { value: 'KR', label: 'KR' },
    { value: 'AS', label: 'AS' },
    { value: 'US', label: 'US' }
];
const remarkSuggestions = ['Hw Change', 'Location Change', 'Org Change'];

const action = [
    { value: 'New deployment', label: 'New deployment' },
    { value: 'Firmware Update', label: 'Firmware Update' },
    { value: 'Tech Change', label: 'Tech Change' },
    { value: 'HW Failure', label: 'HW Failure' },
    { value: 'HW Repair', label: 'HW Repair' }
];
const statusSuggestions = ['Active-UP', 'Active-DN', 'Active-NiU', 'Moved', 'Not-Active'];

// Updated CSS for button styles
const buttonStyles = {
    width: '20%',
    marginTop: '2%',
    marginLeft: '1%',
    backgroundColor: 'green',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: 'green'
    }
};

export default function EditHw(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = useState(true);

    const [selBrev, setSelBrev] = useState(props.mydata.sdata.boardrev);
    const [selFwVer, setSelFwVer] = useState(props.mydata.sdata.fwver);
    const [selTech, setSelTech] = useState(props.mydata.sdata.tech);
    const [selNw, setSelNw] = useState(props.mydata.sdata.network);
    const [selRegion, setSelRegion] = useState(props.mydata.sdata.region);
    const [selRemarks, setSelRemarks] = useState(props.mydata.sdata.remarks);
    const [selDate, setSelDate] = useState(new Date(props.mydata.sdata.adate)); // State for DateTimePicker

    const [selDoA, setSelDoA] = useState(null);
    const [dmdInData, setDmdInData] = useState({});
    const [myorglocs, setMyorglocs] = useState([]);
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };

    const handleAppend = () => {
        let hwdata = {
            hwsl: props.mydata.sdata.hwsl,
            boardrev: selBrev,
            fwver: selFwVer,
            tech: selTech,
            network: selNw,
            region: selRegion,
            remarks: selRemarks,
            adate: selDate
        };

        appendHw({ hwdata: hwdata });
        props.mydata.hcb();
        setOpen(false);
    };

    async function appendHw(mydict) {
        try {
            let sresp = await appendHwData(mydict);

            Swal.fire({
                title: 'Hw Appended',
                text: 'Hw Appended successfully',
                icon: 'success'
            });
        } catch (err) {
            Swal.fire({
                text: err.message
            });
        }
    }

    function appendHwData(mydict) {
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
            var url = new URL(DNC_URL + '/ahwmr');

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

    const handleDateChange = (date) => {
        setSelDate(date);
    };

    const handleUpdate = () => {
        let edata = {
            hwsl: props.mydata.sdata.hwsl,
            boardrev: props.mydata.sdata.boardrev,
            fwver: props.mydata.sdata.fwver,
            tech: props.mydata.sdata.tech,
            network: props.mydata.sdata.network,
            region: props.mydata.sdata.region,
            remarks: props.mydata.sdata.remarks,
            adate: props.mydata.sdata.adate
        };
        let ndata = {
            hwsl: props.mydata.sdata.hwsl,
            boardrev: selBrev,
            fwver: selFwVer,
            tech: selTech,
            network: selNw,
            region: selRegion,
            remarks: selRemarks,
            adate: selDate
        };

        updateHw({ edata: edata, ndata: ndata });
        props.mydata.hcb();
        setOpen(false);
    };

    async function updateHw(mydict) {
        try {
            let sresp = await updateHwData(mydict);

            Swal.fire({
                title: 'Hw Updated',
                text: 'Hw Updated successfully',
                icon: 'success'
            });
        } catch (err) {
            Swal.fire({
                text: err.message
            });
        }
    }

    function updateHwData(mydict) {
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
            var url = new URL(DNC_URL + '/hwmr');

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

    const techChange = (e) => {
        setSelTech(e.target.value);
    };

    const nwChange = (e) => {
        setSelNw(e.target.value);
    };

    const regionChange = (e) => {
        setSelRegion(e.target.value);
    };

    const actionChange = (e) => {
        setSelAction(e.target.value);
    };

    const doaChange = (newDate) => {
        setSelDoA(newDate);
    };
    const remChange = async (e, nv) => {
        // props.ssu.remarks(nv);
        setSelRemarks(nv);
    };

    async function updateDmd() {
        setSelBrev(document.getElementById('boardrev').value);
        setSelFwVer(document.getElementById('fwver').value);
        let mydict = {};
        mydict['hwsl'] = props.mydata.sdata.hwsl;
        mydict['boardrev'] = document.getElementById('boardrev').value;
        mydict['fwver'] = document.getElementById('fwver').value;
        mydict['technology'] = selTech || '';
        mydict['network'] = selNw || '';
        mydict['region'] = selRegion;
        mydict['remarks'] = selAction;
        mydict['adate'] = selDoA;

        let fdict = {};
        fdict['mdata'] = mydict;

        let edict = {};
        edict['hwsl'] = props.mydata.sdata.hwsl;
        edict['boardrev'] = props.mydata.sdata.boardrev;
        edict['fwver'] = props.mydata.sdata.fwver;
        edict['technology'] = props.mydata.sdata.technology;
        edict['network'] = props.mydata.sdata.network;
        edict['region'] = props.mydata.sdata.region;
        edict['remarks'] = props.mydata.sdata.action;
        edict['adate'] = props.mydata.sdata.doa;

        fdict['edata'] = edict;

        console.log('Stock Update Dict: ', mydict);

        let usresp = await updateDmdData(fdict);

        handleCancel();

        Swal.fire(usresp);
    }
    const statusChange = async (e, nv) => {
        props.ssu.status1(nv);
    };

    function updateDmdData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: props.mydata.mode === 'edit' ? 'PUT' : 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict),
                redirect: 'follow'
            };

            var url = new URL(DNC_URL + '/dmd');

            fetch(url, requestOptions)
                .then((response) => {
                    if (response.status === 403) {
                        return { message: 'Session Expired' };
                    } else {
                        console.log('Updt-Resp: ', response);
                        return response.json();
                    }
                })
                .then((data) => {
                    console.log(data);
                    resolve(data.message);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    function showHwInfo() {
        setSelBrev(props.mydata.sdata.boardrev);
        setSelFwVer(props.mydata.sdata.fwver);
        setSelTech(props.mydata.sdata.tech);
        setSelNw(props.mydata.sdata.network);
        setSelRegion(props.mydata.sdata.region);
        setSelRemarks(props.mydata.sdata.remarks);
        setSelDate(props.mydata.sdata.adate);
    }

    function getDmdData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/dmd/' + props.mydata.sdata.hwsl);

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

    useEffect(() => {
        showHwInfo();
    }, []);

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px', textAlign: 'center' }}>
                    {`Manage Hw Master Record - ${props.mydata.sdata.hwsl}`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ textAlign: 'left' }} id="alert-dialog-description">
                        <Box
                            component="form"
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '16px',
                                marginTop: '5%'
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField size="small" id="boardrev" label="Board Revision" value={selBrev} variant="outlined" />
                            <TextField
                                size="small"
                                id="fwver"
                                label="Fw Version"
                                value={selFwVer}
                                variant="outlined"
                                onChange={(e) => setSelFwVer(e.target.value)}
                            />
                            <TextField
                                style={{ marginTop: ' 1px ' }}
                                id="technology"
                                select
                                label=" Technology"
                                helperText=" "
                                value={selTech}
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
                                style={{ marginTop: ' -2px ' }}
                                id="network"
                                select
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
                            </TextField>{' '}
                            {/* Network options */}
                            <TextField
                                size="small"
                                id="region"
                                select
                                label=" Band/Region"
                                helperText=" "
                                value={selRegion}
                                onChange={regionChange}
                            >
                                {bandRegion.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {/* Add the dividing line here */}
                            <Autocomplete
                                freeSolo
                                options={remarkSuggestions}
                                value={selRemarks}
                                onChange={remChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        style={{ width: '100%' }}
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
                                                width: '100%' // Adjust the width as needed
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Box>
                        <Box display="flex" justifyContent="center" marginTop="30px">
                            {/* Append Button */}
                            <Button
                                style={{ marginRight: '1rem' }}
                                onClick={handleAppend}
                                size="small"
                                variant="contained"
                                className={classes.appendButton}
                            >
                                Append
                            </Button>

                            {/* Update Button */}
                            <Button
                                style={{ marginRight: '1rem' }}
                                onClick={handleUpdate}
                                size="small"
                                variant="contained"
                                className={classes.updateButton}
                            >
                                Update
                            </Button>

                            {/* Cancel Button */}
                            <Button onClick={handleCancel} size="small" variant="contained" className={classes.cancelButton}>
                                Cancel
                            </Button>
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
