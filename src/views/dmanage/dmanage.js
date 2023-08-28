import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AddDevice from './adddevice';
import ListDevice from './listssu';
import ListDmd from './listdmd';
import TrackSsu from './trackssu';
import TrackHw from './trackhw';
import MultilineChartIcon from '@mui/icons-material/MultilineChart';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import DoDisturbOnIcon from '@mui/icons-material/DoDisturbOn';
// import ManageDevice from './managedevice';

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

export default function DeviceManage() {
    const [selSsu, setSelSsu] = React.useState('');
    const [selHwsl, setSelHwSl] = React.useState('');
    const [value, setValue] = React.useState(0);
    const [selSid, setSelSid] = React.useState('');
    const [selSname, setSelSname] = React.useState('');

    let myuser = sessionStorage.getItem('myUser');
    let myuobj = JSON.parse(myuser);

    let devname = 'Device';
    if (myuobj.ccode == 'WR') {
        devname = 'SSU';
    }

    const [mytitle, setMytitle] = React.useState(`Manage ${devname}`);

    let constn1 = 'Manage ' + devname;
    let constn2 = 'Add ' + devname;
    let constn3 = 'Track ' + devname;

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <MainCard title={mytitle}>
            <Box sx={{ width: '100%' }}>
                <Box>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab style={{ color: 'darkblue' }} icon={<PinDropOutlinedIcon />} label={constn1} {...a11yProps(0)} />
                        <Tab style={{ color: 'darkblue' }} icon={<AddCircleOutlinedIcon />} label={constn2} {...a11yProps(1)} />
                        <Tab style={{ color: 'darkblue' }} icon={<MultilineChartIcon />} label={constn3} {...a11yProps(2)} />
                        <Tab style={{ color: 'darkblue' }} icon={<StackedLineChartIcon />} label="Track Hw" {...a11yProps(3)} />
                    </Tabs>
                </Box>
                <div>
                    <TabPanel value={value} index={0}>
                        <ListDevice lsdata={{ cbf: setValue, cbfshw: setSelSsu }} />
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <AddDevice asdata={{ cbf: setValue }} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <TrackSsu tsdata={{ cbf: setValue, selSsu: selSsu }} />
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <TrackHw thdata={{ cbf: setValue, selHwsl: selSsu }} />
                    </TabPanel>
                </div>
            </Box>
        </MainCard>
    );
}
