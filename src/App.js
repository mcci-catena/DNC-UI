import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import Routesn from 'routes';
import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';
import useToken from './saveToken';
import { Route, Routes } from 'react-router-dom';
import Login from './login/Login';
import Plink from './login/plink';
import Slink from './login/slink';
import Signup from './signup/Signup';
import FgPwd from './fgpwd/FgPwd';
import { Orgcontext } from './OrgContext';

import React, { useState } from 'react';
// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);
    const { token, setToken } = useToken('');

    const [selOrg, setSelOrg] = useState('Select an Org');
    const orgvalue = { selOrg, setSelOrg };

    if (!token) {
        console.log('No Token');
        return (
            <div>
                {/* <Login setToken={setToken} /> */}
                <Routes>
                    <Route path="/" element={<Login setToken={setToken} />} />
                    <Route path="/plink" element={<Plink />} />
                    <Route path="/slink" element={<Slink />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/fgpwd" element={<FgPwd />} />
                    <Route path="/*" element={<Login setToken={setToken} />} />
                </Routes>
            </div>
        );
    } else {
        console.log('Yes Token');
        return (
            <Orgcontext.Provider orgv={orgvalue}>
                <div>
                    {/* <Home setToken={setToken} /> */}
                    <StyledEngineProvider injectFirst>
                        <ThemeProvider theme={themes(customization)}>
                            <CssBaseline />
                            <NavigationScroll>
                                <Routesn />
                            </NavigationScroll>
                        </ThemeProvider>
                    </StyledEngineProvider>
                </div>
            </Orgcontext.Provider>
        );
    }
};

export default App;
