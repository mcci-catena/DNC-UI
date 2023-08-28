import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { constobj } from '../../misc/constants';

// User defined Import
import EditDevice from './editssu';
import EditDmd from './edithw';

export default function TrackSsu(props) {
    const { DNC_URL } = { ...constobj };
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showEditStock, setShowEditStock] = React.useState(false);
    const [showEditDmd, setShowEditDmd] = React.useState(false);
    const [selid, setSelId] = React.useState();

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
        { field: 'adate', headerName: 'Date', width: 200 }
    ];

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

    function getSsuTrack() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/tsdmd/' + props.tsdata.selSsu);

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

    async function trackOneSsu() {
        const mystock = await getSsuTrack();
        setRows(mystock);
        console.log(mystock);
    }

    const makeStockEditable = () => {
        setShowEditStock(false);
        getStockInfo();
    };

    const makeDmdEditable = () => {
        setShowEditDmd(false);
        getStockInfo();
    };

    useEffect(() => {
        trackOneSsu();
    }, []);

    return (
        <div>
            {showEditStock ? <EditDevice mydata={{ sdata: rows[selid - 1], hcb: makeStockEditable, userName: selectedUserName }} /> : null};
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
