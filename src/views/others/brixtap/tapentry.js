import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import moment from 'moment';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2';
import { constobj } from './../../../misc/constants';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

export default function TapEntry(props) {
    const { DNC_URL, CPLUGIN_URL } = { ...constobj };

    const locations = [
        { id: 1, label: 'Arnot', value: 'Arnot' },
        { id: 2, label: 'Uihlein', value: 'Uihlein' },
        { id: 3, label: 'UVM', value: 'UVM' }
    ];

    const [location, setLocation] = useState('Arnot');
    const [dcpoints, setDcpoints] = useState([]);
    const [treeCount, setTreeCount] = useState();
    const [tapDate, setTapDate] = useState(moment().format('YYYY-MM-DD'));
    const [selSpot, setSelSpot] = useState('');
    const [selectedToDateTime, setSelectedToDateTime] = useState(new Date());

    useEffect(() => {
        getSpots(); // V1 it was getDcp (Get Data Collection point)
    }, []);

    // All Flow sensors are mapped under the Collie-Flow Organization
    async function getSpots() {
        let mydev = await getDeviceList('Collie-Flow', location);
        setDcpoints(mydev);
    }

    function getDeviceList(gclient, gloc) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            fetch(DNC_URL + '/spot/' + gclient, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Spot Data: ', data);
                    let cdev = data.filter(function (row) {
                        // return row.Location == gloc && row.rdate == null
                        return row.location == gloc;
                    });
                    console.log('Filtered Devices: ', cdev);
                    resolve(cdev);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function locationChange(e) {
        let selloc = e.target.value;
        setLocation(e.target.value);
        let mydev = await getDeviceList('Collie-Flow', selloc);
        setDcpoints(mydev);
    }

    function spotChange(e) {
        setSelSpot(e.target.value);
    }

    function setTapCount(inpDict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(inpDict)
            };
            fetch(CPLUGIN_URL + '/tap', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Update Resp: ', data);
                    if (data.hasOwnProperty('message')) {
                        reject(data.message);
                    }
                    resolve('Tap (Tree) Count update success');
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function showAlert(msg, mtype) {
        // setMsgtype(mtype)
        // setMyalertMsg(msg)
        // setMyalert(true)
        // setTimeout(()=>{setMyalert(false)}, 3000);
        Swal.fire({
            icon: mtype,
            title: mtype === 'success' ? 'Success' : 'Error',
            text: msg
        });
    }

    async function onChangeTree(e) {
        const tval = e.target.value;
        setTreeCount(tval);
    }

    const onDateChange = (value) => {
        var date = new Date(value);
        let mnth = ('0' + (date.getMonth() + 1)).slice(-2);
        let day = ('0' + date.getDate()).slice(-2);
        let hours = ('0' + date.getHours()).slice(-2);
        let minutes = ('0' + date.getMinutes()).slice(-2);
        let seconds = ('0' + date.getSeconds()).slice(-2);
        let year = date.getFullYear();
        // let fvalue =  `${year}-${mnth}-${day},${hours}:${minutes}:${seconds}`
        let fvalue = `${mnth}-${day}-${year}`;
        setTapDate(fvalue);
    };

    async function onSubmitCount(e) {
        let loctext = null;
        let dcptext = null;
        try {
            let tapDict = { location: location, dcp: selSpot, tcount: treeCount, tapCount: treeCount, edate: tapDate };
            try {
                let strresp = await setTapCount(tapDict);

                showAlert(strresp, 'success');
            } catch (error) {
                console.log(error);
                showAlert(error, 'error');
            }
        } catch (error) {
            console.log(error);
            showAlert(error, 'error');
        }
    }

    return (
        <Box
            sx={{
                width: '25%', // Make the component responsive
                maxWidth: '500px', // Limit the maximum width to 500px
                margin: '0 auto', // Center align the component
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px', // Add some padding to the component
                borderRadius: '10px' // Rounded corners
            }}
        >
            <FormControl fullWidth sx={{ marginBottom: '12%', color: 'black' }}>
                <InputLabel
                    id="category-label"
                    sx={{
                        color: 'black' // Set the label text color to white
                    }}
                >
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
            <FormControl fullWidth sx={{ marginBottom: '12%', color: 'black' }}>
                <InputLabel
                    id="category-label"
                    sx={{
                        color: 'black' // Set the label text color to white
                    }}
                >
                    Select Data Point (DCP)
                </InputLabel>
                <Select name="dcpoint" id="dcpoint" onChange={spotChange}>
                    {dcpoints.map((msgLoc) => (
                        <MenuItem key={msgLoc.sid} value={msgLoc.sname}>
                            {msgLoc.sname}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                fullWidth
                label="New Tree(Tap) Count"
                type="number"
                id="treePoint"
                value={treeCount}
                onChange={onChangeTree}
                InputLabelProps={{
                    style: {
                        color: 'black' // Change the label text color to white
                    }
                }}
                sx={{ marginBottom: '12%', color: 'blue' }} // Input text color remains blue
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    label="Date/Time Of Action"
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
                onClick={onSubmitCount} // Call handleSave when the button is clicked
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
