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

const devtype = [
    { id: 1, value: 'devEUI', label: 'devEUI' },
    { id: 2, value: 'devID', label: 'devID' }
];

function ConfigDevice(props) {
    const { DNC_URL } = { ...constobj };

    const [dslist, setDslist] = React.useState([]);
    const [dsdict, setDsdict] = React.useState({});
    const [selDs, setSelDs] = useState('');
    const [selDsId, setSelDsId] = useState(null);

    const [selDtype, setSelDtype] = useState('devEUI');
    const [dlist, setDlist] = React.useState([]);
    const [selDev, setSelDev] = useState('');

    props.ds.dtype(selDtype);

    async function dsrcChange(e) {
        props.ds.sid(dsdict[e.target.value]);
        setSelDs(e.target.value);
        setSelDsId(dsdict[e.target.value]);
        getDevices(e.target.value, selDtype);
    }

    async function dtypeChange(e) {
        props.ds.dtype(e.target.value);
        setSelDtype(e.target.value);
        getDevices(selDs, e.target.value);
    }

    async function deviceChange(e) {
        props.ds.devid(e.target.value);
        setSelDev(e.target.value);
    }

    function getDsList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            fetch(DNC_URL + '/dsrc', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    let olist = [];
                    if (data != null) {
                        for (let i = 0; i < data.length; i++) {
                            olist.push({ name: data[i].dsname, id: data[i].dsid });
                        }
                    }
                    resolve(olist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function getDevData(mydict) {
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

            var url = new URL(DNC_URL + '/dlist');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Dev Req Resp: ', data);
                    resolve(data.message);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    async function getDevices(dsrc, dtype) {
        let mydict = {};
        mydict['dsn'] = dsrc; //selDs;
        mydict['dtype'] = dtype; //selDtype;

        try {
            let dresp = await getDevData(mydict);
            let mynewd = [];

            for (let i = 0; i < dresp.length; i++) {
                let mydict = {};
                mydict['id'] = i + 1;
                mydict['label'] = dresp[i];
                mydict['value'] = dresp[i];
                mynewd.push(mydict);
            }
            setDlist(mynewd);
            setSelDev(mynewd[0].value);
            props.ds.devid(mynewd[0].value);
        } catch (error) {
            Swal.fire(error);
        }
    }

    async function getDsInfo() {
        const myds = await getDsList();

        let mynewo = [];
        let dsdict = {};
        for (let i = 0; i < myds.length; i++) {
            let mydict = {};
            mydict['id'] = myds[i].id;
            mydict['label'] = myds[i].name;
            mydict['value'] = myds[i].name;
            mynewo.push(mydict);

            dsdict[myds[i].name] = myds[i].id;
        }

        setDslist(mynewo);
        setDsdict(dsdict);
        setSelDs(mynewo[0].value);
        setSelDsId(mynewo[0].id);
        props.ds.sid(mynewo[0].id);
        getDevices(mynewo[0].value, selDtype);
    }

    useEffect(() => {
        getDsInfo();
    }, []);

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
                <TextField id="dsrc" select label=" Select Data Source" helperText=" " defaultValue="" value={selDs} onChange={dsrcChange}>
                    {dslist.length > 0 &&
                        dslist.map((option) => (
                            <MenuItem key={option.id} value={option.label}>
                                {option.label}
                            </MenuItem>
                        ))}
                </TextField>

                <TextField id="idtype" select label=" Device Id Type" helperText=" " value={selDtype} onChange={dtypeChange}>
                    {devtype.map((option) => (
                        <MenuItem key={option.id} value={option.label}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField id="device" select label=" Select Device" helperText=" " value={selDev} onChange={deviceChange}>
                    {dlist.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        </Box>
    );
}

export default ConfigDevice;
