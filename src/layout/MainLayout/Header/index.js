import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import OrgSection from './OrgSection/OrgSection';
import { IconMenu2 } from '@tabler/icons';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import useToken from './../../../saveToken';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const useStyles = makeStyles((theme) => ({
    timer: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: theme.palette.primary.main
    }
}));

const Timerunner = ({ onTimeout }) => {
    const classes = useStyles();
    const [time, setTime] = useState({ minutes: 30, seconds: 0 }); // Initial time set to 10 seconds

    useEffect(() => {
        let interval = setInterval(() => {
            setTime((prevTime) => {
                let newSeconds = prevTime.seconds - 1;
                let newMinutes = prevTime.minutes;

                if (newSeconds < 0) {
                    newMinutes -= 1;
                    newSeconds = 59;
                }

                if (newMinutes === 0 && newSeconds === 0) {
                    // Call the onTimeout function when the timer reaches 0 seconds
                    onTimeout();
                    clearInterval(interval); // Stop the interval when the timer reaches 0 seconds
                }

                return { minutes: newMinutes, seconds: newSeconds };
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [onTimeout]);

    return (
        <Typography variant="h5" component="span" className={classes.timer}>
            {`${time.minutes < 10 ? '0' + time.minutes : time.minutes}:${time.seconds < 10 ? '0' + time.seconds : time.seconds}`}
        </Typography>
    );
};

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    const { token, setToken } = useToken();
    const [modalOpen, setModalOpen] = useState(false);
    const [closeModalClicked, setCloseModalClicked] = useState(false); // New state to track if the "Close" button is clicked
    const navigate = useNavigate();
    // Function to handle closing the modal
    const handleCloseModal = () => {
        setModalOpen(false);
        setCloseModalClicked(true); // Set the state to true when the "Close" button is clicked
        logout(); // Call the logout function to log out the user
    };
    const logout = () => {
        console.log('On Click Logout');
        clearUserSession();
    };

    const handleTimeoutLogout = () => {
        // Clear the user's token and perform the logout actions
        clearUserSession();
    };

    // Function to clear the user session
    const clearUserSession = () => {
        console.log('Clearing user session...');
        sessionStorage.removeItem('myToken'); // Replace 'myToken' with the actual key used to store the token
        setToken(null); // Assuming setToken from the useToken hook clears the token
        // Additional logic to clear other user-related data from local storage or cookies if needed
    };

    useEffect(() => {
        let logoutTimer = setTimeout(() => {
            // Use useEffect to update the state after rendering
            // This prevents the state update during rendering
            console.log('Timer reached 30 minutes. Logging out...');
            handleTimeoutLogout();
            setModalOpen(true); // Show the modal when the timer reaches 30 minutes
        }, 1800000); // 30 minutes (1800000 milliseconds)

        return () => clearTimeout(logoutTimer);
    }, []);

    // Navigate to the desired page (e.g., './') only if the "Close" button is clicked
    useEffect(() => {
        if (closeModalClicked) {
            window.location.reload(); // Reload the page after logout
        }
    }, [closeModalClicked]);
    // Get the navigate function from useNavigate hook

    // Log the token state to check if it's being updated properly
    console.log('Token state:', token);

    return (
        <>
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
                    <LogoSection />
                </Box>
                <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <Avatar
                        variant="rounded"
                        sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.mediumAvatar,
                            transition: 'all .2s ease-in-out',
                            background: theme.palette.secondary.light,
                            color: theme.palette.secondary.dark,
                            '&:hover': {
                                background: theme.palette.secondary.dark,
                                color: theme.palette.secondary.light
                            }
                        }}
                        onClick={handleLeftDrawerToggle}
                        color="inherit"
                    >
                        <IconMenu2 stroke={1.5} size="1.3rem" />
                    </Avatar>
                </ButtonBase>
            </Box>

            {/* header search */}
            {/* <SearchSection /> */}
            <Box sx={{ flexGrow: 1 }} />

            <OrgSection />

            <Box sx={{ flexGrow: 1 }} />
            {/* Timerunner */}
            <Timerunner onTimeout={logout} />
            <Dialog open={modalOpen} onClose={handleCloseModal}>
                <DialogTitle>Session Timeout</DialogTitle>
                <DialogContent>
                    <Typography>Your session has expired. You will be logged out.</Typography>
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button> */}
                </DialogActions>
            </Dialog>
            {/* notification & profile */}
            <ProfileSection />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
