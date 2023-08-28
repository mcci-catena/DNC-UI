import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { constobj } from './../../misc/constants';

// User defined Import
import EditStock from './editstock';
import EditDmd from './editdmd';

export default function ListDmd(props) {
    const { DNC_URL } = { ...constobj };
    const [rows, setRows] = React.useState([]);
    const [rowModesModel, setRowModesModel] = React.useState({});
    const [showEditStock, setShowEditStock] = React.useState(false);
    const [showEditDmd, setShowEditDmd] = React.useState(false);
    const [selid, setSelId] = React.useState();

    const thcolumns = [
        { field: 'id', headerName: 'S.NO', width: 10 },
        { field: 'hwsl', headerName: 'Hw Serial', width: 150 },
        { field: 'boardrev', headerName: 'BoardRev', width: 70 },
        { field: 'fwver', headerName: 'Fw.Ver', width: 80 },
        { field: 'technology', headerName: 'Technology', width: 120 },
        { field: 'network', headerName: 'Network', width: 100 },
        { field: 'region', headerName: 'Region', width: 100 },
        { field: 'action', headerName: 'Action', width: 130 },
        { field: 'doa', headerName: 'Date', width: 190 },
        { field: 'user', headerName: 'User', width: 130 }
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

    async function getDmdInfo() {
        const mystock = await getDmdData();
        setRows(mystock);
        console.log(mystock);
    }

    function getDmdData() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/dmd');

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
                        myrow['technology'] = item['technology'];
                        myrow['network'] = item['network'];
                        myrow['region'] = item['region'];
                        myrow['action'] = item['action'];
                        myrow['doa'] = item['doa'];
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

    const makeStockEditable = () => {
        setShowEditStock(false);
        getStockInfo();
    };

    const makeDmdEditable = () => {
        setShowEditDmd(false);
        getStockInfo();
    };

    useEffect(() => {
        getDmdInfo();
    }, []);

    return (
        <div>
            {showEditStock ? <EditStock mydata={{ sdata: rows[selid - 1], hcb: makeStockEditable, userName: selectedUserName }} /> : null};
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
