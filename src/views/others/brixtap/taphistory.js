import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { GridRowModes, GridActionsCellItem } from '@mui/x-data-grid-pro';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Swal from 'sweetalert2';

import { useDemoData } from '@mui/x-data-grid-generator';
import 'jspdf-autotable';

import { randomCreatedDate, randomTraderName, randomUpdatedDate, randomId } from '@mui/x-data-grid-generator';
import EditTabHistory from './edittaphistory';
import { constobj } from './../../../misc/constants';

const mydate = randomCreatedDate();
const initialRows = [{ id: 1, location: '', dcp: '', tapCount: '', edate: mydate }];

export default function TapHistory(props) {
    const { DNC_URL, CPLUGIN_URL } = { ...constobj };

    const [rows, setRows] = React.useState(initialRows);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showEditTabHistory, setshowEditTabHistory] = React.useState(false);
    const [location, setLocation] = useState('All');
    const [dcpoints, setDcpoints] = useState([{ sid: 1, sname: 'All' }]);
    const [selid, setSelId] = React.useState();

    const [selSpot, setSelSpot] = useState('All');

    const { data1, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6
    });

    const locations = [
        { id: 1, label: 'All', value: 'All' },
        { id: 2, label: 'Arnot', value: 'Arnot' },
        { id: 3, label: 'Uihlein', value: 'Uihlein' },
        { id: 4, label: 'UVM', value: 'UVM' }
    ];

    useEffect(() => {
        getAllSpotTaps();
    }, []);

    async function getAllSpotTaps() {
        let mydev = await getDeviceList('Collie-Flow', 'All');
        setDcpoints(mydev);
        getTapInfo('All', 'All');
    }

    async function getTapInfo(loc, dcp) {
        const mytap = await getTapData(loc, dcp);
        setRows(mytap);
    }

    function convertdatetime(indata) {
        const [mydate, mytime] = indata.split('T');
        const ndate = mydate.replace(/-/g, '/');
        const [ntime, zonet] = mytime.split(',');
        const ftime = '' + ndate + ',' + ntime + ' AM';
    }

    function getTapData(loc, dcp) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            const mybody = {
                location: loc,
                dcp: dcp
            };
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(CPLUGIN_URL + '/tap');
            for (let key in mybody) {
                if (mybody[key] !== 'All') url.searchParams.append(key, mybody[key]);
            }
            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        item['id'] = index + 1;
                        item['edate'] = new Date(item['edate']);
                    });
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function getDeviceList(gclient, gloc) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            fetch(DNC_URL + '/spot/' + gclient, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    let cdev = data.filter(function (row) {
                        if (gloc === 'All') {
                            return row.sname;
                        } else {
                            // return row.Location == gloc && row.rdate == null;
                            return row.location == gloc;
                        }
                    });
                    resolve([{ sid: 1, sname: 'All' }, ...cdev]);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function locationChange(e) {
        let selloc = e.target.value;
        setLocation(e.target.value);
        let mydev = await getDeviceList('Collie-Flow', selloc);
        setDcpoints(mydev);
    }

    function triggerTapRead() {
        getTapInfo(location, selSpot);
    }

    async function onSubmitCount(e) {
        triggerTapRead();
    }

    async function spotChange(e) {
        setSelSpot(e.target.value);
        getTapInfo(location, e.target.value);
    }

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleSaveClick = (id) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    function updateTap(mydict) {
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

            fetch(CPLUGIN_URL + '/tap', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    function deleteTap(rid) {
        return new Promise(async function (resolve, reject) {
            let mydict = rows[rid - 1];

            const mybody = {
                location: mydict.location,
                dcp: mydict.dcp,
                edate: mydict.edate
            };

            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: JSON.stringify(mybody)
            };

            fetch(CPLUGIN_URL + '/tap', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const handleEditClick = (id) => () => {
        setSelId(id);
        setshowEditTabHistory(true);
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                let dresp = await deleteTap(id);
                Swal.fire(dresp);
                setRows(rows.filter((row) => row.id !== id));
            }
        });
    };

    const makeUserEditable = () => {
        setshowEditTabHistory(false);
        getTapInfo(location, selSpot);
    };

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const onProcessRowUpdateError = (error) => {
        console.log('Error: --->', error);
    };

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        const newdict = {};
        const mid = updatedRow.id;
        const sid = (mid - 1).toString(10);

        newdict['edate'] = updatedRow.edate;
        newdict['tapCount'] = updatedRow.tapCount;

        const mydict = {};
        mydict['location'] = rows[sid].location;
        mydict['dcp'] = rows[sid].dcp;
        mydict['edate'] = rows[sid].edate;
        mydict['tapCount'] = rows[sid].tapCount;

        let uresp = await updateTap({ data: mydict, new: newdict });
        Swal.fire(uresp);

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const columns = [
        { field: 'id', headerName: 'SlNo', width: 100, editable: false },
        { field: 'location', width: 150, headerName: 'Location', type: 'string', editable: false },
        {
            field: 'dcp',
            headerName: 'DCP',
            type: 'string',
            width: 100,
            editable: false
        },
        {
            field: 'tapCount',
            headerName: 'Tap Count',
            type: 'number',
            width: 150,
            editable: true
        },
        {
            field: 'edate',
            headerName: 'Date (DD/MM/YYYY), Time',
            type: 'dateTime',
            format: 'yyyy/mm/dd',
            width: 250,
            editable: true
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem
                        title="Edit User"
                        icon={<EditIcon />}
                        label="Edit"
                        color="inherit"
                        onClick={handleEditClick(id)}
                    />,
                    <GridActionsCellItem icon={<DeleteIcon />} label="Delete" color="inherit" onClick={handleDeleteClick(id)} />
                ];
            }
        }
    ];

    return (
        <div>
            <div>
                <FormControl fullWidth style={{ width: '20%', marginRight: '10px' }}>
                    <InputLabel id="status-label">Select Location</InputLabel>
                    <Select labelId="demo-simple-select-label" name="location" id="location" value={location} onChange={locationChange}>
                        {locations.map((msgLoc) => (
                            <MenuItem key={msgLoc.id} value={msgLoc.value}>
                                {msgLoc.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth style={{ width: '20%' }}>
                    <InputLabel id="status-label">Select Data Point (DCP)</InputLabel>
                    <Select labelId="demo-simple-select-label" name="dcpoint" id="dcpoint" value={selSpot} onChange={spotChange}>
                        {dcpoints.map((msgLoc) => (
                            <MenuItem key={msgLoc.sid} value={msgLoc.sname}>
                                {msgLoc.sname}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    value="Show"
                    onClick={onSubmitCount}
                    style={{
                        backgroundColor: 'green',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '15px',
                        marginTop: 5,
                        marginLeft: 10,
                        width: '5%'
                    }}
                >
                    Show
                </Button>
            </div>
            {showEditTabHistory ? <EditTabHistory mydata={{ sdata: rows[selid - 1], hcb: makeUserEditable }} /> : null}
            <div style={{ height: 400, width: '100%', marginTop: 20, marginLeft: -20 }}>
                <DataGrid
                    {...data1}
                    loading={loading}
                    slots={{ toolbar: GridToolbar }}
                    rows={rows}
                    columns={columns}
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
                    // slots={{
                    //     toolbar: CustomToolbar
                    // }}
                />
            </div>
        </div>
    );
}
