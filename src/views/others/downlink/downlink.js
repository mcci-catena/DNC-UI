import React, { useState, useEffect } from 'react';

import MainCard from 'ui-component/cards/MainCard';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ShowDevices from './showdevices';
import NetworkPingOutlinedIcon from '@mui/icons-material/NetworkPingOutlined';
import ConfigApi from './configapi';
import PermDataSettingOutlinedIcon from '@mui/icons-material/PermDataSettingOutlined';

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

//Manage Gateway
export default function Downlink() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        // console.log("Use Effect")
    }, []);

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <MainCard title="Plugins --> Dowlink">
                    <Box sx={{ width: '100%' }}>
                        <Box>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab style={{ color: 'darkblue' }} icon={<NetworkPingOutlinedIcon />} label="Device" {...a11yProps(0)} />
                                <Tab
                                    style={{ color: 'darkblue' }}
                                    icon={<PermDataSettingOutlinedIcon />}
                                    label="Config API"
                                    {...a11yProps(1)}
                                />
                            </Tabs>
                        </Box>

                        {/* {/ List Gateway /} */}
                        <TabPanel value={value} index={0}>
                            <ShowDevices ludata={{ cbf: setValue }} />
                        </TabPanel>

                        {/* {/ Add Gateway /} */}
                        <TabPanel value={value} index={1}>
                            <ConfigApi iudata={{ cbf: setValue }} />
                        </TabPanel>

                        {/* {/ Add-Remove Gateway /} */}
                        <TabPanel value={value} index={2}></TabPanel>
                    </Box>
                </MainCard>
            </div>
        </div>
    );
}
