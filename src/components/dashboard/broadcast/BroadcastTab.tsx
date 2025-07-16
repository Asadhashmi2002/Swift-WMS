import React, { useState, useEffect } from 'react';
import { Send, Calendar, Users, FileText, Image, BarChart } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Modal } from '../../ui/Modal';
import { Badge } from '../../ui/Badge';
import { useBroadcastStore } from '../../../stores/broadcastStore';

export const BroadcastTab: React.FC = () => {
  const {
    templates,
    currentBroadcast,
    loadTemplates,
    createTemplate,
    sendBroadcast,
    setCurrentBroadcast,
  } = useBroadcastStore();

  const [showPreview, setShowPreview] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    content: '',
    type: 'text' as const,
  });

  const [broadcastData, setBroadcastData] = useState({
    templateId: '',
    audienceTags: [] as string[],
    content: '',
    scheduledAt: '',
  });

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const availableTags = ['all', 'roads', 'water', 'health', 'urgent', 'general'];

  const handleCreateTemplate = async () => {
    try {
      await createTemplate({ ...newTemplate, createdAt: new Date() });
      setNewTemplate({ name: '', content: '', type: 'text' });
      setShowTemplateModal(false);
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handleSendBroadcast = async () => {
    try {
      await sendBroadcast({
        templateId: broadcastData.templateId,
        audienceTags: broadcastData.audienceTags,
        content: broadcastData.content,
        scheduledAt: broadcastData.scheduledAt ? new Date(broadcastData.scheduledAt) : undefined,
        status: 'draft',
      });
      setBroadcastData({
        templateId: '',
        audienceTags: [],
        content: '',
        scheduledAt: '',
      });
      setShowPreview(false);
    } catch (error) {
      console.error('Failed to send broadcast:', error);
    }
  };

  const selectedTemplate = templates.find(t => t.id === broadcastData.templateId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Broadcast</h2>
        <Button onClick={() => setShowTemplateModal(true)}>
          <FileText className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose Section */}
        <Card>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            Compose Broadcast
          </h3>
          <div className="space-y-4">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Select Template
              </label>
              <select
                value={broadcastData.templateId}
                onChange={(e) => setBroadcastData(prev => ({ 
                  ...prev, 
                  templateId: e.target.value,
                  content: templates.find(t => t.id === e.target.value)?.content || ''
                }))}
                className="w-full p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] text-[var(--color-text)]"
              >
                <option value="">Choose a template...</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Message Content
              </label>
              <textarea
                value={broadcastData.content}
                onChange={(e) => setBroadcastData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter your message..."
                rows={4}
                className="w-full p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] text-[var(--color-text)] resize-none"
              />
            </div>
            {/* Audience Selection */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Audience Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setBroadcastData(prev => ({
                        ...prev,
                        audienceTags: prev.audienceTags.includes(tag)
                          ? prev.audienceTags.filter(t => t !== tag)
                          : [...prev.audienceTags, tag]
                      }));
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      broadcastData.audienceTags.includes(tag)
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-gray)] text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule */}
            <Input
              type="datetime-local"
              label="Schedule (Optional)"
              value={broadcastData.scheduledAt}
              onChange={(e) => setBroadcastData(prev => ({ ...prev, scheduledAt: e.target.value }))}
            />

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPreview(true)}
                disabled={!broadcastData.content || broadcastData.audienceTags.length === 0}
              >
                <Image className="h-4 w-4 mr-2" />
                Preview
              </Button>
              
              <Button
                className="flex-1"
                onClick={handleSendBroadcast}
                disabled={!broadcastData.content || broadcastData.audienceTags.length === 0}
              >
                {broadcastData.scheduledAt ? (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Templates List */}
        <Card>
          <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            Message Templates
          </h3>

          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="p-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-gray)] cursor-pointer transition-colors"
                onClick={() => setBroadcastData(prev => ({ 
                  ...prev, 
                  templateId: template.id,
                  content: template.content
                }))}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-[var(--color-text)]">{template.name}</h4>
                  <Badge variant="default" size="sm">{template.type}</Badge>
                </div>
                <p className="text-sm text-gray-500 truncate">{template.content}</p>
              </div>
            ))}

            {templates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No templates found. Create your first template to get started.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Broadcast Preview"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-[var(--color-text)] mb-2">Message Content</h4>
            <div className="p-3 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)]">
              {broadcastData.content}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-[var(--color-text)] mb-2">Audience</h4>
            <div className="flex flex-wrap gap-1">
              {broadcastData.audienceTags.map((tag) => (
                <Badge key={tag} variant="primary" size="sm">{tag}</Badge>
              ))}
            </div>
          </div>

          {broadcastData.scheduledAt && (
            <div>
              <h4 className="font-medium text-[var(--color-text)] mb-2">Scheduled For</h4>
              <p className="text-gray-600">
                {new Date(broadcastData.scheduledAt).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1">
              Edit
            </Button>
            <Button onClick={handleSendBroadcast} className="flex-1">
              {broadcastData.scheduledAt ? 'Schedule' : 'Send Now'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Template Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Create New Template"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Template Name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter template name..."
          />

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Template Type
            </label>
            <select
              value={newTemplate.type}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] text-[var(--color-text)]"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="poll">Poll</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
              Content
            </label>
            <textarea
              value={newTemplate.content}
              onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter template content... Use {{variable}} for dynamic content."
              rows={4}
              className="w-full p-3 border border-[var(--color-border)] rounded-xl bg-[var(--color-background)] text-[var(--color-text)] resize-none"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowTemplateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTemplate}
              disabled={!newTemplate.name || !newTemplate.content}
              className="flex-1"
            >
              Create Template
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};