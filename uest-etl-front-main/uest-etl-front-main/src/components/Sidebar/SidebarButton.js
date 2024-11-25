import React from 'react';
import './SidebarButton.css';

const SidebarButton = ({ onClick, icon, label }) => {
    return (
        <div className="sidebar-button" onClick={onClick}>
            {icon}
            <span>{label}</span>
        </div>
    );
};

export default SidebarButton;
