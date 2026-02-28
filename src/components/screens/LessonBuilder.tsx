import { useState, useEffect } from 'react';
import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { GripVertical, Video, MessageCircle, Target, Play, Save, Upload, X, CheckCircle, AlertCircle, ArrowLeft, Music, FileText, User, BookOpen, MessageSquare, Sparkles, Plus, LayoutList, LayoutGrid } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HorizontalBlockCanvas } from './HorizontalBlockCanvas';

type BlockType = 
  | 'audio' 
  | 'video' 
  | 'personalization' 
  | 'qa' 
  | 'challenge';

type QuestionType = 'text' | 'audio' | 'mcq';

type ChallengeResponseType = 'text' | 'audio';

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // for MCQ
}

interface ChallengeConfig {
  description: string;
  responseType: ChallengeResponseType;
}

interface Block {
  id: string;
  type: BlockType;
  title: string;
  duration: number; // in seconds
  background: {
    type: 'transparent' | 'color' | 'image';
    value?: string; // color hex or image URL
  };
  content?: string;
  mediaUrl?: string;
  templateVars?: string[]; // e.g., ['{username}', '{day}', '{streak}']
  questions?: Question[]; // for Q&A blocks
  challengeConfig?: ChallengeConfig; // for Challenge blocks
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error';

interface UploadedFile {
  name: string;
  size: number;
  url?: string;
}

interface LessonBuilderProps {
  day: number;
  onBack: () => void;
}

export function LessonBuilder({ day, onBack }: LessonBuilderProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedBlockType, setSelectedBlockType] = useState<BlockType>('video');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [dayName, setDayName] = useState(`Day ${day}: Finding Your Voice`);
  const [completionRequired, setCompletionRequired] = useState(true);
  const [timelineView, setTimelineView] = useState<'vertical' | 'horizontal'>('horizontal');

