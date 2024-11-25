import React from 'react';
import { FileExcelOutlined } from '@ant-design/icons';
import Node from './Node';

const NodeDataSource = ({ data, selected }) => {
    const nodeStyle = {
        backgroundColor: selected ? '#d3f2ff' : '#f0f9ff', // Color diferente para el nodo seleccionado
        color: selected ? '#003a70' : '#0050b3',
        border: selected ? '2px solid #003a70' : '1px solid #91d5ff',
        borderRadius: '10px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 8px 12px rgba(0, 0, 0, 0.05)',
        padding: '10px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    };

    const handleHover = {
        boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.2), 0px 12px 16px rgba(0, 0, 0, 0.1)',
        transform: 'translateY(-4px)',
    };

    return (
        <Node
            icon={<FileExcelOutlined />}
            data={data}
            style={nodeStyle}
            hoverStyle={handleHover}
        />
    );
};

export default NodeDataSource;
