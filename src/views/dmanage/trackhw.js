import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { constobj } from '../../misc/constants';
import { GridActionsCellItem } from '@mui/x-data-grid-pro';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

// User defined Import
import EditDevice from './editssu';
import EditHw from './edithw';

export default function TrackHw(props) {
    const { DNC_URL } = { ...constobj };
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showEditStock, setShowEditStock] = React.useState(false);
    const [showEditDmd, setShowEditDmd] = React.useState(false);
    const [selid, setSelId] = React.useState();

    const thcolumns = [
        { field: 'id', headerName: 'S/N', width: 10 },
        { field: 'hwsl', headerName: 'Hw Serial', width: 150 },
        { field: 'boardrev', headerName: 'Board Revision', width: 110 },
        { field: 'fwver', headerName: 'Fw.Ver', width: 80 },
        { field: 'tech', headerName: 'Technology', width: 120 },
        { field: 'network', headerName: 'Network', width: 100 },
        { field: 'region', headerName: 'Region', width: 100 },
        { field: 'remarks', headerName: 'Remarks', width: 130 },
        { field: 'adate', headerName: 'Date', width: 190 },

        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 120,
            cellClassName: 'actions',
            getActions: ({ id }) => {
                return [
                    <GridActionsCellItem title="Edit Stock" icon={<EditIcon />} label="Edit" color="inherit" onClick={handleEditHw(id)} />
                    // <GridActionsCellItem icon={<DeleteIcon />} label="Delete" color="inherit" onClick={handleDeleteClick(id)} />
                ];
            }
        }
    ];

    const handleEditHw = (id) => () => {
        console.log('Handle Edit Hw');
        setSelId(id);
        setShowEditStock(true);
    };

    const handleDeleteClick = (id) => () => {
        const idsToDelete = rows
            .slice(id - 1, id) // Get the selected row
            .map((item) => `${item.hwsl} ?`)
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

    function getHwTrack() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/thwmr/' + props.thdata.selHwsl);

            let myulist = [];

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        let myrow = {};
                        myrow['id'] = index + 1;
                        myrow['hwsl'] = item['hwsl'];
                        myrow['boardrev'] = item['boardrev'];
                        myrow['fwver'] = item['fwver'];
                        myrow['tech'] = item['tech'];
                        myrow['network'] = item['network'];
                        myrow['region'] = item['region'];
                        myrow['remarks'] = item['remarks'];
                        myrow['adate'] = item['adate'];
                        myrow['user'] = item['userid'];

                        myulist.push(myrow);
                    });
                    resolve(myulist);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function trackOneHw() {
        const mystock = await getHwTrack();
        setRows(mystock);
        console.log(mystock);
    }

    const makeStockEditable = () => {
        setShowEditStock(false);
        // getStockInfo();
    };

    const makeDmdEditable = () => {
        setShowEditDmd(false);
        getStockInfo();
    };

    useEffect(() => {
        trackOneHw();
    }, []);

    return (
        <div>
            {showEditStock ? <EditHw mydata={{ sdata: rows[selid - 1], hcb: makeStockEditable }} /> : null};
            {showEditDmd ? <EditDmd mydata={{ sdata: rows[selid - 1], hcb: makeDmdEditable, userName: selectedUserName }} /> : null};
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
                    onProcessRowUpdateError={onProcessRowUpdateError}
                    slotProps={{
                        toolbar: { setRows, setRowModesModel }
                    }}
                />
            </div>
        </div>
    );
}
