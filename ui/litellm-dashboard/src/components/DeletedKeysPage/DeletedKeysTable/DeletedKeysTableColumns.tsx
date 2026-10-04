"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { DateCell, IdCell, IdentityCell, MoneyCell } from "@/components/shared/table_cells";
import { DeletedKeyResponse } from "@/app/(dashboard)/hooks/keys/useKeys";
import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";
import { userDetailHref } from "@/utils/entityLinks";

/** Column labels are baked into the defs when the table is built, so callers pass their `t`; without one the labels stay English. */
const englishT: Translate = (key, params) => translate(DEFAULT_LANGUAGE, key, params);

function TruncatedTextCell({ value }: { value: string | null | undefined }) {
  if (!value) {
    return <span className="text-muted-foreground">-</span>;
  }
  return (
    <span className="block max-w-60 truncate" title={value}>
      {value}
    </span>
  );
}

function UserLinkCell({ userId }: { userId: string | null | undefined }) {
  if (!userId) {
    return <span className="text-muted-foreground">-</span>;
  }
  return (
    <span className="block max-w-60" title={userId}>
      <IdentityCell title={userId} titleClassName="font-normal" href={userDetailHref(userId)} />
    </span>
  );
}

export const getDeletedKeysTableColumns = (t: Translate = englishT): ColumnDef<DeletedKeyResponse>[] => [
  {
    id: "token",
    accessorKey: "token",
    meta: { title: t("deletedKeys.colKeyId") },
    header: t("deletedKeys.colKeyId"),
    size: 150,
    enableSorting: false,
    cell: ({ row }) => <IdCell value={row.original.token} variant="plain" />,
  },
  {
    id: "key_alias",
    accessorKey: "key_alias",
    meta: { title: t("deletedKeys.colKeyAlias") },
    header: t("deletedKeys.colKeyAlias"),
    size: 150,
    enableSorting: false,
    cell: ({ row }) => {
      const value = row.original.key_alias;
      if (!value) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <span className="block max-w-60 truncate font-mono text-xs" title={value}>
          {value}
        </span>
      );
    },
  },
  {
    id: "team_alias",
    accessorKey: "team_alias",
    meta: { title: t("deletedKeys.colTeamAlias") },
    header: t("deletedKeys.colTeamAlias"),
    size: 120,
    enableSorting: false,
    cell: ({ row }) => <TruncatedTextCell value={row.original.team_alias} />,
  },
  {
    id: "spend",
    accessorKey: "spend",
    meta: { title: t("deletedKeys.colSpend"), numeric: true },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("deletedKeys.colSpend")} />,
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <MoneyCell value={row.original.spend} decimals={4} />,
  },
  {
    id: "max_budget",
    accessorKey: "max_budget",
    meta: { title: t("deletedKeys.colBudget"), numeric: true },
    header: t("deletedKeys.colBudget"),
    size: 110,
    enableSorting: false,
    cell: ({ row }) => (
      <MoneyCell value={row.original.max_budget} decimals={0} emptyText={t("deletedKeys.unlimited")} showZero />
    ),
  },
  {
    id: "user_email",
    accessorKey: "user_email",
    meta: { title: t("deletedKeys.colUserEmail") },
    header: t("deletedKeys.colUserEmail"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => <TruncatedTextCell value={row.original.user_email} />,
  },
  {
    id: "user_id",
    accessorKey: "user_id",
    meta: { title: t("deletedKeys.colUserId") },
    header: t("deletedKeys.colUserId"),
    size: 120,
    enableSorting: false,
    cell: ({ row }) => <UserLinkCell userId={row.original.user_id} />,
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    meta: { title: t("deletedKeys.colCreatedAt") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("deletedKeys.colCreatedAt")} />,
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <DateCell value={row.original.created_at} precision="date" />,
  },
  {
    id: "created_by",
    accessorKey: "created_by",
    meta: { title: t("deletedKeys.colCreatedBy") },
    header: t("deletedKeys.colCreatedBy"),
    size: 120,
    enableSorting: false,
    cell: ({ row }) => <UserLinkCell userId={row.original.created_by} />,
  },
  {
    id: "deleted_at",
    accessorKey: "deleted_at",
    meta: { title: t("deletedKeys.colDeletedAt") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("deletedKeys.colDeletedAt")} />,
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <DateCell value={row.original.deleted_at} precision="date" />,
  },
  {
    id: "deleted_by",
    accessorKey: "deleted_by",
    meta: { title: t("deletedKeys.colDeletedBy") },
    header: t("deletedKeys.colDeletedBy"),
    size: 120,
    enableSorting: false,
    cell: ({ row }) => <UserLinkCell userId={row.original.deleted_by} />,
  },
];
