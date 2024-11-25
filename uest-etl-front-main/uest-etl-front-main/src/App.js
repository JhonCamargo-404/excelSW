import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { addEdge, useEdgesState, useNodesState } from 'react-flow-renderer';
import Sidebar from './components/Sidebar/Sidebar';
import Editor from './components/Editor/Editor';
import NodeForm from './components/Editor/NodeForm';
import LoggerBanner from './components/Logger/LoggerBanner'; // Componente para registro, login y recuperación
import { Modal } from 'antd';
import './styles/App.css';

const initialNodes = [];
const initialEdges = [];

const App = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState(null);
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [nodeToDelete, setNodeToDelete] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false); // Inicialmente, el formulario está oculto

    const isAuthenticated = !!localStorage.getItem('token'); // Comprueba si hay un token en localStorage

    const addNode = (type) => {
        const newNode = {
            id: (nodes.length + 1).toString(),
            data: { label: `${type}`, type },
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            type: 'dataSource',
        };
        setNodes((nds) => [...nds, newNode]);
    };

    const onUpdateNode = (updatedNode) => {
        setNodes((nds) =>
            nds.map((node) => (node.id === updatedNode.id ? updatedNode : node))
        );
    };

    const onConnect = (params) => {
        const newEdge = {
            ...params,
            markerEnd: {
                type: 'arrowclosed',
                color: '#FF0072',
                width: 20,
                height: 20,
            },
            style: {
                stroke: '#FF0072',
                strokeWidth: 1,
                strokeDasharray: '5,5',
                strokeLinecap: 'round',
            },
        };
        setEdges((eds) => addEdge(newEdge, eds));
    };

    const onDeleteNode = (nodeId) => {
        const outgoingEdges = edges.filter(edge => edge.source === nodeId);

        if (outgoingEdges.length > 0) {
            setIsWarningModalOpen(true);
            setNodeToDelete(nodeId);
        } else {
            setNodes((nds) => nds.filter((node) => node.id !== nodeId));
            setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
            setSelectedNode(null);
        }
    };

    const handleConfirmDelete = () => {
        if (nodeToDelete) {
            setNodes((nds) => nds.filter((node) => node.id !== nodeToDelete));
            setEdges((eds) => eds.filter((edge) => edge.source !== nodeToDelete && edge.target !== nodeToDelete));
            setSelectedNode(null);
        }
        setIsDeleteModalOpen(false);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
    };

    const handleCloseWarningModal = () => {
        setIsWarningModalOpen(false);
    };

    const handlePaneClick = () => {
        // No hacer nada aquí para evitar conflicto con el cierre manual
    };

    const handleCloseForm = () => {
        setIsFormVisible(false); // Ocultar el formulario cuando se presiona el botón
        setSelectedNode(null); // Reiniciar la selección del nodo
    };

    return (
        <Router>
            <Routes>
                {/* Ruta del Logger unificado */}
                <Route path="/logger" element={<LoggerBanner />} />

                {/* Ruta protegida para la aplicación principal */}
                <Route
                    path="/app"
                    element={
                        isAuthenticated ? (
                            <div className="app">
                                <Sidebar
                                    sidebarExpanded={sidebarExpanded}
                                    setSidebarExpanded={setSidebarExpanded}
                                    createNode={addNode}
                                />
                                <Editor
                                    nodes={nodes}
                                    edges={edges}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    onConnect={onConnect}
                                    setSelectedNode={(node) => {
                                        setSelectedNode(node);
                                        setIsFormVisible(true); // Mostrar el formulario al seleccionar un nodo
                                    }}
                                    selectedNodeId={selectedNode?.id}
                                    onPaneClick={handlePaneClick}
                                    fitView
                                />
                                {/* Renderizar condicionalmente el formulario */}
                                {selectedNode && isFormVisible && (
                                    <div className="sidebar-right">
                                        <NodeForm
                                            node={selectedNode}
                                            onUpdateNode={onUpdateNode}
                                            onDeleteNode={onDeleteNode}
                                            onCloseForm={handleCloseForm} // Pasar la función de cierre como prop
                                        />
                                    </div>
                                )}

                                {/* Modal de advertencia si el nodo no se puede eliminar */}
                                <Modal
                                    title="Advertencia"
                                    open={isWarningModalOpen}
                                    onOk={handleCloseWarningModal}
                                    onCancel={handleCloseWarningModal}
                                    okText="Cerrar"
                                    okButtonProps={{ style: { backgroundColor: '#ff4d4f', color: '#fff', width: '100%' } }}
                                    cancelButtonProps={{ style: { display: 'none' } }}  // Eliminar el botón de cancelación
                                >
                                    <p>No se puede eliminar un nodo con conexiones salientes.</p>
                                </Modal>

                                {/* Modal de confirmación para la eliminación del nodo */}
                                <Modal
                                    title="Confirmar Eliminación"
                                    open={isDeleteModalOpen}
                                    onOk={handleConfirmDelete}
                                    onCancel={handleCancelDelete}
                                    okText="Eliminar"
                                    cancelText="Cancelar"
                                    okButtonProps={{ style: { backgroundColor: '#ff4d4f', color: '#fff' } }}
                                    cancelButtonProps={{ style: { backgroundColor: '#d9d9d9', color: '#000' } }}
                                >
                                    <p>¿Estás seguro de que deseas eliminar este nodo? Esta acción no se puede deshacer.</p>
                                </Modal>
                            </div>
                        ) : (
                            <Navigate to="/logger" />
                        )
                    }
                />

                {/* Redirección predeterminada */}
                <Route path="*" element={<Navigate to="/logger" />} />
            </Routes>
        </Router>
    );
};

export default App;
