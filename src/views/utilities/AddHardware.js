import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './../../App.css';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import Stack from '@mui/material/Stack';

const org = [
    {
        value: 'SigFox',
        label: 'SigFox'
    },

    {
        value: 'LoraWAN',
        label: 'LoraWAN'
    }
];

const network = [
    {
        value: 'TTN',
        label: 'TTN'
    },
    {
        value: 'SigFox',
        label: 'SigFox'
    },

    {
        value: 'LoraWAN',
        label: 'LoraWAN'
    },
    {
        value: 'Actility',
        label: 'Actility'
    }
];
const band = [
    {
        value: 'US',
        label: 'US'
    },
    {
        value: 'AU',
        label: 'AU'
    }
];
const action = [
    {
        value: 'Added',
        label: 'Added'
    },
    {
        value: 'Removed',
        label: 'Removed'
    }
];

const reason = [
    {
        value: 'New deployment',
        label: 'New deployment'
    },
    {
        value: 'Tech Change',
        label: 'Tech Change'
    },
    {
        value: 'Network Change',
        label: 'Network Change'
    }
];

function Addnewuser(props) {
    const [value, setValue] = React.useState(null);
    const [value1, setValue1] = React.useState(null);

    return (
        <div>
            <MainCard title="ADD HARDWARE ">
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 2, width: '25ch' }
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div>
                        <TextField label="Hardware Id" id="outlined-basic" size="small" />
                        <TextField label="Board Rev" id="outlined-basic" size="small" />
                        <TextField label="FwVer" id="outlined-basic" size="small" />

                        {/* DATEPICKER */}
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="FwUpdatedOn"
                                value={value}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                        {/* DATEPICKER ends */}

                        <TextField style={{ marginTop: ' 1px ' }} id="outlined-select-Main Org" select label=" Technology" helperText=" ">
                            {org.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField style={{ marginTop: ' -2px ' }} id="outlined-select-Main Org" select label=" Network" helperText=" ">
                            {network.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField style={{ marginTop: ' -3px ' }} id="outlined-select-Main Org" select label=" Band/Region" helperText=" ">
                            {band.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        <div className="fields">
                            <TextField style={{ marginTop: ' 1px ' }} id="outlined-select-Main Org" select label=" Action" helperText=" ">
                                {action.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField style={{ marginTop: ' 1px ' }} id="outlined-select-Main Org" select label=" Reason" helperText=" ">
                                {reason.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>

                            {/* DATEPICKER */}

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    {...props}
                                    label="Date Of Action"
                                    value={value1}
                                    onChange={(newValue) => {
                                        setValue1(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{
                                                // Add your desired styles here
                                                width: '200px',
                                                fontSize: '16px',
                                                marginTop: '1px'
                                                // ... more styles
                                            }}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </div>

                        <Stack style={{ marginLeft: '18px' }} direction="row" spacing={1}>
                            <Button variant="contained" color="success">
                                Save
                            </Button>
                            <Button variant="contained" color="success">
                                Cancel
                            </Button>
                        </Stack>
                    </div>
                </Box>
            </MainCard>
        </div>
    );
}

export default Addnewuser;
