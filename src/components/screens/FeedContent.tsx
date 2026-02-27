import { useState } from 'react';
import { PageHeader } from '../shared/PageHeader';
import { StatusBadge } from '../shared/StatusBadge';
import { Button } from '../ui/button';
import { Plus, Edit, Eye, Trash2, Image, Upload, X, Pin, PinOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { ImageWithFallback } from '../figma/ImageWithFallback';

type ContentType = 'quote' | 'statistic' | 'tip' | 'announcement';

interface FeedPost {
  id: number;
  title: string;
  type: string;
  author: string;
  published: string | null;
  status: string;
  views: number;
  likes: number;
  hasImage: boolean;
  imageUrl?: string;
  isPinned?: boolean;
}

export function FeedContent() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('quote');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('All');
  const [editingPost, setEditingPost] = useState<FeedPost | null>(null);

  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    { 
      id: 1, 
      title: 'Unlock Your Creative Voice',
      type: 'Article',
      author: 'Coach Devon',
      published: 'Feb 5, 2026',
      status: 'published',
      views: 1234,
      likes: 56,
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1582200371354-28fa73e45a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjBjcmVhdGl2ZSUyMHdyaXRpbmclMjBqb3VybmFsJTIwY29mZmVlfGVufDF8fHx8MTc3MDg4MzI1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      id: 2, 
      title: 'Weekly Writing Challenge',
      type: 'Challenge',
      author: 'StoryFirst Team',
      published: 'Feb 4, 2026',
      status: 'published',
      views: 856,
      likes: 34,
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1587215231250-c0c8e03eb455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjB2aW50YWdlJTIwdHlwZXdyaXRlciUyMHN0b3J5fGVufDF8fHx8MTc3MDg4MzI1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      id: 3, 
      title: 'Community Spotlight: Sarah J.',
      type: 'Feature',
      author: 'Admin',
      published: null,
      status: 'draft',
      views: 0,
      likes: 0,
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1761586449543-edbcad36276e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMGNpcmNsZSUyMGZyaWVuZHNoaXAlMjBncm91cHxlbnwxfHx8fDE3NzA4ODMyNTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      id: 4, 
      title: 'The Power of Vulnerability',
      type: 'Article',
      author: 'Coach Devon',
      published: null,
      status: 'ready',
      views: 0,
      likes: 0,
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1758565811465-4c64744b898a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjBtaW5pbWFsaXN0JTIwYm9vayUyMHJlYWRpbmclMjBsaWdodxlbnwxfHx8fDE3NzA4ODMyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    { 
      id: 5, 
      title: 'Character Development Tips',
      type: 'Tips',
      author: 'StoryFirst Team',
      published: 'Jan 28, 2026',
      status: 'published',
      views: 2145,
      likes: 78,
      hasImage: true,
      imageUrl: 'https://images.unsplash.com/photo-1726484202650-532e35e68c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXN0aGV0aWMlMjBjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGluc3BpcmF0aW9ufGVufDF8fHx8MTc3MDg4MzI1NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    // Handle post creation logic here
    console.log('Creating post of type:', selectedContentType);
    setIsCreateModalOpen(false);
    setImagePreview(null);
  };

  const handlePreview = (postId: number) => {
    console.log('Preview post:', postId);
    alert(`Preview post #${postId}`);
  };

  const handleEdit = (postId: number) => {
    const post = feedPosts.find(p => p.id === postId);
    if (post) {
      setEditingPost(post);
      setIsEditModalOpen(true);
    }
  };

  const handleDelete = (postId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      console.log('Delete post:', postId);
      alert(`Post #${postId} deleted successfully`);
      setFeedPosts(feedPosts.filter(p => p.id !== postId));
    }
  };

  const handleTogglePin = (postId: number) => {
    setFeedPosts(feedPosts.map(post => 
      post.id === postId ? { ...post, isPinned: !post.isPinned } : post
    ));
  };

  // Filter posts based on selected type
  const filteredPosts = filterType === 'All' 
    ? feedPosts 
    : feedPosts.filter(post => post.type === filterType);

  const renderFormFields = () => {
    switch (selectedContentType) {
      case 'quote':
        return (
          <>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Quote Text</label>
              <textarea 
                rows={3}
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                placeholder="Enter an inspirational quote about storytelling..."
              />
            </div>
          </>
        );
      
      case 'statistic':
        return (
          <>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Statistic</label>
              <input 
                type="text"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                placeholder="e.g., 82% of people..."
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Description</label>
              <textarea 
                rows={3}
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                placeholder="Add context or explanation for this statistic"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Source (optional)</label>
              <input 
                type="text"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                placeholder="e.g., Harvard Business Review"
              />
            </div>
          </>
        );
      
      case 'tip':
        return (
          <>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Tip Title</label>
              <input 
                type="text"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                placeholder="e.g., Show, Don't Tell"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Tip Content</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                placeholder="Explain the storytelling tip in detail..."
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Example (optional)</label>
              <textarea 
                rows={2}
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                placeholder="Provide an example of this tip in action"
              />
            </div>
          </>
        );
      
      case 'announcement':
        return (
          <>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Announcement Title</label>
              <input 
                type="text"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                placeholder="e.g., New Feature Launch"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Message</label>
              <textarea 
                rows={4}
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                placeholder="Write your announcement message..."
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Call to Action (optional)</label>
              <input 
                type="text"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                placeholder="e.g., Learn More, Try Now"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Link URL (optional)</label>
              <input 
                type="url"
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                placeholder="https://..."
              />
            </div>
          </>
        );
    }
  };

  return (
    <div>
      <PageHeader 
        title="Feed content management"
        subtitle="Manage articles, challenges, and community content"
        actions={
          <Button 
            className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        }
      />

      {/* Content Types Filter */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm text-[var(--sf-text-muted)]">Filter by type:</span>
        <select 
          className="px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)] bg-white text-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Article">Article</option>
          <option value="Challenge">Challenge</option>
          <option value="Feature">Feature</option>
          <option value="Tips">Tips</option>
        </select>
        <span className="text-sm text-[var(--sf-text-muted)]">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="bg-white border border-[var(--sf-border)] overflow-hidden hover:shadow-md transition-shadow">
            {/* Post Image */}
            <div className="relative">
              {post.hasImage && post.imageUrl ? (
                <ImageWithFallback
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              ) : post.hasImage ? (
                <div className="h-48 bg-gradient-to-br from-[var(--sf-orange)] to-[#FFD93D] flex items-center justify-center">
                  <Image className="w-12 h-12 text-white/50" />
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <p className="text-sm text-[var(--sf-text-muted)]">No image</p>
                </div>
              )}
              
              {/* Pin/Unpin Button */}
              <button
                onClick={() => handleTogglePin(post.id)}
                className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white transition-colors shadow-md"
                title={post.isPinned ? 'Unpin' : 'Pin to top'}
              >
                {post.isPinned ? (
                  <Pin className="w-4 h-4 text-[var(--sf-orange)] fill-[var(--sf-orange)]" />
                ) : (
                  <Pin className="w-4 h-4 text-[var(--sf-text-secondary)]" />
                )}
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="text-xs tracking-wider text-[var(--sf-text-muted)]"
                      style={{ fontFamily: 'var(--font-bebas)' }}
                    >
                      {post.type}
                    </span>
                    <StatusBadge status={post.status as any} />
                  </div>
                  <h3 
                    className="text-lg tracking-wide mb-1"
                    style={{ fontFamily: 'var(--font-bebas)' }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-sm text-[var(--sf-text-muted)]">
                    By {post.author}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--sf-border)]">
                <div className="text-sm text-[var(--sf-text-muted)]">
                  {post.published ? (
                    <>
                      {post.published} • {post.views.toLocaleString()} views
                    </>
                  ) : (
                    'Not published'
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => handlePreview(post.id)}>
                    <Eye className="w-4 h-4 text-[var(--sf-text-secondary)]" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => handleEdit(post.id)}>
                    <Edit className="w-4 h-4 text-[var(--sf-text-secondary)]" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="w-4 h-4 text-[var(--sf-red)]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle 
              className="text-2xl tracking-wide"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              Create feed post
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Content Type Selection */}
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Content Type</label>
              <select 
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value as ContentType)}
              >
                <option value="quote">Quote - Inspirational quotes</option>
                <option value="statistic">Statistic - Interesting stats</option>
                <option value="tip">Tip - Storytelling tips & tricks</option>
                <option value="announcement">Announcement - Functional announcements</option>
              </select>
            </div>

            {/* Dynamic Form Fields */}
            {renderFormFields()}

            {/* Image Upload */}
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Cover Image (optional)</label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-[var(--sf-border)] rounded-lg p-8">
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-[var(--sf-text-muted)] mx-auto mb-3" />
                    <p className="text-sm text-[var(--sf-text-secondary)] mb-3">
                      Upload a cover image
                    </p>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Choose Image
                    </Button>
                    <p className="text-xs text-[var(--sf-text-muted)] mt-3">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateModalOpen(false);
                setImagePreview(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={handleCreatePost}
            >
              Save as Draft
            </Button>
            <Button 
              className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
              onClick={handleCreatePost}
            >
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Post Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle 
              className="text-2xl tracking-wide"
              style={{ fontFamily: 'var(--font-bebas)' }}
            >
              Edit feed post
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Content Type Selection */}
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Content Type</label>
              <select 
                className="w-full px-4 py-2 border border-[var(--sf-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--sf-orange)]"
                value={selectedContentType}
                onChange={(e) => setSelectedContentType(e.target.value as ContentType)}
              >
                <option value="quote">Quote - Inspirational quotes</option>
                <option value="statistic">Statistic - Interesting stats</option>
                <option value="tip">Tip - Storytelling tips & tricks</option>
                <option value="announcement">Announcement - Functional announcements</option>
              </select>
            </div>

            {/* Dynamic Form Fields */}
            {renderFormFields()}

            {/* Image Upload */}
            <div>
              <label className="block text-sm text-[var(--sf-text-secondary)] mb-2">Cover Image (optional)</label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-[var(--sf-border)] rounded-lg p-8">
                  <div className="text-center">
                    <Upload className="w-10 h-10 text-[var(--sf-text-muted)] mx-auto mb-3" />
                    <p className="text-sm text-[var(--sf-text-secondary)] mb-3">
                      Upload a cover image
                    </p>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Choose Image
                    </Button>
                    <p className="text-xs text-[var(--sf-text-muted)] mt-3">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditModalOpen(false);
                setImagePreview(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={handleCreatePost}
            >
              Save as Draft
            </Button>
            <Button 
              className="bg-[var(--sf-orange)] hover:bg-[var(--sf-orange)]/90"
              onClick={handleCreatePost}
            >
              Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}