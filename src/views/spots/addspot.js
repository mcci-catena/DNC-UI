import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Swal from 'sweetalert2';

import { constobj } from './../../misc/constants';

export default function AddSpot(props) {
    const { DNC_URL } = { ...constobj };
    const [tdata, setTdata] = useState([]);
    const [spotName, setSpotName] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [status, setStatus] = useState('');
    const [dynamicFields, setDynamicFields] = useState({});
    const [tagval, setTagval] = useState({});

    useEffect(() => {
        props.asdata.cbftitle('Spots -> AddSpot');

        let myorg = sessionStorage.getItem('myOrg');
        getTaginfo(myorg);

        const interval = setInterval(() => {
            let norg = sessionStorage.getItem('myOrg');
            if (norg != myorg) {
                myorg = norg;
                getTaginfo(myorg);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    async function getTaginfo(myorg) {
        const mytag = await getTagData(myorg);
        let mytags = mytag;
        setTdata(mytags);

        const myvals = await getTagValues(myorg, mytag);
        setTagval(myvals);
    }

    function getTagData(myorg) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/orgtags/' + myorg);

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

    function getTagValues(myorg, mytag) {
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

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    let tagvdict = {};
                    let lctags = [];
                    for (let i = 0; i < mytag.length; i++) {
                        tagvdict[mytag[i]] = [];
                        lctags.push(mytag[i].toLowerCase());
                    }
                    for (let i = 0; i < data.length; i++) {
                        for (let j = 0; j < mytag.length; j++) {
                            if (!tagvdict[mytag[j]].includes(data[i][lctags[j]])) {
                                tagvdict[mytag[j]].push(data[i][lctags[j]]);
                            }
                        }
                    }
                    resolve(tagvdict);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const handleSave = () => {
        const sdict = {};

        sdict['sname'] = spotName;
        sdict['latitude'] = latitude;
        sdict['longitude'] = longitude;
        sdict['status'] = status;

        for (let i = 0; i < tdata.length; i++) {
            sdict[tdata[i].toLowerCase()] = dynamicFields[tdata[i]] ? dynamicFields[tdata[i]] : '';
        }

        onAddSpot(sdict);
    };

    async function resetInputboxes() {
        setLatitude('');
        setLongitude('');
        setStatus('');

        for (let i = 0; i < tdata.length; i++) {
            const newValue = document.getElementById(tdata[i]).value;
            setDynamicFields((prevFields) => ({
                ...prevFields,
                [tdata[i]]: ''
            }));
            if (!tagval[tdata[i]].includes(newValue)) {
                tagval[tdata[i]].push(newValue);
            }
        }
        setTagval({ ...tagval });
    }

    async function onAddSpot(mydict) {
        try {
            let sres = await addNewSpot(mydict);
            Swal.fire({
                title: 'Spot added successfully!',
                text: 'Do you want to add another Spot ?',
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    resetInputboxes();
                } else {
                    props.asdata.cbfMove(0);
                }
            });
        } catch (error) {
            Swal.fire(error);
        }
    }

    function addNewSpot(mydict) {
        return new Promise(async function (resolve, reject) {
            try {
                let myorg = sessionStorage.getItem('myOrg');

                let auth = sessionStorage.getItem('myToken');
                var myHeaders = new Headers();
                myHeaders.append('Authorization', 'Bearer ' + auth);
                myHeaders.append('Content-Type', 'application/json');

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: JSON.stringify(mydict)
                };

                var url = new URL(DNC_URL + '/spot/' + myorg);

                fetch(url, requestOptions)
                    .then(async (response) => {
                        if (response.status == '200') {
                            let resp = await response.json();
                            resolve(resp);
                        } else {
                            // console.log('Response Code: ', response.status);
                            //return response.json()
                            let data = await response.json();
                            reject(data.message);
                        }
                    })
                    .catch((error) => {
                        console.log('Error Resp: ', error);
                        reject(error);
                    });
            } catch (error) {
                reject('Invalid Organization');
            }
        });
    }

    const handleDynamicFieldChange = (event) => {
        const { id, value } = event.target;
        setDynamicFields((prevFields) => ({
            ...prevFields,
            [id]: value
        }));
    };

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '30ch' },
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '40px'
            }}
            noValidate
            autoComplete="off"
        >
            <TextField required id="spotName" label="Spot Name" value={spotName} onChange={(e) => setSpotName(e.target.value)} />

            <TextField id="latitude" label="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />

            <TextField id="longitude" label="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />

            <TextField id="status" label="status" value={status} onChange={(e) => setStatus(e.target.value)} />

            {tdata.map((item) => (
                <div key={item}>
                    <TextField
                        label={item}
                        id={item}
                        value={dynamicFields[item] || ''}
                        onChange={handleDynamicFieldChange}
                        inputProps={{
                            list: `${item}Suggestions`
                        }}
                    />
                    <datalist id={`${item}Suggestions`}>
                        {Array.isArray(tagval[item]) &&
                            tagval[item].length > 0 &&
                            tagval[item].map((option) => <option key={option} value={option} />)}
                    </datalist>
                </div>
            ))}

            <div>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="success"
                    style={{ marginTop: '7%' }}
                    sx={{
                        backgroundColor: 'green',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '15px'
                    }}
                >
                    Save
                </Button>
            </div>
        </Box>
    );
}
