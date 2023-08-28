import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2';
import { constobj } from './../../../misc/constants';

export default function EditOrgUser(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);
    const [selRole, setSelRole] = useState(props.mydata.sdata.role);

    const statusRef = useRef(null);

    const myrole = [
        { id: '1', label: 'Org-User', value: 'Org-User' },
        { id: '2', label: 'Org-Admin', value: 'Org-Admin' },
        { id: '3', label: 'App-User', value: 'App-User' },
        { id: '4', label: 'App-Admin', value: 'App-Admin' }
    ];

    const handleSave = () => {
        //setOpen(true);
        UpdateUser();
    };

    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    useEffect(() => {
        setSelRole(props.mydata.sdata.role);
    }, []);

    function UpdateUserData(mydict) {
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

            var url = new URL(DNC_URL + '/chrole');

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

    async function UpdateUser() {
        let newdict = {};

        let roleidx = 1;
        for (let i = 0; i < myrole.length; i++) {
            if (myrole[i].value == selRole) {
                roleidx = myrole[i].id;
                break;
            }
        }

        newdict['level'] = roleidx;

        if (statusRef.current) {
            newdict['status'] = statusRef.current.value;
        }

        newdict['email'] = props.mydata.sdata.email;
        newdict['uname'] = props.mydata.sdata.name;

        let uresp = await UpdateUserData(newdict);

        handleClose();
        Swal.fire(uresp);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'EDIT USER - ' + props.mydata.sdata.name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{}} id="alert-dialog-description">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                '& > :not(style)': { m: 1, flexBasis: '50%' }
                            }}
                        >
                            <FormControl>
                                <InputLabel id="role-label">Role</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="1"
                                    value={selRole}
                                    onChange={(event) => setSelRole(event.target.value)}
                                >
                                    {myrole.map((role) => (
                                        <MenuItem key={role.value} value={role.value}>
                                            {role.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField required label="Status" defaultValue={props.mydata.sdata.status} inputRef={statusRef} />
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
                        onClick={handleClose}
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
