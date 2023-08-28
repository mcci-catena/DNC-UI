import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';

import { constobj } from './../../misc/constants';

export default function EditSpot(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    const [tdata, setTdata] = React.useState([]);
    const [odata, setOdata] = React.useState({});

    const handleSave = () => {
        //setOpen(true);
        UpdateSpot();
    };

    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    useEffect(() => {
        getRowInfo();
    }, []);

    async function getRowInfo() {
        let mytags = Object.keys(props.mydata.sdata);
        let otags = [];
        for (let i = 0; i < mytags.length; i++) {
            otags.push(mytags[i]);
        }

        console.log('My Tags: ', otags);

        let index = mytags.indexOf('id');
        if (index > -1) {
            otags.splice(index, 1);
        }
        setOdata(otags);

        index = mytags.indexOf('id');
        if (index > -1) {
            mytags.splice(index, 1);
        }

        index = mytags.indexOf('sid');
        if (index > -1) {
            mytags.splice(index, 1);
        }
        index = mytags.indexOf('user');
        if (index > -1) {
            mytags.splice(index, 1);
        }
        setTdata(mytags);
    }

    function UpdateSpotData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            let sname = mydict.data.sname;
            let myorg = sessionStorage.getItem('myOrg');
            mydict['orgname'] = myorg;

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };

            var url = new URL(DNC_URL + '/spot/' + sname);

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    async function UpdateSpot() {
        let newdict = {};
        let olddict = {};

        for (let i = 0; i < tdata.length; i++) {
            newdict[tdata[i].toLowerCase()] = document.getElementById(tdata[i]).value;
        }

        for (let i = 0; i < odata.length; i++) {
            olddict[odata[i]] = props.mydata.sdata[odata[i]];
        }
        let uresp = await UpdateSpotData({ data: olddict, new: newdict });

        handleClose();

        Swal.fire(uresp);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'MANAGE SPOT'}
                </DialogTitle>
                <DialogContentText style={{ width: '500px' }} id="alert-dialog-description">
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '30ch' },
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '1px'
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        {tdata.map((item) => (
                            <div key={item}>
                                <TextField style={{}} label={item} id={item} defaultValue={props.mydata.sdata[item]} />
                            </div>
                        ))}
                        <div>
                            <Button
                                onClick={handleSave}
                                variant="contained"
                                color="success"
                                sx={{
                                    backgroundColor: 'green',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '15px'
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={handleClose}
                                variant="contained"
                                color="error"
                                style={{ width: '30%', marginLeft: '10%' }}
                                sx={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '15px'
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </Box>
                </DialogContentText>
                <DialogActions></DialogActions>
            </Dialog>
        </div>
    );
}
