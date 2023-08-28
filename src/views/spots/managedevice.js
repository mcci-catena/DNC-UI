import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import 'jspdf-autotable';
import DownloadIcon from '@mui/icons-material/Download';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import AssignDevice from './assigndevice';
import RemoveDevice from './removedevice';
import ReplaceDevice from './replacedevice';

// User defined Import
import { constobj } from '../../misc/constants';

export default function ListUser(props) {
    const { DNC_URL } = { ...constobj };

    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [csvFileName, setCsvFileName] = React.useState('');

    const [enableAssign, setEnableAssign] = React.useState(false);
    const [enableRaR, setEnableRaR] = React.useState(false);
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [myassign, setMyAssign] = React.useState(false);
    const [myreplace, setMyReplace] = React.useState(false);
    const [myremove, setMyRemove] = React.useState(false);
    const [liveDev, setLiveDev] = React.useState({});

    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 8 },
        { field: 'hwsl', headerName: 'Hw.Sl', width: 150 },
        { field: 'dsn', headerName: 'Data Source', width: 150 },
        { field: 'devId', headerName: 'Device ID', width: 200 },
        { field: 'devType', headerName: 'Device Type', width: 110 },
        { field: 'idate', headerName: 'Install Date', width: 200 },
        { field: 'rdate', headerName: 'Remove Date', width: 200 },
        { field: 'remarks', headerName: 'Remarks', width: 180 }
    ];

    const enableassigndev = () => {
        setMyAssign(false);
        getDeviceInfo();
    };

    const enablereplacedev = () => {
        setMyReplace(false);
        getDeviceInfo();
    };

    const enableremovedev = () => {
        setMyRemove(false);
        getDeviceInfo();
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const processRowUpdate = async (newRow) => {
        console.log('Process Row Update');
    };

    const onProcessRowUpdateError = (error) => {
        console.log('Error: --->', error);
    };

    async function getDeviceInfo() {
        const mydev = await getSpotDevices();
        enableControls(mydev);
        setRows(mydev);
    }

    function enableControls(mydev) {
        let devthere = false;
        for (let i = 0; i < mydev.length; i++) {
            if (mydev[i].rdate == null) {
                devthere = true;
                setLiveDev(mydev[i]);
                break;
            }
        }
        if (devthere) {
            setEnableAssign(false);
            setEnableRaR(true);
        } else {
            setEnableAssign(true);
            setEnableRaR(false);
        }
    }

    function getSpotDevices() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            let myorg = sessionStorage.getItem('myOrg');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            var url = new URL(DNC_URL + '/device?org=' + myorg + '&sid=' + props.mddata.sid);

            let mydlist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Spot D: ', data);
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['hwsl'] = item['hwsl'];
                        myrow['devId'] = item['devid'];
                        myrow['devType'] = item['devtype'];
                        myrow['dsid'] = item['dsid'] !== null ? item['dsid'].split(',')[0] : '';
                        myrow['dsn'] = item['dsid'] !== null ? item['dsid'].split(',')[1] : '';
                        myrow['idate'] = item['idate'];
                        myrow['rdate'] = item['rdate'];
                        myrow['remarks'] = item['remarks'];
                        mydlist.push(myrow);
                    });
                    resolve(mydlist);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    const handleAssignDev = () => {
        setMyAssign(true);
    };

    const handleRemDev = () => {
        setMyRemove(true);
    };

    const handleRepDev = () => {
        setMyReplace(true);
    };

    function CustomToolbarButton() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <Button style={{ fontSize: '13px' }} variant="text" startIcon={<DownloadIcon />} onClick={handleOpenDownloadDialog}>
                    Export CSV
                </Button>
                <div style={{ display: 'flex', justifyContent: 'flex-start', width: '40%' }}>
                    <Button
                        style={{ flex: 1, marginRight: '10px' }}
                        variant="contained"
                        size="small"
                        startIcon={<AssignmentTurnedInIcon />}
                        color="warning"
                        onClick={handleAssignDev}
                        disabled={!enableAssign}
                    >
                        Assign
                    </Button>
                    <Button
                        style={{ flex: 1, marginRight: '10px' }}
                        variant="contained"
                        startIcon={<PublishedWithChangesIcon />}
                        color="success"
                        size="small"
                        onClick={handleRepDev}
                        disabled={!enableRaR}
                    >
                        Replace
                    </Button>
                    <Button
                        style={{ flex: 1 }}
                        variant="contained"
                        startIcon={<RestoreFromTrashIcon />}
                        color="secondary"
                        size="small"
                        onClick={handleRemDev}
                        disabled={!enableRaR}
                    >
                        Remove
                    </Button>
                </div>
            </GridToolbarContainer>
        );
    }

    const handleOpenDownloadDialog = () => {
        setOpenDownloadDialog(true);
    };

    // Close the dialog
    const handleCloseDownloadDialog = () => {
        setOpenDownloadDialog(false);
    };

    // Download CSV with the provided file name
    const handleDownloadCsv = () => {
        handleCloseDownloadDialog();
        handleExportCsv(csvFileName);
    };
    const handleCsvFileNameChange = (event) => {
        setCsvFileName(event.target.value);
    };
    const handleExportCsv = (fileName) => {
        // Create a CSV string from the rows data
        const csvData = rows.map((row) => Object.values(row).join(',')).join('\n');

        // Create a blob with the CSV data
        const blob = new Blob([csvData], { type: 'text/csv' });

        // Create a temporary link to download the CSV file
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.csv`; // Set the file name with the user-entered name
        document.body.appendChild(a);
        a.click();

        // Clean up the temporary link
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    useEffect(() => {
        if (props.mddata.sname) {
            props.mddata.cbftitle('Spots -> ManageDevice -> ' + props.mddata.sname);
        } else {
            props.mddata.cbftitle('Spots -> ManageDevice -> Select a Spot');
        }
        getDeviceInfo();
    }, []);

    return (
        <div>
            {myassign ? (
                <AssignDevice mydata={{ sdata: { sid: props.mddata.sid, sname: props.mddata.sname }, hcb: enableassigndev }} />
            ) : null}
            {myreplace ? (
                <ReplaceDevice
                    mydata={{ sdata: { ddata: liveDev, sid: props.mddata.sid, sname: props.mddata.sname }, hcb: enablereplacedev }}
                />
            ) : null}
            {myremove ? (
                <RemoveDevice
                    mydata={{ sdata: { ddata: liveDev, sid: props.mddata.sid, sname: props.mddata.sname }, hcb: enableremovedev }}
                />
            ) : null}

            <div className="data-grid-container" style={{ height: 400, width: '100%', marginTop: -1, marginLeft: -20 }}>
                <DataGrid
                    rows={rows}
                    columns={thcolumns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    density="compact"
                    slots={{
                        toolbar: CustomToolbarButton
                    }}
                />
            </div>
            <Dialog open={openDownloadDialog} onClose={handleCloseDownloadDialog}>
                <DialogTitle>Enter CSV File Name</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                        <TextField id="linkmail" label="Enter Name" fullWidth value={csvFileName} onChange={handleCsvFileNameChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDownloadDialog}>Cancel</Button>
                    <Button onClick={handleDownloadCsv} color="primary">
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
