// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import ManageHistoryOutlinedIcon from '@mui/icons-material/ManageHistoryOutlined';
import InstallDesktopOutlinedIcon from '@mui/icons-material/InstallDesktopOutlined';
import AddHomeWorkOutlinedIcon from '@mui/icons-material/AddHomeWorkOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AirlineStopsOutlinedIcon from '@mui/icons-material/AirlineStopsOutlined';

// constant
const icons = {
    IconTypography,
    IconPalette,
    IconShadow,
    IconWindmill,
    AirlineStopsOutlinedIcon,
    ManageAccountsOutlinedIcon,
    ManageHistoryOutlinedIcon,
    InstallDesktopOutlinedIcon,
    PeopleAltOutlinedIcon,
    AddHomeWorkOutlinedIcon
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
    id: 'utilities',
    title: 'Organization',
    type: 'group',
    children: [
        {
            id: 'org-Report',
            title: 'Home',
            type: 'item',
            url: '/org/home',
            icon: icons.AddHomeWorkOutlinedIcon,
            breadcrumbs: false
        },
        {
            id: 'org-Users',
            title: 'Users',
            type: 'item',
            url: '/org/users',
            icon: icons.PeopleAltOutlinedIcon,
            breadcrumbs: false
        },
        {
            id: 'org-Spots',
            title: 'Spots',
            type: 'item',
            url: '/org/spots',
            icon: icons.AirlineStopsOutlinedIcon,
            breadcrumbs: false
        }
    ]
};

export default utilities;
