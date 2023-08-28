import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, FormControl } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';

import { constobj } from './../../../misc/constants';

export default function BrixEntry(props) {
    const { CPLUGIN_URL } = { ...constobj };

    const locations = [
        { id: 1, label: 'Arnot', value: 'Arnot' },
        { id: 2, label: 'Uihlein', value: 'Uihlein' },
        { id: 3, label: 'UVM', value: 'UVM' }
    ];

    const [brixdate, setBrixDate] = useState('YYYY-MM-DD,HH:mm:ss');
    const [location, setLocation] = useState('Arnot');
    const [brixVal, setBrixVal] = useState(0);
    const [selectedToDateTime, setSelectedToDateTime] = useState(new Date());

    async function locationChange(e) {
        const selloc = e.target.value;
        setLocation(selloc); // Update the location state with the selected value
    }

    const onDateChange = (value) => {
        var date = new Date(value);
        let mnth = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let hours = ('0' + date.getHours()).slice(-2);
        let minutes = ('0' + date.getMinutes()).slice(-2);
        let seconds = ('0' + date.getSeconds()).slice(-2);
        let year = date.getFullYear();
        let fvalue = `${year}-${mnth}-${day},${hours}:${minutes}:${seconds}`;
        setBrixDate(fvalue);
    };

    async function onSubmitBrix(e) {
        let brixdttime = null;
        try {
            let isodt = new Date(brixdate).toISOString();
            let mydate = isodt.split('T')[0].split('-');
            let mytime = isodt.split('T')[1].split('.')[0];
            brixdttime = mydate[1] + '-' + mydate[2] + '-' + mydate[0] + ',' + mytime;
        } catch {}
        try {
            const myresp = await pushBrixData(brixdttime);
            showAlert(myresp, 'success'); // Show success alert
        } catch (error) {
            showAlert(error, 'error'); // Show error alert
        }
    }

    function showAlert(msg, mtype) {
        Swal.fire({
            icon: mtype,
            title: mtype === 'success' ? 'Success' : 'Error',
            text: msg
        });
    }

    function pushBrixData(brixdttime) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            const mybody = {};
            mybody[location] = brixVal;
            mybody['rdate'] = brixdttime;
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mybody)
            };
            fetch(CPLUGIN_URL + '/brix', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.hasOwnProperty('message')) {
                        if (data.message.includes('updated successfully')) {
                            resolve(data.message);
                        } else {
                            reject(data.message);
                        }
                    }
                    reject('Brix data update failed');
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function onChangeBrix(e) {
        const tval = e.target.value;
        setBrixVal(tval);
    }

    return (
        <Box
            sx={{
                width: '25%',
                maxWidth: '500px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                // background: 'linear-gradient(135deg, #d4a7b1 0%, #a25683 100%)',
                background: 'white',
                padding: '20px',
                borderRadius: '10px'
                // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
            }}
        >
            <FormControl fullWidth sx={{ marginBottom: '10%' }}>
                <InputLabel id="status-label" sx={{ color: 'black' }}>
                    Select Location
                </InputLabel>
                <Select label="demo-simple-select-label" name="location" id="location" onChange={locationChange}>
                    {locations.map((msgLoc) => (
                        <MenuItem key={msgLoc.id} value={msgLoc.value}>
                            {msgLoc.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                fullWidth
                label="New Brix Value"
                type="number"
                id="brixbox"
                value={brixVal}
                onChange={onChangeBrix}
                InputLabelProps={{ style: { color: 'black' } }} // Set the label text color to black
                sx={{ marginBottom: '12%', '& .MuiOutlinedInput-root': { color: 'black' } }} // Set the text field color to black
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label="Date/Time Of Action"
                    // value={selectedDateTime}
                    showSeconds
                    value={selectedToDateTime}
                    onChange={(newValue) => {
                        setSelectedToDateTime(newValue);
                        onDateChange(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} InputLabelProps={{ style: { color: 'black' } }} />}
                    fullWidth
                    sx={{ marginBottom: '12px', '& .MuiOutlinedInput-root': { color: 'black' } }}
                />
            </LocalizationProvider>
            <Button
                variant="contained"
                color="success"
                onClick={onSubmitBrix}
                sx={{
                    backgroundColor: 'green',
                    color: 'white', // Set the text color for the button
                    fontWeight: 'bold',
                    fontSize: '15px',
                    mt: 2
                }}
            >
                Save
            </Button>
        </Box>
    );
}
