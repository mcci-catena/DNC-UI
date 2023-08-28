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
import EditBrixHistory from './editbrixhistory';

const mydate = randomCreatedDate();

const initialRows = [{ id: 1, brix: '', date: mydate }];

import { constobj } from './../../../misc/constants';

export default function BrixHistory(props) {
    const { CPLUGIN_URL } = { ...constobj };
    const [rows, setRows] = React.useState(initialRows);
    const [showEditBriHistory, setshowEditBriHistory] = React.useState(false);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [location, setLocation] = useState('Arnot');
    const [selid, setSelId] = React.useState();

    const columns = [
        { field: 'id', headerName: 'SlNo', width: 100 },
        { field: 'brix', headerName: 'Brix', width: 100 },
        { field: 'date', headerName: 'Date/Time', width: 400 },
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
    const handleEditClick = (id) => () => {
        setSelId(id);
        setshowEditBriHistory(true);
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
                let dresp = await deleteBrix(id);
                Swal.fire(dresp);
                setRows(rows.filter((row) => row.id !== id));
            }
        });
    };
    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };
    const { data1, loading } = useDemoData({
        dataSet: 'Commodity',
        rowLength: 4,
        maxColumns: 6
    });
    const locations = [
        { id: 1, label: 'Arnot', value: 'Arnot' },
        { id: 2, label: 'Uihlein', value: 'Uihlein' },
        { id: 3, label: 'UVM', value: 'UVM' }
    ];

    useEffect(() => {
        getBrixInfo('Arnot');
    }, []);

    async function getBrixInfo(selloc) {
        const mybrix = await getBrixData(selloc);
        setRows(mybrix);
    }
    const handleRowModesModelChange = (newRowModesModel) => {
        setRowModesModel(newRowModesModel);
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const onProcessRowUpdateError = (error) => {
        console.log('Error: --->', error);
    };

    const makeUserEditable = () => {
        setshowEditBriHistory(false);
        getBrixInfo(location);
    };

    function getBrixData(selloc) {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');
            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            fetch(CPLUGIN_URL + '/brix/' + selloc, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    let clist = [];
                    data.forEach((item, index) => {
                        // clist.push({ id: index + 1, brix: item[selloc], date: new Date(item['rdate']) });
                        clist.push({ id: index + 1, brix: item[selloc], date: item['rdate'] });
                    });
                    resolve(clist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    function converttimestr(bdate) {
        let brixdate = bdate.toISOString();
        let mydate = brixdate.split('T')[0].split('-');
        let mytime = brixdate.split('T')[1].split('.')[0];
        let mybrixdate = mydate[1] + '-' + mydate[2] + '-' + mydate[0] + ',' + mytime;
        return mybrixdate;
    }

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        const newdict = {};
        const mid = updatedRow.id;
        const sid = (mid - 1).toString(10);

        let newdtstr = converttimestr(updatedRow.date);
        newdict['rdate'] = newdtstr;
        newdict[location] = updatedRow.brix;

        const mydict = {};
        let mydtstr = converttimestr(rows[sid].date);

        mydict['rdate'] = mydtstr;
        mydict[location] = rows[sid].brix;

        let uresp = await updateBrix({ data: mydict, new: newdict });

        Swal.fire(uresp);

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    function updateBrix(mydict) {
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

            fetch(CPLUGIN_URL + '/brix', requestOptions)
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

    function deleteBrix(rid) {
        return new Promise(async function (resolve, reject) {
            const mydict = {};
            let dtstr = converttimestr(new Date(rows[rid - 1].date));

            mydict['rdate'] = dtstr;
            mydict[location] = rows[rid - 1].brix;

            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'DELETE',
                headers: myHeaders,
                body: JSON.stringify(mydict)
            };

            fetch(CPLUGIN_URL + '/brix', requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function locationChange(e) {
        let selloc = e.target.value;
        setLocation(e.target.value);
        let mybrix = await getBrixData(selloc);
        setRows(mybrix);
    }

    async function onSubmitShow(e) {
        let mybrix = await getBrixData(location);
        setRows(mybrix);
    }

    return (
        <div>
            <div>
                <FormControl fullWidth style={{ width: '20%', marginRight: '10px' }}>
                    <InputLabel id="status-label">Select Location</InputLabel>
                    <Select labelId="demo-simple-select-label" name="location" value={location} id="location" onChange={locationChange}>
                        {locations.map((msgLoc) => (
                            <MenuItem key={msgLoc.id} value={msgLoc.value}>
                                {msgLoc.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    value="Show"
                    onClick={onSubmitShow}
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
            {showEditBriHistory ? <EditBrixHistory mydata={{ sdata: rows[selid - 1], location: location, hcb: makeUserEditable }} /> : null}
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
