import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import { constobj } from '../../../misc/constants';

export default function Co2calibration() {
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
                    '& .MuiTextField-root': { m: 1, width: '50ch' },
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '10px'
                }}
                noValidate
                autoComplete="off"
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <h6 style={{ marginRight: '10px', verticalAlign: 'middle' }}>Co2 calibration</h6>
                    <TextField
                        id="co2input"
                        label="Enter Data"
                        type="number"
                        variant="standard"
                        style={{ verticalAlign: 'middle', marginTop: '-10px' }}
                    />
                    <h6 style={{ marginLeft: '10px', verticalAlign: 'middle' }}>ppm</h6>
                </div>
            </Box>
        </Box>
    );
}
