import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider';


const MapChart = ({ data }) => {
  const { isDarkTheme} = useTheme();
  const chartRef = useRef(null);
  const [chartOptions, setChartOptions] = useState({
    series: [{
      data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
    }],
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        'Team A', 'Team B', 'Team C', 'Team D', 'Team E',
        'Team F', 'Team G', 'Team H', 'Team I', 'Team J',
      ],
    },
  });

  useEffect(() => {
    const chartDom = chartRef.current;
    const chart = new ApexCharts(chartDom, chartOptions);
    chart.render();

    // Cleanup function to remove the chart instance
    return () => {
      if (chart) {
       // chart.destroy();
      }
    };
  }, [chartOptions]);

  const handleMarkerClick = (newData) => {
    setChartOptions((prevOptions) => ({
      ...prevOptions,
      series: [{
        data: newData,
      }],
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-4  rounded-lg shadow-lg calendar">
      <MapContainer
        center={[37.9, -77]}
        zoom={2}
        style={{ height: '400px', marginBottom: '20px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          position={[37.9, -87]}
          eventHandlers={{
            click: () => {
              handleMarkerClick([100, 130, 448, 470, 540, 580, 690, 140, 1200, 1380]);
            },
          }}
        >
          <Popup>First Marker</Popup>
        </Marker>
        <Marker
          position={[39.9, -97]}
          eventHandlers={{
            click: () => {
              handleMarkerClick([1380, 1200, 1100, 690, 580, 540, 470, 448, 130, 100]);
            },
          }}
        >
          <Popup>Second Marker</Popup>
        </Marker>
      </MapContainer>
      <div id="chart" ref={chartRef}></div>
    </div>
  );
};

export default MapChart;
