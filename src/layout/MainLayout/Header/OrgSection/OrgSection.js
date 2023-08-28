import { Orgcontext } from 'OrgContext';
import React, { useState, useEffect, useContext } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import { value } from 'assets/scss/_themes-vars.module.scss';

import { constobj } from '../../../../misc/constants';

export default function OrgSection() {
    const { DNC_URL } = { ...constobj };

    const [userOrgs, setUserOrgs] = useState([]);
    const [selOrg, setSelOrg] = useState('');

    useEffect(() => {
        getOrgList();
    }, []);

    async function updtOrgList() {
        let mydev = await getUserOrg();
        let mynewo = [];
        for (let i = 0; i < mydev.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['label'] = mydev[i];
            mydict['value'] = mydev[i];
            mynewo.push(mydict);
        }
        setUserOrgs(mynewo);
        let myorg = sessionStorage.getItem('myOrg');
        // if(mydev.includes(myorg)){
        //     console.log("Selected Org Available")
        //  }
        // else{
        //     console.log("Selected Org Deleted ", myorg)
        //     setSelOrg(mynewo[0].value);
        //     sessionStorage.setItem('myOrg', mynewo[0].value);
        // }

        if (!mydev.includes(myorg)) {
            setSelOrg(mynewo[0].value);
            sessionStorage.setItem('myOrg', mynewo[0].value);
        }
    }

    async function getOrgList() {
        let mydev = await getUserOrg();
        let mynewo = [];
        for (let i = 0; i < mydev.length; i++) {
            let mydict = {};
            mydict['id'] = i + 1;
            mydict['label'] = mydev[i];
            mydict['value'] = mydev[i];
            mynewo.push(mydict);
        }
        setUserOrgs(mynewo);
        setSelOrg(mynewo[0].value);
        sessionStorage.setItem('myOrg', mynewo[0].value);
    }

    function getUserOrg() {
        return new Promise(async function (resolve, reject) {
            let auth = sessionStorage.getItem('myToken');

            let myuser = sessionStorage.getItem('myUser');
            let myuobj = JSON.parse(myuser);
            let userid = myuobj.user;

            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + auth);
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };

            var url = new URL(DNC_URL + '/uorg/' + userid);

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data.message);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    async function orgChange(e) {
        let selfunc = e.target.value;
        setSelOrg(e.target.value);
        sessionStorage.setItem('myOrg', e.target.value);
    }

    return (
        <Box sx={{ minWidth: 200 }}>
            <TextField
                style={{ width: '80%' }}
                id="outlined-select-Main Org"
                select
                label="Select Org"
                Placeholder="select org"
                helperText=" "
                value={selOrg}
                onFocus={updtOrgList}
                onChange={orgChange}
                sx={{ height: '40px' }}
            >
                {userOrgs.map((msgLoc) => (
                    <MenuItem key={msgLoc.id} value={msgLoc.value}>
                        {msgLoc.label}
                    </MenuItem>
                ))}
            </TextField>
        </Box>
    );
}
