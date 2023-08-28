import React, { useState } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider, MuiPickersUtilsProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CssBaseline from '@mui/material/CssBaseline';

const colorfulTheme = createTheme({
    palette: {
        primary: {
            main: '#ff5722' // Replace this with your desired primary color
        },
        secondary: {
            main: '#00bcd4' // Replace this with your desired secondary color
        }
    }
});

export default function DataDownload() {
    const BASE_URL = 'https://www.cornellsaprun.com/dncserver/';
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [location, setLocation] = useState('Arnot');
    const [frmDate, setFrmDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [loading, setLoading] = useState(false);

    const handleDownload = () => {
        console.log('Download button clicked!');
        setIsDialogOpen(true);
        setTimeout(() => {
            console.log('Download completed!');
            setIsDialogOpen(false);
        }, 1000);
        setTimeout(() => {
            setIsDialogOpen(false);
        }, 2000);

        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        var query = JSON.stringify({ loc: location, fmdate: frmDate, todate: toDate });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: query
        };
        fetch(BASE_URL + 'getld', requestOptions)
            .then((response) => response.text())
            .then((result) => {
                let resobj = JSON.parse(result);
                let fname = resobj['message'];

                var anchor = document.createElement('a');
                anchor.href = BASE_URL + 'download/' + fname;
                anchor.download = fname;
                anchor.click();
                setLoading(false);
            })
            .catch((error) => console.log('error', error));
    };
    const onHandleDnload = () => {
        setLoading(true);
        onDownload();
    };

    const onHandleBack = () => {
        props.navigation.navigate('LoginScreen');
    };

    const onLocationChange = (e) => {
        setLocation(e.target.value);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-inner">
                <MainCard title="Plugins --> Data Download">
                    <Box display="flex" marginLeft="10%" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                        {/* {/ {/ {/ Select Location /} /} /} */}
                        <Box
                            sx={{
                                width: '30%',
                                maxWidth: '500px',
                                margin: '0 auto',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                // background: 'linear-gradient(135deg, #d4a7b1 0%, #a25683 100%)',
                                background: 'white',
                                padding: '20px',
                                borderRadius: '10px'
                                // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Location</InputLabel>
                                <Select
                                    labelId="Select Location"
                                    id="demo-simple-select"
                                    // value={age}
                                    label="Select Location"
                                    onChange={(e) => onLocationChange(e)}
                                >
                                    <MenuItem value="Arnot">Arnot</MenuItem>
                                    <MenuItem value="Uihlein">Uihlein</MenuItem>
                                    <MenuItem value="UVM">UVM</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* {/ {/ {/ From Date/Time /} /} /} */}
                        <ThemeProvider theme={colorfulTheme}>
                            <CssBaseline />
                            <Box sx={{ width: '26%', marginBottom: '2rem', textAlign: 'center' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        renderInput={(props) => (
                                            <TextField
                                                {...props}
                                                variant="outlined"
                                                color="primary"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                            />
                                        )}
                                        label="From Date/Time"
                                        value={frmDate}
                                        onChange={(value) => setFrmDate(value)}
                                        showTodayButton
                                        todayText="Now"
                                    />
                                </LocalizationProvider>
                            </Box>

                            <Box sx={{ width: '26%', marginBottom: '1rem', textAlign: 'center' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        renderInput={(props) => (
                                            <TextField
                                                {...props}
                                                variant="outlined"
                                                color="secondary"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                            />
                                        )}
                                        label="To Date/Time"
                                        value={toDate}
                                        onChange={(value) => setToDate(value)}
                                        showTodayButton
                                        todayText="Now"
                                    />
                                </LocalizationProvider>
                            </Box>
                        </ThemeProvider>

                        {/* {/ {/ {/ Download Button /} /} /} */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                style={{ backgroundColor: colorfulTheme.palette.primary.main }}
                                variant="contained"
                                color="primary"
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                        </Box>
                    </Box>
                </MainCard>
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                    <DialogContent>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 3
                            }}
                        >
                            {' '}
                            <CircularProgress size={64} color="secondary" />
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <h3>Downloading...</h3>
                            <p>Please wait while the data is being downloaded.</p>
                        </Box>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
