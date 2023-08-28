import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { useDemoData } from '@mui/x-data-grid-generator';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import MainCard from 'ui-component/cards/MainCard';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Swal from 'sweetalert2';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
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

export default function Managestock() {
    const BASE_URL = 'https://training.mcci.io/dncserverv';
    const [value1, setValue1] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue1(newValue);
    };

    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});

    const thcolumns = [
        { field: 'id', headerName: 'SINO', width: 700 },
        { field: 'hwsl', headerName: 'hwsl', width: 100 },
        { field: 'devID', headerName: 'devID', width: 10 },
        { field: 'devEUI', headerName: 'devEUI', width: 110 },
        { field: 'idate', headerName: 'In-Date', width: 100 },
        { field: 'odate', headerName: 'Out-Date', width: 100 },
        { field: 'remarks', headerName: 'Remarks', width: 80 },
        { field: 'dsid', headerName: 'dataSource', width: 70 },
        { field: 'org', headerName: 'Organization', width: 115 },
        { field: 'user', headerName: 'user', width: 100 },
        { field: 'status', headerName: 'status', width: 100, type: 'string', editable: true },
        { field: 'boardRev', headerName: 'boardRev', width: 100, type: 'string', editable: true },
        { field: 'fwver', headerName: 'Fw.Version', width: 100, type: 'string', editable: true },
        { field: 'fwupdtdon', headerName: 'FwUpdateOn', width: 100, type: 'string', editable: true },
        { field: 'technology', headerName: 'Technology', width: 100, type: 'string', editable: true },
        { field: 'region', headerName: 'Region', width: 100, type: 'string', editable: true },

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

    const { data1, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6
    });

    const [data, setData] = useState([
        {
            id: 1,
            hwsl: '',
            devID: '',
            devEUI: '',
            idate: '',
            odate: '',
            remarks: '',
            dsid: '',
            org: '',
            user: '',
            status: '',
            boardRev: '',
            fwver: '',
            fwupdtdon: '',
            technology: '',
            region: ''
        }
    ]);

    useEffect(() => {
        // console.log("Use Effect")
        getStockInfo();
    }, []);

    async function getStockInfo() {
        const mystock = await getStockData();
        setRows(mystock);
        console.log(mystock);
    }

    // get User data
    function getStockData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(BASE_URL + '/stock');

            let myulist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['hwsl'] = item['hwsl'];
                        myrow['devID'] = item['devID'];
                        myrow['devEUI'] = item['devEUI'];
                        myrow['idate'] = item['idate'];
                        myrow['odate'] = item['odate'];
                        myrow['remarks'] = item['remarks'];
                        myrow['dsid'] = item['dsid'];
                        myrow['org'] = item['org'];
                        myrow['user'] = item['user'];
                        myrow['status'] = item['status'];
                        myrow['boardRev'] = item['boardRev'];
                        myrow['fwver'] = item['fwver'];
                        myrow['fwupdtdon'] = item['fwupdtdon'];
                        myrow['technology'] = item['technology'];
                        myrow['region'] = item['region'];
                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    function IconLabelTabs() {
        const [value, setValue] = React.useState(0);

        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
    }

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const onProcessRowUpdateError = (error) => {
        console.log('Error: --->', error);
    };

    const handleEditClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleCancelClick = (id) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true }
        });
    };

    const handleDeleteClick = (id) => async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this data!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        // .then(async (result) => {
        //     if (result.isConfirmed) {
        //         let dresp = await deleteBrix(id)
        //         Swal.fire(
        //             dresp
        //         )
        //         setRows(rows.filter((row) => row.id !== id));
        //     }
        // })
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    function updateStock(mydict) {
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

            var url = new URL(BASE_URL + '/stock');

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

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        // Get Updated Row ID
        const urid = updatedRow.id;
        const uridstr = (urid - 1).toString(10);

        console.log('My ID is: ', 'welcome123-a');

        // console.log("Row IDs: ", Object.keys(updatedRow))
        let gkeys = Object.keys(updatedRow);

        for (let i = 0; i < gkeys.length; i++) {
            if (gkeys[i] === 'id' || gkeys[i] === 'isNew') {
                gkeys.splice(i, 1);
            }
        }

        let olddict = {};
        let newdict = {};

        for (let i = 0; i < gkeys.length; i++) {
            newdict[gkeys[i]] = updatedRow[gkeys[i]];
        }

        gkeys = Object.keys(rows[uridstr]);
        for (let i = 0; i < gkeys.length; i++) {
            olddict[gkeys[i]] = rows[uridstr][gkeys[i]];
        }

        let uresp = await updateStock({ data: olddict, new: newdict });

        Swal.fire(uresp);

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <MainCard title="Manage Stocks ">
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value1} onChange={handleChange} aria-label="basic tabs example">
                                <Tab
                                    style={{ color: 'darkblue' }}
                                    icon={<Inventory2OutlinedIcon />}
                                    label="Manage Stock"
                                    {...a11yProps(0)}
                                />
                                <Tab
                                    style={{ color: 'darkblue' }}
                                    icon={<AddCircleRoundedIcon />}
                                    label="Manage Stock"
                                    label="Add Stock"
                                    {...a11yProps(1)}
                                />
                                {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
                            </Tabs>
                        </Box>
                        <div>
                            <TabPanel value={value1} index={0}>
                                <div style={{ height: 400, width: '100%', marginTop: 20, marginLeft: -10 }}>
                                    <DataGrid
                                        {...data1}
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
                                        onProcessRowUpdateError={onProcessRowUpdateError}
                                        slotProps={{
                                            toolbar: { setRows, setRowModesModel }
                                        }}
                                    />
                                </div>
                            </TabPanel>
                            <TabPanel value={value1} index={1}>
                                <Box
                                    component="form"
                                    sx={{
                                        '& .MuiTextField-root': { m: 2, width: '45ch' }
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField label="Gateway Id" id="outlined-size-normal" />
                                    <TextField label="Location" id="outlined-size-normal" />
                                    <TextField label="Technology" id="outlined-size-normal" />
                                </Box>
                            </TabPanel>
                        </div>
                    </Box>
                </MainCard>
            </div>
        </div>
    );
}
