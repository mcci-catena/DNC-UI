import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';

import { constobj } from './../../misc/constants';

export default function RemoveDevice(props) {
    const { DNC_URL } = { ...constobj };

    const [liveDev, setLiveDev] = React.useState('');

    const [open, setOpen] = useState(true);
    const [selectedRDate, setSelectedRDate] = useState(null);

    const handleRemove = () => {
        let myrdict = {};
        myrdict['orgname'] = sessionStorage.getItem('myOrg');
        myrdict['rdate'] = selectedRDate;
        myrdict['hwsl'] = liveDev;
        myrdict['sid'] = props.mydata.sdata.sid;

        removeDevice(myrdict);
        setOpen(false); // Close the dialog after saving
        props.mydata.hcb();
    };

    async function removeDevice(mydict) {
        let rdresp;
        try {
            rdresp = updtDevRecord(mydict);
            Swal.fire('Device remove success');
        } catch (err) {
            Swal.fire(rdresp);
        }
    }

    function updtDevRecord(mydict) {
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

            var url = new URL(DNC_URL + '/remdev');

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

    const handleClose = () => {
        setOpen(false); // Close the dialog when Cancel is clicked
        props.mydata.hcb();
    };

    useEffect(() => {
        getDeviceInfo();
    }, []);

    async function getDeviceInfo() {
        setLiveDev(props.mydata.sdata.ddata.hwsl);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <div style={{ width: '400px' }}>
                    <DialogTitle style={{ fontSize: '16px' }} id="alert-dialog-title">
                        Remove Device from the Spot
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Stack spacing={2}>
                                <TextField id="hwsl" label="HwId" value={liveDev} variant="outlined" />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        fullWidth
                                        label="Date of Removal"
                                        value={selectedRDate}
                                        onChange={setSelectedRDate}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                    />
                                </LocalizationProvider>
                            </Stack>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ justifyContent: 'center' }}>
                        <Stack spacing={2} direction="row">
                            <Button variant="contained" color="secondary" onClick={handleRemove}>
                                Remove
                            </Button>
                            <Button variant="contained" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Stack>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}
