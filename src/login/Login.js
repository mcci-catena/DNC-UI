import './Login.css';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { constobj } from './../misc/constants';
import Swal from 'sweetalert2';

async function loginUser(credentials, setToken) {
    const { DNC_URL } = { ...constobj };
    console.log('Login Page: ', DNC_URL);
    return fetch(constobj.DNC_URL + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then((data) => data.json())
        .then((data) => {
            if (data.hasOwnProperty('message')) {
                console.log(data.message);
                return 'error';
            } else {
                console.log('Login Success');
                console.log(data.token);
                return { result: 'success', token: data.token, udata: data.udata };
            }
        });
}

function cbloginsuccess() {
    console.log('Callback of Login success');
}

export default function Login({ setToken }) {
    const [uname, setUserName] = useState();
    const [pwd, setPassword] = useState();
    // const { uiversion } = getEnvVars();

    const { DNC_URL } = { ...constobj };

    const [authenticatedUser, setAuthenticatedUser] = useState('');
    const [dncv, setDncv] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false); // New state for login success

    useEffect(() => {
        getDncVersion();
    }, []);

    async function getDncVersion() {
        let dver = await getVersion();
        console.log(dver);
        let dncv2 = dver.split('Server')[1];
        setDncv(dncv2);
    }

    function getVersion() {
        return new Promise(async function (resolve, reject) {
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');

            var requestOptions = {
                method: 'GET',
                headers: myHeaders
            };
            var url = new URL(DNC_URL + '/version');

            fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const logresp = await loginUser({
            uname,
            pwd
        });
        if (logresp.result === 'success') {
            sessionStorage.setItem('myToken', logresp.token);
            sessionStorage.setItem('myUser', JSON.stringify(logresp.udata));
            console.log('Set Client Name');
            setToken(logresp.token);
            setAuthenticatedUser(uname);
            setLoginSuccess(true);
        } else {
            Swal.fire({
                title: 'Invalid Credentials',
                width: 600,
                padding: '3em',
                color: 'black',
                background: '#fff url(https://www.freepik.com/free-photos-vectors/background)',
                backdrop: `
                  black
                  url("/images/nyan-cat.gif")
                  left top
                  no-repeat
                `
            });
        }
    };
    if (loginSuccess) {
        return <div className="maincontainer"></div>;
    } else {
        return (
            <div className="maincontainer">
                <div class="container-fluid">
                    <div class="row no-gutter">
                        <div class="col-md-6 d-none d-md-flex bg-image"></div>
                        <div class="col-md-6 bg-light">
                            <div class="login d-flex align-items-center py-5">
                                <div class="container">
                                    <div class="row">
                                        <div class="col-lg-10 col-xl-7 mx-auto">
                                            <h2 class="display-4">DNC </h2>
                                            {/* {/ <h1 class="loginvr1">v{constobj.SW_APP}</h1> /} */}
                                            <h5 class="text-muted mb-4">Data Normalization Console</h5>
                                            {/* {/ <h1 class="loginvr">v{constobj.SW_VER}</h1> /} */}
                                            <form onSubmit={handleSubmit}>
                                                <div class="form-group mb-3">
                                                    <input
                                                        onChange={(e) => setUserName(e.target.value)}
                                                        required
                                                        id="outlined-required"
                                                        placeholder="User Name"
                                                        label="Username"
                                                        class="form-control rounded-pill border-0 shadow-sm px-4 text-primary"
                                                    />
                                                </div>
                                                <div class="form-group mb-3">
                                                    <input
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        id="outlined-required"
                                                        type="password"
                                                        placeholder="Password"
                                                        required=""
                                                        class="form-control rounded-pill border-0 shadow-sm px-4 text-primary"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    class=" form-control btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm"
                                                >
                                                    Log in
                                                </button>
                                                <h7 class=" float-start">
                                                    Forgot <a href="plink">password</a>
                                                </h7>
                                                <h7 class=" float-end">
                                                    New User? <a href="slink">Sign Up</a>
                                                </h7>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {authenticatedUser && (
                    <div className="profile-section">
                        <h4>Welcome-123, {authenticatedUser}!</h4>
                        {/ Other profile information /}
                    </div>
                )}

                <footer className="footer">
                    DNC {dncv} | Server v{constobj.SW_VER}
                </footer>
            </div>
        );
    }
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};
