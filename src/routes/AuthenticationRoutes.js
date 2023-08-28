import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import MainLayout from 'layout/MainLayout';

import Dashboard from 'views/dashboard/Default';
import Users from 'views/users/Users';
import Gateways from 'views/gateways/Gateways';
import Profile from './../views/profile/Profile';
import Spots from './../views/spots/Spots';
import Stocks from 'views/stocks/Stocks';
import DataSources from 'views/datasrc/DataSource';
import DeviceManage from 'views/dmanage/dmanage';

// login option 3 routing
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));
const AuthRegister3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Register3')));
const AuthOrganization3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Organization3')));

// ==============================|| AUTHENTICATION ROUTING ||============================== //

const AuthenticationRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/users',
            element: <Users />
        },
        {
            path: '/stocks',
            element: <Stocks />
        },
        {
            path: '/mdev',
            element: <DeviceManage />
        },
        {
            path: '/datasources',
            element: <DataSources />
        },
        {
            path: '/gateways',
            element: <Gateways />
        },
        {
            path: '/orgs',
            element: <AuthOrganization3 />
        },
        {
            path: '/profile',
            element: <Profile />
        }
    ]
};

export default AuthenticationRoutes;
