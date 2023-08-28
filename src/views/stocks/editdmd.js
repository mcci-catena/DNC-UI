import React, { useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { constobj } from './../../misc/constants';

const technology = [
    { value: 'SigFox', label: 'SigFox' },
    { value: 'LoraWAN', label: 'LoRaWAN' }
];
const network = [
    { value: 'TTN', label: 'TTN' },
    { value: 'SigFox', label: 'SigFox' },
    { value: 'Actility', label: 'Actility' }
];
const bandRegion = [
    { value: 'US', label: 'US' },
    { value: 'AU', label: 'AU' }
];

const action = [
    { value: 'New deployment', label: 'New deployment' },
    { value: 'Firmware Update', label: 'Firmware Update' },
    { value: 'Tech Change', label: 'Tech Change' },
    { value: 'HW Failure', label: 'HW Failure' },
    { value: 'HW Repair', label: 'HW Repair' }
];

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

export default function EditDmd(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = useState(true);
    const [selDoA, setSelDoA] = useState(null);
    const [dmdInData, setDmdInData] = useState({});

    const [selBoardRev, setSelBoardRev] = useState('');
    const [selFwVer, setSelFwVer] = useState('');
    const [selTech, setSelTech] = useState('');
    const [selNw, setSelNw] = useState('');
    const [selBand, setSelBand] = useState('');
    const [selAction, setSelAction] = useState('');

    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };
    const handleSave = () => {
        updateDmd();
    };
    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };

    const techChange = (e) => {
        setSelTech(e.target.value);
    };

    const nwChange = (e) => {
        setSelNw(e.target.value);
    };

    const bandChange = (e) => {
        setSelBand(e.target.value);
    };

    const actionChange = (e) => {
        setSelAction(e.target.value);
    };

    const doaChange = (newDate) => {
        setSelDoA(newDate);
    };

    async function updateDmd() {
        setSelBoardRev(document.getElementById('boardrev').value);
        setSelFwVer(document.getElementById('fwver').value);
        let mydict = {};
        mydict['hwsl'] = props.mydata.sdata.hwsl;
        mydict['boardrev'] = document.getElementById('boardrev').value;
        mydict['fwver'] = document.getElementById('fwver').value;
        mydict['technology'] = selTech || '';
        mydict['network'] = selNw || '';
        mydict['region'] = selBand;
        mydict['action'] = selAction;
        mydict['doa'] = selDoA;

        let fdict = {};
        fdict['mdata'] = mydict;

        let edict = {};
        edict['hwsl'] = props.mydata.sdata.hwsl;
        edict['boardrev'] = props.mydata.sdata.boardrev;
        edict['fwver'] = props.mydata.sdata.fwver;
        edict['technology'] = props.mydata.sdata.technology;
        edict['network'] = props.mydata.sdata.network;
        edict['region'] = props.mydata.sdata.region;
        edict['action'] = props.mydata.sdata.action;
        edict['doa'] = props.mydata.sdata.doa;

        fdict['edata'] = edict;

        console.log('Stock Update Dict: ', mydict);

        let usresp = await updateDmdData(fdict);

        handleCancel();

        Swal.fire(usresp);
    }

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

    function showDmdInfo() {
        setSelBoardRev(props.mydata.sdata.boardrev);
        setSelFwVer(props.mydata.sdata.fwver);
        setSelTech(props.mydata.sdata.technology);
        setSelNw(props.mydata.sdata.network);
        setSelBand(props.mydata.sdata.region);
        setSelAction(props.mydata.sdata.action);
        setSelDoA(props.mydata.sdata.doa);
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
        showDmdInfo();
    }, []);

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px', textAlign: 'center' }}>
                    {props.mydata.mode === 'edit'
                        ? 'Edit Device Master Record - ' + props.mydata.sdata.hwsl
                        : 'Append Device Master Record - ' + props.mydata.sdata.hwsl}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{ textAlign: 'center' }} id="alert-dialog-description">
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '30ch' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField id="boardrev" label="Board Revision" defaultValue={props.mydata.sdata.boardrev} variant="outlined" />
                            <TextField id="fwver" label="Fw Version" defaultValue={props.mydata.sdata.fwver} variant="outlined" />

                            {/* Add the dividing line here */}
                            <hr style={{ marginTop: '32px 0', width: '100%' }} />

                            <TextField id="technology" select label=" Technology" helperText=" " value={selTech} onChange={techChange}>
                                {technology.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField id="network" select label=" Network" helperText=" " value={selNw} onChange={nwChange}>
                                {network.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField id="region" select label=" Band Region" helperText=" " value={selBand} onChange={bandChange}>
                                {bandRegion.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                style={{ marginTop: ' 10px ' }}
                                id="action"
                                select
                                label=" Action"
                                helperText=" "
                                value={selAction}
                                onChange={actionChange}
                            >
                                {action.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Select Date and Time"
                                    value={selDoA}
                                    onChange={doaChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{
                                                width: '43%'
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                            <Button
                                style={{ ...buttonStyles, backgroundColor: 'green' }} // Green button color
                                onClick={handleSave}
                                variant="contained"
                                color="success"
                            >
                                {props.mydata.mode === 'edit' ? 'Save' : 'Add'}
                            </Button>
                            <Button
                                style={{ ...buttonStyles, backgroundColor: 'Red' }} // Red button color
                                onClick={handleCancel}
                                variant="contained"
                                color="success"
                            >
                                Cancel
                            </Button>
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
