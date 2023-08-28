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

const thcolumns = [
    { field: 'sino', headerName: 'SlNo', width: 100 },
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'installedDate', headerName: 'Installed-Date', width: 150 },
    { field: 'network', headerName: 'NetworkType', width: 150 },
    { field: 'locat', headerName: 'Location', width: 100 },
    { field: 'last', headerName: 'Last-Update', width: 100 },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'org', headerName: 'Organization', width: 100 },
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
            const isInEditMode = [id]?.mode === GridRowModes.Edit;

            if (isInEditMode) {
                return [
                    <GridActionsCellItem icon={<SaveIcon />} label="Save" />,
                    <GridActionsCellItem icon={<CancelIcon />} label="Cancel" className="textPrimary" color="inherit" />
                ];
            }

            return [
                <GridActionsCellItem icon={<EditIcon />} label="Edit" className="textPrimary" color="inherit" />,
                <GridActionsCellItem icon={<DeleteIcon />} label="Delete" color="inherit" />
            ];
        }
    }
];

export default function TapHistory() {
    const BASE_URL = 'https://www.cornellsaprun.com/dncserver';
    const TAP_URL = 'https://www.cornellsaprun.com/dncserver/tap';
    // const TAP_URL = "http://localhost:8891/tap"
    var selloc;

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

    const [location, setLocation] = useState('Arnot');
    const [clients, setClients] = useState([]);
    const [dcpoints, setDcpoints] = useState([{ DCP: 'All' }]);
    const [treeCount, setTreeCount] = useState();

    const [data, setData] = useState([{ id: 1, location: '', dcp: '', tapCount: '', edate: '' }]);

    useEffect(() => {
        // console.log("Use Effect")
        getTapInfo('All', 'All');
    }, []);

    async function getTapInfo(loc, dcp) {
        const filter = {};
        const mytap = await getTapData(loc, dcp);
        setData(mytap);
        console.log(mytap);
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
            var url = new URL(TAP_URL);
            for (let key in mybody) {
                if (mybody[key] !== 'All') url.searchParams.append(key, mybody[key]);
            }

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    data.forEach((item, index) => {
                        item['id'] = index + 1;
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

            fetch(BASE_URL + '/listadev/' + gclient, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    // let dlist = []
                    // data.forEach(device => {
                    //     dlist.push(device.cname)
                    // });
                    let cdev = data.filter(function (row) {
                        if (gloc == 'All') {
                            return row.rdate == null;
                        } else {
                            return row.Location == gloc && row.rdate == null;
                        }
                    });
                    // cdev.push("All")
                    // console.log([{"DCP": "All", ...cdev}])
                    resolve([{ DCP: 'All' }, ...cdev]);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function locationChange(e) {
        let selloc = e.target.value;
        setLocation(e.target.value);
        // console.log(sessionStorage.getItem("myToken"))
        let mydev = await getDeviceList('Collie-Flow', selloc);
        console.log(mydev);
        setDcpoints(mydev);
    }

    async function onDateChange(e) {
        console.log('On Date Change');
    }

    async function onSubmitCount(e) {
        console.log('On Submit Count');
        let loctext = null;
        let dcptext = null;
        try {
            var loc = document.getElementById('location');
            loctext = loc.options[loc.selectedIndex].text;
            var dcp = document.getElementById('dcpoint');
            dcptext = dcp.options[dcp.selectedIndex].text;
        } catch {}

        getTapInfo(loctext, dcptext);

        console.log('Selected Location is ', loctext);
        console.log('Selected DCP is ', dcptext);
    }

    async function dcpointChange(e) {
        let seldcp = e.target.value;
    }

    async function onChangeTree(e) {
        const tval = e.target.value;
        setTreeCount(tval);
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <MainCard title="MANAGE GATEWAY ">
                    <div>
                        <Button color="secondary" endIcon={<AddCircleOutlinedIcon />} variant="contained" href="util-DeviceReport">
                            Add Gateway
                        </Button>

                        <DataGrid
                            className="table"
                            {...data1}
                            loading={loading}
                            slots={{ toolbar: GridToolbar }}
                            rows={data}
                            columns={thcolumns}
                            pageSize={(2, 5, 10, 20)}
                            rowsPerPageOptions={[10]}
                            checkboxSelection
                        />
                    </div>
                </MainCard>
            </div>
        </div>
    );
}
