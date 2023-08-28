import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

const OrgSpots = Loadable(lazy(() => import('views/spots/Spots')));
const OrgDevices = Loadable(lazy(() => import('views/utilities/DeviceReport')));
const OrgHome = Loadable(lazy(() => import('views/utilities/OrgHome')));
const OrgUser = Loadable(lazy(() => import('views/utilities/orguser/orguser')));

// sample page routing
const DataDnLoad = Loadable(lazy(() => import('views/others/download/download')));
const DownLink = Loadable(lazy(() => import('views/others/downlink/downlink')));
const Subscription = Loadable(lazy(() => import('views/others/subscription/subscription')));
const BrixTap = Loadable(lazy(() => import('views/others/brixtap/brixtap')));

// ==============================|| MAIN ROUTING ||============================== //

const myplugins = ['subscrip', 'dnload', 'dnlink', 'brixtap'];
//const myplugins = ['subscrip', 'dnlink'];

const splroutes = {
    subscrip: { path: 'other', children: [{ path: 'subscription', element: <Subscription /> }] },
    dnload: { path: 'other', children: [{ path: 'datadnload', element: <DataDnLoad /> }] },
    dnlink: { path: 'other', children: [{ path: 'downlink', element: <DownLink /> }] },
    brixtap: { path: 'other', children: [{ path: 'brixtap', element: <BrixTap /> }] }
};

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: []
};

addOrgRoutes();
addSelectiveRoutes();

function addOrgRoutes() {
    MainRoutes.children.push({ path: '/', element: <DashboardDefault /> });
    MainRoutes.children.push({ path: 'dashboard', children: [{ path: 'default', element: <DashboardDefault /> }] });
    MainRoutes.children.push({ path: 'org', children: [{ path: 'home', element: <OrgHome /> }] });
    MainRoutes.children.push({ path: 'org', children: [{ path: 'users', element: <OrgUser /> }] });
    MainRoutes.children.push({ path: 'org', children: [{ path: 'spots', element: <OrgSpots /> }] });
}

function addSelectiveRoutes() {
    for (let i = 0; i < myplugins.length; i++) {
        MainRoutes.children.push(splroutes[myplugins[i]]);
    }
}

export default MainRoutes;
