import ReactFlow, { MiniMap, Controls, Background } from 'react-flow-renderer';
import './Editor.css';
import NodeDataSource from '../Node/NodeDataSource';

const nodeTypes = {
    dataSource: NodeDataSource, // Aquí registramos el nodo personalizado bajo el tipo 'dataSource'
};

const Editor = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect, setSelectedNode, sidebarExpanded, selectedNodeId }) => {
    return (
        <div className={`editor ${sidebarExpanded ? '' : 'collapsed'}`}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={(event, node) => setSelectedNode(node)}
                nodeTypes={nodeTypes} // Usa nodeTypes para registrar nodos personalizados
                style={{ width: '100%', height: '100vh' }}
            >
                <MiniMap />
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default Editor;
