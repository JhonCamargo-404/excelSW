import React, { useState } from 'react';
import Editor from './Editor';
import Sidebar from '../Sidebar/Sidebar';
import { v4 as uuidv4 } from 'uuid';


const initialNodes = [];
const initialEdges = [];

const EditorArea = () => {
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const onNodesChange = (changes) => {
        setNodes((nds) => nds.map((node) => {
            const change = changes.find((c) => c.id === node.id);
            return change ? { ...node, ...change } : node;
        }));
    };


    const onEdgesChange = (changes) => {
        setEdges((eds) => [...eds, ...changes]);
    };

    const createNodeDataSource = () => {
        const newNode = {
            id: uuidv4(),
            data: { label: 'Data Source Node' }, // Revisa que data contenga un label
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            type: 'default', // Este tipo debe coincidir con los tipos soportados por react-flow
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
    };


    return (
        <div className="editor-container">
            <Sidebar
                createNode={createNodeDataSource}
                sidebarExpanded={sidebarExpanded}
                setSidebarExpanded={setSidebarExpanded}
            />
            <Editor
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={(params) => setEdges((eds) => [...eds, params])}
                setSelectedNode={(node) => console.log('Nodo seleccionado:', node)}
                sidebarExpanded={sidebarExpanded}
            />
        </div>
    );
};

export default EditorArea;
