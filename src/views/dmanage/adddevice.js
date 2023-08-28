import React, { useState } from 'react';
import { Button, Collapse, IconButton, Paper } from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddSsuInfo from './addssuinfo';
import AddHwInfo from './addhwinfo';
import ConfigDevice from './configdevice';
import TextField from '@mui/material/TextField';
import { constobj } from './../../misc/constants';

function AddDevice() {
    const { DNC_URL } = { ...constobj };

    const [hwExpanded, setHwExpanded] = useState(false);
    const [cfExpanded, setCfExpanded] = useState(false);
    const [selDate, setSelDate] = useState(new Date()); // State for DateTimePicker

    // Ssu Info
    const [ssuId, setSsuId] = useState('');
    const [ssuBatch, setSsuBatch] = useState('');
    const [ssuType, setSsuType] = useState('');
    const [ssuVer, setSsuVer] = useState('');
    const [ssuStatus1, setSsuStatus1] = useState('');
    const [ssuOrg, setSsuOrg] = useState('');
    const [ssuLoc, setSsuLoc] = useState('');
    const [ssuRemarks, setSsuRemarks] = useState('');

    //hwinfo
    const [hwsl, setHwSl] = useState('');
    const [boardRev, setBoardRev] = useState('');
    const [fwVer, setFwVer] = useState('');
    const [tech, setTech] = useState('');
    const [network, setNetwork] = useState('');
    const [region, setRegion] = useState('');
    const [hwRemarks, setHwRemarks] = useState('');

    //data source
    const [dsid, setDsid] = useState('');
    const [dtype, setDtype] = useState('');
    const [devid, setDevid] = useState('');

    const [ssuBoardRever, setSsuBoardRver] = useState('');
    const [ssuFirWareVersion, setSsuFirmWareVersion] = useState('');
    const [hwData, setHwData] = useState({});
    const [configData, setConfigData] = useState({});

    let myuser = sessionStorage.getItem('myUser');
    let myuobj = JSON.parse(myuser);

    let dnhold = 'Device';
    if (myuobj.ccode == 'WR') {
        dnhold = 'SSU';
    }

    const handleHwToggle = () => {
        setHwExpanded(!hwExpanded);
    };
    const handlecfToggle = () => {
        setCfExpanded(!cfExpanded);
    };
    const handleDateChange = (date) => {
        setSelDate(date);
    };

    const handleAddClick = () => {
        // Handle the logic for adding the device with selected date
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

        let hdata = {
            hwsl: hwsl,
            boardrev: boardRev,
            fwver: fwVer,
            tech: tech,
            network: network,
            region: region,
            remarks: hwRemarks,
            adate: selDate
        };

        let sdata = {
            hwsl: hwsl,
            dsid: dsid,
            nwIdV: devid,
            nwIdK: dtype
        };

        ssdata.ssuid = hdata.hwsl;

        console.log('HW Data to Add:', sdata);

        addSsu({ ssdata: ssdata, hdata: hdata, sdata: sdata });
    };

    async function addSsu(mydict) {
        try {
            let sresp = await addSsuData(mydict);

            Swal.fire({
                title: 'Stock Added',
                text: 'Stock added successfully',
                icon: 'success'
            });
        } catch (err) {
            Swal.fire({
                text: err.message
            });
        }
    }

    function addSsuData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');

            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);

            // let mydict = {};
            // mydict['sdata'] = datadict;

            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'POST',
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

    return (
        <div>
            <div style={{ padding: '16px', maxWidth: '1000px', marginBottom: '16px' }}>
                <span>{`${dnhold} Details`}</span>
                <AddSsuInfo
                    ssu={{
                        ver: setSsuVer,
                        id: setSsuId,
                        type: setSsuType,
                        batch: setSsuBatch,
                        status1: setSsuStatus1,
                        org: setSsuOrg,
                        loc: setSsuLoc,
                        remarks: setSsuRemarks
                    }}
                />
            </div>
            <Paper elevation={0}>
                <IconButton onClick={handleHwToggle}>{hwExpanded ? <RemoveIcon /> : <AddIcon />}</IconButton>
                <span>Hardware Details</span>
                <Collapse in={hwExpanded}>
                    <AddHwInfo
                        hw={{
                            hwsl: setHwSl,
                            brev: setBoardRev,
                            fwver: setFwVer,
                            tech: setTech,
                            netw: setNetwork,
                            region: setRegion,
                            remarks: setHwRemarks
                        }}
                    />
                </Collapse>
            </Paper>
            <Paper elevation={0}>
                <IconButton onClick={handlecfToggle}>{cfExpanded ? <RemoveIcon /> : <AddIcon />}</IconButton>
                <span>Config Details</span>
                <Collapse in={cfExpanded}>
                    <ConfigDevice ds={{ sid: setDsid, dtype: setDtype, devid: setDevid }} /> {/* Pass the onDataChange prop */}
                </Collapse>
            </Paper>
            <Paper style={{ marginTop: '5%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        label="Select In Date/Time"
                        value={selDate}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                style={{
                                    width: '30%', // Adjust the width as needed
                                    marginLeft: '16px' // Add some spacing between DateTimePicker and Button
                                }}
                            />
                        )}
                    />
                </LocalizationProvider>
                <Button style={{ marginLeft: '2%', marginTop: '0.5%' }} variant="contained" color="primary" onClick={handleAddClick}>
                    Add
                </Button>
            </Paper>
        </div>
    );
}

export default AddDevice;
