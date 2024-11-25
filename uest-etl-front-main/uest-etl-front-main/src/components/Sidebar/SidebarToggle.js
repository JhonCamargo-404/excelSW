import React from 'react';
import { FaBars } from 'react-icons/fa';
import './SidebarToggle.css';

const SidebarToggle = ({ setSidebarExpanded }) => {
    const toggleSidebar = () => {
        setSidebarExpanded(prev => !prev);
    };

    return (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
            <span className="icon">
                {<FaBars />}
            </span>
        </button>
    );
};

export default SidebarToggle;
