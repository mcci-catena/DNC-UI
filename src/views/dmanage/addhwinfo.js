import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './../../App.css';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { constobj } from './../../misc/constants';
import Autocomplete from '@mui/material/Autocomplete';
const technology = [
    { id: 1, value: 'Sigfox', label: 'Sigfox' },
    { id: 2, value: 'LoRaWAN', label: 'LoRaWAN' }
];
const remarkSuggestions = ['Hw Change', 'Location Change', 'Org Change', 'New Deployment'];

const network = {
    Sigfox: [{ value: 'Sigfox', label: 'Sigfox' }],
    LoRaWAN: [
        { value: 'TTN', label: 'TTN' },
        { value: 'Helium', label: 'Helium' },
        { value: 'machineQ', label: 'machineQ' },
        { value: 'Senet', label: 'Senet' },
        { value: 'Senra', label: 'Senra' },
        { value: 'Swisscom', label: 'Swisscom' },
        { value: 'Chirpstack', label: 'Chirpstack' },
        { value: 'Generic', label: 'Generic' },
        { value: 'Actility', label: 'Actility' }
    ]
};

const bandRegion = [
    { value: 'IN', label: 'IN' },
    { value: 'AU', label: 'AU' },
    { value: 'EU', label: 'EU' },
    { value: 'JP', label: 'JP' },
    { value: 'KR', label: 'KR' },
    { value: 'AS', label: 'AS' },
    { value: 'US', label: 'US' }
];

const action = [
    { value: 'New deployment', label: 'New deployment' },
    { value: 'Firmware Update', label: 'Firmware Update' },
    { value: 'Tech Change', label: 'Tech Change' },
    { value: 'HW Failure', label: 'HW Failure' },
    { value: 'HW Repair', label: 'HW Repair' }
];

function AddHwInfo(props) {
    const { DNC_URL } = { ...constobj };

    const [selTech, setSelTech] = useState('');
    const [selNw, setSelNw] = useState('');
    const [selRegion, setSelRegion] = useState('');
    const [selAction, setSelAction] = useState('');

    const [nwList, setNwList] = useState([]);

    const [doa, setDoA] = React.useState(null);

    const handleSaveClick = () => {
        addStock();
        props.onAddSsuInfoData(mydict); // Call the callback function with data
        props.mydata.cbf(1);
    };

    async function techChange(e) {
        props.hw.tech(e.target.value);
        setSelTech(e.target.value);
        setNwList(network[e.target.value]);
    }

    async function nwChange(e) {
        props.hw.netw(e.target.value);
        setSelNw(e.target.value);
    }

    async function regionChange(e) {
        props.hw.region(e.target.value);
    }

    const remChange = async (e, nv) => {
        props.hw.remarks(nv);
    };

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 3, width: '30ch' }
            }}
            noValidate
            autoComplete="off"
        >
            <div>
                <TextField onChange={(e) => props.hw.hwsl(e.target.value)} id="hwId" label="Hardware Id" />
                <TextField onChange={(e) => props.hw.brev(e.target.value)} id="boardRev" label="Board Revision" />
                <TextField onChange={(e) => props.hw.fwver(e.target.value)} id="fwVer" label="Firmware Version" />
            </div>
            <div>
                <TextField
                    style={{ marginTop: ' 1px ' }}
                    id="technology"
                    select
                    label=" Technology"
                    helperText=" "
                    defaultValue=""
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
                    defaultValue=""
                    onChange={nwChange}
                >
                    {nwList.length > 0 &&
                        nwList.map((option) => (
                            <MenuItem key={option.id} value={option.label}>
                                {option.label}
                            </MenuItem>
                        ))}
                </TextField>

                <TextField
                    style={{ marginTop: ' -3px ' }}
                    id="bandRegion"
                    select
                    label=" Band/Region"
                    defaultValue=""
                    helperText=" "
                    onChange={regionChange}
                >
                    {bandRegion.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
            <Autocomplete
                freeSolo
                options={remarkSuggestions}
                onChange={remChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Remarks"
                        onChange={(e) => props.hw.remarks(e.target.value)}
                        style={{ minWidth: '193px', marginTop: '-2%' }}
                    />
                )}
            />
        </Box>
    );
}

export default AddHwInfo;
