// assets
import { IconDashboard } from '@tabler/icons';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';

// constant
const icons = { DashboardCustomizeOutlinedIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.DashboardCustomizeOutlinedIcon,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
