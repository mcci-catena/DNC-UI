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
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { constobj } from './../../misc/constants';

const devtype = [
    { id: 1, value: 'devEUI', label: 'devEUI' },
    { id: 2, value: 'devID', label: 'devID' }
];

const stockstatus = [
    { value: 'Config', label: 'Config' },
    { value: 'Test', label: 'Test' },
    { value: 'Ready', label: 'Ready' },
    { value: 'Taken', label: 'Taken' }
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
    cancelButton: {
        backgroundColor: '#f44336',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#d32f2f'
        },
        width: '48%'
    },
    saveButton: {
        backgroundColor: '#4caf50',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#43a047'
        },
        width: '48%'
    }
}));
export default function Editgateway(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);

    const [orglist, setOrglist] = React.useState([]);
    const [orgdict, setOrgdict] = React.useState({});
    const [selOrg, setSelOrg] = useState('');
    const [selOrgId, setSelOrgId] = useState(null);

    const [dslist, setDslist] = React.useState([]);
    const [dsdict, setDsdict] = React.useState({});
    const [selDs, setSelDs] = useState('');
    const [selDsId, setSelDsId] = useState(null);

    const [selDtype, setSelDtype] = useState('');
    const [dlist, setDlist] = React.useState([]);
    const [selDev, setSelDev] = useState('');

    const [selectedIDate, setSelectedIDate] = useState(null);
    const [selectedODate, setSelectedODate] = useState(null);

    const [selStatus, setSelStatus] = useState('');

    const classes = useStyles();

    const handleRefreshOrg = () => {
        getOrgInfo();
    };

    async function orgChange(e) {
        setSelOrg(e.target.value);
        setSelOrgId(orgdict[e.target.value]);
    }

    const handleRefreshDs = () => {
        getDsInfo();
    };

    async function dsChange(e) {
        setSelDs(e.target.value);
        setSelDsId(dsdict[e.target.value]);
    }

    async function dtChange(e) {
        setSelDtype(e.target.value);
    }

    async function devChange(e) {
        setSelDev(e.target.value);
    }

    async function handleStatus(e) {
        setSelStatus(e.target.value);
    }

    const handleGetDevices = () => {
        getDevices();
    };

    const handleSave = () => {
        updateStock();
    };

    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };
    const handleIDateChange = (newDate) => {
        setSelectedIDate(newDate);
    };
    const handleODateChange = (newDate) => {
        setSelectedODate(newDate);
    };

    async function getOrgInfo() {
        const myorg = await getOrgList();

        let mynewo = [];
        let orgdict = {};
        for (let i = 0; i < myorg.length; i++) {
            let mydict = {};
            mydict['id'] = myorg[i].id;
            mydict['label'] = myorg[i].name;
            mydict['value'] = myorg[i].name;
            mynewo.push(mydict);

            orgdict[myorg[i].name] = myorg[i].id;
        }

        setOrglist(mynewo);
        setOrgdict(orgdict);
        setSelOrg(mynewo[0].value);
        setSelOrgId(mynewo[0].id);
    }

    // get User data
    function getOrgList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            fetch(DNC_URL + '/org', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    let olist = [];
                    if (data != null) {
                        for (let i = 0; i < data.length; i++) {
                            olist.push({ name: data[i].name, id: data[i].id });
                        }
                    }
                    resolve(olist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function getDsInfo() {
        const myds = await getDsList();

        let mynewo = [];
        let dsdict = {};
        for (let i = 0; i < myds.length; i++) {
            let mydict = {};
            mydict['id'] = myds[i].id;
            mydict['label'] = myds[i].name;
            mydict['value'] = myds[i].name;
            mynewo.push(mydict);

            dsdict[myds[i].name] = myds[i].id;
        }

        setDslist(mynewo);
        setDsdict(dsdict);
        setSelDs(mynewo[0].value);
        setSelDsId(mynewo[0].id);
    }

    function getDsList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            fetch(DNC_URL + '/dsrc', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    let olist = [];
                    if (data != null) {
                        for (let i = 0; i < data.length; i++) {
                            olist.push({ name: data[i].dsname, id: data[i].dsid });
                        }
                    }
                    resolve(olist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function getDevData(mydict) {
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

            var url = new URL(DNC_URL + '/dlist');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Dev Req Resp: ', data);
                    resolve(data.message);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    async function getDevices() {
        let mydict = {};
        mydict['dsn'] = selDs;
        mydict['dtype'] = selDtype;

        try {
            let dresp = await getDevData(mydict);
            let mynewd = [];

            for (let i = 0; i < dresp.length; i++) {
                let mydict = {};
                mydict['id'] = i + 1;
                mydict['label'] = dresp[i];
                mydict['value'] = dresp[i];
                mynewd.push(mydict);
            }
            setDlist(mynewd);
            setSelDev(mynewd[0].value);
        } catch (error) {
            Swal.fire(error);
        }
    }

    // Send request to backend to update the stock (device record)
    async function updateStock() {
        let mydict = {};
        mydict['hwsl'] = props.mydata.sdata.hwsl;
        mydict['nwIdV'] = selDev;
        mydict['nwIdK'] = selDtype;
        mydict['orgid'] = selOrgId || '';
        mydict['dsid'] = selDsId || '';
        mydict['idate'] = selectedIDate;
        mydict['odate'] = selectedODate;
        mydict['status'] = selStatus;
        mydict['remarks'] = document.getElementById('remarks').value;

        let fdict = {};
        fdict['sdata'] = mydict;

        console.log('Stock Update Dict: ', mydict);

        let usresp = await updateStockRecord(fdict);

        handleCancel();

        // Swal.fire(usresp);
        Swal.fire({
            title: 'Stock Update',
            text: `Hardware Serial: ${mydict.hwsl}\nNetwork ID Key: ${mydict.nwIdK}\nNetwork ID Value: ${mydict.nwIdV}\nOrganization ID: ${mydict.orgid}\nData Source ID: ${mydict.dsid}`,
            icon: 'success'
        });
    }

    function updateStockRecord(mydict) {
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

            var url = new URL(DNC_URL + '/stock');

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

    function showStockInfo() {
        setSelOrg(props.mydata.sdata.orgn);
        setSelOrgId(props.mydata.sdata.orgid);
        setSelDs(props.mydata.sdata.dsn);
        setSelDsId(props.mydata.sdata.dsid);
        setSelDtype(props.mydata.sdata.Type);
        setSelDev(props.mydata.sdata.nwId);
        setSelectedIDate(props.mydata.sdata.idate);
        setSelectedODate(props.mydata.sdata.odate);
        setSelStatus(props.mydata.sdata.status);

        setDslist([
            {
                id: props.mydata.sdata.dsid,
                value: props.mydata.sdata.dsn,
                label: props.mydata.sdata.dsn
            }
        ]);

        setOrglist([
            {
                id: props.mydata.sdata.orgid,
                value: props.mydata.sdata.orgn,
                label: props.mydata.sdata.orgn
            }
        ]);

        let selorgn = props.mydata.sdata.orgn;
        let selorgid = props.mydata.sdata.orgid;

        setOrgdict({ selorgn: selorgid });

        let seldsn = props.mydata.sdata.dsn;
        let seldsid = props.mydata.sdata.dsid;
        setDsdict({ seldsn: seldsid });

        let seldevid = props.mydata.sdata.nwId;
        setDlist([
            {
                id: 1,
                value: seldevid,
                label: seldevid
            }
        ]);
    }

    useEffect(() => {
        showStockInfo();
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
                        {'Edit Stock - ' + props.mydata.sdata.hwsl}
                    </DialogTitle>
                    <DialogContent>
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '90%' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField id="selectOrg" select label="Select Org" value={selOrg} onChange={orgChange}>
                                {orglist.map((option) => (
                                    <MenuItem key={option.id} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button onClick={handleRefreshOrg} variant="contained" color="primary">
                                Refresh
                            </Button>
                            <TextField id="selectDs" select label="Select Data Source" value={selDs} onChange={dsChange}>
                                {dslist.map((option) => (
                                    <MenuItem key={option.id} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button onClick={handleRefreshDs} variant="contained" color="primary">
                                Refresh
                            </Button>
                            <TextField id="selectDtype" select label="Device Id Type" value={selDtype} onChange={dtChange}>
                                {devtype.map((option) => (
                                    <MenuItem key={option.id} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField id="outlined-select-Main Org" select label="Select Device" value={selDev} onChange={devChange}>
                                {dlist.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button onClick={handleGetDevices} variant="contained" color="primary">
                                Get Devices
                            </Button>
                            <TextField
                                id="remarks"
                                defaultValue={props.mydata.sdata.remarks}
                                label="Remarks"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField id="selstatus" select label="Status" value={selStatus} onChange={handleStatus}>
                                {stockstatus.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Box display="flex" justifyContent="space-between" alignItems="center" marginTop="16px">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="Select In Date/Time"
                                        value={selectedIDate}
                                        onChange={handleIDateChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                style={{
                                                    width: '50%'
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="Select Out Date/Time"
                                        value={selectedODate}
                                        onChange={handleODateChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                style={{
                                                    width: '51%'
                                                }}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Box>
                            <Box display="flex" justifyContent="space-between" marginTop="16px">
                                <Button onClick={handleSave} variant="contained" className={classes.saveButton} fullWidth>
                                    Save
                                </Button>
                                <Button onClick={handleCancel} variant="contained" className={classes.cancelButton} fullWidth>
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