  // Upload state management
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // load any previously uploaded video for this day so the admin can replace it
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/videos?day=${day}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Array<{ playbackUrl: string }>) => {
        if (cancelled) return;
        if (Array.isArray(data) && data.length > 0) {
          setUploadedFile({ name: `day-${day}-video`, size: 0, url: data[0].playbackUrl });
          setUploadState("success");
          setUploadProgress(100);
        }
      })
      .catch(() => {
        // ignore errors, admin can upload normally
      });
    return () => {
      cancelled = true;
    };
  }, [day]);

  // Block configuration state
  const [blockConfig, setBlockConfig] = useState({
    duration: 5,
    backgroundType: 'transparent' as 'transparent' | 'color' | 'image',
    backgroundColor: '#FFFFFF',
    content: '',
    templateVars: [] as string[],
  });

  // Modal state
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Q&A Block state
  const [qaQuestions, setQaQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'text' as QuestionType,
    options: ['', '', '', ''] as string[]
  });

  // Challenge Block state
  const [challengeConfig, setChallengeConfig] = useState<ChallengeConfig>({
    description: '',
    responseType: 'text'
  });

  // Upload handlers
  // When an admin selects a file we send it to a backend endpoint that
  // proxies the payload into Mux.  The server creates a direct upload with
  // a public playback policy, streams the bytes to Mux, and then returns the
  // public playback URL (if available).  This keeps secret keys off the
  // client and ensures the video is hosted by Mux instead of locally.
  const handleFileSelect = async (file: File) => {
    const isVideo = selectedBlockType === 'video';
    const isAudio = selectedBlockType === 'audio';

    // Validate file type
    if (isVideo && !file.type.startsWith('video/')) {
      setUploadError('Please upload a video file');
      setUploadState('error');
      return;
    }

    if (isAudio && !file.type.startsWith('audio/')) {
      setUploadError('Please upload an audio file');
      setUploadState('error');
      return;
    }

    if (file.size > 2 * 1024 * 1024 * 1024) { // 2GB
      setUploadError('File size exceeds 2GB limit');
      setUploadState('error');
      return;
    }

    // Simulate upload
    setUploadState('uploading');
    setUploadProgress(0);
    setUploadError(null);

    // kick off a faux progress bar that will cap at 90%
    const interval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 5, 90));
    }, 200);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("day", day.toString());

      const headers: HeadersInit = {};
      if (process.env.NEXT_PUBLIC_ADMIN_KEY) {
        headers["x-admin-key"] = process.env.NEXT_PUBLIC_ADMIN_KEY;
      }

      const res = await fetch("/api/videos/upload", {
        method: "POST",
        headers,
        body: form,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Upload failed");
      }

      const data = await res.json();
      // if mux returned a playback url, use it. otherwise fall back to object URL
      const videoUrl = data.playbackUrl || URL.createObjectURL(file);
      setUploadedFile({ name: file.name, size: file.size, url: videoUrl });
      setUploadState("success");
      setUploadProgress(100);
    } catch (err: any) {
      setUploadError(err?.message || "Upload error");
      setUploadState("error");
      setUploadProgress(0);
    } finally {
      clearInterval(interval);
    }
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';

    if (selectedBlockType === 'video') {
      input.accept = 'video/*';
    } else if (selectedBlockType === 'audio') {
      input.accept = 'audio/*';
    } else {
      input.accept = 'image/*';
    }

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileSelect(file);
    };
    input.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleRetry = () => {
    setUploadState('idle');
    setUploadError(null);
  };

  const handleRemove = () => {
    setUploadState('idle');
    setUploadedFile(null);
    setUploadProgress(0);
  };

  const handleReplace = () => {
    handleUploadClick();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get video assets for each block - aesthetic nature videos (~1 min duration)
  const getVideoAssets = (index: number) => {
    const videos = [
      {
        poster: 'https://images.unsplash.com/photo-1661788276757-2f9c8246fc2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBtb3VudGFpbiUyMHN1bnNldCUyMG5hdHVyZXxlbnwxfHx8fDE3NzA4OTM1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4#t=0,60'
      },
      {
        poster: 'https://images.unsplash.com/photo-1759036170298-8616a009de22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwcGVhY2VmdWwlMjB3YXRlcnxlbnwxfHx8fDE3NzA4OTM1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4#t=0,60'
      },
      {
        poster: 'https://images.unsplash.com/photo-1669478297677-e4079a6d1ad9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBzdW5yaXNlJTIwbWlzdHklMjB0cmVlc3xlbnwxfHx8fDE3NzA4OTM1NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4'
      },
      {
        poster: 'https://images.unsplash.com/photo-1703004912901-3045e5b2b56e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBsYW5kc2NhcGUlMjBnb2xkZW4lMjBob3VyfGVufDF8fHx8MTc3MDg4NjY5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
      },
      {
        poster: 'https://images.unsplash.com/photo-1549633760-9a0931220b84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGF1cm9yYSUyMHNreXxlbnwxfHx8fDE3NzA3OTgwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4#t=0,60'
      },
      {
        poster: 'https://images.unsplash.com/photo-1763434182752-ff8d1e28e411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlcmZhbGwlMjBuYXR1cmUlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NzA4MTAxMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
      }
    ];
    return videos[index % videos.length];
  };

  // Drag and drop handlers for lesson blocks
  const handleBlockDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleBlockDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedIndex === null || draggedIndex === index) return;

    const newBlocks = [...blocks];
    const draggedBlock = newBlocks[draggedIndex];
    newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(index, 0, draggedBlock);

    setBlocks(newBlocks);
    setDraggedIndex(index);
  };

  const handleBlockDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleAddBlock = () => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type: selectedBlockType,
      title: getBlockTypeLabel(selectedBlockType),
      duration: blockConfig.duration,
      background: {
        type: blockConfig.backgroundType,
        value: blockConfig.backgroundType === 'color' ? blockConfig.backgroundColor : undefined
      },
      content: blockConfig.content,
      mediaUrl: uploadedFile?.url,
      templateVars: blockConfig.templateVars,
      questions: selectedBlockType === 'qa' ? [
              {
          id: 'q1',
          text: 'What story moment moved you today?',
          type: 'text'
        }
      ] : undefined,
      challengeConfig: selectedBlockType === 'challenge' ? {
        description: 'Complete a 5-minute meditation to help you focus and relax.',
        responseType: 'text'
      } : undefined
    };

    setBlocks([...blocks, newBlock]);

    // Reset form
    setUploadState('idle');
    setUploadedFile(null);
    setBlockConfig({
      duration: 5,
      backgroundType: 'transparent',
      backgroundColor: '#FFFFFF',
      content: '',
      templateVars: [],
    });
  };

  const getBlockIcon = (type: BlockType) => {
    switch (type) {
      case 'audio': return Music;
      case 'video': return Video;
      case 'personalization': return User;
      case 'qa': return MessageCircle;
      case 'challenge': return Target;
    }
  };

  const getBlockColor = (type: BlockType) => {
    switch (type) {
      case 'audio': return 'border-green-500 bg-green-50';
      case 'video': return 'border-[var(--sf-orange)] bg-[#FFF4E6]';
      case 'personalization': return 'border-teal-500 bg-teal-50';
      case 'qa': return 'border-[var(--sf-blue)] bg-[#E3F2FD]';
      case 'challenge': return 'border-[#FFD93D] bg-[#FFFBE6]';
    }
  };

  const getBlockTypeLabel = (type: BlockType) => {
    switch (type) {
      case 'audio': return 'Audio Block';
      case 'video': return 'Video Block';
      case 'personalization': return 'Personalization Block';
      case 'qa': return 'Q&A Block';
      case 'challenge': return 'Challenge Block';
    }
  };

  const needsMediaUpload = (type: BlockType) => {
    return type === 'video' || type === 'audio' || (blockConfig.backgroundType === 'image');
  };

  const selectedBlock = selectedBlockId ? blocks.find(b => b.id === selectedBlockId) : null;

  return (
    <div>
      <PageHeader
        title={`Day ${day} - Lesson Builder`}
        subtitle={`Building Day ${day} of 70`}
        actions={
          <>
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90">
              Publish
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Main Content Area */}
        <div className="col-span-9 space-y-6">
          {/* Day Configuration and Add Block - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Day Configuration */}
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Day Name</label>
              <input
                type="text"
                value={dayName}
                onChange={(e) => setDayName(e.target.value)}
                className="w-full px-4 py-2 bg-white border-2 border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)] text-[var(--sf-text-primary)]"
              />
            </div>

            {/* Add Block */}
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Add Block</label>
              <select
                className="w-full px-4 py-2 bg-white border-2 border-[var(--sf-border)] rounded-lg text-[var(--sf-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                value={selectedBlockType}
                onChange={(e) => {
                  setSelectedBlockType(e.target.value as BlockType);
                  setIsBlockModalOpen(true);
                }}
              >
                <option value="audio">Audio Block</option>
                <option value="video">Video Block</option>
                <option value="personalization">Personalization Block</option>
                <option value="qa">Q&A Block</option>
                <option value="challenge">Challenge Block</option>
              </select>
            </div>
          </div>

          {/* Block Configuration Modal */}
          {isBlockModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
                <div className="sticky top-0 bg-white border-b border-[var(--sf-border)] px-6 py-4 flex items-center justify-between">
                  <h3
                    className="text-lg tracking-wide"
                    style={{ fontFamily: 'var(--font-bebas)' }}
                  >
                    CONFIGURE {getBlockTypeLabel(selectedBlockType).toUpperCase()}
                  </h3>
                  <button
                    onClick={() => {
                      setIsBlockModalOpen(false);
                      // Reset form
                      setUploadState('idle');
                      setUploadedFile(null);
                      setBlockConfig({
                        duration: 5,
                        backgroundType: 'transparent',
                        backgroundColor: '#FFFFFF',
                        content: '',
                        templateVars: [],
                      });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  {/* Media Upload (for video/audio blocks) */}
                  {needsMediaUpload(selectedBlockType) && (
                    <div className={`border border-[var(--sf-border)] rounded-lg mb-6 ${uploadState === 'success' ? 'p-3' : 'p-6'}`}>
                      {uploadState === 'idle' && (
                        <div
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          className="border-2 border-dashed border-[var(--sf-border)] rounded-lg p-8 text-center"
                        >
                          <Upload className="w-12 h-12 text-[var(--sf-text-muted)] mx-auto mb-3" />
                          <p className="text-sm text-[var(--sf-text-secondary)] mb-3">
                            Drag and drop your {selectedBlockType === 'video' ? 'video' : selectedBlockType === 'audio' ? 'audio' : 'image'} here, or
                          </p>
                          <Button
                            onClick={handleUploadClick}
                            className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload {selectedBlockType === 'video' ? 'Video' : selectedBlockType === 'audio' ? 'Audio' : 'Image'}
                          </Button>
                          <p className="text-xs text-[var(--sf-text-muted)] mt-3">
                            MP4 recommended · Max 2GB · 16:9 preferred
                          </p>
                        </div>
                      )}

                      {uploadState === 'uploading' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Video className="w-5 h-5 text-[var(--sf-orange)]" />
                              <div>
                                <p className="text-sm font-medium">Uploading...</p>
                                <p className="text-xs text-[var(--sf-text-muted)]">{uploadProgress}%</p>
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[var(--sf-orange)] h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {uploadState === 'error' && (
                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-red-900">Upload failed</p>
                              <p className="text-sm text-red-700 mt-1">{uploadError}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleRetry}
                              variant="outline"
                              className="flex-1"
                            >
                              Retry Upload
                            </Button>
                            <Button 
                              onClick={handleRemove}
                              variant="outline"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {uploadState === 'success' && uploadedFile && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-50 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{uploadedFile.name}</p>
                              <p className="text-xs text-[var(--sf-text-muted)]">
                                {formatFileSize(uploadedFile.size)} · Ready
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleReplace}
                              variant="outline"
                              size="sm"
                            >
                              Replace
                            </Button>
                            <Button
                              onClick={handleRemove}
                              variant="outline"
                              size="sm"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text Content (for text-based blocks) - EXCEPT Q&A */}
                  {(selectedBlockType === 'audio' || 
                    selectedBlockType === 'video' || 
                    selectedBlockType === 'personalization') && (
                    <div className="mb-6">
                      <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Content</label>
                      <textarea
                        rows={6}
                        value={blockConfig.content}
                        onChange={(e) => setBlockConfig({...blockConfig, content: e.target.value})}
                        className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                        placeholder="Enter your content here..."
                      />
                      {(selectedBlockType === 'personalization') && (
                        <div className="mt-3">
                          <p className="text-xs text-[var(--sf-text-muted)] mb-2">
                            Insert template variables:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const text = blockConfig.content;
                                const before = text.substring(0, start);
                                const after = text.substring(end);
                                const newContent = before + '{username}' + after;
                                setBlockConfig({
                                  ...blockConfig,
                                  content: newContent,
                                  templateVars: [...new Set([...blockConfig.templateVars, '{username}'])]
                                });
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(start + 10, start + 10);
                                }, 0);
                              }}
                            >
                              <User className="w-3 h-3 mr-1" />
                              {'{username}'}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const text = blockConfig.content;
                                const before = text.substring(0, start);
                                const after = text.substring(end);
                                const newContent = before + '{day}' + after;
                                setBlockConfig({
                                  ...blockConfig,
                                  content: newContent,
                                  templateVars: [...new Set([...blockConfig.templateVars, '{day}'])]
                                });
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(start + 5, start + 5);
                                }, 0);
                              }}
                            >
                              📅 {'{day}'}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const text = blockConfig.content;
                                const before = text.substring(0, start);
                                const after = text.substring(end);
                                const newContent = before + '{streak}' + after;
                                setBlockConfig({
                                  ...blockConfig,
                                  content: newContent,
                                  templateVars: [...new Set([...blockConfig.templateVars, '{streak}'])]
                                });
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(start + 8, start + 8);
                                }, 0);
                              }}
                            >
                              🔥 {'{streak}'}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const text = blockConfig.content;
                                const before = text.substring(0, start);
                                const after = text.substring(end);
                                const newContent = before + '{firstName}' + after;
                                setBlockConfig({
                                  ...blockConfig,
                                  content: newContent,
                                  templateVars: [...new Set([...blockConfig.templateVars, '{firstName}'])]
                                });
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(start + 11, start + 11);
                                }, 0);
                              }}
                            >
                              👤 {'{firstName}'}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                                const start = textarea.selectionStart;
                                const end = textarea.selectionEnd;
                                const text = blockConfig.content;
                                const before = text.substring(0, start);
                                const after = text.substring(end);
                                const newContent = before + '{completedLessons}' + after;
                                setBlockConfig({
                                  ...blockConfig,
                                  content: newContent,
                                  templateVars: [...new Set([...blockConfig.templateVars, '{completedLessons}'])]
                                });
                                setTimeout(() => {
                                  textarea.focus();
                                  textarea.setSelectionRange(start + 18, start + 18);
                                }, 0);
                              }}
                            >
                              ✅ {'{completedLessons}'}
                            </Button>
                          </div>
                          {blockConfig.templateVars.length > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                              <p className="text-xs text-blue-800">
                                <strong>Active variables:</strong> {blockConfig.templateVars.join(', ')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Q&A Block Configuration */}
                  {selectedBlockType === 'qa' && (
                    <div className="mb-6 space-y-4">
                      {/* Add Question Instruction */}
                      <div className="flex items-center justify-center gap-2 text-sm text-[var(--sf-text-secondary)] py-2">
                        <Plus className="w-4 h-4" />
                        <span>Add Question</span>
                      </div>

                      {/* Question Text Input */}
                      <div>
                        <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Question Text:</label>
                        <textarea
                          rows={3}
                          value={currentQuestion.text}
                          onChange={(e) => setCurrentQuestion({...currentQuestion, text: e.target.value})}
                          className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                          placeholder="Enter your question here..."
                        />
                      </div>

                      {/* Question Type Radio Buttons */}
                      <div>
                        <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Question Type:</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="questionType"
                              value="text"
                              checked={currentQuestion.type === 'text'}
                              onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value as QuestionType})}
                              className="w-4 h-4 text-[var(--sf-orange)] focus:ring-[var(--sf-orange)]"
                            />
                            <span className="text-sm">Text</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="questionType"
                              value="mcq"
                              checked={currentQuestion.type === 'mcq'}
                              onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value as QuestionType})}
                              className="w-4 h-4 text-[var(--sf-orange)] focus:ring-[var(--sf-orange)]"
                            />
                            <span className="text-sm">Multiple Choice</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="questionType"
                              value="audio"
                              checked={currentQuestion.type === 'audio'}
                              onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value as QuestionType})}
                              className="w-4 h-4 text-[var(--sf-orange)] focus:ring-[var(--sf-orange)]"
                            />
                            <span className="text-sm">Audio Record</span>
                          </label>
                        </div>
                      </div>

                      {/* MCQ Options */}
                      {currentQuestion.type === 'mcq' && (
                        <div className="space-y-2">
                          <label className="block text-sm text-[var(--sf-text-secondary)]">Answer Options:</label>
                          {currentQuestion.options.map((option, index) => (
                            <input
                              key={index}
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...currentQuestion.options];
                                newOptions[index] = e.target.value;
                                setCurrentQuestion({...currentQuestion, options: newOptions});
                              }}
                              className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                              placeholder={`Option ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}

                      {/* List of Added Questions */}
                      {qaQuestions.length > 0 && (
                        <div className="pt-4 border-t border-[var(--sf-border)]">
                          <p className="text-sm text-[var(--sf-text-secondary)] mb-3">Added Questions ({qaQuestions.length}):</p>
                          <div className="space-y-2">
                            {qaQuestions.map((q, index) => (
                              <div key={q.id} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{q.text}</p>
                                  <p className="text-xs text-[var(--sf-text-muted)] mt-1">Type: {q.type === 'mcq' ? 'Multiple Choice' : q.type === 'audio' ? 'Audio Record' : 'Text'}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setQaQuestions(qaQuestions.filter(question => question.id !== q.id))}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Challenge Block Configuration */}
                  {selectedBlockType === 'challenge' && (
                    <div className="mb-6 space-y-4">
                      {/* Add Question Button */}
                      <Button
                        onClick={() => {
                          if (challengeConfig.description.trim()) {
                            const newConfig: ChallengeConfig = {
                              description: challengeConfig.description,
                              responseType: challengeConfig.responseType
                            };
                            setChallengeConfig({
                              description: '',
                              responseType: 'text'
                            });
                          }
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Challenge
                      </Button>

                      {/* Question Text Input */}
                      <div>
                        <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Challenge Description:</label>
                        <textarea
                          rows={3}
                          value={challengeConfig.description}
                          onChange={(e) => setChallengeConfig({...challengeConfig, description: e.target.value})}
                          className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                          placeholder="Enter your challenge description here..."
                        />
                      </div>

                      {/* Question Type Radio Buttons */}
                      <div>
                        <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Response Type:</label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="responseType"
                              value="text"
                              checked={challengeConfig.responseType === 'text'}
                              onChange={(e) => setChallengeConfig({...challengeConfig, responseType: e.target.value as ChallengeResponseType})}
                              className="w-4 h-4 text-[var(--sf-orange)] focus:ring-[var(--sf-orange)]"
                            />
                            <span className="text-sm">Text</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="responseType"
                              value="audio"
                              checked={challengeConfig.responseType === 'audio'}
                              onChange={(e) => setChallengeConfig({...challengeConfig, responseType: e.target.value as ChallengeResponseType})}
                              className="w-4 h-4 text-[var(--sf-orange)] focus:ring-[var(--sf-orange)]"
                            />
                            <span className="text-sm">Audio Record</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Block Configuration */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Duration (seconds)</label>
                      <input
                        type="number"
                        value={blockConfig.duration}
                        onChange={(e) => setBlockConfig({...blockConfig, duration: parseInt(e.target.value) || 5})}
                        className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Background</label>
                      <select
                        className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg"
                        value={blockConfig.backgroundType}
                        onChange={(e) => setBlockConfig({...blockConfig, backgroundType: e.target.value as any})}
                      >
                        <option value="transparent">Transparent</option>
                        <option value="color">Color</option>
                        <option value="image">Image</option>
                      </select>
                    </div>
                  </div>

                  {blockConfig.backgroundType === 'color' && (
                    <div className="mb-6">
                      <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Background Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={blockConfig.backgroundColor}
                          onChange={(e) => setBlockConfig({...blockConfig, backgroundColor: e.target.value})}
                          className="h-10 w-20 border border-[var(--sf-border)] rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={blockConfig.backgroundColor}
                          onChange={(e) => setBlockConfig({...blockConfig, backgroundColor: e.target.value})}
                          className="flex-1 px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      handleAddBlock();
                      setIsBlockModalOpen(false);
                    }}
                    className="w-full bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Block to Lesson
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Lesson Preview & Flow Timeline - MERGED */}
          <div className="bg-white rounded-lg border border-[var(--sf-border)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--sf-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg tracking-wide text-[var(--sf-text-primary)] mb-1" style={{ fontFamily: 'var(--font-bebas)' }}>
                    Lesson Preview & Flow ({blocks.length} blocks · {formatDuration(blocks.reduce((sum, b) => sum + b.duration, 0))} total)
                  </h3>
                  <p className="text-sm text-[var(--sf-text-secondary)]">
                    Preview your lesson and drag blocks to reorder the sequence
                  </p>
                </div>
              </div>
            </div>

            {/* Video Preview */}
            <div className="bg-gray-50">
              {blocks.length === 0 ? (
                <div className="aspect-video bg-[#2a2a2a] flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-40" />
                    <p className="text-sm">Add blocks to see preview</p>
                  </div>
                </div>
              ) : (() => {
                  const activeBlockIndex = selectedBlockId
                  ? blocks.findIndex(b => b.id === selectedBlockId)
                    : 0;
                  const activeBlock = blocks[activeBlockIndex] || blocks[0];
                  const videoAsset = getVideoAssets(activeBlockIndex);

                  // Only show video player for video blocks
                  if (activeBlock.type === "video") {
                    const previewSrc = activeBlock.mediaUrl || videoAsset.src;
                    const poster = activeBlock.mediaUrl
                      ? undefined
                      : videoAsset.poster;
                    return (
                      <div className="relative">
                        <div className="aspect-video bg-[#2a2a2a] flex items-center justify-center relative overflow-hidden">
                          <video
                            key={activeBlock.id}
                            className="w-full h-full object-cover"
                            poster={poster}
                            controls
                            autoPlay={false}
                          >
                            <source src={previewSrc} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    );
                  } else {
                    // Show block type preview for non-video blocks
                    const Icon = getBlockIcon(activeBlock.type);
                    const colors = {
                    audio: { bg: '#1DD1A1', icon: '#059669' },
                    personalization: { bg: '#8B5CF6', icon: '#7C3AED' },
                    qa: { bg: '#3B82F6', icon: '#2563EB' },
                    challenge: { bg: '#FBBF24', icon: '#F59E0B' },
                    };
                  const color = colors[activeBlock.type as keyof typeof colors] || { bg: '#F97316', icon: '#EA580C' };

                    return (
                    <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: color.bg }}>
                        <div className="text-center text-white">
                        <Icon className="w-24 h-24 mx-auto mb-4 opacity-90" style={{ color: color.icon }} />
                        <p className="text-xl font-medium mb-2">{getBlockTypeLabel(activeBlock.type)}</p>
                          {activeBlock.content && (
                          <p className="text-sm opacity-90 max-w-md mx-auto px-4">{activeBlock.content}</p>
                          )}
                        </div>
                      </div>
                    );
                  }
              })()}
            </div>

            {/* Horizontal Timeline */}
            <div className="bg-[#f5f5f5] p-6 border-t border-[var(--sf-border)]">
              {/* Time Ruler */}
              <div className="flex items-center mb-4 text-xs text-gray-600 font-mono overflow-hidden">
                {blocks.length > 0 && blocks.map((block, i) => (
                  <div key={i} style={{ flex: '1' }} className="relative">
                    <span>{formatDuration(blocks.slice(0, i).reduce((sum, b) => sum + b.duration, 0))}</span>
                      <div className="absolute top-5 left-0 w-px h-2 bg-gray-400"></div>
                    </div>
                  ))}
                {blocks.length > 0 && (
                  <div style={{ flex: '1' }} className="relative">
                    <span>{formatDuration(blocks.reduce((sum, b) => sum + b.duration, 0))}</span>
                    <div className="absolute top-5 left-0 w-px h-2 bg-gray-400"></div>
                  </div>
                )}
              </div>

              <DndProvider backend={HTML5Backend}>
                <div className="flex gap-1 items-stretch" style={{ minHeight: '80px' }}>
                  {blocks.length > 0 && blocks.map((block, index) => {
                      const Icon = getBlockIcon(block.type);
                      const colors = {
                      audio: { bg: '#1DD1A1', text: 'text-gray-900' },      // Mint Green
                      video: { bg: '#F97316', text: 'text-white' },         // Bright Orange
                      personalization: { bg: '#8B5CF6', text: 'text-white' },  // Purple/Violet
                      qa: { bg: '#3B82F6', text: 'text-white' },            // Bright Blue
                      challenge: { bg: '#FBBF24', text: 'text-gray-900' },  // Golden Yellow
                      };
                      const color = colors[block.type] || colors.video;

                      return (
                        <div
                          key={block.id}
                          draggable
                          onDragStart={(e) => handleBlockDragStart(e, index)}
                          onDragOver={(e) => handleBlockDragOver(e, index)}
                          onDragEnd={handleBlockDragEnd}
                          onClick={() => setSelectedBlockId(block.id)}
                          style={{
                          flex: '1',
                            backgroundColor: color.bg,
                          minWidth: '80px'
                          }}
                          className={`rounded cursor-move transition-all hover:opacity-90 ${color.text} p-2 flex flex-col justify-between ${
                          selectedBlockId === block.id ? 'ring-2 ring-[var(--sf-orange)] ring-offset-2 ring-offset-[#f5f5f5]' : ''
                        } ${draggedIndex === index ? 'opacity-50 scale-95' : 'opacity-100'}`}
                        >
                          <div className="flex items-start gap-1.5">
                            <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-medium truncate leading-tight">
                                {block.title}
                              </h4>
                            </div>
                          </div>
                          <div className="mt-auto pt-1">
                            <p className="text-[10px] opacity-80">
                              {formatDuration(block.duration)}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                  {blocks.length === 0 && (
                    <div className="w-full text-center py-12 text-gray-400">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">No blocks added yet. Add your first block above.</p>
                    </div>
                  )}
                </div>
              </DndProvider>

              {/* Playhead indicator */}
              <div className="relative mt-4 h-1 bg-gray-300 rounded">
                <div className="absolute left-0 top-0 w-0.5 h-1 bg-[var(--sf-orange)]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel - Block Configuration */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg border border-[var(--sf-border)] p-6 sticky top-6">
            <h3
              className="text-lg tracking-wide mb-4"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              {selectedBlock ? 'Block Details' : 'Day Parameters'}
            </h3>

            {selectedBlock ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Type</label>
                  <p className="text-sm font-medium">{getBlockTypeLabel(selectedBlock.type)}</p>
                </div>
                <div>
                  <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Duration</label>
                  <p className="text-sm font-medium">{formatDuration(selectedBlock.duration)}</p>
                </div>
                <div>
                  <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Background</label>
                  <p className="text-sm font-medium capitalize">{selectedBlock.background.type}</p>
                  {selectedBlock.background.value && (
                    <div
                      className="mt-2 w-full h-8 rounded border border-[var(--sf-border)]"
                      style={{ backgroundColor: selectedBlock.background.value }}
                    />
                  )}
                </div>
                {selectedBlock.content && (
                  <div>
                    <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Content</label>
                    <p className="text-sm">{selectedBlock.content}</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setBlocks(blocks.filter(b => b.id !== selectedBlock.id));
                    setSelectedBlockId(null);
                  }}
                >
                  Delete Block
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Total Blocks</label>
                  <p className="text-sm font-medium">{blocks.length}</p>
                </div>
                <div>
                  <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Total Duration</label>
                  <p className="text-sm font-medium">{formatDuration(blocks.reduce((sum, b) => sum + b.duration, 0))}</p>
                </div>
                <div>
                  <label className="block text-xs text-[var(--sf-text-muted)] mb-1">Status</label>
                  <p className="text-sm font-medium">Draft</p>
                </div>
                <div className="pt-4 border-t border-[var(--sf-border)]">
                  <p className="text-xs text-[var(--sf-text-muted)] mb-2">Click a block in the timeline to view and edit its details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}