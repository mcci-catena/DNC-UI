import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useDemoData } from '@mui/x-data-grid-generator';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SettingsInputAntennaOutlinedIcon from '@mui/icons-material/SettingsInputAntennaOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';
import Editdatasource from './editdatasources';
import DownloadIcon from '@mui/icons-material/Download';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector } from '@mui/x-data-grid';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { SaveAlt as PdfIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

import { constobj } from './../../misc/constants';

export default function DataSource() {
    const { DNC_URL } = { ...constobj };
    const [dsname, setDsName] = React.useState('');
    const [dburl, setDbUrl] = React.useState('http://influxdb:8086');
    const [dbuname, setDbUname] = React.useState('');
    const [dbpwd, setDbPwd] = React.useState('');
    const [dblist, setDblist] = React.useState([]);
    const [seldb, setSelDb] = React.useState('');
    const [mmtlist, setMmtlist] = React.useState([]);
    const [selmmt, setSelMmt] = React.useState('');
    const [selid, setSelId] = React.useState();
    const [rows, setRows] = React.useState([]);
    const [csvFileName, setCsvFileName] = React.useState('');
    const [openDownloadDialog, setOpenDownloadDialog] = React.useState(false);
    const [openDownloadPdfDialog, setOpenDownloadPdfDialog] = React.useState(false);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [mypopup, setMyPopUp] = React.useState(false);
    const { data1, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6
    });

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 50 },
        { field: 'dsname', headerName: 'Name', width: 150 },
        { field: 'dburl', headerName: 'URL', width: 350 },
        { field: 'dbname', headerName: 'DataBase Name', width: 160 },
        { field: 'mmtname', headerName: 'Measurement Name', width: 220 },
        { field: 'user', headerName: 'User', width: 80 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={handleSaveClick(id)} />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            color="inherit"
                            onClick={handleCancelClick(id)}
                        />
                    ];
                }
                return [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        className="textPrimary"
                        color="inherit"
                        onClick={handleEditClick(id)}
                    />,
                    <GridActionsCellItem icon={<DeleteIcon />} label="Delete" color="inherit" onClick={handleDeleteClick(id)} />
                ];
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
        setMyPopUp(true);
    };

    const makepopenable = () => {
        setMyPopUp(false);
        getDsInfo();
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
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
        const confirmationMessage = `Are you sure you want to delete data source : \n
        ${data[id - 1].dsname} ?\n
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
                console.log('Start to delete a DS: ', data[id - 1].dsname);
                let dresp = await deleteDs(id);
                Swal.fire(dresp.message);
                getDsInfo();
            }
        });
    };

    function deleteDs(id) {
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

            var url = new URL(DNC_URL + '/dsrc/' + data[id - 1].dsname);

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

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        return updatedRow;
    };

    async function onsavesource() {
        let srcdict = {};
        srcdict['dsname'] = document.getElementById('dsname_tin').value;
        srcdict['dburl'] = document.getElementById('dburl_tin').value;
        srcdict['dbname'] = seldb;
        srcdict['mmtname'] = selmmt;
        srcdict['uname'] = document.getElementById('dbuname_tin').value;
        srcdict['pwd'] = document.getElementById('dbpwd_tin').value;

        try {
            let dres = await setDataSource(srcdict);
            Swal.fire(dres.message);
            clearAllFields();
            setValue(0);
            getDsInfo();
        } catch (err) {
            Swal.fire(err);
        }
    }

    function clearAllFields() {
        setDsName('');
        setDbUrl('http://influxdb:8086');
        setDbUname('');
        setDbPwd('');
    }

    //passwordfield
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = (event) => {
        event.preventDefault();
        setDsName(document.getElementById('dsname_tin').value);
        setDbUrl(document.getElementById('dburl_tin').value);
        setDbUname(document.getElementById('dbuname_tin').value);
        setDbPwd(document.getElementById('dbpwd_tin').value);
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    //refreshdbonclick
    const handleRefershdb = async () => {
        setDsName(document.getElementById('dsname_tin').value);
        setDbUrl(document.getElementById('dburl_tin').value);
        setDbUname(document.getElementById('dbuname_tin').value);
        setDbPwd(document.getElementById('dbpwd_tin').value);
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

    const handleRefershmmt = async () => {
        let mydb = seldb;
        const mymmts = await getMmtList(mydb);
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

    const [data, setData] = useState([
        {
            id: 1,
            dsname: '',
            dburl: '',
            dbname: '',
            mmtname: '',
            uname: '',
            pwd: '',
            user: ''
        }
    ]);
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
        const csvData = data.map((row) => Object.values(row).join(',')).join('\n');

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
        getDsInfo();
    }, []);

    async function getDsInfo() {
        const myuser = await getUserData();
        setData(myuser);
        console.log(myuser);
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

    async function onchangeMmt(e) {
        let mselmmt = e.target.value;
        setSelMmt(mselmmt);
    }

    function setDataSource(mydict) {
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
            var url = new URL(DNC_URL + '/dsrc');

            fetch(url, requestOptions)
                .then(async (response) => {
                    if (response.status == '400') {
                        let resp = await response.json();
                        reject(resp.message);
                    } else {
                        console.log('Response Code: ', response.status);
                        //return response.json()
                        let data = await response.json();
                        resolve(data);
                    }
                })
                .catch((error) => {
                    console.log('Err Resp SDS: ', error);
                    reject(error);
                });
        });
    }

    function getDbList() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            const mydict = {};
            mydict['dburl'] = document.getElementById('dburl_tin').value;
            mydict['dbuname'] = document.getElementById('dbuname_tin').value;
            mydict['dbpwd'] = document.getElementById('dbpwd_tin').value;

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
            mydict['dburl'] = document.getElementById('dburl_tin').value;
            mydict['dbuname'] = document.getElementById('dbuname_tin').value;
            mydict['dbpwd'] = document.getElementById('dbpwd_tin').value;
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

    // get User data
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
            var url = new URL(DNC_URL + '/dsrc');

            let myulist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['dsname'] = item['dsname'];
                        myrow['dburl'] = item['dburl'];
                        myrow['dbname'] = item['dbname'];
                        myrow['mmtname'] = item['mmtname'];
                        myrow['uname'] = item['uname'];
                        myrow['pwd'] = item['pwd'];
                        myrow['user'] = item['user'];
                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // Tab bar function starts
    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired
    };

    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`
        };
    }

    return (
        <div className="dashboard-container">
            {mypopup ? <Editdatasource mydata={{ sdata: data[selid - 1], hcb: makepopenable }} /> : null}
            <div className="dashboard-inner">
                <MainCard title="Data Source">
                    <div>
                        <Box sx={{ width: '100%' }}>
                            <Box>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab
                                        style={{ color: 'darkblue' }}
                                        icon={<SettingsInputAntennaOutlinedIcon />}
                                        label="Data Source"
                                        {...a11yProps(0)}
                                    />
                                    <Tab
                                        style={{ color: 'darkblue' }}
                                        icon={<AddCircleOutlinedIcon />}
                                        label="Add Data Source"
                                        {...a11yProps(1)}
                                    />
                                </Tabs>
                            </Box>

                            {/* tab bar started for gateways */}
                            <TabPanel value={value} index={0}>
                                <div style={{ height: 400, width: '100%', marginTop: -1, marginLeft: -20 }}>
                                    <DataGrid
                                        {...data1}
                                        loading={loading}
                                        slots={{ toolbar: GridToolbar }}
                                        rows={data}
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
                                        onProcessRowUpdateError={onProcessRowUpdateError}
                                        density="compact"
                                        slotProps={{
                                            toolbar: { setRows, setRowModesModel }
                                        }}
                                        slots={{
                                            toolbar: CustomToolbar
                                        }}
                                    />
                                </div>
                            </TabPanel>

                            {/* tab bar for Add gateway */}
                            <TabPanel value={value} index={1}>
                                <Box
                                    component="form"
                                    sx={{
                                        '& .MuiTextField-root': { m: 2, width: '45ch' }
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField label="Name" defaultValue={dsname} id="dsname_tin" />
                                    <TextField label="URL" defaultValue={dburl} id="dburl_tin" />
                                    <TextField label="User-Name" defaultValue={dbuname} id="dbuname_tin" />
                                    <FormControl
                                        style={{
                                            marginTop: '1.5%',
                                            marginLeft: '2%',
                                            width: '45ch',
                                            '@media (maxWidth: 600px)': {
                                                width: '100%'
                                            }
                                        }}
                                        variant="outlined"
                                    >
                                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                        <OutlinedInput
                                            id="dbpwd_tin"
                                            defaultValue={dbpwd}
                                            type={showPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        // onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                            sx={{
                                                '@media (max-width: 600px)': {
                                                    // Adjust other styles for screens with a maximum width of 600px
                                                }
                                            }}
                                        />
                                    </FormControl>

                                    <TextField
                                        style={{ marginLeft: '2%' }}
                                        id="selectdb"
                                        select
                                        label="Select Database"
                                        Placeholder="Select Database"
                                        value={seldb}
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
                                        style={{ marginTop: '25px', width: '100%', maxWidth: '100px' }} // Adjust width and maxWidth as needed
                                        onClick={handleRefershdb}
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Refresh
                                    </Button>

                                    <br></br>
                                    <TextField
                                        id="selectmmt"
                                        select
                                        onChange={onchangeMmt}
                                        label="Select Measurement"
                                        placeholder="Select Measurement"
                                        value={selmmt}
                                        helperText=" "
                                        style={{
                                            width: '100%',
                                            maxWidth: '350px',
                                            marginBottom: '10px',
                                            marginTop: '-1.5%',
                                            marginLeft: '2%'
                                            // Add more styles as needed
                                        }}
                                    >
                                        {mmtlist.map((option) => (
                                            <MenuItem key={option.value} value={option.label}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <Button
                                        style={{ marginTop: '-5px', width: '100%', maxWidth: '100px' }} // Adjust width and maxWidth as needed
                                        onClick={handleRefershmmt}
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Refresh
                                    </Button>

                                    <div style={{ marginLeft: '18px' }} class="position-absolute top-center">
                                        <Button onClick={onsavesource} type="button" variant="contained" class="btn btn-primary">
                                            Save
                                        </Button>
                                    </div>
                                </Box>
                            </TabPanel>
                        </Box>
                    </div>
                </MainCard>
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
        </div>
    );
}
