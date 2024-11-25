import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import { SaveOutlined, DeleteOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons';
import ExcelUploadForm from './Forms/ExcelUploadForm';
import './NodeForm.css';

const NodeForm = ({ node, onUpdateNode, onDeleteNode, onCloseForm }) => {
    const [nodeName, setNodeName] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);

    useEffect(() => {
        if (node) {
            setNodeName(node.data.label || '');
        }
    }, [node]);

    const handleNameChange = (e) => {
        setNodeName(e.target.value);
    };

    const handleSaveName = () => {
        if (nodeName.trim() !== '') {
            onUpdateNode({
                ...node,
                data: { ...node.data, label: nodeName },
            });
            setIsConfigModalVisible(false); // Cerrar modal al guardar el nombre
        }
    };

    const handleDeleteClick = () => {
        setIsDeleteModalVisible(true);
    };

    const handleConfirmDelete = () => {
        if (node) {
            onDeleteNode(node.id);
        }
        setIsDeleteModalVisible(false);
    };

    const handleCancelDelete = () => {
        setIsDeleteModalVisible(false);
    };

    const renderNodeSpecificForm = () => {
        switch (node?.data?.type) {
            case 'Hoja de Excel':
                return <ExcelUploadForm node={node} />;
            default:
                return <div>Configuración específica para este nodo.</div>;
        }
    };

    return (
        <div className="node-form">
            {/* Cabecera con el tipo de nodo y el nombre */}
            <div className="node-header">
                <h3>{`${node?.data?.type || 'Tipo de Nodo'} - ${nodeName || 'Nombre del Nodo'}`}</h3>
            </div>

            {/* Botón flotante de cerrar */}
            <button className="floating-close-button" onClick={onCloseForm}>
                <CloseOutlined />
            </button>

            {/* Botón de configuración */}
            <button className="floating-config-button" onClick={() => setIsConfigModalVisible(true)}>
                <SettingOutlined />
            </button>

            {/* Botón de eliminar */}
            <button className="floating-delete-button" onClick={handleDeleteClick}>
                <DeleteOutlined />
            </button>

            <div className="form-content">
                {renderNodeSpecificForm()}
            </div>

            {/* Modal para cambiar el nombre */}
            <Modal
                title="Cambiar Nombre del Nodo"
                open={isConfigModalVisible}
                footer={null} // Eliminamos los botones por defecto del modal
                onCancel={() => setIsConfigModalVisible(false)}
            >
                <input
                    type="text"
                    value={nodeName}
                    onChange={handleNameChange}
                    placeholder="Cambiar nombre del nodo"
                    style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <button className="form-button" onClick={handleSaveName}>
                    <SaveOutlined /> Guardar
                </button>
            </Modal>

            {/* Modal para confirmar la eliminación */}
            <Modal
                title="Confirmar Eliminación"
                open={isDeleteModalVisible}
                footer={null} // Eliminamos los botones por defecto del modal
                onCancel={handleCancelDelete}
            >
                <p>¿Estás seguro de que deseas eliminar este nodo? Esta acción no se puede deshacer.</p>
                <button className="form-button delete-button" onClick={handleConfirmDelete}>
                    <DeleteOutlined /> Eliminar
                </button>
            </Modal>
        </div>
    );
};

export default NodeForm;
