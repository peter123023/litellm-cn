"use client";

import { Inbox } from "lucide-react";
import React, { useMemo } from "react";

import { DataTable } from "@/components/shared/DataTable";
import { DocumentUpload } from "@/components/vector_store_management/types";

import { getDocumentsTableColumns } from "./DocumentsTableColumns";
import { useTranslation } from "@/i18n";

interface DocumentsTableProps {
  documents: DocumentUpload[];
  onRemove: (uid: string) => void;
}

function EmptyState() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
        <Inbox className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">{t("vectorStores.documents.emptyTitle")}</div>
      <div className="text-sm text-muted-foreground">{t("vectorStores.documents.emptyDesc")}</div>
    </div>
  );
}

const DocumentsTable: React.FC<DocumentsTableProps> = ({ documents, onRemove }) => {
  const { t } = useTranslation();
  const columns = useMemo(() => getDocumentsTableColumns({ onRemove, t }), [onRemove, t]);

  return (
    <DataTable
      data={documents}
      columns={columns}
      getRowId={(document, index) => document.uid || String(index)}
      noDataMessage={<EmptyState />}
      size="compact"
    />
  );
};

export default DocumentsTable;
