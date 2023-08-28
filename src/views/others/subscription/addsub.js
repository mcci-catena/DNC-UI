import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { constobj } from './../../../misc/constants';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

const splans = [
    { id: 1, value: 'Free', label: 'Free' },
    { id: 2, value: 'Pro Cloud', label: 'Pro Cloud' }
];

export default function AddSub() {
    const { DNC_URL } = { ...constobj };

    const [orglist, setOrglist] = React.useState([]);
    const [orgdict, setOrgdict] = React.useState({});
    const [selOrg, setSelOrg] = useState('');
    const [selOrgId, setSelOrgId] = useState(null);

    const [selPlan, setSelPlan] = useState('');

    const [selSdate, setSelSdate] = useState(null);
    const [selEdate, setSelEdate] = useState(null);

    const orgChange = (e) => {
        setSelOrg(e.target.value);
        setSelOrgId(orgdict[e.target.value]);
    };

    const planChange = (event) => {
        setSelPlan(event.target.value);
    };

    const sdateChange = (newDate) => {
        setSelSdate(newDate);
    };

    const edateChange = (newDate) => {
        setSelEdate(newDate);
    };

    const handleAddSubs = async () => {
        // console.log("Send Sub Info: ", selOrgId, selOrg, selPlan, selSdate, selEdate);
        const mydict = { orgid: selOrgId, splan: selPlan, sdate: selSdate, edate: selEdate };
        try {
            const myresp = await sendNewSubs(mydict);
            Swal.fire(myresp);
        } catch (error) {
            Swal.fire(error);
        }
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

    function sendNewSubs(mydict) {
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
            var url = new URL(DNC_URL + '/subs');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    useEffect(() => {
        getOrgInfo();
    }, []);

    return (
        <Box
            sx={{
                width: '25%',
                maxWidth: '500px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'white',
                padding: '20px',
                borderRadius: '10px'
            }}
        >
            <FormControl sx={{ minWidth: '20%', marginBottom: '10px', width: '110%' }}>
                <TextField id="selectOrg" select label="Select Org" value={selOrg} onChange={orgChange}>
                    {orglist.length > 0 &&
                        orglist.map((option) => (
                            <MenuItem key={option.id} value={option.label}>
                                {option.label}
                            </MenuItem>
                        ))}
                </TextField>
            </FormControl>
            <FormControl sx={{ minWidth: '20%', marginBottom: '10px', width: '110%' }}>
                <TextField id="selectPlan" select label="Select Plan" value={selPlan} onChange={planChange}>
                    {splans.map((option) => (
                        <MenuItem key={option.id} value={option.label}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </FormControl>
            <Box sx={{ marginTop: '10px', marginBottom: '10px', width: '110%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="Start Date/Time"
                        value={selSdate}
                        onChange={sdateChange}
                        sx={{ marginTop: '10px', marginBottom: '20px', width: ['100%', '50%', '30%'] }}
                    />
                </LocalizationProvider>
            </Box>
            <Box sx={{ marginTop: '10px', marginBottom: '20px', width: '110%' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="End Date/Time"
                        value={selEdate}
                        onChange={edateChange}
                        sx={{ width: '100%' }}
                    />
                </LocalizationProvider>
            </Box>
            <Button variant="contained" color="info" onClick={handleAddSubs} sx={{ width: '15%' }}>
                Add
            </Button>
        </Box>
    );
}
