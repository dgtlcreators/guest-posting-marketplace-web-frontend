
import React from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';

const Treemap = ({ data }) => {

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
            />
            </div>
        </div>
    );
};

export default Treemap;
