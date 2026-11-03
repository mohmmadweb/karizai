import type { ReactNode } from "react";
import { AccessProvider } from "@/admin/features/access-control/components/access-provider";
import { getAccessGrants } from "@/admin/features/access-control/data/access-grants";
import { AdminShell } from "@/admin/features/admin-shell/components/admin-shell";
import { DataSourcesProvider } from "@/admin/features/data-sources/components/data-sources-provider";
import { getSchemaDescriptions } from "@/admin/features/data-sources/data/descriptions";
import { getDataSources } from "@/admin/features/data-sources/data/data-sources";
import { DocumentsProvider } from "@/admin/features/documents/components/documents-provider";
import { getDocuments } from "@/admin/features/documents/data/documents";
import { getFileSources } from "@/admin/features/documents/data/file-sources";
import { BiProvider } from "@/admin/features/bi-dashboard/components/bi-provider";
import { ApiKeysProvider } from "@/admin/features/api-keys/components/api-keys-provider";
import { ConnectionsProvider } from "@/admin/features/connections/components/connections-provider";
import { RoutersProvider } from "@/admin/features/smart-router/components/routers-provider";
import { ModelsProvider } from "@/admin/features/models/components/models-provider";
import { getModels } from "@/admin/features/models/data/models";
import { getProviders } from "@/admin/features/models/data/providers";
import { DirectoryProvider } from "@/admin/features/user-management/components/directory-provider";
import { getGroups } from "@/admin/features/user-management/data/groups";
import { getMemberships } from "@/admin/features/user-management/data/memberships";
import { getUsers } from "@/admin/features/user-management/data/users";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DirectoryProvider
      initialUsers={getUsers()}
      initialGroups={getGroups()}
      initialMemberships={getMemberships()}
    >
      <AccessProvider initialGrants={getAccessGrants()}>
        <ModelsProvider initialProviders={getProviders()} initialModels={getModels()}>
          <DataSourcesProvider
            initialSources={getDataSources()}
            initialDescriptions={getSchemaDescriptions()}
          >
            <RoutersProvider>
              <ConnectionsProvider>
                <ApiKeysProvider>
                  <DocumentsProvider initialDocuments={getDocuments()} initialSources={getFileSources()}>
                    <BiProvider><AdminShell>{children}</AdminShell></BiProvider>
                  </DocumentsProvider>
                </ApiKeysProvider>
              </ConnectionsProvider>
            </RoutersProvider>
          </DataSourcesProvider>
        </ModelsProvider>
      </AccessProvider>
    </DirectoryProvider>
  );
}
