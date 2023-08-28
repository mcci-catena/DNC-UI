import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Swal from 'sweetalert2';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { constobj } from './../../../misc/constants';

const splans = [
    { id: 1, value: 'Free', label: 'Free' },
    { id: 2, value: 'Pro Cloud', label: 'Pro Cloud' }
];

export default function EditSub(props) {
    const { DNC_URL } = { ...constobj };
    const [open, setOpen] = React.useState(true);

    const [selOrg, setSelOrg] = useState('');
    const [selOrgId, setSelOrgId] = useState(null);
    const [selPlan, setSelPlan] = useState('');

    const [selSdate, setSelSdate] = useState(null);
    const [selEdate, setSelEdate] = useState(null);

    const handleSave = () => {
        //setOpen(true);
        updateSubs();
    };
    const handleCancel = () => {
        props.mydata.hcb();
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
        props.mydata.hcb();
    };

    const planChange = (event) => {
        setSelPlan(event.target.value);
    };

    async function sdateChange(newDate) {
        setSelSdate(newDate);
    }

    async function edateChange(newDate) {
        setSelEdate(newDate);
    }

    async function updateSubs() {
        let edict = {};
        edict['orgid'] = props.mydata.sdata.orgid;
        edict['splan'] = props.mydata.sdata.splan;
        edict['sdate'] = props.mydata.sdata.sdate;
        edict['edate'] = props.mydata.sdata.edate;

        let sdict = {};
        sdict['orgid'] = selOrgId;
        sdict['splan'] = selPlan;
        sdict['sdate'] = selSdate;
        sdict['edate'] = selEdate;

        let fdict = {};
        fdict['edata'] = edict;
        fdict['sdata'] = sdict;

        let usresp = await updateSubsRecord(fdict);

        handleClose();

        Swal.fire(usresp);
    }

    function updateSubsRecord(mydict) {
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

            var url = new URL(DNC_URL + '/subs');

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

    function showSubsInfo() {
        console.log('Show Gateway Info: ', props);
        setSelOrg(props.mydata.sdata.orgname);
        setSelOrgId(props.mydata.sdata.orgid);
        setSelPlan(props.mydata.sdata.splan);
        setSelSdate(props.mydata.sdata.sdate);
        setSelEdate(props.mydata.sdata.edate);
    }

    useEffect(() => {
        showSubsInfo();
    }, []);

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle style={{ fontSize: '20px' }} id="alert-dialog-title">
                    {'Edit Subscription'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText style={{}} id="alert-dialog-description">
                        <Box
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '30ch' }
                            }}
                            noValidate
                            autoComplete="off"
                        >
                            <TextField id="splan" select label="Select Plan" helperText=" " value={selPlan} onChange={planChange}>
                                {splans.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Start-Date/Time"
                                    value={selSdate}
                                    onChange={sdateChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="In-Date/Time"
                                    value={selEdate}
                                    onChange={edateChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <Button
                                onClick={handleSave}
                                variant="contained"
                                color="primary" // Change the button color to primary
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    width: '10%',
                                    marginTop: '3%'
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                onClick={handleCancel}
                                variant="contained"
                                color="error" // Change the button color to error
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                    width: '10%',
                                    marginTop: '3%'
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}
