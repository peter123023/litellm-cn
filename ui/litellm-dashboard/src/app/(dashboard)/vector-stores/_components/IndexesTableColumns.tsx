"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { DateCell, IdentityCell } from "@/components/shared/table_cells";
import { userDetailHref } from "@/utils/entityLinks";
import { translate, type Translate } from "@/i18n";

import type { VectorStoreIndex } from "./IndexesTab";

interface IndexesTableColumnsDeps {
  resolveVectorStoreId: (name: string) => string | undefined;
  onViewVectorStore: (vectorStoreId: string) => void;
  t?: Translate;
}

export const getIndexesTableColumns = ({
  resolveVectorStoreId,
  onViewVectorStore,
  t = translate,
}: IndexesTableColumnsDeps): ColumnDef<VectorStoreIndex>[] => [
  {
    id: "index_name",
    accessorKey: "index_name",
    meta: { title: t("vectorStores.indexes.col.indexName") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("vectorStores.indexes.col.indexName")} />,
    size: 220,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="block max-w-60 truncate text-sm font-medium" title={row.original.index_name}>
        {row.original.index_name || "-"}
      </span>
    ),
  },
  {
    id: "vector_store_name",
    accessorFn: (row) => row.litellm_params.vector_store_name,
    meta: { title: t("vectorStores.indexes.col.vectorStore") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("vectorStores.indexes.col.vectorStore")} />,
    size: 200,
    enableSorting: true,
    cell: ({ row }) => {
      const name = row.original.litellm_params.vector_store_name;
      const vectorStoreId = name ? resolveVectorStoreId(name) : undefined;
      if (vectorStoreId) {
        return (
          <IdentityCell
            title={name}
            titleClassName="font-normal"
            className="max-w-60"
            onClick={() => onViewVectorStore(vectorStoreId)}
          />
        );
      }
      return (
        <span className="block max-w-60 truncate text-sm" title={name}>
          {name || "-"}
        </span>
      );
    },
  },
  {
    id: "vector_store_index",
    accessorFn: (row) => row.litellm_params.vector_store_index,
    meta: { title: t("vectorStores.indexes.col.providerIndex") },
    header: t("vectorStores.indexes.col.providerIndex"),
    size: 220,
    enableSorting: false,
    cell: ({ row }) => (
      <span
        className="block max-w-60 truncate font-mono text-xs"
        title={row.original.litellm_params.vector_store_index}
      >
        {row.original.litellm_params.vector_store_index || "-"}
      </span>
    ),
  },
  {
    id: "created_by",
    accessorKey: "created_by",
    meta: { title: t("vectorStores.indexes.col.createdBy") },
    header: t("vectorStores.indexes.col.createdBy"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => {
      const createdBy = row.original.created_by;
      if (createdBy) {
        return (
          <IdentityCell
            title={createdBy}
            titleClassName="font-normal"
            className="max-w-48"
            href={userDetailHref(createdBy)}
          />
        );
      }
      return <span className="block max-w-48 truncate text-sm">-</span>;
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    sortingFn: "datetime",
    meta: { title: t("vectorStores.indexes.col.createdAt") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("vectorStores.indexes.col.createdAt")} />,
    size: 150,
    enableSorting: true,
    cell: ({ row }) => <DateCell value={row.original.created_at} precision="date" />,
  },
];
