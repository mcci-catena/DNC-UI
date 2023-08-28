// assets
import { IconBrandChrome, IconHelp } from '@tabler/icons';
import PollOutlinedIcon from '@mui/icons-material/PollOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import NetworkPingOutlinedIcon from '@mui/icons-material/NetworkPingOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';

// constant
const icons = {
    IconBrandChrome,
    SellOutlinedIcon,
    IconHelp,
    PollOutlinedIcon,
    DownloadOutlinedIcon,
    NetworkPingOutlinedIcon,
    CurrencyExchangeOutlinedIcon
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

// const myplugins = ['subscrip', 'dnload', 'dnlink', 'brixtap'];

let myuser = sessionStorage.getItem('myUser');
let myuobj = JSON.parse(myuser);

const myplugins = [];

console.log('Read Client Name: ', myuobj);

if (myuobj != null) {
    if (myuobj.ccode == 'CS') {
        myplugins.push('dnload');
        myplugins.push('brixtap');
    } else if (myuobj.ccode == 'WF') {
        myplugins.push('subscrip');
        myplugins.push('dnlink');
    }
}

const mymenus = {
    subscrip: {
        id: 'Subscription',
        title: 'Subscription',
        type: 'item',
        url: '/other/subscription',
        icon: icons.CurrencyExchangeOutlinedIcon,
        breadcrumbs: false
    },
    dnload: {
        id: 'DataDownload',
        title: 'Data Download',
        type: 'item',
        url: '/other/datadnload',
        icon: icons.DownloadOutlinedIcon,
        breadcrumbs: false
    },
    dnlink: {
        id: 'DownLink',
        title: 'Downlink',
        type: 'item',
        url: '/other/downlink',
        icon: icons.NetworkPingOutlinedIcon,
        breadcrumbs: false
    },
    brixtap: {
        id: 'BrixTap',
        title: 'Brix & Tap',
        type: 'item',
        url: '/other/brixtap',
        icon: icons.SellOutlinedIcon,
        breadcrumbs: false
    }
};

const other = {
    id: 'other',
    title: 'Plugins',
    type: 'group',
    children: []
};

console.log('Myplugins: ', myplugins);

for (let i = 0; i < myplugins.length; i++) {
    other.children.push(mymenus[myplugins[i]]);
}

export default other;
