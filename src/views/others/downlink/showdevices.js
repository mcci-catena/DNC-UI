import React, { useState, useEffect } from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import NetworkPingOutlinedIcon from '@mui/icons-material/NetworkPingOutlined';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ScreenRotationAltSharpIcon from '@mui/icons-material/ScreenRotationAltSharp';
import { constobj } from './../../../misc/constants';
import Co2calibration from './co2calibration';

export default function ShowDevices(props) {
    const { DNC_URL } = { ...constobj };
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const [cols, setCols] = React.useState([]);
    const [mypopup, setMyPopUp] = React.useState(false);
    const [delpopup, setDelPopUp] = React.useState(false);
    const [myassign, setMyAssign] = React.useState(false);

    const { data1, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6
    });

    const [selid, setSelId] = React.useState();
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);

    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 50 },
        { field: 'sname', headerName: 'Spot Name', width: 150 },
        { field: 'devtype', headerName: 'Device ID Type', width: 150 },
        { field: 'devid', headerName: 'Device ID', width: 200 },

        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        icon={<NetworkPingOutlinedIcon />}
                        onClick={handleDnLink(id)}
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                    />
                ];
            }
        }
    ];

    useEffect(() => {
        console.log('Use Effect ====> ===>');
        // props.lsdata.cbftitle('Spots -> ManageSpot');

        let myorg = sessionStorage.getItem('myOrg');

        getSpotInfo(myorg);

        const interval = setInterval(() => {
            // console.log('This will run every second!');
            let norg = sessionStorage.getItem('myOrg');
            if (norg != myorg) {
                myorg = norg;
                getSpotInfo(myorg);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function isothertags(value) {
        if (value == 'latitude' || value == 'longitude' || value == 'sid' || value == 'user') {
            return false;
        }
        return true;
    }

    async function getSpotInfo(myorg) {
        const myspot = await getSpotData(myorg);
        // let myrow = myspot[0];
        setRows(myspot);
    }

    function getSpotData(myorg) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/dlspot/' + myorg);

            let myslist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log('Real Data: ', data);
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['sname'] = item.sname;
                        myrow['devtype'] = item.devtype;
                        myrow['devid'] = item.devid;
                        myslist.push(myrow);
                    });
                    resolve(myslist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleDnLink = (id) => () => {
        console.log('Edit Triggered: ===> ', id);
        console.log('Selected ID: ', id, rows[id - 1]);
        sendDownLink(rows[id - 1].devid);
    };

    async function sendDownLink(devId) {
        try {
            let dlresp = await onSubmitDL(devId);
            console.log('Success Resp: ', dlresp['message']);
            Swal.fire(dlresp['message']);
        } catch (error) {
            console.log('Fail Resp: ', error['message']);
            Swal.fire(error['message']);
        }
    }

    function onSubmitDL(devId) {
        return new Promise(async function (resolve, reject) {
            let co2data = document.getElementById('co2input').value;

            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var raw = JSON.stringify({ dndata: co2data, devId: devId });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw
            };

            console.log('Before DnLink Sent: ', co2data, devId);

            fetch(DNC_URL + '/sdnlink', requestOptions)
                .then((response) => response.json())
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });
    }

    const onProcessRowUpdateError = (error) => {
        console.log('Error: --->', error);
    };

    async function devrecord() {
        setMyAssign(false);
        //let sname = rows[selid - 1].sname;
        props.lsdata.cbf(2);
        props.lsdata.cbfsid(rows[selid - 1].sid);
        props.lsdata.cbfsname(rows[selid - 1].sname);
        // props.lsdata.cbftitle('Spots -> ManageDevice -> '+sname);
    }

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    //const processRowUpdate = async (newRow) => {};

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        return updatedRow;
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
            {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h6 style={{ marginRight: '10px', verticalAlign: 'middle' }}>Co2 calibration</h6>
                <TextField
                    id="co2input"
                    label="Enter Data"
                    type="number"
                    variant="standard"
                    style={{ verticalAlign: 'middle', marginTop: '-10px' }}
                />
                <h6 style={{ marginLeft: '10px', verticalAlign: 'middle' }}>ppm</h6>
            </div> */}
            <div>
                <Co2calibration />
            </div>
            <div style={{ height: 400, width: '100%', marginTop: 15, marginLeft: -20 }}>
                {myassign ? devrecord() : null}
                <DataGrid
                    loading={loading}
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
