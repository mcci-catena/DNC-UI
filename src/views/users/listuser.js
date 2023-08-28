import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// User defined Import
import EditUser from './edituser';
import { constobj } from './../../misc/constants';

export default function ListUser(props) {
    const { DNC_URL } = { ...constobj };

    const myroles = ['Org-User', 'Org-Admin', 'App-User', 'App-Admin'];

    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showEditUser, setShowEditUser] = React.useState(false);
    const [csvFileName, setCsvFileName] = React.useState('');
    const [selid, setSelId] = React.useState();
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);

    const thcolumns = [
        { field: 'id', headerName: 'S/No', width: 8 },
        { field: 'name', headerName: 'Name', width: 90 },
        { field: 'email', headerName: 'Email', width: 180 },
        { field: 'firstname', headerName: 'First Name', width: 100 },
        { field: 'lastname', headerName: 'Last Name', width: 110 },
        { field: 'role', headerName: 'Role', width: 100 },
        { field: 'status', headerName: 'Status', width: 80 },
        { field: 'lastlogin', headerName: 'Last Login', width: 230 },
        { field: 'logout', headerName: 'Logout', width: 200 },

        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id, row }) => {
                // Use "row" to access user data
                const { name, role } = row; // Extract name and role from the user's row data
                return [
                    <GridActionsCellItem title="Edit User" icon={<EditIcon />} label="Edit" color="inherit" onClick={handleEditUser(id)} />,
                    <GridActionsCellItem
                        icon={<DeleteIcon />}
                        label="Delete"
                        color="inherit"
                        onClick={handleDeleteUser(id, name, role)} // Pass name and role here
                    />
                ];
            }
        }
    ];

    const handleEditUser = (id) => () => {
        setSelId(id);
        setShowEditUser(true);
    };

    const handleDeleteUser = (id) => () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this data!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let dresp = await deleteUser(id);
                Swal.fire(dresp.message);
                getUserInfo();
            }
        });
    };

    function deleteUser(id) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');

            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);

            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            let mydict = {};
            mydict['user'] = myuobj.user;
            mydict['level'] = myuobj.level;
            console.log('User Request: ', mydict);

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };

            var url = new URL(DNC_URL + '/user/' + [rows[id - 1].name]);

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

    const makeUserEditable = () => {
        setShowEditUser(false);
        getUserInfo();
    };

    async function getUserInfo() {
        const myuser = await getUserData();
        setRows(myuser);
    }

    function getUserData() {
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
        getUserInfo();
    }, []);

    return (
        <div>
            {showEditUser ? <EditUser mydata={{ sdata: rows[selid - 1], hcb: makeUserEditable }} /> : null}
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
                        toolbar: CustomToolbar
                    }}
                />
            </div>
            <Dialog open={openDownloadDialog} onClose={handleCloseDownloadDialog}>
                <DialogTitle>Enter CSV File Name</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
                        <TextField
                            id="linkmail"
                            label="Enter Name"
                            fullWidth
                            fullWidth
                            value={csvFileName}
                            onChange={handleCsvFileNameChange}
                        />
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
