import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@mui/material';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, Button, MenuItem, Typography, CardActions } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import { Gateways } from 'views/gateways/Gateways';
import MultilineChartSharpIcon from '@mui/icons-material/MultilineChartSharp';
import AccessibilitySharpIcon from '@mui/icons-material/AccessibilitySharp';
import PeopleOutlineSharpIcon from '@mui/icons-material/PeopleOutlineSharp';

const CardWrapper = styled(MainCard)(({ theme }) => ({
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    overflow: 'hidden',
    position: 'relative',
    '&:after': {
        content: '""',
        position: 'absolute',
        width: 210,
        height: 210,
        background: theme.palette.secondary[800],
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
        background: theme.palette.secondary[800],
        borderRadius: '50%',
        top: -125,
        right: -15,
        opacity: 0.5,
        [theme.breakpoints.down('sm')]: {
            top: -155,
            right: -70
        }
    }
}));
const CustomButton = styled(Button)`
    // background-color: white; /* Set your desired background color */
    color: #ffffff; /* Set your desired text color */

    &:hover {
        background-color: violet; /* Set your desired background color for hover */
    }
`;

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading }) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const navigate = useNavigate(); // initialize the useNavigate hook

    const [modalOpen, setModalOpen] = useState(false);
    const handleViewAllUsers = () => {
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
                    <Box sx={{ p: 2.25 }}>
                        <Grid container direction="column">
                            <Grid item>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.largeAvatar,
                                                backgroundColor: theme.palette.secondary[800],
                                                mt: 1
                                            }}
                                        >
                                            <img src={EarningIcon} alt="Notification" />
                                        </Avatar>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                ...theme.typography.commonAvatar,
                                                ...theme.typography.mediumAvatar,
                                                backgroundColor: theme.palette.secondary.dark,
                                                color: theme.palette.secondary[200],
                                                zIndex: 1
                                            }}
                                            aria-controls="menu-earning-card"
                                            aria-haspopup="true"
                                            onClick={handleClick}
                                        >
                                            <MoreHorizIcon fontSize="inherit" />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center">
                                    <Grid item>
                                        <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>
                                            Users : 50
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Avatar
                                            sx={{
                                                cursor: 'pointer',
                                                ...theme.typography.smallAvatar,
                                                backgroundColor: theme.palette.secondary[200],
                                                color: theme.palette.secondary.dark
                                            }}
                                        >
                                            <ArrowUpwardIcon fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                                        </Avatar>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <CardActions sx={{ p: 1.25 }}>
                                <CustomButton style={{ marginLeft: '-1%' }} size="small" disableElevation onClick={handleViewAllUsers}>
                                    View All Users
                                    <PeopleOutlineSharpIcon sx={{ color: '#ffffff' }} /> {/* Set your desired icon color */}
                                </CustomButton>
                            </CardActions>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
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

EarningCard.propTypes = {
    isLoading: PropTypes.bool
};

export default EarningCard;
