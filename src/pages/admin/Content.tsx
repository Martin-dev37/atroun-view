import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Layout, Eye, Settings } from 'lucide-react';
import { WebsiteEditor } from '@/components/admin/editors/WebsiteEditor';
import { PortalEditor } from '@/components/admin/editors/PortalEditor';

export default function ContentPage() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return <AdminLayout><div className="p-8 text-center text-muted-foreground">Access restricted to administrators.</div></AdminLayout>;

  return (
    <AdminLayout requireAdmin>
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">Content Editor</h1>
          <p className="text-muted-foreground mt-1">Edit website pages and portal content</p>
        </div>

        <Tabs defaultValue="website">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />Website Pages
            </TabsTrigger>
            <TabsTrigger value="portal" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />Portal Sections
            </TabsTrigger>
          </TabsList>
          <TabsContent value="website" className="mt-6">
            <WebsiteEditor />
          </TabsContent>
          <TabsContent value="portal" className="mt-6">
            <PortalEditor />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
