import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';

import { constobj } from './../../misc/constants';

export default function InviteUser() {
    const { DNC_URL } = { ...constobj };
    const [uemail, setUemail] = useState('');
    const [role, setRole] = React.useState('');

    const onChangeEmail = (event) => {
        const value = event.target.value;
        setUemail(value);
    };
    const handleChange = (event) => {
        setRole(event.target.value);
        console.log('Set Role: ', event.target.value);
    };

    const handleInviteLink = async () => {
        console.log('On Click Send Invite: ', uemail);
        try {
            const myresp = await sendInviteLink(uemail); // Make sure you pass the correct value
            Swal.fire(myresp);
        } catch (error) {
            Swal.fire(error);
        }
    };

    // Request for sending signup link to the given email ID
    function sendInviteLink(userEmail) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var udata = JSON.stringify({ fcode: 'nusu', email: userEmail, role: role });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: udata
            };
            var url = new URL(DNC_URL + '/slink');

            let myulist = [];

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

    return (
        <div>
            <div style={{ display: 'flex', gap: '1%' }}>
                <TextField style={{ width: '30%' }} label="Email" id="linkmail" size="small" value={uemail} onChange={onChangeEmail} />
                <FormControl sx={{ m: 0, minWidth: '20%' }} size="small">
                    <InputLabel id="demo-select-small-label">Roles</InputLabel>
                    <Select labelId="demo-select-small-label" id="demo-select-small" value={role} label="role" onChange={handleChange}>
                        <MenuItem value=""></MenuItem>
                        <MenuItem value={4}>App-Admin</MenuItem>
                        <MenuItem value={3}>App-User</MenuItem>
                        <MenuItem value={2}>Org-Admin</MenuItem>
                        <MenuItem value={1}>Org-User</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <Box sx={{ '& button': { m: 0 } }}>
                <Stack style={{ marginLeft: '18px', marginTop: '20px' }} direction="row" spacing={1}>
                    <Button variant="contained" color="info" onClick={handleInviteLink}>
                        Send Signup Link
                    </Button>
                </Stack>
            </Box>
        </div>
    );
}
