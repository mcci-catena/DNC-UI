import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Swal from 'sweetalert2';
import { constobj } from './../../../misc/constants';

export default function EditTapHistory(props) {
    const { CPLUGIN_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    const [selectedIDate, setSelectedIDate] = useState(null);

    const statusRef = useRef(null);

    const handleIDateChange = (newDate) => {
        setSelectedIDate(newDate);
    };

    const handleSave = () => {
        //setOpen(true);
        updateTap();
    };

    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    useEffect(() => {
        console.log(props.mydata.sdata);
        setSelectedIDate(props.mydata.sdata.edate);
    }, []);

    function converttimestr(bdate) {
        let brixdate = bdate.toISOString();
        let mydate = brixdate.split('T')[0].split('-');
        let mytime = brixdate.split('T')[1].split('.')[0];
        let mybrixdate = mydate[1] + '-' + mydate[2] + '-' + mydate[0] + ',' + mytime;
        return mybrixdate;
    }

    async function updateTap() {
        const newdict = {};
        let location = props.mydata.sdata.location;
        let dcpold = props.mydata.sdata.dcp;
        let tapold = props.mydata.sdata.tapCount;
        let dateold = props.mydata.sdata.edate;

        if (statusRef.current) {
            newdict['tapCount'] = statusRef.current.value;
        } else {
            newdict['tapCount'] = tapold;
        }
        newdict['edate'] = converttimestr(selectedIDate);

        const mydict = {};

        mydict['edate'] = converttimestr(new Date(dateold));
        mydict['tapCount'] = tapold;
        mydict['dcp'] = dcpold;
        mydict['location'] = location;

        let uresp = await updateOneTap({ data: mydict, new: newdict });

        handleClose();

        Swal.fire(uresp);
    }

    function updateOneTap(mydict) {
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

            fetch(CPLUGIN_URL + '/tap', requestOptions)
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
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'Edit Tap : ' + props.mydata.sdata.location + ' -> ' + props.mydata.sdata.dcp}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{}} id="alert-dialog-description">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                '& > :not(style)': { m: 1, flexBasis: '50%' }
                            }}
                        >
                            <TextField
                                required
                                label="Tap count"
                                defaultValue={props.mydata.sdata.tapCount}
                                type="number"
                                inputRef={statusRef}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Select In Date/Time"
                                    value={selectedIDate}
                                    onChange={handleIDateChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{
                                                width: '92%'
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="success"
                        sx={{
                            backgroundColor: 'green',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '15px'
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        ccolor="error"
                        sx={{
                            backgroundColor: 'red',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '15px'
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}