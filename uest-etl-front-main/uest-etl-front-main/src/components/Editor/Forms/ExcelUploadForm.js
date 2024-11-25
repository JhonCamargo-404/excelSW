import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Select, Table } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import './ExcelUploadForm.css';

const ExcelUploadForm = ({ node }) => {
    const [file, setFile] = useState(null);
    const [sheets, setSheets] = useState([]);
    const [data, setData] = useState([]);
    const [selectedSheet, setSelectedSheet] = useState('');
    const [newName, setNewName] = useState('');
    const [filePath, setFilePath] = useState(''); // Agregamos estado para almacenar el path del archivo

    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetNames = workbook.SheetNames;
            setSheets(sheetNames);
            setData([]); // Clear previous data on new file upload
            setSelectedSheet(''); // Reset selected sheet
            setNewName(''); // Reset new name
        };
        reader.readAsBinaryString(file);
        setFile(file);
        setFilePath(file.name); // Establece el nombre del archivo para mostrarlo
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
            setData(jsonData.slice(0, 5)); // Mostrar las primeras 5 filas
        };
        reader.readAsBinaryString(file);

        setSelectedSheet(sheetName);
        setNewName(sheetName); // Actualiza el nuevo nombre con el nombre de la hoja seleccionada
    };

    const handleNameChange = (e) => {
        setNewName(e.target.value);
    };

    const handleSave = () => {
        // Implementar la lógica de guardado aquí
        console.log("Guardar datos");
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
                    accept=".xlsx"
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
                <button className="save-button" onClick={handleSave}>
                    <SaveOutlined /> Guardar
                </button>
            </div>
        </div>
    );
};

export default ExcelUploadForm;
