import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageManager } from './PageManager';
import { ContentEditorWithPreview } from './ContentEditorWithPreview';
import { CampaignScheduler } from './CampaignScheduler';
import { PortalManager } from './PortalManager';
import { MessageSquare, FileText, Edit, Send, Users } from 'lucide-react';

interface AdminTabsProps {
  children: React.ReactNode; // Contact submissions content
}

export const AdminTabs = ({ children }: AdminTabsProps) => {
  return (
    <Tabs defaultValue="messages" className="space-y-6">
      <TabsList className="grid w-full grid-cols-5 max-w-2xl">
        <TabsTrigger value="messages" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Messages</span>
        </TabsTrigger>
        <TabsTrigger value="pages" className="gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Pages</span>
        </TabsTrigger>
        <TabsTrigger value="editor" className="gap-2">
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Editor</span>
        </TabsTrigger>
        <TabsTrigger value="campaigns" className="gap-2">
          <Send className="h-4 w-4" />
          <span className="hidden sm:inline">Campaigns</span>
        </TabsTrigger>
        <TabsTrigger value="portals" className="gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Portals</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="messages">
        {children}
      </TabsContent>

      <TabsContent value="pages">
        <PageManager />
      </TabsContent>

      <TabsContent value="editor">
        <ContentEditorWithPreview />
      </TabsContent>

      <TabsContent value="campaigns">
        <CampaignScheduler />
      </TabsContent>

      <TabsContent value="portals">
        <PortalManager />
      </TabsContent>
    </Tabs>
  );
};
