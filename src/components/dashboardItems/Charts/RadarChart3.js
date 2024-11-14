import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { useTheme } from '../../../context/ThemeProvider.js';

const RadarChart3 = ({ data }) => {
    const { isDarkTheme } = useTheme(); 

    const expertiseData = data.flatMap(each => each.expertise).filter(lang => lang);


    const expertiseCount = expertiseData.reduce((acc, item) => {
        acc[item.type] = (acc[item.type] || 0) + 1;
        return acc;
    }, {});

  
    const radarData = Object.keys(expertiseCount).map(type => ({
        type,
        value: expertiseCount[type], 
    }));

    /**
     * const radarData = data
    .filter(item => item.type && item.type.trim() !== '') 
    .map(item => ({
        type: item.type, 
        value: item.value,
    }));

     */

    const types = radarData.map(item => item.type);
//console.log(types);

    //console.log("Radar Data ",radarData)
    const borderColor = isDarkTheme ? '#FFFFFF' : '#000000'; 
    const fillColor = isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
    const labelColor = isDarkTheme ? '#FFFFFF' : '#000000'; 

    const radarChartData = radarData.map(item => ({
        taste: item.type || "Unknown",
        value: item.value
      }));
      

      const lightTheme = {
        background: "#ffffff",
        textColor: "#333333",
        axis: { line: { stroke: "#ddd" }, ticks: { text: { fill: "#333" } } },
        grid: { line: { stroke: "#ddd" } },
        dots: { color: { theme: "background" }, borderColor: { from: "color", modifiers: [["darker", 0.7]] } },
        colors: { scheme: "nivo" },
        tooltip: {
          container: {
            background: "#fff",
            color: "#333",
          },
        },
      };
      
      const darkTheme = {
        background: "#333333",
        textColor: "#f4f4f4",
        axis: { line: { stroke: "#555" }, ticks: { text: { fill: "#f4f4f4" } } },
        grid: { line: { stroke: "#555" } },
        dots: { color: { theme: "background" }, borderColor: { from: "color", modifiers: [["darker", 0.7]] } },
        colors: { scheme: "nivo" },
        tooltip: {
          container: {
            background: "#333",
            color: "#fff", 
          },
        },
      };
      

      const radarChartSettings = {
        indexBy: "taste",
        keys: ["value"],
        maxValue: Math.max(...Object.values(expertiseCount), 1), 
        margin: { top: 40, right: 80, bottom: 40, left: 80 },
        gridShape: "linear",
        gridLabelOffset: 36,
        enableDots: true,
        dotSize: 10,
        dotBorderWidth: 2,
        enableGridX: true,
        enableGridY: true,
        isInteractive: true,
        animate: true,
      };
      
      

    return (
        <div style={{  textAlign: 'center',border: '2px solid #ccc', padding: '20px', borderRadius: '8px', width: '100%',borderColor: '#f1f1f1', }}>
            <span style={{ textAlign: 'center',padding:"5px",fontWeight:"bold" ,marginBottom:"5px"}}>Expertise </span>
            <div style={{ height: '300px',color:labelColor }}
            >

<ResponsiveRadar
        data={radarChartData}
        theme={ isDarkTheme? darkTheme : lightTheme}
        {...radarChartSettings}
        tooltip={({ index, value }) => (
            <div
              style={{
                padding: "8px 12px",
                backgroundColor: isDarkTheme ? "#333" : "#fff", 
                color: isDarkTheme ? "#fff" : "#333",           
                borderRadius: "5px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                fontSize: "14px",
              }}
            >
              <strong>{index}</strong>: <span>{value}</span>
            </div>
          )}
      />

{/*<ResponsiveRadar
        data={radarData}
        keys={[ types ]}
        indexBy="taste"
        valueFormat=">-.2f"
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        borderColor={{ theme: 'grid.line.stroke' }}
        gridLabelOffset={36}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={2}
        colors={{ scheme: 'nivo' }}
        blendMode="multiply"
        motionConfig="wobbly"
        legends={[
            {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    />*/}
               { /*<ResponsiveRadar
                    data={radarData}
                    keys={['value']}
                    indexBy="type"
                    maxValue={Math.max(...Object.values(expertiseCount), 1)} 
                    margin={{ top: 40, right: 80, bottom: 40, left: 80 }}
                    curve="linearClosed"
                    
                   borderColor={{ from: 'color' }}
                  //  borderColor={borderColor}
                    fill={fillColor} 
                    gridLabelOffset={36}
                    enableDots={true}
                    dotSize={10}
                    dotColor={{ from: 'color' }}
                   // dotColor={borderColor}
                   
                    dotBorderWidth={2}
                   // dotBorderColor={borderColor}
                    dotBorderColor={{ from: 'color', modifiers: [['brighter', 0.2]] }}
                 //   dotLabelTextColor={labelColor} 
                 dotLabelTextColor={{ from: 'color' }}
                 colors={{ scheme: 'nivo' }}


                 
                labelTextColor={{ from: 'color', modifiers: [['brighter', 1.5]] }}
                    enableDotLabel={true}
                    dotLabel="value"
                    isInteractive={true}
                    animate={true}
                    motionConfig="gentle"
                    gridLabelTextColor={labelColor}
                    
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            translateY: 56,
                            itemWidth: 100,
                            itemHeight: 20,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            itemTextColor: labelColor,
                        },
                    ]}
                />*/}
            </div>
        </div>
    );
};

export default RadarChart3;
