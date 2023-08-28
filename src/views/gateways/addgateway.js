import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './../../App.css';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { constobj } from './../../misc/constants';
import Grid from '@mui/material/Grid'; // Add this line for the Grid component

const remarkoptions = ['Hw Change', 'Location Change', 'Org Change', 'New Deployment'];
const statusoptions = ['Active-UP', 'Active-DN', 'Active-NiU', 'Moved', 'Not-Active'];

const modeloptions = ['MultiTech', 'Heltec', 'Sigfox'];

const locoptions = ['WeRadiate', 'MCCI', 'Tresca'];

const technology = [
    { value: 'Sigfox', label: 'Sigfox' },
    { value: 'LoRaWAN', label: 'LoRaWAN' }
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

function AddGateway(props) {
    const { DNC_URL } = { ...constobj };

    const [myorgs, setMyorgs] = useState([]);
    const [selOrg, setSelOrg] = useState('');
    const [myorglocs, setMyorglocs] = useState([]);

    const [selLoc, setSelLoc] = useState('');
    const [selRemarks, setSelRemarks] = useState('');
    const [selStatus, setSelStatus] = useState('');

    const [orgdict, setOrgdict] = React.useState({});
    const [selModel, setSelModel] = useState(''); // Set an initial valid value or empty string
    const [selTech, setSelTech] = useState(''); // Set an initial valid value or empty string
    const [selNw, setSelNw] = useState(''); // Set an initial valid value or empty string
    const [selInsDate, setSelInsDate] = useState(null); // You can keep this as null if it's valid for your use case

    const [formData, setFormData] = useState({
        gatewayName: '',
        location: '',
        technology: '',
        network: '',
        lastUpdateOn: null
    });

    let myorg = sessionStorage.getItem('myOrg');

    let myuser = sessionStorage.getItem('myUser');
    let myuobj = JSON.parse(myuser);

    let dnhold = 'Device';
    if (myuobj.ccode == 'WR') {
        dnhold = 'SSU';
    }

    const handleSaveClick = () => {
        console.log('Save Clicked!!!');
        addNewGateway();
    };

    const handleRefOrg = () => {
        getOrgInfo();
    };

    // async function orgChange(e) {
    //     setSelOrg(e.target.value);
    //     setSelOrgId(orgdict[e.target.value]);
    // }

    async function changeModel(e) {
        setSelModel(e.target.value);
    }

    async function changeTech(e) {
        setSelTech(e.target.value);
    }

    async function changeNw(e) {
        setSelNw(e.target.value);
    }

    const changeInsDate = (newDate) => {
        setSelInsDate(newDate);
        console.log('Selected Date:', newDate);
    };

    const orgChange = async (e, nv) => {
        setSelOrg(nv);
        // const myspot = await getSpotData(nv);
        // setMyorglocs(myspot);
    };

    const locChange = async (e, nv) => {
        setSelLoc(nv);
    };

    const modelChange = async (e, nv) => {
        setSelModel(nv);
    };

    const remChange = async (e, nv) => {
        setSelRemarks(nv);
    };

    const statusChange = async (e, nv) => {
        setSelStatus(nv);
    };

    async function addNewGateway() {
        let mydict = {};
        mydict['name'] = document.getElementById('gwname').value;
        mydict['hwid'] = document.getElementById('gwhwid').value;
        mydict['simmk'] = document.getElementById('simcard').value;
        mydict['ssusc'] = document.getElementById('ssusc').value;

        mydict['tech'] = selTech || '';
        mydict['network'] = selNw || '';
        mydict['adate'] = selInsDate;
        mydict['model'] = selModel;
        mydict['status'] = selStatus;
        mydict['orgid'] = selOrg;
        mydict['location'] = selLoc;

        mydict['remarks'] = selRemarks;

        try {
            let sresp = await addGwData(mydict);
            Swal.fire(sresp.message);
            props.agdata.cbf(0);
        } catch (error) {
            Swal.fire(error);
        }
    }

    function addGwData(datadict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');

            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(datadict)
            };
            var url = new URL(DNC_URL + '/gwunit');

            fetch(url, requestOptions)
                .then(async (response) => {
                    if (response.status == '400') {
                        let resp = await response.json();
                        reject(resp.message);
                    } else {
                        console.log('Response Code: ', response.status);
                        //return response.json()
                        let data = await response.json();
                        resolve(data);
                    }
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
        // console.log('MySpot SSU: ', myspot);
        // setMyorglocs(myspot);
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

    useEffect(() => {
        let myorg = sessionStorage.getItem('myOrg');
        getSpotInfo(myorg);
    }, []);

    return (
        <div>
            <Box
                component="form"
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    '& .MuiTextField-root': { width: '100%' }
                }}
                noValidate
                autoComplete="off"
            >
                <div>
                    <TextField id="gwname" label="Gateway Name" defaultValue="" />
                </div>
                <div>
                    <TextField id="gwhwid" label="Hardware ID" defaultValue="" />
                </div>
                <div>
                    <TextField id="simcard" label="SIM card make" defaultValue="" />
                </div>
                <div>
                    <Autocomplete
                        freeSolo
                        options={myorgs}
                        defaultValue=""
                        value={selOrg}
                        onChange={orgChange}
                        renderInput={(params) => <TextField {...params} label="Client/Org" onChange={(e) => setSelOrg(e.target.value)} />}
                    />
                </div>
                <div>
                    <Autocomplete
                        freeSolo
                        options={locoptions}
                        onChange={locChange}
                        renderInput={(params) => <TextField {...params} label="Location" onChange={(e) => setSelLoc(e.target.value)} />}
                    />
                </div>
                <div>
                    <TextField id="ssusc" label={`${dnhold}s connected`} type="number" />
                </div>
                <div>
                    <Autocomplete
                        freeSolo
                        options={modeloptions}
                        onChange={modelChange}
                        renderInput={(params) => <TextField {...params} label="Model" onChange={(e) => setSelModel(e.target.value)} />}
                    />
                </div>
                <div>
                    <TextField id="gwtech" select label="Technology" helperText=" " value={selTech} onChange={changeTech}>
                        {technology.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                <div>
                    <TextField id="gwnw" select label="Network" helperText=" " value={selNw} onChange={changeNw}>
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
                </div>
                <div>
                    <Autocomplete
                        freeSolo
                        options={statusoptions}
                        onChange={statusChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Status"
                                onChange={(e) => {
                                    setSelStatus(e.target.value); // Make sure props.ssu.status is defined and working
                                }}
                                style={{ minWidth: '193px' }}
                            />
                        )}
                    />
                </div>
                <div>
                    <Autocomplete
                        freeSolo
                        options={remarkoptions}
                        onChange={remChange}
                        renderInput={(params) => <TextField {...params} label="Remarks" onChange={(e) => setSelRemarks(e.target.value)} />}
                    />
                </div>
                <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            label="Date"
                            value={selInsDate}
                            onChange={changeInsDate}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </div>
                <div>
                    <Button
                        style={{ marginTop: '1.8%' }}
                        onClick={handleSaveClick}
                        type="button"
                        variant="contained"
                        className="btn btn-primary"
                    >
                        Save
                    </Button>
                </div>
            </Box>
        </div>
    );
}

export default AddGateway;
