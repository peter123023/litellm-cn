"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { DateCell, IdentityCell, ModelsCell, MoneyCell } from "@/components/shared/table_cells";
import { Organization } from "@/components/networking";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";
import { DEFAULT_LANGUAGE, translate, type Translate } from "@/i18n";

interface OrganizationBudget {
  max_budget?: number | null;
  tpm_limit?: number | null;
  rpm_limit?: number | null;
}

const getOrganizationBudget = (organization: Organization): OrganizationBudget =>
  (organization.litellm_budget_table ?? {}) as OrganizationBudget;

function OrganizationLimitsCell({ organization, t }: { organization: Organization; t: Translate }) {
  const { tpm_limit, rpm_limit } = getOrganizationBudget(organization);
  return (
    <div className="flex flex-col text-xs text-muted-foreground">
      <span>TPM: {tpm_limit ?? t("organizations.unlimited")}</span>
      <span>RPM: {rpm_limit ?? t("organizations.unlimited")}</span>
    </div>
  );
}

interface OrganizationRowActionsProps {
  organization: Organization;
  t: Translate;
  onEditClick: (organizationId: string) => void;
  onDeleteClick: (organizationId: string) => void;
}

function OrganizationRowActions({ organization, t, onEditClick, onDeleteClick }: OrganizationRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("organizations.openActionsAria")}
        data-testid={`organization-actions-${organization.organization_id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          data-testid="organization-action-edit"
          onClick={() => onEditClick(organization.organization_id)}
        >
          <Pencil />
          {t("common.edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          data-testid="organization-action-delete"
          onClick={() => onDeleteClick(organization.organization_id)}
        >
          <Trash2 />
          {t("common.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface OrganizationsTableColumnsDeps {
  userRole: string;
  t?: Translate;
  onOrganizationClick: (organizationId: string) => void;
  onEditClick: (organizationId: string) => void;
  onDeleteClick: (organizationId: string) => void;
}

export const getOrganizationsTableColumns = ({
  userRole,
  t = (key, params) => translate(DEFAULT_LANGUAGE, key, params),
  onOrganizationClick,
  onEditClick,
  onDeleteClick,
}: OrganizationsTableColumnsDeps): ColumnDef<Organization>[] => [
  {
    id: "organization_id",
    accessorKey: "organization_id",
    meta: { title: t("organizations.organizationId") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("organizations.organizationId")} />,
    size: 220,
    enableSorting: true,
    cell: ({ row }) => (
      <IdentityCell
        title={row.original.organization_id}
        titleClassName="font-mono text-xs font-normal"
        className="max-w-56"
        onClick={() => onOrganizationClick(row.original.organization_id)}
      />
    ),
  },
  {
    id: "organization_alias",
    accessorKey: "organization_alias",
    meta: { title: t("organizations.organizationName") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("organizations.organizationName")} />,
    size: 200,
    enableSorting: true,
    cell: ({ row }) => {
      const alias = row.original.organization_alias;
      return (
        <span className="block max-w-56 truncate text-sm font-medium" title={alias ?? undefined}>
          {alias || "-"}
        </span>
      );
    },
  },
  {
    id: "created_at",
    accessorKey: "created_at",
    sortingFn: "datetime",
    meta: { title: t("organizations.created") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("organizations.created")} />,
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <DateCell value={row.original.created_at} precision="date" />,
  },
  {
    id: "spend",
    accessorKey: "spend",
    meta: { title: t("organizations.spendUsd"), numeric: true },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("organizations.spendUsd")} />,
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <MoneyCell value={row.original.spend} decimals={4} />,
  },
  {
    id: "max_budget",
    meta: { title: t("organizations.budgetUsd"), numeric: true },
    header: t("organizations.budgetUsd"),
    size: 120,
    enableSorting: false,
    cell: ({ row }) => (
      <MoneyCell
        value={getOrganizationBudget(row.original).max_budget}
        decimals={2}
        emptyText={t("organizations.unlimited")}
        showZero
      />
    ),
  },
  {
    id: "models",
    meta: { title: t("organizations.models"), skeleton: "chips" },
    header: t("organizations.models"),
    size: 260,
    enableSorting: false,
    cell: ({ row }) => <ModelsCell models={row.original.models} />,
  },
  {
    id: "limits",
    meta: { title: t("organizations.tpmRpmLimits") },
    header: t("organizations.tpmRpmLimits"),
    size: 150,
    enableSorting: false,
    cell: ({ row }) => <OrganizationLimitsCell organization={row.original} t={t} />,
  },
  {
    id: "members",
    meta: { title: t("organizations.members"), numeric: true },
    header: t("organizations.members"),
    size: 100,
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm">{t("organizations.membersCount", { count: row.original.members?.length ?? 0 })}</span>
    ),
  },
  {
    id: "actions",
    meta: { className: "text-right", headerClassName: "text-right" },
    header: () => <span className="sr-only">{t("common.actions")}</span>,
    size: 64,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) =>
      userRole === "Admin" ? (
        <div className="flex justify-end">
          <OrganizationRowActions
            organization={row.original}
            t={t}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        </div>
      ) : null,
  },
];
