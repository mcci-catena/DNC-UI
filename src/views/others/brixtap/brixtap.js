import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import TapEntry from './tapentry';
import BrixEntry from './brixentry';
import TapHistory from './taphistory';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import StreetviewOutlinedIcon from '@mui/icons-material/StreetviewOutlined';
import BrixHistory from './brixhistory';

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

export default function BrixTap() {
    const [value, setValue] = React.useState(0);
    const [selSid, setSelSid] = React.useState('');
    const [selSname, setSelSname] = React.useState('');

    const [mytitle, setMytitle] = React.useState('Plugins --> Brix & Tap');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <MainCard title={mytitle}>
            <Box sx={{ width: '100%' }}>
                <Box>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab style={{ color: 'darkblue' }} icon={<StreetviewOutlinedIcon />} label="Tap Entry" {...a11yProps(0)} />
                        <Tab style={{ color: 'darkblue' }} icon={<StreetviewOutlinedIcon />} label="Brix Entry" {...a11yProps(1)} />
                        <Tab style={{ color: 'darkblue' }} icon={<HistoryOutlinedIcon />} label="Tap History" {...a11yProps(2)} />
                        <Tab style={{ color: 'darkblue' }} icon={<HistoryOutlinedIcon />} label="Brix History" {...a11yProps(3)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <TapEntry lsdata={{ cbf: setValue, cbfsid: setSelSid, cbfsname: setSelSname, cbftitle: setMytitle }} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <BrixEntry asdata={{ cbftitle: setMytitle }} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <TapHistory mddata={{ sid: selSid, sname: selSname, cbftitle: setMytitle }} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <BrixHistory mddata={{ sid: selSid, sname: selSname, cbftitle: setMytitle }} />
                </TabPanel>
            </Box>
        </MainCard>
    );
}
