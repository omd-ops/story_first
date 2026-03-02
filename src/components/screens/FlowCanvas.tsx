import { useCallback, useMemo, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
  NodeTypes,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Video, MessageCircle, Target, Sparkles, Music, FileText, User, BookOpen, MessageSquare, CheckCircle } from 'lucide-react';

type BlockType =
  | 'intro' 
  | 'customized-message' 
  | 'audio' 
  | 'video' 
  | 'content-piece' 
  | 'personalization' 
  | 'direct-instruction' 
  | 'qa' 
  | 'challenge' 
  | 'wrap-up';

interface Block {
  id: string;
  type: BlockType;
  title: string;
  duration: number;
  background: {
    type: 'transparent' | 'color' | 'image';
    value?: string;
  };
  content?: string;
  mediaUrl?: string;
  templateVars?: string[];
}

interface FlowCanvasProps {
  blocks: Block[];
  onReorder: (blocks: Block[]) => void;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
}

const BLOCK_ICONS: Record<BlockType, typeof Sparkles> = {
  'intro': Sparkles,
  'customized-message': MessageSquare,
  'audio': Music,
  'video': Video,
  'content-piece': FileText,
  'personalization': User,
  'direct-instruction': BookOpen,
  'qa': MessageCircle,
  'challenge': Target,
  'wrap-up': CheckCircle,
};

const BLOCK_COLORS: Record<BlockType, { bg: string; border: string }> = {
  'intro': { bg: '#F3E5F5', border: '#9C27B0' },
  'customized-message': { bg: '#FCE4EC', border: '#E91E63' },
  'audio': { bg: '#E8F5E9', border: '#4CAF50' },
  'video': { bg: '#FFF4E6', border: '#FF9800' },
  'content-piece': { bg: '#E8EAF6', border: '#3F51B5' },
  'personalization': { bg: '#E0F2F1', border: '#009688' },
  'direct-instruction': { bg: '#FFF8E1', border: '#FFC107' },
  'qa': { bg: '#E3F2FD', border: '#2196F3' },
  'challenge': { bg: '#FFFBE6', border: '#FFD93D' },
  'wrap-up': { bg: '#E8F5E9', border: '#10B981' },
};

interface CustomNodeData {
  label: string;
  type: string;
  blockType: BlockType;
  duration: number;
}

function CustomNode({ data }: { data: CustomNodeData }) {

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const IconComponent = BLOCK_ICONS[data.blockType];
  const colors = BLOCK_COLORS[data.blockType];

  return (
    <div
      className="px-4 py-3 rounded-lg shadow-lg transition-all relative"
      style={{
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        minWidth: '200px',
      }}
    >
      {/* Input handle (left side) */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: colors.border,
          border: '2px solid white',
        }}
      />

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }}>
          <IconComponent className="w-5 h-5" style={{ color: colors.border }} />
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm" style={{ color: '#1a1a1a' }}>{data.label}</div>
          <div className="text-xs" style={{ color: '#666' }}>{data.type} · {formatDuration(data.duration)}</div>
        </div>
      </div>

      {/* Output handle (right side) */}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: '12px',
          height: '12px',
          backgroundColor: colors.border,
          border: '2px solid white',
        }}
      />
    </div>
  );
}

export function FlowCanvas({ blocks, onReorder, selectedBlockId, onSelectBlock }: FlowCanvasProps) {
  const getBlockTypeLabel = (type: BlockType) => {
    switch (type) {
      case 'intro': return 'Intro';
      case 'customized-message': return 'Message';
      case 'audio': return 'Audio';
      case 'video': return 'Video';
      case 'content-piece': return 'Content';
      case 'personalization': return 'Personal';
      case 'direct-instruction': return 'Instruction';
      case 'qa': return 'Q&A';
      case 'challenge': return 'Challenge';
      case 'wrap-up': return 'Wrap-up';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Convert blocks to nodes and edges
  const initialNodes: Node[] = useMemo(() => {
    return blocks.map((block, index) => ({
      id: block.id,
      type: 'custom',
      position: { x: 150, y: index * 150 + 50 },
      data: {
        label: block.title,
        type: getBlockTypeLabel(block.type),
        blockType: block.type,
        duration: block.duration,
      },
    }));
  }, [blocks]);

  const initialEdges: Edge[] = useMemo(() => {
    return blocks.slice(0, -1).map((block, index) => ({
      id: `e${block.id}-${blocks[index + 1].id}`,
      source: block.id,
      target: blocks[index + 1].id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#FF9800', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#FF9800',
      },
    }));
  }, [blocks]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when blocks change
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  // Update edges when blocks change
  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      setEdges((eds) => {
        // Remove any existing edge that points to the same target
        // This ensures each block has only ONE incoming connection
        const filtered = eds.filter((e) => e.target !== params.target);

        const newEdge: Edge = {
          ...params,
          source: params.source!,
          target: params.target!,
          id: `e${params.source}-${params.target}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#FF9800', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#FF9800',
          },
        };

        return addEdge(newEdge, filtered);
      });
    },
    [setEdges]
  );

  // Custom edge styles when selected
  const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#FF9800', strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#FF9800',
    },
  };

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      if (!newConnection.source || !newConnection.target) return;

      setEdges((els) => {
        // Remove old edge and any other edge pointing to the same target
        // This ensures each block has only ONE incoming connection
        const filtered = els.filter((e) => e.id !== oldEdge.id && e.target !== newConnection.target);

        const newEdge: Edge = {
          ...newConnection,
          source: newConnection.source!,
          target: newConnection.target!,
          id: `e${newConnection.source}-${newConnection.target}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#FF9800', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#FF9800',
          },
        };
        return addEdge(newEdge, filtered);
      });
    },
    [setEdges]
  );

  const nodeTypes: NodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onSelectBlock(node.id);
    },
    [onSelectBlock]
  );

  return (
    <div className="bg-white rounded-lg border border-[var(--sf-border)] overflow-hidden" style={{ height: '600px' }}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--sf-border)] bg-gray-50">
        <h3
          className="text-lg tracking-wide"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          LESSON FLOW ({blocks.length} blocks · {formatDuration(blocks.reduce((sum, b) => sum + b.duration, 0))} total)
        </h3>
        <div className="flex flex-col items-end gap-1">
          <p className="text-xs text-[var(--sf-text-muted)]">
            <span className="font-medium">Sequence:</span> One block can lead to multiple blocks · Each block has only one predecessor
          </p>
          <p className="text-xs text-[var(--sf-text-muted)] italic">
            Drag connections to define execution order · Delete key to remove connections
          </p>
        </div>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        edgesUpdatable={true}
        edgesFocusable={true}
        elementsSelectable={true}
        deleteKeyCode="Delete"
        defaultEdgeOptions={defaultEdgeOptions}
        onEdgeUpdate={onEdgeUpdate}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
