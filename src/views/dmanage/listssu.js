import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { constobj } from '../../misc/constants';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import Swal from 'sweetalert2';
import Box from '@mui/material/Box';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

// User defined Import
import EditSsu from './editssu';
import EditDmd from './edithw';

export default function ListSsu(props) {
    const { DNC_URL } = { ...constobj };
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showEditSsu, setShowEditSsu] = React.useState(false);
    const [showEditDmd, setShowEditDmd] = React.useState(false);
    const [selectedUserName, setSelectedUserName] = React.useState('');
    const [selid, setSelId] = React.useState();
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);

    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 10 },
        { field: 'ssuid', headerName: 'ID', width: 170 },
        { field: 'batch', headerName: 'Batch', width: 150 },
        { field: 'type', headerName: 'Type', width: 100 },
        { field: 'ver', headerName: 'Version', width: 100 },
        { field: 'status', headerName: 'Status', width: 100 },
        { field: 'client', headerName: 'Client', width: 100 },
        { field: 'location', headerName: 'Location', width: 100 },
        { field: 'remarks', headerName: 'Remarks', width: 150 },
        { field: 'adate', headerName: 'Date', width: 200 },

        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 150,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem title="Edit SSU" icon={<EditIcon />} label="Edit" color="inherit" onClick={handleEditSsu(id)} />,
                    <GridActionsCellItem
                        title="Track SSU"
                        icon={<TrackChangesIcon />}
                        label="Edit"
                        color="inherit"
                        onClick={handleTrackSsu(id)}
                    />,
                    <GridActionsCellItem
                        title="Track Hw"
                        icon={<TrackChangesIcon />}
                        label="Edit"
                        color="inherit"
                        onClick={handleTrackHw(id)}
                    />
                    // <GridActionsCellItem icon={<DeleteIcon />} label="Delete" color="inherit" onClick={handleDeleteClick(id)} />
                ];
            }
        }
    ];

    const handleEditSsu = (id) => () => {
        console.log('Handle Edit Click');
        setSelId(id);
        setShowEditSsu(true);
    };

    const handleDeleteClick = (id) => () => {
        const idsToDelete = rows
            .slice(id - 1, id) // Get the selected row
            .map((item) => `${item.ssuid} ?`)
            .join('\n');
        Swal.fire({
            title: 'Confirm Delete',
            html: `Are you sure, do you want to delete the device:
            <pre>${idsToDelete}</pre>
            This action cannot be retrieved.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log('Start to delete a HwSl: ', rows[id - 1].hwsl);
                let dresp = await deleteStock(id);
                Swal.fire(dresp.message);
                getSsuInfo();
            }
        });
    };

    function deleteStock(id) {
        return new Promise(async function (resolve, reject) {
            if (rows[id - 1].status === 'taken' || rows[id - 1].status === 'ready') {
                resolve({ message: "can't delete the stock record, update the status then try again" });
            } else {
                let auth = sessionStorage.getItem('myToken');

                let myuser = sessionStorage.getItem('myUser');
                let myuobj = JSON.parse(myuser);

                var myHeaders = new Headers();
                myHeaders.append('Authorization', 'Bearer ' + auth);
                myHeaders.append('Content-Type', 'application/json');

                let mydict = {};

                mydict['user'] = myuobj.user;
                mydict['level'] = myuobj.level;

                var requestOptions = {
                    method: 'DELETE',
                    headers: myHeaders,
                    body: JSON.stringify(mydict)
                };

                var url = new URL(DNC_URL + '/stock/' + rows[id - 1].hwsl);

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

    const handleTrackSsu = (id) => () => {
        props.lsdata.cbf(2);
        props.lsdata.cbfshw(rows[id - 1].ssuid);
    };

    const handleTrackHw = (id) => () => {
        props.lsdata.cbf(3);
        props.lsdata.cbfshw(rows[id - 1].ssuid);
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

    async function getSsuInfo() {
        const mystock = await getSsuData();
        setRows(mystock);
        props.lsdata.cbfshw(mystock[0].ssuid);
        console.log(mystock);
    }

    function getSsuData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/sdmd');

            let myulist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['ssuid'] = item['ssuid'];
                        myrow['batch'] = item['batch'];
                        myrow['type'] = item['ssutype'];
                        myrow['ver'] = item['ssuver'];
                        myrow['status'] = item['ssustatus'];
                        myrow['client'] = item['client'];
                        myrow['location'] = item['location'];
                        myrow['remarks'] = item['remarks'];
                        myrow['adate'] = item['adate'];
                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const makeStockEditable = () => {
        console.log('Get SSU Info -- List Device');
        setShowEditSsu(false);
        getSsuInfo();
    };

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
        getSsuInfo();
    }, []);

    return (
        <div>
            {showEditSsu && <EditSsu mydata={{ sdata: rows[selid - 1], hcb: makeStockEditable, userName: selectedUserName }} />}
            <div style={{ height: 400, width: '100%', marginTop: 10, marginLeft: -20 }}>
                <DataGrid
                    slots={{ toolbar: GridToolbar }}
                    rows={rows}
                    columns={thcolumns}
                    pageSize={(2, 5, 10, 20)}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowModesModelChange={handleRowModesModelChange}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    density="compact"
                    onProcessRowUpdateError={onProcessRowUpdateError}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel }
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
