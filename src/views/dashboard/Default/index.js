// export default Dashboard;
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import RouterIcon from '@mui/icons-material/Router';
import StoreIcon from '@mui/icons-material/Store';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import { css } from '@emotion/react';

const cardData = [
    {
        title: 'Card 1',
        color: '#CAE7DF',
        content: { title: '' },
        details: {
            totalUsers: '--',
            activeUsers: '--'
        }
    },
    {
        title: 'Card 2',
        color: '#CAE7DF',
        content: { title: '', text: 'Click to see details' },
        details: {
            totalgateways: '--',
            activeGateways: '--'
        }
    },
    {
        title: 'Card 3',
        color: '#CAE7DF',
        content: { title: '', text: 'Click to see details' },
        details: {
            totalStocks: '--',
            activeStocks: '--'
        }
    },
    {
        title: 'Card 4',
        color: '#CAE7DF',
        content: { title: '', text: 'Click to see details' },
        details: {
            totalSpots: '--',
            activeSpots: '--'
        }
    }
];

const dashboardStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(200px, 1fr))',
    gridTemplateRows: 'repeat(2, 1fr)',
    gap: '20px',
    justifyContent: 'center',
    alignItems: 'center',
    height: '70vh',
    padding: '20px'
};

const cardStyles = {
    position: 'relative',
    width: '100%',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '220px', // Increase the height to accommodate the divider
    alignItems: 'center',
    color: 'white',
    textAlign: 'center',
    boxShadow: '0px 2px 6px #CAE7DF',
    cursor: 'pointer',
    transition: 'transform 0.3s, box-shadow 0.3s',
    background: '#CAE7DF',
    '&:hover': {
        background: 'linear-gradient(45deg, #6FA8FF 30%, #0000 90%)'
    }
};

const modalStyles = {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
};

const modalContentStyles = {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    width: '200px',
    maxWidth: '95%'
};

const modalDetailsStyles = {
    marginLeft: '20px',
    fontSize: '16px',
    color: 'black'
};

const cardContentStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.2)',
    textAlign: 'center'
};
const iconStyles = {
    fontSize: '48px',
    color: 'black'
};

const titleStyles = {
    fontSize: '24px',
    color: 'black',
    marginTop: '10px'
};

const detailsStyles = {
    color: 'black'
};

function Dashboard() {
    const [showModal, setShowModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const toggleModal = (index) => {
        setShowModal(!showModal);
        setSelectedCard(index);
    };

    const handleModalKeydown = (event) => {
        if (event.key === 'Escape') {
            toggleModal(null);
        }
    };

    return (
        <div className="App">
            <div style={dashboardStyles} className="dashboard">
                {cardData.map((card, index) => (
                    <div
                        key={index}
                        role="button"
                        tabIndex="0"
                        style={{
                            ...cardStyles,
                            backgroundColor: card.color
                        }}
                        className="card"
                        onClick={() => toggleModal(index)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                toggleModal(index);
                            }
                        }}
                    >
                        <div style={cardContentStyles}>
                            <Avatar style={iconStyles}>
                                {index === 0 && <PeopleAltIcon />}
                                {index === 1 && <RouterIcon />}
                                {index === 2 && <StoreIcon />}
                                {index === 3 && <LocationOnIcon />}
                            </Avatar>
                            <h3 style={titleStyles}>
                                {card.content.title}
                                {index === 0 && (
                                    <NavLink
                                        to="/Users"
                                        style={{ color: selectedCard === 0 ? 'greenyellow' : 'black', textDecoration: 'none' }}
                                    >
                                        Users
                                    </NavLink>
                                )}
                                {index === 1 && (
                                    <NavLink
                                        to="/Gateways"
                                        style={{ color: selectedCard === 1 ? 'greenyellow' : 'black', textDecoration: 'none' }}
                                    >
                                        Gateway
                                    </NavLink>
                                )}
                                {index === 2 && (
                                    <NavLink
                                        to="/Stocks"
                                        style={{ color: selectedCard === 2 ? 'greenyellow' : 'black', textDecoration: 'none' }}
                                    >
                                        Stocks
                                    </NavLink>
                                )}
                                {index === 3 && (
                                    <NavLink
                                        to="/ManageSpot"
                                        style={{ color: selectedCard === 3 ? 'greenyellow' : 'black', textDecoration: 'none' }}
                                    >
                                        Spots
                                    </NavLink>
                                )}
                            </h3>
                            {card.details && (
                                <div style={detailsStyles}>
                                    {index === 0 && (
                                        <div>
                                            <p>Total: {card.details.totalUsers}</p>
                                            <p>Active: {card.details.activeUsers}</p>
                                        </div>
                                    )}
                                    {index === 1 && (
                                        <div>
                                            <p>Total: {card.details.totalgateways}</p>
                                            <p>Active: {card.details.activeGateways}</p>
                                        </div>
                                    )}
                                    {index === 2 && (
                                        <div>
                                            <p>Total: {card.details.totalStocks}</p>
                                            <p>Assigned: {card.details.activeStocks}</p>
                                        </div>
                                    )}
                                    {index === 3 && (
                                        <div>
                                            <p>Total: {card.details.totalSpots}</p>
                                            <p>Assigned: {card.details.activeSpots}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {showModal && (
                <div style={modalStyles} onClick={() => toggleModal(null)} onKeyDown={handleModalKeydown} role="button" tabIndex="0">
                    <div style={modalContentStyles}>
                        <h3>{cardData[selectedCard].content.title} Details</h3>
                        {cardData[selectedCard].details && (
                            <div style={modalDetailsStyles}>
                                {selectedCard === 0 && (
                                    <div>
                                        <p>Total Users: {cardData[selectedCard].details.totalUsers}</p>
                                        <p>Active Users: {cardData[selectedCard].details.activeUsers}</p>
                                    </div>
                                )}
                                {selectedCard === 1 && (
                                    <div>
                                        <p>Total Gateways: {cardData[selectedCard].details.totalgateways}</p>
                                        <p>Active Gateways: {cardData[selectedCard].details.activeGateways}</p>
                                    </div>
                                )}
                                {selectedCard === 2 && (
                                    <div>
                                        <p>Total Stocks: {cardData[selectedCard].details.totalStocks}</p>
                                        <p>Active Stocks: {cardData[selectedCard].details.activeStocks}</p>
                                    </div>
                                )}
                                {selectedCard === 3 && (
                                    <div>
                                        <p>Total Spots: {cardData[selectedCard].details.totalSpots}</p>
                                        <p>Active Spots: {cardData[selectedCard].details.activeSpots}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
