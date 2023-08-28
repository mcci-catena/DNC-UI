import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';

import { constobj } from './../../misc/constants';

export default function ReplaceDevice(props) {
    const { DNC_URL } = { ...constobj };

    const [devlist, setDevlist] = React.useState([]);
    const [selDev, setSelDev] = React.useState('');
    const [dictlist, setDictList] = React.useState([]);

    const [open, setOpen] = useState(true);

    const [liveDev, setLiveDev] = React.useState('');
    const [selectedIDate, setSelectedIDate] = useState(null);

    const handleReplace = () => {
        replaceDev();
    };

    async function replaceDev() {
        let selidx = null;
        for (let i = 0; i < dictlist.length; i++) {
            if (dictlist[i].hwsl == selDev) {
                selidx = i;
                break;
            }
        }

        if (selidx != null) {
            let ddict = {};
            ddict['hwsl'] = dictlist[selidx].hwsl;
            ddict['dsid'] = dictlist[selidx].dsid;
            ddict['devid'] = dictlist[selidx].nwIdV;
            ddict['devtype'] = dictlist[selidx].nwIdK;
            ddict['sid'] = props.mydata.sdata.sid;
            ddict['idate'] = selectedIDate;
            ddict['remarks'] = 'Replace Device';

            let rmdict = {};
            rmdict['orgname'] = sessionStorage.getItem('myOrg');
            rmdict['rdate'] = selectedIDate;
            rmdict['hwsl'] = liveDev;
            rmdict['sid'] = props.mydata.sdata.sid;

            let rdresp;
            try {
                rdresp = await updtRemove(rmdict);
                let rpresp;
                try {
                    let mydict = {};
                    mydict['device'] = ddict;
                    mydict['orgname'] = sessionStorage.getItem('myOrg');
                    mydict['sname'] = props.mydata.sdata.sname;

                    rpresp = updtReplace(mydict);
                    Swal.fire('Device replace success');
                } catch (err) {
                    Swal.fire(rpresp);
                }
            } catch (err) {
                Swal.fire(rdresp);
            }
        }
        setOpen(false); // Close the dialog after saving
        props.mydata.hcb();
    }

    function updtRemove(mydict) {
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

            var url = new URL(DNC_URL + '/remdev');

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

    function updtReplace(mydict) {
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

            var url = new URL(DNC_URL + '/device/' + mydict.sname);

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

    const handleClose = () => {
        setOpen(false); // Close the dialog when Cancel is clicked
        props.mydata.hcb();
    };

    useEffect(() => {
        getDeviceInfo();
    }, []);

    async function getDeviceInfo() {
        setLiveDev(props.mydata.sdata.ddata.hwsl);
        let myorg = sessionStorage.getItem('myOrg');
        let dlist = await getrtadevices(myorg);

        let devList = [];

        for (let i = 0; i < dlist.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['value'] = dlist[i].hwsl;
            mydict['label'] = dlist[i].hwsl;
            devList.push(mydict);
        }

        setSelDev(devList[0].value);
        setDevlist(devList);
        setDictList(dlist);
    }

    function getrtadevices(myorg) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            var url = new URL(DNC_URL + '/rtadev/' + myorg);

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

    async function onChangeDev(e) {
        let mseldev = e.target.value;
        setSelDev(mseldev);
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <div style={{ width: '400px' }}>
                    <DialogTitle style={{ fontSize: '16px' }} id="alert-dialog-title">
                        Replace Device to Spot
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Stack spacing={2}>
                                <TextField id="hwsl" label="HwId" value={liveDev} variant="outlined" />
                                <TextField
                                    fullWidth
                                    id="demo-select-small"
                                    select
                                    label="Select Devices"
                                    value={selDev}
                                    onChange={onChangeDev}
                                >
                                    {devlist.map((option) => (
                                        <MenuItem key={option.value} value={option.label}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        fullWidth
                                        label="Installed Date"
                                        value={selectedIDate}
                                        onChange={setSelectedIDate}
                                        renderInput={(params) => <TextField {...params} variant="outlined" />}
                                    />
                                </LocalizationProvider>
                            </Stack>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ justifyContent: 'center' }}>
                        <Stack spacing={2} direction="row">
                            <Button variant="contained" color="success" onClick={handleReplace}>
                                Replace
                            </Button>
                            <Button variant="contained" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Stack>
                    </DialogActions>
                </div>
            </Dialog>
        </div>
    );
}
