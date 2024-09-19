import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { useTheme } from '../../../context/ThemeProvider';

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
    const borderColor = isDarkTheme ? '#FFFFFF' : '#000000'; 
    const fillColor = isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
    const labelColor = isDarkTheme ? '#FFFFFF' : '#000000'; 

    return (
        <div style={{  textAlign: 'center',border: '2px solid #ccc', padding: '20px', borderRadius: '8px', width: '100%',borderColor: '#f1f1f1', }}>
            <span style={{ textAlign: 'center',padding:"5px",fontWeight:"bold" ,marginBottom:"5px"}}>Expertise </span>
            <div style={{ height: '300px',color:labelColor }}
            >
                <ResponsiveRadar
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
                />
            </div>
        </div>
    );
};

export default RadarChart3;
