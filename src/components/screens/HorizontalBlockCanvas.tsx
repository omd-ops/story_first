import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Video, MessageCircle, Target, Sparkles, Music, FileText, User, BookOpen, MessageSquare, CheckCircle, LayoutList, LayoutGrid } from 'lucide-react';
import { Button } from '../ui/button';

type BlockType = 
  | 'intro' 
  | 'audio' 
  | 'video' 
  | 'personalization' 
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

interface HorizontalBlockCanvasProps {
  blocks: Block[];
  onReorder: (blocks: Block[]) => void;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
}

interface DraggableBlockCardProps {
  block: Block;
  index: number;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ITEM_TYPE = 'BLOCK';

function DraggableBlockCard({ block, index, moveBlock, isSelected, onSelect }: DraggableBlockCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveBlock(item.index, index);
        item.index = index;
      }
    },
  });

  const getBlockIcon = (type: BlockType) => {
    switch (type) {
      case 'intro': return Sparkles;
      case 'audio': return Music;
      case 'video': return Video;
      case 'personalization': return User;
      case 'qa': return MessageCircle;
      case 'challenge': return Target;
      case 'wrap-up': return CheckCircle;
    }
  };

  const getBlockColor = (type: BlockType) => {
    switch (type) {
      case 'intro': return 'border-purple-500 bg-purple-50';
      case 'audio': return 'border-green-500 bg-green-50';
      case 'video': return 'border-[var(--sf-orange)] bg-[#FFF4E6]';
      case 'personalization': return 'border-teal-500 bg-teal-50';
      case 'qa': return 'border-[var(--sf-blue)] bg-[#E3F2FD]';
      case 'challenge': return 'border-[#FFD93D] bg-[#FFFBE6]';
      case 'wrap-up': return 'border-emerald-500 bg-emerald-50';
    }
  };

  const getBlockTypeLabel = (type: BlockType) => {
    switch (type) {
      case 'intro': return 'Intro Block';
      case 'audio': return 'Audio Block';
      case 'video': return 'Video Block';
      case 'personalization': return 'Personalization Block';
      case 'qa': return 'Q&A Block';
      case 'challenge': return 'Challenge Block';
      case 'wrap-up': return 'Wrap-up Block';
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const Icon = getBlockIcon(block.type);

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`
        flex-shrink-0 w-64 cursor-move transition-all
        ${isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
      `}
      onClick={() => onSelect(block.id)}
    >
      <div
        className={`
          h-full rounded-lg border-2 p-4 hover:shadow-lg transition-shadow
          ${getBlockColor(block.type)}
          ${isSelected ? 'ring-2 ring-[var(--sf-orange)] shadow-lg' : ''}
        `}
      >
        {/* Drag Handle */}
        <div className="flex items-center justify-center mb-3">
          <GripVertical className="w-5 h-5 text-[var(--sf-text-muted)]" />
        </div>

        {/* Block Number */}
        <div className="text-center mb-3">
          <span 
            className="text-3xl"
            style={{ fontFamily: 'var(--font-bebas)' }}
          >
            {index + 1}
          </span>
        </div>

        {/* Icon */}
        <div className="flex items-center justify-center mb-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/60">
            <Icon className="w-6 h-6" />
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-medium text-center mb-1 line-clamp-2">
          {block.title}
        </h4>

        {/* Type Label */}
        <p className="text-xs text-[var(--sf-text-muted)] text-center mb-3">
          {getBlockTypeLabel(block.type)}
        </p>

        {/* Duration */}
        <div className="flex items-center justify-center">
          <span className="text-xs text-[var(--sf-text-secondary)] bg-white/60 px-2 py-1 rounded">
            {formatDuration(block.duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function HorizontalBlockCanvas({ blocks, onReorder, selectedBlockId, onSelectBlock }: HorizontalBlockCanvasProps) {
  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[dragIndex];
    newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, draggedBlock);
    onReorder(newBlocks);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 
          className="text-lg tracking-wide"
          style={{ fontFamily: 'var(--font-bebas)' }}
        >
          LESSON TIMELINE ({blocks.length} blocks · {formatDuration(blocks.reduce((sum, b) => sum + b.duration, 0))} total)
        </h3>
        <p className="text-xs text-[var(--sf-text-muted)]">
          Drag blocks horizontally to reorder
        </p>
      </div>
      
      {blocks.length === 0 ? (
        <div className="text-center py-12 text-[var(--sf-text-muted)]">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No blocks added yet. Add your first block above.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Horizontal Scrollable Container */}
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {blocks.map((block, index) => (
                <DraggableBlockCard
                  key={block.id}
                  block={block}
                  index={index}
                  moveBlock={moveBlock}
                  isSelected={selectedBlockId === block.id}
                  onSelect={onSelectBlock}
                />
              ))}
            </div>
          </div>

          {/* Progress Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full">
            <div 
              className="h-1 bg-[var(--sf-orange)] rounded-full transition-all"
              style={{ width: blocks.length > 0 ? '100%' : '0%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}