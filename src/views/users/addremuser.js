import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import EditUser from './edituser';

import { constobj } from './../../misc/constants';

export default function AddRemUser() {
    const { DNC_URL } = { ...constobj };
    const [myuser, setMyUser] = React.useState(false);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [rows, setRows] = React.useState([]);
    const [selid, setSelId] = React.useState();
    const [restUsers, setRestUsers] = useState(['select a Org']);
    const [selUser, setSelUser] = useState('');
    const myroles = ['Org-User', 'Org-Admin', 'App-User', 'App-Admin'];
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);

    let myorg = sessionStorage.getItem('myOrg');

    const handleButtonClick = () => {
        addUserToOrg();
    };

    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 100 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'firstname', headerName: 'First Name', width: 150 },
        { field: 'lastname', headerName: 'Last Name', width: 150 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = [id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<SaveIcon />} onClick={handleSaveClick(id)} label="Save" />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            onClick={handleCancelClick(id)}
                            label="Cancel"
                            className="textPrimary"
                            color="inherit"
                        />
                    ];
                }

                return [<GridActionsCellItem onClick={handleDeleteClick(id)} icon={<DeleteIcon />} label="Delete" color="inherit" />];
            }
        }
    ];
    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleEditClick = (id) => () => {
        setSelId(id);
        setMyUser(true);
    };

    const makeuserenable = () => {
        setMyUser(false);
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
        Swal.fire(`Role/Status for user ${rows[id - 1].name} updated successfully`);
    };

    const onProcessRowUpdateError = (error) => {
        console.log('Error: --->', error);
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true }
        });
    };

    const handleDeleteClick = (id) => async () => {
        const confirmationMessage = `Are you sure you want to Remove this User?\n
        - Name: ${rows[id - 1].name}\n
        This action cannot be retrieved.`;
        Swal.fire({
            title: 'Confirm Delete',
            text: confirmationMessage,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let dresp = await removeUser(id);
                Swal.fire(dresp.message);
                getUserInfo(myorg);
            }
        });
    };

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        return updatedRow;
    };

    const [data, setData] = useState([
        { id: 1, name: '', email: '', firstname: '', lastname: '', status: '', role: '', lastlogin: '', logout: '' }
    ]);

    useEffect(() => {
        // console.log("Use Effect")
        myorg = sessionStorage.getItem('myOrg');
        getUserInfo(myorg);

        const interval = setInterval(() => {
            console.log('This will run every second!');
            let norg = sessionStorage.getItem('myOrg');
            if (norg != myorg) {
                myorg = norg;
                getUserInfo(myorg);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    async function getUserInfo(myorg) {
        const myuser = await getUserData(myorg);
        setData(myuser);
        setRows(myuser);

        const alluser = await getAllUserList();
        const linkeduser = getLinkedUser(myuser);

        let finalList = [];
        for (let i = 0; i < alluser.length; i++) {
            if (!linkeduser.includes(alluser[i])) {
                finalList.push(alluser[i]);
            }
        }

        let mynewo = [];
        for (let i = 0; i < finalList.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['label'] = finalList[i];
            mydict['value'] = finalList[i];
            mynewo.push(mydict);
        }
        setRestUsers(mynewo);
        setSelUser(mynewo[0].value);
    }

    async function addUserToOrg() {
        const mydict = {};
        mydict['fncode'] = 'adduser';
        mydict['org'] = myorg;
        mydict['data'] = { users: [selUser] };

        try {
            const myresp = await requestToAddUser(mydict);
            await getUserInfo(myorg); // Refresh user list after adding

            return true; // Return success flag
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No User Found: ${error}`
            });

            return false; // Return error flag
        }
    }

    function requestToAddUser(mydict) {
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
            var url = new URL(DNC_URL + '/org');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Data-1201: ', data);
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function removeUser(id) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            const mydict = {};
            mydict['fncode'] = 'rmuser';
            mydict['org'] = myorg;
            mydict['data'] = { users: [rows[id - 1].name] };

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };
            var url = new URL(DNC_URL + '/org');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Data-remove: ', data);
                    resolve(data);
                })
                .catch((error) => {
                    console.log('Remove Error: ', error);
                    reject(error);
                });
        });
    }

    function getLinkedUser(myuser) {
        let linuser = [];
        for (let i = 0; i < myuser.length; i++) {
            linuser.push(myuser[i].name);
        }
        return linuser;
    }

    // get User data
    function getAllUserList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/user');

            let myulist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        myulist.push(item['name']);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // get User data
    function getUserData(myorg) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/orguser/' + myorg);

            let myulist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Data: ', data);
                    data.message.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['name'] = item['name'];
                        myrow['email'] = item['email'];
                        myrow['firstname'] = item['firstName'];
                        myrow['lastname'] = item['lastName'];
                        myrow['role'] = myroles[item['role'] - 1];
                        myrow['status'] = item['status'];
                        myrow['lastlogin'] = item['lastLogin']['login'];
                        myrow['logout'] = item['lastLogin']['logout'];
                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function userChange(e) {
        let selfunc = e.target.value;
        setSelUser(e.target.value);
        // sessionStorage.setItem('myOrg', e.target.value);
    }

    function IconLabelTabs() {
        const [value, setValue] = React.useState(0);

        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
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

    // for PDF
    const [pdfFileName, setPdfFileName] = React.useState('');

    const handleOpenDownloadPdfDialog = () => {
        setOpenDownloadPdfDialog(true);
    };

    const handleCloseDownloadPdfDialog = () => {
        setOpenDownloadPdfDialog(false);
    };

    const handlePdfFileNameChange = (event) => {
        setPdfFileName(event.target.value);
    };

    const handleExportPdf = () => {
        handleCloseDownloadPdfDialog();
        handleGeneratePdf(pdfFileName);
    };
    const pdfCellWidth = 70;

    const handleGeneratePdf = (fileName) => {
        const doc = new jsPDF();

        const columns = thcolumns.map((col) => col.headerName);

        // Calculate the total number of pages required based on the rows
        const totalPages = Math.ceil(rows.length / 10); // Assuming 10 rows fit on each page

        let startY = 10; // Initial Y position for the first page

        for (let page = 1; page <= totalPages; page++) {
            if (page > 1) {
                doc.addPage();
            }

            // Calculate the ending index for the current page
            const endIndex = page * 10;
            const pageRows = rows.slice((page - 1) * 10, endIndex);

            const tableData = pageRows.map((row) => thcolumns.map((col) => row[col.field]));

            // Calculate the width for each column based on thcolumns
            const columnWidths = thcolumns.map((col) => col.width || 100); // Default width: 100 if not specified

            // Add the PDF table to the document for the current page
            doc.autoTable({
                head: [columns],
                body: tableData,
                startY,
                styles: {
                    fontSize: 10,
                    cellPadding: { top: 5, right: 5, bottom: 5, left: 5 }
                },
                columnStyles: {
                    // Set individual column widths based on thcolumns
                    ...columnWidths.reduce((acc, width, index) => {
                        acc[index] = { cellWidth: width };
                        return acc;
                    }, {})
                    // Add more column styles for each column if needed
                },
                // Set the width of the table to match the content
                tableWidth: 'auto',
                // Add custom 'pageBreak' option to ensure table content flows across pages
                pageBreak: 'auto'
            });

            // Update the starting position for the next page
            startY = doc.autoTable.previous.finalY + 10;
        }

        // Save the PDF
        doc.save(`${fileName}.pdf`);
    };

    function CustomToolbar() {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <Button style={{ fontSize: '13px' }} variant="text" startIcon={<DownloadIcon />} onClick={handleOpenDownloadDialog}>
                    Export CSV
                </Button>
                {/* <Button variant="text" startIcon={<PdfIcon />} onClick={handleOpenDownloadPdfDialog}>
                    Export PDF
                </Button> */}
            </GridToolbarContainer>
        );
    }
    return (
        <div>
            <div style={{ height: 100, margin: '5px 0' }}>
                {/* <h7 style={{ fontSize: '16px', marginBottom: '5px' }}>Select a User</h7> */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        style={{ width: '30%', marginTop: '-1%' }}
                        id="outlined-select-Main Org"
                        select
                        label="Select User"
                        Placeholder="select user"
                        helperText=" "
                        value={selUser}
                        onChange={userChange}
                        sx={{ height: '40px' }}
                    >
                        {restUsers.map((msgLoc) => (
                            <MenuItem key={msgLoc.id} value={msgLoc.value}>
                                {msgLoc.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button style={{ width: '8%', marginLeft: '2%' }} onClick={handleButtonClick} variant="contained" color="info">
                        Add
                    </Button>
                </div>
            </div>
            <div className="data-grid-container" style={{ height: 300, width: '100%', marginLeft: -20, marginTop: '-40px' }}>
                {myuser ? <EditUser mydata={{ sdata: rows[selid - 1], hcb: makeuserenable }} /> : null}

                <DataGrid
                    rows={rows}
                    columns={thcolumns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                    disableSelectionOnClick
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    onRowEditCommit={processRowUpdate}
                    onRowEditError={onProcessRowUpdateError}
                    onRowClick={handleEditClick}
                    density="compact"
                    onRowSelectionChange={(newSelection) => {
                        console.log(newSelection);
                    }}
                    slots={{
                        toolbar: CustomToolbar
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
            <Dialog open={openDownloadPdfDialog} onClose={handleCloseDownloadPdfDialog}>
                <DialogTitle>Enter PDF File Name</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                        <TextField id="linkmail" label="Enter Name" fullWidth value={pdfFileName} onChange={handlePdfFileNameChange} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDownloadPdfDialog}>Cancel</Button>
                    <Button onClick={handleExportPdf} color="primary">
                        Download
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

AddRemUser.propTypes = {
    title: PropTypes.string
};
