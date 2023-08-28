// Core React Imports
import React, { useState, useEffect } from 'react';

// MUI Imports
import MainCard from 'ui-component/cards/MainCard';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PreviewIcon from '@mui/icons-material/Preview';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

// User defined Imports
import Addstock from './addstock';
import ListStock from './liststock';
import ListDmd from './listdmd';
import TrackDmd from './trackdmd';
import AssignedStock from './assigned';

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
    const [value, setValue] = React.useState(0);
    const [selHwsl, setSelHwSl] = React.useState('');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        // console.log("Use Effect")
        // setValue(1)
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <MainCard title="View Stocks">
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab
                                    style={{ color: 'darkblue' }}
                                    icon={<Inventory2OutlinedIcon />}
                                    label="View Stocks"
                                    {...a11yProps(0)}
                                />
                                <Tab style={{ color: 'darkblue' }} icon={<AddCircleRoundedIcon />} label="Assigned" {...a11yProps(1)} />
                                {/* <Tab style={{ color: 'darkblue' }} icon={<PreviewIcon />} label="Device Master Record" {...a11yProps(2)} />
                                <Tab style={{ color: 'darkblue' }} icon={<TrackChangesIcon />} label="Track DMR" {...a11yProps(3)} /> */}
                                {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
                            </Tabs>
                        </Box>
                        <div>
                            <TabPanel value={value} index={0}>
                                <ListStock lsdata={{ cbf: setValue, cbfshw: setSelHwSl }} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <AssignedStock asdata={{ cbf: setValue }} />
                            </TabPanel>
                            {/* <TabPanel value={value} index={2}>
                                <ListDmd lddata={{ cbf: setValue, cbfshw: setSelHwSl }} />
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                                <TrackDmd tddata={{ cbf: setValue, selHwsl: selHwsl }} />
                            </TabPanel> */}
                        </div>
                    </Box>
                </MainCard>
            </div>
        </div>
    );
}
