import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { constobj } from '../../misc/constants';

const statusSuggestions = ['Active-UP', 'Active-DN', 'Active-NiU', 'Moved', 'Not-Active'];
const remarkSuggestions = ['Hw Change', 'Location Change', 'Org Change'];
const ssuTypes = ['SiT', 'DuT', 'MoT'];

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
export default function EditSsu(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    // Ssu Info
    const [ssuId, setSsuId] = useState(props.mydata.sdata.ssuid);
    const [ssuBatch, setSsuBatch] = useState(props.mydata.sdata.batch);
    const [ssuType, setSsuType] = useState(props.mydata.sdata.type);
    const [ssuVer, setSsuVer] = useState(props.mydata.sdata.ver);
    const [ssuStatus1, setSsuStatus1] = useState(props.mydata.sdata.status);
    const [ssuOrg, setSsuOrg] = useState(props.mydata.sdata.client);
    const [ssuLoc, setSsuLoc] = useState(props.mydata.sdata.location);
    const [ssuRemarks, setSsuRemarks] = useState(props.mydata.sdata.remarks);
    const [selDate, setSelDate] = useState(new Date(props.mydata.sdata.adate)); // State for DateTimePicker

    const [myorgs, setMyorgs] = useState([]);
    const [myorglocs, setMyorglocs] = useState([]);

    const classes = useStyles();

    let myuser = sessionStorage.getItem('myUser');
    let myuobj = JSON.parse(myuser);

    let dnhold = 'Device';
    if (myuobj.ccode == 'WR') {
        dnhold = 'SSU';
    }

    async function getSpotInfo(myorg) {
        const myclients = await getClientData();
        setMyorgs(myclients);
        const myspot = await getSpotData(myorg);
        console.log('MySpot SSU: ', myspot);
        setMyorglocs(myspot);
    }

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

    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };

    const handleUpdateClick = () => {
        let edata = {
            ssuid: props.mydata.sdata.ssuid,
            batch: props.mydata.sdata.batch,
            ssutype: props.mydata.sdata.type,
            ssuver: props.mydata.sdata.ver,
            ssustatus: props.mydata.sdata.status,
            client: props.mydata.sdata.client,
            location: props.mydata.sdata.location,
            remarks: props.mydata.sdata.remarks,
            adate: props.mydata.sdata.adate
        };
        let ndata = {
            ssuid: ssuId,
            batch: ssuBatch,
            ssutype: ssuType,
            ssuver: ssuVer,
            ssustatus: ssuStatus1,
            client: ssuOrg,
            location: ssuLoc,
            remarks: ssuRemarks,
            adate: selDate
        };

        updateSsu({ edata: edata, ndata: ndata });
        props.mydata.hcb();
        setOpen(false);
    };

    async function updateSsu(mydict) {
        try {
            let sresp = await updateSsuData(mydict);

            Swal.fire({
                title: 'SSU Updated',
                text: 'SSU Updated successfully',
                icon: 'success'
            });
        } catch (err) {
            Swal.fire({
                text: err.message
            });
        }
    }

    function updateSsuData(mydict) {
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
            var url = new URL(DNC_URL + '/ssu');

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

    const handleAppendClick = () => {
        let ssdata = {
            ssuid: ssuId,
            batch: ssuBatch,
            ssutype: ssuType,
            ssuver: ssuVer,
            ssustatus: ssuStatus1,
            client: ssuOrg,
            location: ssuLoc,
            remarks: ssuRemarks,
            adate: selDate
        };

        appendSsu({ ssdata: ssdata });
        props.mydata.hcb();
        setOpen(false);
    };

    async function appendSsu(mydict) {
        try {
            let sresp = await appendSsuData(mydict);

            Swal.fire({
                title: 'SSU Appended',
                text: 'SSU Appended successfully',
                icon: 'success'
            });
        } catch (err) {
            Swal.fire({
                text: err.message
            });
        }
    }

    function appendSsuData(mydict) {
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
            var url = new URL(DNC_URL + '/assu');

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

    async function getSpotInfo(myorg) {
        const myclients = await getClientData();
        setMyorgs(myclients);
        const myspot = await getSpotData(myorg);
        console.log('MySpot SSU: ', myspot);
        setMyorglocs(myspot);
    }

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

    const typeChange = async (e, nv) => {
        setSsuType(nv);
    };

    const statusChange = async (e, nv) => {
        setSsuStatus1(nv);
    };

    const orgChange = async (e, nv) => {
        setSsuOrg(nv);
        const myspot = await getSpotData(nv);
        setMyorglocs(myspot);
    };

    const locChange = async (e, nv) => {
        setSsuLoc(nv);
    };

    const remChange = async (e, nv) => {
        setSsuRemarks(nv);
    };
    const handleClose = () => {
        setOpen(false);
        // props.mydata.hcb();
    };

    useEffect(() => {
        let myorg = sessionStorage.getItem('myOrg');
        // setSelOrg(myorg);
        getSpotInfo(myorg);
    }, []);

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                // className={classes.dialogWrapper}
            >
                <div className={classes.dialogCard}>
                    <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                        {`Manage ${dnhold} Master Record - ${props.mydata.sdata.ssuid}`}
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
                                <TextField style={{ width: '100%' }} id="hwId" label={`${dnhold} ID`} value={ssuId} size="small" />
                                <TextField
                                    style={{ width: '100%' }}
                                    id="boardRev"
                                    label="Batch"
                                    defaultValue={ssuBatch}
                                    size="small"
                                    onChange={(e) => setSsuBatch(e.target.value)}
                                />
                            </Box>

                            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem">
                                <Autocomplete
                                    freeSolo
                                    options={ssuTypes}
                                    defaultValue={ssuType}
                                    onChange={typeChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Type"
                                            size="small"
                                            style={{ width: '100%' }}
                                            onChange={(e) => {
                                                props.ssu.type(e.target.value);
                                            }}
                                        />
                                    )}
                                />
                                <TextField
                                    style={{ width: '100%' }}
                                    id="ssuVersion"
                                    label="Version"
                                    defaultValue={ssuVer}
                                    size="small"
                                    onChange={(e) => setSsuVer(e.target.value)}
                                />
                            </Box>

                            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem">
                                <Autocomplete
                                    freeSolo
                                    options={statusSuggestions}
                                    defaultValue={ssuStatus1}
                                    onChange={statusChange}
                                    renderInput={(params) => (
                                        <TextField
                                            style={{ width: '100%' }}
                                            {...params}
                                            label="Status"
                                            size="small"
                                            onChange={(e) => {
                                                setSsuStatus1(e.target.value);
                                            }}
                                        />
                                    )}
                                />
                                <Autocomplete
                                    freeSolo
                                    options={myorgs}
                                    value={ssuOrg}
                                    onChange={orgChange}
                                    renderInput={(params) => (
                                        <TextField
                                            style={{ width: '100%' }}
                                            {...params}
                                            onChange={(e) => setSsuOrg(e.target.value)}
                                            label="Organization/Client"
                                            size="small"
                                        />
                                    )}
                                />
                            </Box>

                            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="1rem">
                                <Autocomplete
                                    freeSolo
                                    options={myorglocs}
                                    value={ssuLoc}
                                    onChange={locChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{ width: '100%' }}
                                            label="Location"
                                            size="small"
                                            onChange={(e) => setSsuLoc(e.target.value)}
                                        />
                                    )}
                                />
                                <Autocomplete
                                    freeSolo
                                    options={remarkSuggestions}
                                    value={ssuRemarks}
                                    onChange={remChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Remarks"
                                            size="small"
                                            style={{ width: '100%' }}
                                            onChange={(e) => setSsuRemarks(e.target.value)}
                                        />
                                    )}
                                />
                            </Box>

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
                                                width: '53%', // Adjust the width as needed
                                                marginTop: '25px', // Add some spacing between DateTimePicker and Button
                                                marginLeft: '25%'
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>

                            <Box display="flex" justifyContent="center" marginTop="30px">
                                <Button
                                    onClick={handleAppendClick}
                                    style={{ marginRight: '1rem' }}
                                    size="small"
                                    variant="contained"
                                    className={classes.appendButton}
                                >
                                    Append
                                </Button>
                                <Button
                                    onClick={handleUpdateClick}
                                    style={{ marginRight: '1rem' }}
                                    size="small"
                                    variant="contained"
                                    className={classes.updateButton}
                                >
                                    Update
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    style={{ marginRight: '1rem' }}
                                    size="small"
                                    variant="contained"
                                    className={classes.cancelButton}
                                >
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
