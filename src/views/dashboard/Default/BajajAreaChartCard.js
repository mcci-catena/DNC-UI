import PropTypes from 'prop-types';
import { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import ReactApexChart from 'react-apexcharts';

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

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

const EarningCard = ({ isLoading }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const lineData = {
        options: {
            chart: {
                id: 'line-chart',
                stacked: true,
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: true
                }
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }
            ],
            plotOptions: {
                line: {
                    horizontal: false,
                    columnWidth: '50%'
                }
            },
            xaxis: {
                type: 'category',
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            legend: {
                show: true,
                fontSize: '14px',
                fontFamily: `'Roboto', sans-serif`,
                position: 'bottom',
                offsetX: 20,
                labels: {
                    useSeriesColors: false
                },
                markers: {
                    width: 16,
                    height: 16,
                    radius: 5
                },
                itemMargin: {
                    horizontal: 15,
                    vertical: 8
                }
            },
            fill: {
                type: 'solid'
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                show: true
            }
        },
        series: [
            {
                name: 'Organization',
                data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75],
                color: '#FF6384' // Assign a color to the series
            },
            {
                name: 'Device Report',
                data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75],
                color: '#36A2EB' // Assign a color to the series
            },
            {
                name: 'Manage Gateway',
                data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10],
                color: '#FFCE56' // Assign a color to the series
            },
            {
                name: 'Manage Stock',
                data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0],
                color: '#4CAF50' // Assign a color to the series
            }
        ],
        type: 'line',
        height: 320
    };

    const pieData = {
        options: {
            chart: {
                id: 'pie-chart',
                toolbar: {
                    show: true
                }
            },
            legend: {
                show: true,
                fontSize: '14px',
                fontFamily: `'Roboto', sans-serif`,
                position: 'bottom',
                offsetX: 20,
                offsetY: 8,
                labels: {
                    useSeriesColors: false
                },
                markers: {
                    width: 16,
                    height: 16,
                    radius: 5
                },
                itemMargin: {
                    horizontal: 15,
                    vertical: 8
                }
            },
            dataLabels: {
                enabled: false
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 300
                        },
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0
                        }
                    }
                }
            ]
        },
        series: [35, 15, 45, 25],
        type: 'donut',
        height: 240
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
                                        <Menu
                                            id="menu-earning-card"
                                            anchorEl={anchorEl}
                                            keepMounted
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                            variant="selectedMenu"
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'right'
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                        >
                                            <MenuItem onClick={handleClose}>
                                                <GetAppTwoToneIcon sx={{ mr: 1.75 }} /> Import Card
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <FileCopyTwoToneIcon sx={{ mr: 1.75 }} /> Copy Data
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <PictureAsPdfTwoToneIcon sx={{ mr: 1.75 }} /> Export
                                            </MenuItem>
                                            <MenuItem onClick={handleClose}>
                                                <ArchiveTwoToneIcon sx={{ mr: 1.75 }} /> Archive File
                                            </MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h4" sx={{ fontSize: '2.125rem', fontWeight: 500, mt: 1.75, mb: 0.75 }}>
                                            Device=10
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <ReactApexChart
                                            options={lineData.options}
                                            series={lineData.series}
                                            type={lineData.type}
                                            height={lineData.height}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ReactApexChart
                                            options={pieData.options}
                                            series={pieData.series}
                                            type={pieData.type}
                                            height={pieData.height}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </CardWrapper>
            )}
        </>
    );
};

EarningCard.propTypes = {
    isLoading: PropTypes.bool
};

export default EarningCard;
