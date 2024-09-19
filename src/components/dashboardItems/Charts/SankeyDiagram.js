import React, { useState } from 'react';
import { ResponsiveSankey } from '@nivo/sankey';

const SankeyDiagram = ({ data }) => {
    const [hoveredNode, setHoveredNode] = useState(null);
    
    const languages = data.flatMap(each => each.languages).filter(lang => lang);



    if (languages.length === 0) {
        return <div>No language data available.</div>;
    }

   
    const uniqueLanguages = Array.from(new Set(languages.map(lang => lang.name)));


    const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Native"];


    const languageProficiencyData = uniqueLanguages.map(uniqueLang => {
        const langData = languages.find(lang => lang.name === uniqueLang);
        const value = langData ? langData.proficiency : null;

        return { id: uniqueLang, proficiency: value };
    }).filter(lang => lang.proficiency);
    const nodes = [
        ...languageProficiencyData.map(lang => ({ id: lang.id })), 
        ...proficiencyLevels.map(level => ({ id: level })) 
    ];


    const links = languageProficiencyData.map(lang => ({
        source: lang.id,
        target: lang.proficiency,
        value: 1 
    }));

    const sankeyData = {
        nodes,
        links,
    };
    const nodeColor = (node) => {
        if (hoveredNode === node.id) {
            return '#FFD700'; 
        }
        return node.color || '#000'; 
    };

    return (
        <div style={{textAlign: 'center',border: '2px solid #ccc',boxShadow:"#bfbfbf", padding: '20px', borderRadius: '8px', width: '100%' }}
        >
            <span style={{ textAlign: 'center',fontWeight:"bold",padding:"5px" }}>Language Proficiency</span>
            <div style={{ height: '300px' }}>
                <ResponsiveSankey
                    data={sankeyData}
                    //margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    nodeColor={{ scheme: 'nivo' }}
                    nodeOpacity={0.9}
                    nodeHoverOpacity={1}
                    nodeThickness={18}
                    nodeSpacing={24}
                    linkColor={{ scheme: 'nivo' }}
                    linkOpacity={0.6}
                    enableLinkGradient={true}
                 //   onMouseEnter={(node) => setHoveredNode(node.id)} 
                  //  onMouseLeave={() => setHoveredNode(null)}
                    onClick={(node) => alert(`Clicked: ${node.id}`)}
                />
            </div>
        </div>
    );
};

export default SankeyDiagram;
