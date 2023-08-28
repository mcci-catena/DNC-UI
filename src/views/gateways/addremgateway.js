import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import Swal from 'sweetalert2';
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { constobj } from './../../misc/constants';

export default function AddRemGateway(props) {
    const { DNC_URL } = { ...constobj };

    const [restGws, setRestGws] = useState(['select a Org']);
    const [selGw, setSelGw] = useState(['select a Gateway']);
    const [rows, setRows] = React.useState([]);
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);

    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 100 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'hwid', headerName: 'Hw Id', width: 250 },
        { field: 'model', headerName: 'Model', width: 150 },
        { field: 'location', headerName: 'Location', width: 150 },

        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [<GridActionsCellItem icon={<DeleteIcon />} label="Delete" color="inherit" onClick={handleDeleteGw(id)} />];
            }
        }
    ];

    const handleDeleteGw = (id) => () => {
        const confirmationMessage = `Are you sure, do you want to delete the following Gateway :
         ${rows[id - 1].name} ? \n
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
                let dresp = await removeGw(id);
                Swal.fire(dresp.message);
                let myorg = sessionStorage.getItem('myOrg');
                getGwInfo(myorg);
            }
        });
    };

    function removeGw(id) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            let myorg = sessionStorage.getItem('myOrg');

            const mydict = {};
            mydict['fncode'] = 'rmgw';
            mydict['org'] = myorg;
            mydict['data'] = { gws: [rows[id - 1].name] };
            // mydict['data'] = {gws: [selGw]}

            console.log('MyDict: ', mydict);

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

    async function gwChange(e) {
        let selfunc = e.target.value;
        setSelGw(e.target.value);
    }

    const handleAddClick = () => {
        console.log('Selected Gateway:', selGw);
        addGwToOrg();
    };

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleEditClick = (id) => () => {
        console.log('Edit Triggered: ===> ', id);
        setSelId(id);
        setMyUser(true);
    };

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        return updatedRow;
    };

    const onProcessRowUpdateError = (error) => {
        console.log('Error: --->', error);
    };

    async function addGwToOrg() {
        let myorg = sessionStorage.getItem('myOrg');
        const mydict = {};
        mydict['fncode'] = 'addgw';
        mydict['org'] = myorg;
        mydict['data'] = { gws: [selGw] };

        const myresp = await requestToAddGw(mydict);

        Swal.fire(myresp.message);

        getGwInfo(myorg);
    }

    function requestToAddGw(mydict) {
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

    async function getGwInfo(myorg) {
        const mygw = await getGwData(myorg);
        setRows(mygw);
        const allgw = await getAllGwList();
        const linkedgw = getLinkedGw(mygw);
        let finalList = [];
        for (let i = 0; i < allgw.length; i++) {
            if (!linkedgw.includes(allgw[i])) {
                finalList.push(allgw[i]);
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
        setRestGws(mynewo);
        setSelGw(mynewo[0].value);
    }

    function getLinkedGw(mygw) {
        let linkgw = [];
        for (let i = 0; i < mygw.length; i++) {
            linkgw.push(mygw[i].name);
        }
        return linkgw;
    }

    function getGwData(myorg) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/orggw/' + myorg);

            let myulist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Data: ', data);
                    data.message.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['gwid'] = item['gwid'];
                        myrow['name'] = item['name'];
                        myrow['hwid'] = item['hwid'];
                        myrow['location'] = item['location'];
                        myrow['technology'] = item['technology'];
                        myrow['network'] = item['network'];
                        myrow['model'] = item['model'];
                        myrow['status'] = item['status'];
                        myrow['removedOn'] = item['removedOn'];
                        myrow['lastUptdOn'] = item['lastUptdOn'];
                        myrow['installedOn'] = item['installedOn'];
                        myrow['orgid'] = item['orgid'] != null ? item['orgid'].split(',')[0] : '';
                        myrow['orgn'] = item['orgid'] != null ? item['orgid'].split(',')[1] : '';
                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function getAllGwList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/gwunit');

            let myulist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Data-1201: ', data);
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

    useEffect(() => {
        console.log('Use Effect');
        let myorg = sessionStorage.getItem('myOrg');
        getGwInfo(myorg);

        const interval = setInterval(() => {
            // console.log('This will run every second!');
            let norg = sessionStorage.getItem('myOrg');
            if (norg != myorg) {
                myorg = norg;
                getGwInfo(myorg);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div style={{ height: 100, margin: '5px 0' }}>
                {/* <h7 style={{ fontSize: '16px', marginBottom: '5px' }}>Select a User</h7> */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        style={{ width: '30%' }}
                        id="selgw"
                        select
                        label="Select Gateway"
                        Placeholder="select gateway"
                        helperText=" "
                        value={selGw}
                        onChange={gwChange}
                        sx={{ height: '40px' }}
                    >
                        {restGws.map((msgLoc) => (
                            <MenuItem key={msgLoc.id} value={msgLoc.value}>
                                {msgLoc.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <Button
                        style={{ width: '8%', maxWidth: '300px', marginLeft: '2%', marginTop: '1%' }}
                        onClick={handleAddClick}
                        variant="contained"
                        color="success"
                    >
                        Add
                    </Button>
                </div>
            </div>
            <div style={{ height: 400, width: '100%', marginTop: '-28px' }}>
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
                    components={{
                        Toolbar: GridToolbar
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
