// ===========================|| DASHBOARD - TOTAL GROWTH BAR CHART ||=========================== //

const chartData = {
    height: 480,
    type: 'line',
    options: {
        chart: {
            id: 'line-chart',
            stacked: false,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 300,
                animateGradually: {
                    enabled: true,
                    delay: 50
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 350
                }
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
    ]
};

export default chartData;
