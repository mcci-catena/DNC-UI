import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';

import { constobj } from './../../misc/constants';

const GreenButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#4CAF50',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: '#45a049'
    }
}));

const RedButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#f44336',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': {
        backgroundColor: '#d32f2f'
    }
}));

export default function Editdatasource(props) {
    const { DNC_URL } = { ...constobj };

    const [open, setOpen] = React.useState(true);
    const [dblist, setDblist] = React.useState([]);
    const [selMmt, setSelMmt] = React.useState('');
    const [mmtlist, setMmtlist] = React.useState([]);
    const [selDb, setSelDb] = React.useState('');

    console.log('Read EDS Props: ', props);

    const handleSave = () => {
        //setOpen(true);
        UpdateDataSource();
    };

    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
        console.log('My Child Comp: ', props.mydata.sdata);
        props.mydata.hcb();
    };

    useEffect(() => {
        showDsInfo();
    }, []);

    const handleRefershdb = async () => {
        const mydbs = await getDbList();
        let mydblst = [];
        for (let i = 0; i < mydbs.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['value'] = mydbs[i];
            mydict['label'] = mydbs[i];
            mydblst.push(mydict);
        }
        setDblist(mydblst);
        setSelDb(mydblst[0].value);
        console.log('My DBs ****', mydblst);
    };

    function getDbList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            const mydict = {};
            mydict['dburl'] = document.getElementById('dsurl').value;
            mydict['dbuname'] = document.getElementById('uname').value;
            mydict['dbpwd'] = document.getElementById('pwd').value;

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/getdbl');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.db_list);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function getMmtList(dbname) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            const mydict = {};
            mydict['dburl'] = document.getElementById('dsurl').value;
            mydict['dbuname'] = document.getElementById('uname').value;
            mydict['dbpwd'] = document.getElementById('pwd').value;
            mydict['dbname'] = dbname;

            console.log('MMT Param: ', mydict);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/getmmtl');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('List of MMT: ', data);
                    resolve(data.mmt_list);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function onchangeDb(e) {
        let mseldb = e.target.value;
        setSelDb(mseldb);
        console.log('Handle Read MMgt');

        if (mseldb !== '') {
            const mymmts = await getMmtList(mseldb);
            let mymmtlst = [];
            for (let i = 0; i < mymmts.length; i++) {
                let mydict = {};
                mydict['id'] = i + 1;
                mydict['value'] = mymmts[i];
                mydict['label'] = mymmts[i];
                mymmtlst.push(mydict);
            }
            setMmtlist(mymmtlst);
            setSelMmt(mymmtlst[0].value);
        }
    }

    const handleRefershmmt = async () => {
        const mymmts = await getMmtList(selDb);
        let mymmtlst = [];
        for (let i = 0; i < mymmts.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['value'] = mymmts[i];
            mydict['label'] = mymmts[i];
            mymmtlst.push(mydict);
        }
        setMmtlist(mymmtlst);
        setSelMmt(mymmtlst[0].value);
    };

    async function onchangeMmt(e) {
        setSelMmt(e.target.value);
    }

    function showDsInfo() {
        setSelDb(props.mydata.sdata.dbname);
        setSelMmt(props.mydata.sdata.mmtname);
        setDblist([
            {
                id: 1,
                value: props.mydata.sdata.dbname,
                label: props.mydata.sdata.dbname
            }
        ]);
        setMmtlist([
            {
                id: 1,
                value: props.mydata.sdata.mmtname,
                label: props.mydata.sdata.mmtname
            }
        ]);
    }

    async function UpdateDataSource() {
        let myuser = sessionStorage.getItem('myUser');
        let myuobj = JSON.parse(myuser);

        let mydict = {};
        mydict['user'] = myuobj.user;
        mydict['level'] = myuobj.level;
        console.log('User Request: ', mydict);

        let dbdata = {};
        dbdata['dsname'] = document.getElementById('dsname').value;
        dbdata['dsurl'] = document.getElementById('dsurl').value;
        // dbdata['dbname'] = document.getElementById('dbname').value;
        dbdata['dbname'] = selDb;
        // dbdata['mmtname'] = document.getElementById('mmtname').value;
        dbdata['mmtname'] = selMmt;
        dbdata['uname'] = document.getElementById('uname').value;
        dbdata['pwd'] = document.getElementById('pwd').value;

        mydict['dbdata'] = dbdata;

        let edsname = props.mydata.sdata.dsname;

        let uresp = await UpdateDSrecord(edsname, mydict);

        handleCancel();

        Swal.fire(uresp);
    }

    function UpdateDSrecord(edsname, mydict) {
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

            var url = new URL(DNC_URL + '/dsrc/' + edsname);

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

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'EDIT DATA-SOURCE'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{}} id="alert-dialog-description">
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '32ch' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField id="dsname" defaultValue={props.mydata.sdata.dsname} label="Name" variant="outlined" />
                            <TextField id="dsurl" defaultValue={props.mydata.sdata.dburl} label="URL" variant="outlined" />
                            <TextField id="uname" defaultValue={props.mydata.sdata.uname} label="User-Name" variant="outlined" />
                            <TextField
                                id="pwd"
                                defaultValue={props.mydata.sdata.pwd}
                                label="Password"
                                variant="outlined"
                                type="password" // Add this line to display the field as a password input
                            />
                            <TextField
                                id="dbname"
                                select
                                label="Select Database"
                                placeholder="Select Database"
                                value={selDb}
                                onChange={onchangeDb}
                                helperText=" "
                            >
                                {dblist.map((option) => (
                                    <MenuItem key={option.value} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                style={{ marginTop: '18px', width: '15%' }}
                                onClick={handleRefershdb}
                                size="small"
                                variant="contained"
                                color="primary"
                            >
                                Refresh
                            </Button>
                            <TextField
                                style={{ marginTop: '-2%' }}
                                id="mmtname"
                                select
                                label="Select Measurement"
                                placeholder="Select Measurement"
                                value={selMmt}
                                onChange={onchangeMmt}
                                helperText=" "
                            >
                                {mmtlist.map((option) => (
                                    <MenuItem key={option.value} value={option.label}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Button
                                size="small"
                                style={{ marginTop: '1px', width: '15%' }}
                                onClick={handleRefershmmt}
                                variant="contained"
                                color="primary"
                            >
                                Refresh
                            </Button>
                        </Box>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <GreenButton style={{ width: '17%' }} onClick={handleSave} variant="contained">
                        Save
                    </GreenButton>
                    <RedButton style={{ width: '17%' }} onClick={handleCancel} variant="contained">
                        Cancel
                    </RedButton>
                </DialogActions>
            </Dialog>
        </div>
    );
}
