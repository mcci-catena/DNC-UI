import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Swal from 'sweetalert2';
import { constobj } from '../../../misc/constants';

export default function ConfigApi() {
    const { DNC_URL } = { ...constobj };

    const [apiUrl, setApiUrl] = React.useState('');
    const [apiKey, setApiKey] = React.useState('');
    const [apiSf, setApiSf] = React.useState('');
    const [apiPf, setApiPf] = React.useState('');

    const handleSaveClick = () => {
        let adata = {
            aurl: document.getElementById('apiurl').value,
            akey: document.getElementById('apikey').value,
            apisf: document.getElementById('apiusf').value,
            nwidpf: document.getElementById('nwidpf').value
        };

        updateApic({ adata: adata });
        props.mydata.hcb();
        setOpen(false);
    };

    async function updateApic(mydict) {
        try {
            let sresp = await updateApiData(mydict);

            Swal.fire({
                title: 'API Config Updated',
                text: 'API Config Updated successfully',
                icon: 'success'
            });
        } catch (err) {
            Swal.fire({
                text: err.message
            });
        }
    }

    function updateApiData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');

            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);

            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/apic');

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

    function getApiData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/apic');

            let resdict = {};

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resdict['aurl'] = data[0].aurl;
                    resdict['akey'] = data[0].akey;
                    resdict['apisf'] = data[0].apisf;
                    resdict['nwidpf'] = data[0].nwidpf;
                    resolve(resdict);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function getApiConfig() {
        const myapi = await getApiData();

        setApiUrl(myapi.aurl);
        setApiKey(myapi.akey);
        setApiSf(myapi.apisf);
        setApiPf(myapi.nwidpf);
    }

    useEffect(() => {
        getApiConfig();
    }, []);

    return (
        <Box display="flex" marginLeft="-10%" flexDirection="column" alignItems="center" justifyContent="center" height="50%">
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '30ch' },
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '10px'
                }}
                noValidate
                autoComplete="off"
            >
                <TextField required id="apiurl" label="Api Url" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />

                <TextField id="apikey" label="Api Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                <TextField
                    id="apiusf"
                    label="Api URL Suffix"
                    helperText={
                        <Typography variant="body5" noWrap style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            (optional, Default value '/down/replace')
                        </Typography>
                    }
                    style={{ flex: 1, marginRight: '10px' }}
                    defaultValue=""
                    value={apiSf}
                    onChange={(e) => setApiSf(e.target.value)}
                />
                <TextField
                    id="nwidpf"
                    label="Network ID Prefix"
                    defaultValue=""
                    value={apiPf}
                    onChange={(e) => setApiPf(e.target.value)}
                    helperText={
                        <Typography variant="body5" noWrap style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            (optional, Default value is "eui -")
                        </Typography>
                    }
                    style={{ flex: 1, marginRight: '10px' }}
                />

                <div>
                    <Box sx={{ '& button': { m: 0 } }}>
                        <Stack style={{ marginLeft: '35%' }} direction="row" spacing={1}>
                            <Button variant="contained" color="success" onClick={handleSaveClick}>
                                Save
                            </Button>
                        </Stack>
                    </Box>
                </div>
            </Box>
        </Box>
    );
}
