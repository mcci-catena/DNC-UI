import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';

import Swal from 'sweetalert2';

import { constobj } from './../../misc/constants';

export default function DeleteSpot(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);

    const handleDelete = () => {
        deleteSpot();
    };

    const handleCancel = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    async function deleteSpot() {
        let sdict = props.mydata.sdata;
        let mydict = {};
        let myorg = sessionStorage.getItem('myOrg');
        mydict['org'] = myorg;
        mydict['sname'] = sdict.sname;
        mydict['sid'] = sdict.sid;

        let dresp = await deleteSpotReq(mydict);
        Swal.fire(dresp.message);
        setOpen(false);
        props.mydata.hcb();
    }

    function deleteSpotReq(sdict) {
        return new Promise(async function (resolve, reject) {
            if (sdict.status === 'live') {
                resolve({ message: "can't delete the spot record, update the status then try again" });
            } else {
                let auth = sessionStorage.getItem('myToken');

                var myHeaders = new Headers();
                myHeaders.append('Authorization', 'Bearer ' + auth);
                myHeaders.append('Content-Type', 'application/json');

                var requestOptions = {
                    method: 'DELETE',
                    headers: myHeaders,
                    body: JSON.stringify(sdict)
                };

                var url = new URL(DNC_URL + '/spot/' + sdict.sname);

                fetch(url, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        resolve(data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            }
        });
    }

    return (
        <div>
            <Dialog open={open} onClose={handleCancel} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'Delete Spot  ' + props.mydata.sdata.sname}
                </DialogTitle>
                <DialogContent style={{ minWidth: '300px' }}>
                    <DialogContentText>
                        <Box
                            sx={{
                                p: 3,
                                borderRadius: '4px',
                                backgroundColor: '#f5f5f5'
                            }}
                        >
                            <h3>Are You Sure, do You Want To Delete?</h3>
                            <p>This action cannot be reterive.</p>
                        </Box>
                    </DialogContentText>
                    <DialogActions>
                        <Button
                            style={{ width: '100%', marginTop: '10px', backgroundColor: '#e57373', color: 'white' }}
                            onClick={handleDelete}
                            variant="contained"
                        >
                            Delete
                        </Button>
                        <Button
                            style={{ width: '100%', marginTop: '10px', backgroundColor: '#64b5f6', color: 'white' }}
                            onClick={handleCancel}
                            variant="contained"
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </div>
    );
}
