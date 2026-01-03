import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle2, 
  Archive, 
  UserPlus, 
  Mail, 
  X,
  Loader2,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';

export default function BulkActions({ selectedIds, onComplete, teamMembers, availableTags }) {
  const [loading, setLoading] = useState(false);

  const handleBulkAction = async (action, value = null) => {
    setLoading(true);
    try {
      for (const id of selectedIds) {
        const updateData = {};
        
        if (action === 'status') {
          updateData.status = value;
        } else if (action === 'assign') {
          updateData.assigned_to = value;
        } else if (action === 'tag') {
          const intakes = await base44.entities.Intake.filter({ id });
          const intake = intakes[0];
          const currentTags = intake.tags || [];
          if (!currentTags.includes(value)) {
            updateData.tags = [...currentTags, value];
          }
        }
        
        await base44.entities.Intake.update(id, updateData);
      }
      
      toast.success(`Updated ${selectedIds.length} intake${selectedIds.length > 1 ? 's' : ''}`);
      onComplete();
    } catch (error) {
      toast.error('Failed to update intakes');
    } finally {
      setLoading(false);
    }
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border-2 border-blue-300 rounded-2xl shadow-2xl shadow-blue-500/30 p-4 z-50">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-blue-900">{selectedIds.length}</span>
          </div>
          <span className="text-sm text-blue-900 font-medium">selected</span>
        </div>

        <div className="h-6 w-px bg-blue-200" />

        <Select onValueChange={(value) => handleBulkAction('status', value)} disabled={loading}>
          <SelectTrigger className="w-40 h-9 border-blue-200">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Set Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {teamMembers?.length > 0 && (
          <Select onValueChange={(value) => handleBulkAction('assign', value)} disabled={loading}>
            <SelectTrigger className="w-40 h-9 border-blue-200">
              <UserPlus className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Assign To" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map(email => (
                <SelectItem key={email} value={email}>
                  {email.split('@')[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {availableTags?.length > 0 && (
          <Select onValueChange={(value) => handleBulkAction('tag', value)} disabled={loading}>
            <SelectTrigger className="w-40 h-9 border-blue-200">
              <Tag className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Add Tag" />
            </SelectTrigger>
            <SelectContent>
              {availableTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onComplete}
          disabled={loading}
          className="text-blue-700 hover:bg-blue-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}