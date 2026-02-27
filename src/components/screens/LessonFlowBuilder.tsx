import { Button } from '../ui/button';
import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Sparkles, Video, MessageCircle, Target, Save, Play, Plus } from 'lucide-react';

interface LessonBlock {
  id: string;
  type: 'intro' | 'video' | 'qa' | 'challenge';
  label: string;
  subtitle: string;
  duration: string;
}

const initialBlocks: LessonBlock[] = [
  { id: '1', type: 'intro', label: 'Intro Block', subtitle: 'Intro', duration: '0:01' },
  { id: '2', type: 'video', label: 'Welcome & Introduction', subtitle: 'Video', duration: '3:45' },
  { id: '3', type: 'qa', label: 'Reflection Question', subtitle: 'Q&A', duration: '1:00' },
  { id: '4', type: 'challenge', label: 'Practice Challenge', subtitle: 'Challenge', duration: '2:00' },
];

const ItemType = 'LESSON_BLOCK';

interface DraggableBlockProps {
  block: LessonBlock;
  index: number;
  moveBlock: (dragIndex: number, hoverIndex: number) => void;
}

function DraggableBlock({ block, index, moveBlock }: DraggableBlockProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveBlock(item.index, index);
        item.index = index;
      }
    },
  });

  const iconMap: Record<string, any> = {
    intro: Sparkles,
    video: Video,
    qa: MessageCircle,
    challenge: Target,
  };

  const Icon = iconMap[block.type] || Sparkles;

  const colorMap: Record<string, { bg: string; border: string; icon: string }> = {
    intro: { bg: 'bg-purple-50', border: 'border-purple-400', icon: 'text-purple-600' },
    video: { bg: 'bg-orange-50', border: 'border-[var(--sf-orange)]', icon: 'text-[var(--sf-orange)]' },
    qa: { bg: 'bg-blue-50', border: 'border-blue-400', icon: 'text-blue-600' },
    challenge: { bg: 'bg-yellow-50', border: 'border-yellow-400', icon: 'text-yellow-600' },
  };

  const colors = colorMap[block.type] || colorMap.intro;

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`${colors.bg} ${colors.border} border-2 rounded-lg p-3 w-[200px] cursor-move transition-all hover:shadow-md ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colors.icon}`} />
      </div>
      <h3 className="text-sm font-medium text-[var(--sf-text-primary)] mb-1 truncate">
        {block.label}
      </h3>
      <p className="text-xs text-[var(--sf-text-secondary)]">
        {block.subtitle} · {block.duration}
      </p>
    </div>
  );
}

export function LessonFlowBuilder() {
  const [blocks, setBlocks] = useState<LessonBlock[]>(initialBlocks);

  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const updatedBlocks = [...blocks];
    const [draggedBlock] = updatedBlocks.splice(dragIndex, 1);
    updatedBlocks.splice(hoverIndex, 0, draggedBlock);
    setBlocks(updatedBlocks);
  };

  const handleSave = () => {
    console.log('Saving lesson flow...', blocks);
  };

  const totalDuration = blocks.reduce((acc, block) => {
    const [min, sec] = block.duration.split(':').map(Number);
    return acc + min * 60 + sec;
  }, 0);

  const formatTotalDuration = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-[calc(100vh-64px)] bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-[var(--sf-border)] px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl tracking-wide text-[var(--sf-text-primary)] mb-1"
                style={{ fontFamily: 'var(--font-bebas)' }}
              >
                Lesson Flow Builder
              </h1>
              <p className="text-sm text-[var(--sf-text-secondary)]">
                Drag blocks horizontally to reorder the lesson sequence
              </p>
            </div>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Flow
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Preview Section */}
          <div className="bg-white rounded-lg border border-[var(--sf-border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--sf-border)]">
              <h2 className="text-lg font-medium text-[var(--sf-text-primary)]">
                Lesson Preview
              </h2>
            </div>
            <div className="relative">
              <div className="aspect-video bg-black flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[var(--sf-orange)] flex items-center justify-center cursor-pointer hover:bg-[var(--sf-orange-hover)] transition-colors">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>
              <p className="text-center text-sm text-[var(--sf-text-secondary)] py-3">
                Preview updates automatically when blocks are reordered
              </p>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-lg border border-[var(--sf-border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--sf-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-[var(--sf-text-primary)] mb-1">
                    Lesson Flow ({blocks.length} blocks · {formatTotalDuration(totalDuration)} total)
                  </h2>
                  <p className="text-sm text-[var(--sf-text-secondary)]">
                    Drag connections to define execution order · Delete key to remove connections
                  </p>
                </div>
              </div>
            </div>

            {/* Horizontal Timeline */}
            <div className="p-6">
              <div className="flex gap-4 items-center overflow-x-auto pb-4">
                {blocks.map((block, index) => (
                  <DraggableBlock
                    key={block.id}
                    block={block}
                    index={index}
                    moveBlock={moveBlock}
                  />
                ))}
                
                {/* Add Block Button */}
                <button className="w-[200px] min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-[var(--sf-orange)] hover:bg-orange-50 transition-colors">
                  <Plus className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-500">Add Block</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar Stats (as a card) */}
          <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--sf-text-secondary)] mb-1">Total Blocks</p>
                <p className="text-2xl font-medium text-[var(--sf-text-primary)]">{blocks.length}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--sf-text-secondary)] mb-1">Total Duration</p>
                <p className="text-2xl font-medium text-[var(--sf-text-primary)]">{formatTotalDuration(totalDuration)}</p>
              </div>
              <div>
                <p className="text-sm text-[var(--sf-text-secondary)] mb-1">Status</p>
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                  Draft
                </span>
              </div>
              <p className="text-xs text-[var(--sf-text-secondary)] pt-2 border-t border-[var(--sf-border)]">
                Click a block in the timeline to select and edit its details
              </p>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
