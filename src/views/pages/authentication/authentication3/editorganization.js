import React, { useState, useRef, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';

import { constobj } from '../../../../misc/constants';

export default function EditOrganization(props) {
    const { DNC_URL } = { ...constobj };

    const [open, setOpen] = useState(true);
    const [tagValue, setTagValue] = useState('');
    const [nameValue, setNameValue] = useState('');

    const handleSave = () => {
        UpdateOrg();
    };
    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
        props.mydata && props.mydata.hcb && props.mydata.hcb();
    };

    const tagRef = useRef(null);

    // Destructure name and tags from the prop, default to empty object if undefined
    const { name, tags } = props.rowData || {};

    // Set the initial values based on the prop data
    useEffect(() => {
        if (name && tags) {
            setNameValue(name);
            setTagValue(tags.join(', '));
        }
    }, [name, tags]);

    // ...

    function UpdateOrgData(mydict) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');

            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };

            let orgname = props.mydata.sdata.name;

            var url = new URL(DNC_URL + '/org/' + orgname);

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

    async function UpdateOrg() {
        let myuser = sessionStorage.getItem('myUser');
        let myuobj = JSON.parse(myuser);

        let mydict = {};
        mydict['user'] = myuobj.user;
        mydict['level'] = myuobj.level;

        let odata = {};
        odata['name'] = nameValue;
        odata['tags'] = tagValue.split(',').map((tag) => tag.trim());

        mydict['odata'] = odata;

        let uresp = await UpdateOrgData(mydict);

        handleCancel();

        // Swal.fire(uresp);
        Swal.fire({
            title: 'Organization Update',
            text: `Organization Name: ${mydict.odata.name}, Tags Updated: ${mydict.odata.tags.join(', ')}`,
            icon: 'success'
        });
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'Edit Organization'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                '& > :not(style)': { m: 2, flexBasis: '50%', width: '110%' }
                            }}
                        >
                            <TextField
                                style={{ marginLeft: '-3%' }}
                                required
                                id="oname"
                                label="Name"
                                defaultValue={props.mydata.sdata.name}
                                onChange={(event) => setNameValue(event.target.value)}
                            />
                            <TextField
                                style={{ marginLeft: '-3%' }}
                                required
                                id="otags"
                                label="Tags"
                                inputRef={tagRef}
                                defaultValue={props.mydata.sdata.tags}
                                onChange={(event) => setTagValue(event.target.value)}
                            />
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
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
                        onClick={handleCancel}
                        variant="contained"
                        color="error"
                        sx={{
                            backgroundColor: 'red',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '15px'
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
