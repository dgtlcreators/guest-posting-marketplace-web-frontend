
import React from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { useTheme } from '../../../context/ThemeProvider';

const Treemap = ({ data }) => {
    const { isDarkTheme } = useTheme();

    if (!data || !Array.isArray(data)) {
        return <div>No data available.</div>;
    }


    const expertiseData = data.flatMap(each => each.industry).filter(lang => lang);


    const industryMap = expertiseData.reduce((acc, industry) => {
        const industryName = industry.type || 'Unknown';
        if (!acc[industryName]) {
            acc[industryName] = {};
        }
        
        (industry.subCategories || []).forEach(sub => {
            const subCategoryName = sub.type || 'Unknown';
            if (!acc[industryName][subCategoryName]) {
                acc[industryName][subCategoryName] = 0;
            }
            acc[industryName][subCategoryName] += 1; 
        });

        return acc;
    }, {});


    const treeData = {
        name: 'Industries',
        children: Object.entries(industryMap).map(([industryName, subCategories]) => ({
            name: industryName,
            children: Object.entries(subCategories).map(([subCategoryName, size]) => ({
                name: subCategoryName,
                size, 
            })),
        })).filter(industry => industry.children.length > 0),
    };

    const customTheme = {
        tooltip: {
            container: {
                background: isDarkTheme ? '#333' : '#fff',    // Dark or light background
                color: isDarkTheme ? '#fff' : '#333',          // Dark or light text color
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                maxWidth: '200px',
                textAlign: 'center',
            }
        },
        labels: {
            text: {
                fontSize: '14px',
                fontWeight: 'bold',
                color: isDarkTheme ? '#fff' : '#333', 
            }
        },
       
        borderColor: isDarkTheme ? '#fff' : '#333',  
        colors: { scheme: isDarkTheme ? 'dark2' : 'nivo' }, 
    };


    return (
        <div// style={{ height: '500px', border: '2px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        style={{ 
          //  height: '600px', 
          textAlign: 'center',
            width: '100%', 
            padding: '20px', 
            borderRadius: '8px', 
            border: '2px solid #ccc',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        }}>
        <span  style={{ textAlign: 'center' ,fontWeight:"bold"}}>Industry </span>
        <div style={{ height: '300px' }}>
            <ResponsiveTreeMap
                data={treeData}
                identity="name"
                value="size"
                innerPadding={3}
                outerPadding={10}
                enableLabel={true}
                labelTextColor={{ from: 'color', modifiers: [['brighter', 1.5]] }}
                labelSkipSize={12}
                colors={{ scheme: 'nivo' }}
                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                theme={customTheme} 
           />
            </div>
        </div>
    );
};

export default Treemap;

