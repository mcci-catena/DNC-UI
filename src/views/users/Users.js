import React, { useState, useEffect } from 'react';

import MainCard from 'ui-component/cards/MainCard';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SettingsInputAntennaOutlinedIcon from '@mui/icons-material/SettingsInputAntennaOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';

import InviteUser from './inviteuser';
import ListUser from './listuser';
import AddRemUser from './addremuser';

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
export default function ManageUser() {
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
                <MainCard title="Manage User">
                    <Box sx={{ width: '100%' }}>
                        <Box>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab
                                    style={{ color: 'darkblue' }}
                                    icon={<SettingsInputAntennaOutlinedIcon />}
                                    label="Users"
                                    {...a11yProps(0)}
                                />
                                <Tab style={{ color: 'darkblue' }} icon={<AddCircleOutlinedIcon />} label="Invite User" {...a11yProps(1)} />
                                <Tab style={{ color: 'darkblue' }} icon={<DoDisturbOnIcon />} label="Add / Remove User" {...a11yProps(2)} />
                            </Tabs>
                        </Box>

                        {/* List Gateway */}
                        <TabPanel value={value} index={0}>
                            <ListUser ludata={{ cbf: setValue }} />
                        </TabPanel>

                        {/* Add Gateway */}
                        <TabPanel value={value} index={1}>
                            <InviteUser iudata={{ cbf: setValue }} />
                        </TabPanel>

                        {/* Add-Remove Gateway */}
                        <TabPanel value={value} index={2}>
                            <AddRemUser arudata={{ cbf: setValue }} />
                        </TabPanel>
                    </Box>
                </MainCard>
            </div>
        </div>
    );
}
