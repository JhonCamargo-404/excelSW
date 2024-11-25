import React from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, FileExcelOutlined } from '@ant-design/icons';
import './Sidebar.css';

const { Sider } = Layout;

const Sidebar = ({ sidebarExpanded, setSidebarExpanded, createNode }) => {
    const toggleSidebar = () => {
        setSidebarExpanded(prev => !prev);
    };

    return (
        <Sider className={`sidebar ${sidebarExpanded ? '' : 'collapsed'}`} collapsible collapsed={!sidebarExpanded} onCollapse={toggleSidebar}>
            <div className="collapse-button">
                <Button
                    type="text"
                    icon={sidebarExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                    onClick={toggleSidebar}
                />
            </div>
            <div className="sidebar-content">
                {/* Pasamos un valor dinámico para el nombre del nodo */}
                <Button icon={<FileExcelOutlined />} onClick={() => createNode('Hoja de Excel')}>
                    {sidebarExpanded ? 'Añadir Hoja Excel' : null}
                </Button>
            </div>
        </Sider>
    );
};

export default Sidebar;

