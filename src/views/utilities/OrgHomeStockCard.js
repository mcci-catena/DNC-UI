import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mui/material';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, CardActions, CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BrowserUpdatedSharpIcon from '@mui/icons-material/BrowserUpdatedSharp';
import { Stocks } from 'views/stocks/Stocks';
import PinDropOutlinedIcon from '@mui/icons-material/PinDropOutlined';

// ==============================|| DASHBOARD DEFAULT - POPULAR CARD ||============================== //
const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary.main,
        borderRadius: '50%',
        top: -85,
        right: -95,
        [theme.breakpoints.down('sm')]: {
            top: -105,
            right: -140
        }
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary.main,
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    },
    '&:hover': {
        backgroundColor: theme.palette.secondary.main,
        cursor: 'pointer'
    }
}));

const CustomButton = styled(Button)(({ theme }) => ({
    color: 'white',
    '&:hover': {
        backgroundColor: theme.palette.primary.contrastText,
        cursor: 'pointer',
        color: 'black',
        '& svg': {
            color: 'black' // Change this to your desired icon hover color
        }
    },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '35%'
}));

const DividerWrapper = styled(Divider)(({ theme }) => ({
    marginTop: theme.spacing(-0),
    marginBottom: theme.spacing(2),
    width: '100%',
    backgroundColor: theme.palette.secondary.main
}));

const OrgHomeStockCard = ({ isLoading }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const navigate = useNavigate(); // initialize the useNavigate hook

    // const handleViewAllStocks = () => {
    //     // Perform any necessary actions before navigating

    //     // Navigate to the desired page
    //     navigate('/stocks');
    // };
    const [modalOpen, setModalOpen] = useState(false);
    const handleViewAllStocks = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };
    return (
        <>
            {isLoading ? (
                <SkeletonEarningCard />
            ) : (
                <CardWrapper border={false} content={false}>
                    <Box sx={{ p: 2 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                width: theme.spacing(7),
                                                height: theme.spacing(7),
                                                backgroundColor: theme.palette.secondary[800],
                                                color: '#FFFFFF', // Set the color to white
                                                mt: 1
                                            }}
                                        >
                                            <PinDropOutlinedIcon />
                                        </Avatar>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                width: theme.spacing(5),
                                                height: theme.spacing(4),
                                                backgroundColor: theme.palette.secondary.main,
                                                color: '#FFFFFF', // Set the color to white
                                                zIndex: 1
                                            }}
                                            aria-controls="PinDropOutlinedIcon"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <PinDropOutlinedIcon />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography
                                            sx={{
                                                fontSize: '2.125rem',
                                                fontWeight: 500,
                                                mr: 1,
                                                mt: 1.75,
                                                mb: 0.75,
                                                color: theme.palette.primary.contrastText
                                            }}
                                        >
                                            Stocks
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            sx={{
                                                cursor: 'pointer',
                                                width: theme.spacing(3),
                                                height: theme.spacing(3),
                                                backgroundColor: theme.palette.primary.contrastText,
                                                color: theme.palette.secondary.main
                                            }}
                                        >
                                            {/* <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} /> */}
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <DividerWrapper />
                            <Grid item>
                                <CardActions sx={{ p: 1 }}>
                                    <Grid container direction="row" justifyContent="space-between">
                                        <Grid item>
                                            <Typography
                                                sx={{
                                                    fontSize: '1.25rem',
                                                    fontWeight: 500,
                                                    mt: 1,
                                                    mb: 1,
                                                    color: theme.palette.primary.contrastText
                                                }}
                                            >
                                                Total Stocks 20
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography
                                                sx={{
                                                    fontSize: '2',
                                                    fontWeight: 50,
                                                    mt: 1.5,
                                                    mb: 1,
                                                    color: theme.palette.primary.contrastText
                                                }}
                                            >
                                                Active Stocks 15
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography
                                                sx={{
                                                    fontSize: '2',
                                                    fontWeight: 50,
                                                    mt: 1.5,
                                                    mb: 1,
                                                    color: theme.palette.primary.contrastText
                                                }}
                                            >
                                                Blocked Stocks 5
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardActions>
                            </Grid>
                        </Grid>
                    </Box>
                    <CardActions sx={{ p: 1 }}>
                        <CustomButton size="small" disableElevation onClick={handleViewAllStocks}>
                            View All Stocks
                            <PinDropOutlinedIcon sx={{ color: '#fff', marginLeft: '8px' }} />
                        </CustomButton>
                    </CardActions>
                </CardWrapper>
            )}
            {/* Modal Alert */}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: '#fff',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '4px'
                    }}
                >
                    <Typography variant="h5">Under Development</Typography>
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        This feature is under development!
                    </Typography>
                    <Button variant="contained" sx={{ mt: 3 }} onClick={handleCloseModal}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

OrgHomeStockCard.propTypes = {
    isLoading: PropTypes.bool
};

export default OrgHomeStockCard;
