




/*import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Linecharts3D = ({ data }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Axes helper
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // Line setup
    const createLine = (points, color) => {
      const material = new THREE.LineBasicMaterial({ color });
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, material);
      return line;
    };

    // Data to 3D points
    const postPoints = data.map((item, index) => new THREE.Vector3(index, item.collaborationRates.post, 0));
    const storyPoints = data.map((item, index) => new THREE.Vector3(index, item.collaborationRates.story, 1));
    const reelPoints = data.map((item, index) => new THREE.Vector3(index, item.collaborationRates.reel, 2));

    const postLine = createLine(postPoints, 0xff0000); // Red
    const storyLine = createLine(storyPoints, 0x00ff00); // Green
    const reelLine = createLine(reelPoints, 0x0000ff); // Blue

    scene.add(postLine);
    scene.add(storyLine);
    scene.add(reelLine);

    // Adding grid helper for better visualization
    const gridHelper = new THREE.GridHelper(50, 50);
    scene.add(gridHelper);

    // Camera positioning
    camera.position.set(10, 10, 20);
    camera.lookAt(0, 0, 0);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, [data]);

  return <div ref={mountRef} style={{ width: '100%', height: '500px' }} />;
};

export default Linecharts3D;*/












import React from 'react'
import ApexCharts from 'react-apexcharts';
import { useTheme } from '../../../context/ThemeProvider.js';

const Linecharts = ({data}) => {
  const { isDarkTheme } = useTheme();

    const sponsoredVideos = data.map(item => item.collaborationRates.sponsoredVideos);
    const productReviews = data.map(item => item.collaborationRates.productReviews);
    const shoutouts = data.map(item => item.collaborationRates.shoutouts);

    const labels = data.map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (data.length - index)); 
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); 
    });
    
    
    var options = {
        series: [{
          name: "SponsoredVideos",
          data: sponsoredVideos
        },
        {
          name: "ProductReviews",
          data: productReviews
        },
        {
          name: 'Shoutouts',
          data: shoutouts
        }
      ],
        chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      fill: {
      type: 'gradient',
    },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      title: {
        text: 'collaborationRates',
       
        align: 'left',
        style: {
          //fontSize: '24px',
          color: isDarkTheme ? '#FFFFFF' : '#000000', 
        },
      },
      legend: {
        tooltipHoverFormatter: function(val, opts) {
          return val + ' - <strong>' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '</strong>'
        },
        labels: { colors: isDarkTheme ? '#FFFFFF' : '#000000' },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      labels: labels,
      xaxis: {
        type: 'datetime',
        style: {
          color: isDarkTheme ? '#FFFFFF' : '#000000',
        },
        labels: {
          style: {
            colors: isDarkTheme ? '#FFFFFF' : '#000000',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Collaboration Rates',
          style: {
            color: isDarkTheme ? '#FFFFFF' : '#000000',
          },
        },
          labels: {
            style: {
              colors: isDarkTheme ? '#FFFFFF' : '#000000',
            },
          },
        
        
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + " (mins)"
              }
            },
            labels: {
              style: {
                colors: isDarkTheme ? '#FFFFFF' : '#000000',
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val + " per session"
              }
            },
            labels: {
              style: {
                colors: isDarkTheme ? '#FFFFFF' : '#000000',
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val;
              }
            },
            labels: {
              style: {
                colors: isDarkTheme ? '#FFFFFF' : '#000000',
              },
            },
          }
        ]
      },
      grid: {
        borderColor: '#f1f1f1',
      },
      legend: {
       
        labels: {
          colors: isDarkTheme ? '#FFFFFF' : '#000000',
        }
      },
      grid: {
        borderColor: isDarkTheme ? '#555555' : '#E0E0E0' 
      }
      };
    

  return (
   
   <div className="w-full max-w-md mx-auto p-4  rounded-lg shadow-lg calendar">
    <ApexCharts
       options={options}
       series={options.series}
      type="line"
      height={350}
    />
 </div>
  )
}

export default Linecharts