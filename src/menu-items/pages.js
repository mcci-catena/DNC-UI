// assets
import { IconKey } from '@tabler/icons';
import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import SettingsInputAntennaOutlinedIcon from '@mui/icons-material/SettingsInputAntennaOutlined';
import Diversity1OutlinedIcon from '@mui/icons-material/Diversity1Outlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import LeakAddOutlinedIcon from '@mui/icons-material/LeakAddOutlined';

// constant
const icons = {
    IconKey,
    Diversity3OutlinedIcon,
    GroupOutlinedIcon,
    PinDropOutlinedIcon,
    Inventory2OutlinedIcon,
    LaptopChromebookOutlinedIcon,
    LeakAddOutlinedIcon,
    Diversity1OutlinedIcon,
    SourceOutlinedIcon,
    SettingsInputAntennaOutlinedIcon
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

let myuser = sessionStorage.getItem('myUser');

console.log('Pages: ', myuser);

let myuobj = JSON.parse(myuser);

console.log('Pages-1: ', myuobj);

let devname = 'Device Management';

// let keys = Object.keys(myuobj);

if (myuobj != null) {
    if (myuobj.ccode == 'WR') {
        devname = 'SSU Management';
    }
}

const pages = {
    id: 'pages',
    title: 'Configurations',
    type: 'group',
    children: [
        {
            id: 'authentication',
            title: 'Configurations',
            type: 'collapse',
            icon: icons.Diversity1OutlinedIcon,

            children: [
                {
                    id: 'login3',
                    title: 'Organization',
                    type: 'item',
                    url: '/orgs',
                    icon: icons.Diversity3OutlinedIcon
                },
                {
                    id: 'user',
                    title: 'Users',
                    type: 'item',
                    url: '/users',
                    icon: icons.GroupOutlinedIcon
                },
                {
                    id: 'stock',
                    title: 'Stocks',
                    type: 'item',
                    url: '/stocks',
                    icon: icons.Inventory2OutlinedIcon
                },
                {
                    id: 'device',
                    title: devname,
                    type: 'item',
                    url: '/mdev',
                    icon: icons.Inventory2OutlinedIcon
                },
                {
                    id: 'data sources',
                    title: 'Data Sources',
                    type: 'item',
                    url: '/datasources',
                    icon: icons.SourceOutlinedIcon
                },
                {
                    id: 'gateway',
                    title: 'Gateways',
                    type: 'item',
                    url: '/gateways',
                    icon: icons.LeakAddOutlinedIcon
                }
            ]
        }
    ]
};

export default pages;
