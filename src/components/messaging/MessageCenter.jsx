import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Paperclip, Loader2, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function MessageCenter({ intake, userType = 'staff' }) {
  const [newMessage, setNewMessage] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', intake.id],
    queryFn: () => base44.entities.Message.filter({ intake_id: intake.id }, '-created_date'),
    refetchInterval: 5000 // Poll every 5 seconds
  });

  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      const user = userType === 'staff' ? await base44.auth.me() : null;
      
      return base44.entities.Message.create({
        intake_id: intake.id,
        sender_email: userType === 'staff' ? user.email : intake.client_email,
        sender_name: userType === 'staff' ? user.full_name : intake.client_name,
        sender_type: userType,
        content: newMessage,
        attachments: attachments
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', intake.id]);
      setNewMessage('');
      setAttachments([]);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setAttachments([...attachments, file_url]);
      toast.success('File attached');
    } catch (error) {
      toast.error('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSend = () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    sendMessageMutation.mutate();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (userType === 'staff') {
      messages
        .filter(m => m.sender_type === 'client' && !m.read)
        .forEach(m => {
          base44.entities.Message.update(m.id, { read: true });
        });
    }
  }, [messages, userType]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Messages List */}
        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-blue-600/70">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isStaff = message.sender_type === 'staff';
              const isOwnMessage = userType === message.sender_type;

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-900 border border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium opacity-80">
                        {message.sender_name}
                      </span>
                      <span className="text-xs opacity-60">
                        {format(new Date(message.created_date), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.attachments?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((url, idx) => (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs underline block"
                          >
                            📎 Attachment {idx + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((url, idx) => (
              <div
                key={idx}
                className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-2"
              >
                <span className="text-xs text-blue-900">Attachment {idx + 1}</span>
                <button
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))}
                  className="text-blue-600 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id={`file-upload-${intake.id}`}
          />
          <label htmlFor={`file-upload-${intake.id}`}>
            <Button
              variant="outline"
              size="icon"
              asChild
              disabled={uploadingFile}
              className="border-blue-200 hover:bg-blue-50"
            >
              <span className="cursor-pointer">
                {uploadingFile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Paperclip className="w-4 h-4" />
                )}
              </span>
            </Button>
          </label>
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            rows={2}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 resize-none bg-white border-blue-200"
          />
          <Button
            onClick={handleSend}
            disabled={sendMessageMutation.isPending || (!newMessage.trim() && attachments.length === 0)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}