import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Select, Table, notification, Button } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import './ExcelUploadForm.css';

const ExcelUploadForm = ({ node }) => {
    const [file, setFile] = useState(null);
    const [sheets, setSheets] = useState([]);
    const [data, setData] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [newName, setNewName] = useState('');
    const [filePath, setFilePath] = useState(''); // Path del archivo cargado

    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetNames = workbook.SheetNames;
            setSheets(sheetNames);
            setData([]); // Limpiar los datos previos al cargar un nuevo archivo
            setSelectedSheet(''); // Resetear la hoja seleccionada
            setNewName(''); // Resetear el nombre
        };
        reader.readAsBinaryString(file);
        setFile(file);
        setFilePath(file.name); // Almacenar el nombre del archivo cargado
    };

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        handleFileUpload(file);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        handleFileUpload(file);
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleSheetSelect = (sheetName) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setData(jsonData.slice(0, 5)); // Mostrar solo las primeras 5 filas
        };
        reader.readAsBinaryString(file);

        setSelectedSheet(sheetName);
        setNewName(sheetName); // Actualiza el nuevo nombre con el nombre de la hoja seleccionada
    };

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleSave = async () => {
        if (!file) {
            notification.error({
                message: "No file selected",
                description: "Please select a valid Excel file before saving."
            });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/upload-excel', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Token de autenticación
                },
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                notification.success({
                    message: 'File Uploaded Successfully',
                    description: `Excel file uploaded with ID: ${result.id}`
                });
                setFile(null); // Limpiar el archivo después de subirlo
                setFilePath('');
            } else {
                const errorData = await response.json();
                notification.error({
                    message: "Upload Failed",
                    description: errorData.detail || "An error occurred while uploading the file."
                });
            }
        } catch (error) {
            console.error("Error uploading the file:", error);
            notification.error({
                message: "Upload Failed",
                description: "An error occurred while uploading the file."
            });
        }
    };

    const columns = data[0]
        ? data[0].map((col, index) => ({
            title: col,
            dataIndex: index,
            key: index,
        }))
        : [];

    const dataSource = data.slice(1).map((row, rowIndex) => {
        const rowData = {};
        row.forEach((cell, colIndex) => {
            rowData[colIndex] = cell;
        });
        return { key: rowIndex, ...rowData };
    });

    return (
        <div
            className="excel-upload-form"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <h4 className="form-title">Cargar archivo de Excel</h4>
            <div className="drag-area">
                <label htmlFor="file-upload" className="file-input-button">
                    <UploadOutlined /> Seleccionar archivo
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileInputChange}
                    className="file-input"
                />
                ó Arrastrar y soltar el archivo aquí
            </div>

            {filePath && (
                <div className="file-path">
                    <strong>Archivo cargado:</strong> {filePath}
                </div>
            )}

            {sheets.length > 0 && (
                <div className="sheet-wrapper">
                    <label htmlFor="sheet-select" className="sheet-label">
                        Seleccionar Hoja
                    </label>
                    <Select
                        id="sheet-select"
                        onChange={handleSheetSelect}
                        placeholder="Selecciona una hoja"
                        className="sheet-select"
                        value={selectedSheet}
                    >
                        {sheets.map((sheet) => (
                            <Select.Option key={sheet} value={sheet}>
                                {sheet}
                            </Select.Option>
                        ))}
                    </Select>

                    <label htmlFor="new-name" className="name-label">
                        Nuevo nombre
                    </label>
                    <input
                        id="new-name"
                        type="text"
                        value={newName}
                        onChange={handleNameChange}
                        className="name-input"
                    />
                </div>
            )}

            {data.length > 0 && (
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    className="data-table"
                    scroll={{ y: 240, x: 'max-content' }} // Ajustamos el scroll horizontal
                />
            )}

            <div className="footer">
                <Button
                    className="save-button"
                    onClick={handleSave}
                    icon={<SaveOutlined />}
                    type="primary"
                >
                    Guardar
                </Button>
            </div>
        </div>
    );
};

export default ExcelUploadForm;
