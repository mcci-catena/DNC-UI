import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import AddSpot from './addspot';
import ManageSpot from './managespot';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
import ManageDevice from './managedevice';

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

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const [selSid, setSelSid] = React.useState('');
    const [selSname, setSelSname] = React.useState('');

    const [mytitle, setMytitle] = React.useState('Spots');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <MainCard title={mytitle}>
            <Box sx={{ width: '100%' }}>
                <Box>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab style={{ color: 'darkblue' }} icon={<PinDropOutlinedIcon />} label="Manage Spots" {...a11yProps(0)} />
                        <Tab style={{ color: 'darkblue' }} icon={<AddCircleOutlinedIcon />} label="Add Spots" {...a11yProps(1)} />
                        <Tab style={{ color: 'darkblue' }} icon={<DoDisturbOnIcon />} label="Manage Device" {...a11yProps(2)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <ManageSpot lsdata={{ cbf: setValue, cbfsid: setSelSid, cbfsname: setSelSname, cbftitle: setMytitle }} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <AddSpot asdata={{ cbftitle: setMytitle, cbfMove: setValue }} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <ManageDevice mddata={{ sid: selSid, sname: selSname, cbftitle: setMytitle }} />
                </TabPanel>
            </Box>
        </MainCard>
    );
}
