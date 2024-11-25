import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';
import './Node.css';

const Node = ({ data, style, icon, hoverStyle }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="custom-node"
            style={{
                ...style,
                ...(isHovered ? hoverStyle : {}),
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="node-icon">
                {icon} {/* Renderiza el ícono como JSX */}
            </div>
            <div className="node-label">
                {data.label}
            </div>
            <Handle type="source" position="right" />
            <Handle type="target" position="left" />
        </div>
    );
};

export default Node;
