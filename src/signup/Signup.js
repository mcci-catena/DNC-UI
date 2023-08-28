import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { constobj } from './../misc/constants';
import Swal from 'sweetalert2';

export default function Signup() {
    const [uname, setUserName] = useState();
    const [pwd, setPassword] = useState();
    const [email, setEmail] = useState();
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSubmit = async (e) => {
        console.log('submit handler');
        e.preventDefault();
    };

    const navigate = useNavigate();

    const goBack = () => {
        navigate('/');
    };

    async function onSignup(e) {
        e.preventDefault();

        const mybody = {
            turl: searchParams.get('user'),
            email,
            pwd,
            uname,
            firstName,
            lastName
        };

        try {
            const response = await fetch(constobj.DNC_URL + '/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mybody)
            });

            const data = await response.json();
            if (data.hasOwnProperty('message')) {
                Swal.fire({
                    text: data.message,
                    showCloseButton: true
                }).then(() => {
                    navigate('/'); // Navigate to the login screen after successful signup
                });
            } else {
                Swal.fire('Error occurred, try again');
                // You can add additional code here to display the error message to the user
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('An error occurred, please try again');
            // You can add additional code here to display the error message to the user
        }
    }
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
                                        <h5 class="text-muted mb-4">New User Sign Up</h5>
                                        <form onSubmit={handleSubmit}>
                                            <div class="form-group mb-3">
                                                <input
                                                    onChange={(e) => setUserName(e.target.value)}
                                                    required
                                                    id="outlined-required"
                                                    placeholder="User Name"
                                                    label="Username"
                                                    class="form-control rounded-pill border-0 shadow-sm px-4"
                                                />
                                            </div>
                                            <div class="form-group mb-3">
                                                <input
                                                    onChange={(e) => setfirstName(e.target.value)}
                                                    required
                                                    id="outlined-required"
                                                    placeholder="First Name"
                                                    label="firstName"
                                                    class="form-control rounded-pill border-0 shadow-sm px-4"
                                                />
                                            </div>
                                            <div class="form-group mb-3">
                                                <input
                                                    onChange={(e) => setlastName(e.target.value)}
                                                    required
                                                    id="outlined-required"
                                                    placeholder="Last Name"
                                                    label="lastName"
                                                    class="form-control rounded-pill border-0 shadow-sm px-4"
                                                />
                                            </div>
                                            <div class="form-group mb-3">
                                                <input
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    id="outlined-required"
                                                    placeholder="Email"
                                                    label="Email"
                                                    class="form-control rounded-pill border-0 shadow-sm px-4"
                                                />
                                            </div>
                                            <div class="form-group mb-3">
                                                <input
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                    id="outlined-required"
                                                    type="password"
                                                    placeholder="Password"
                                                    label="Password"
                                                    class="form-control rounded-pill border-0 shadow-sm px-4"
                                                />
                                            </div>

                                            <button
                                                style={{ width: '120px', marginTop: '20px' }}
                                                type="submit"
                                                onClick={onSignup}
                                                class="  btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                style={{ width: '120px', marginTop: '20px' }}
                                                onClick={goBack}
                                                type="submit"
                                                class=" float-end .me-4 btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm"
                                            >
                                                Back
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
