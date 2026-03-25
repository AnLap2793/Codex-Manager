"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Download,
  PencilLine,
  ExternalLink,
  FileUp,
  FolderOpen,
  MoreVertical,
  Pin,
  Plus,
  Power,
  PowerOff,
  RefreshCw,
  Search,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { AddAccountModal } from "@/components/modals/add-account-modal";
import { ConfirmDialog } from "@/components/modals/confirm-dialog";
import UsageModal from "@/components/modals/usage-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAccounts } from "@/hooks/useAccounts";
import { useDesktopPageActive } from "@/hooks/useDesktopPageActive";
import { useI18n } from "@/hooks/useI18n";
import { usePageTransitionReady } from "@/hooks/usePageTransitionReady";
import { useRuntimeCapabilities } from "@/hooks/useRuntimeCapabilities";
import { cn } from "@/lib/utils";
import { buildStaticRouteUrl } from "@/lib/utils/static-routes";
import {
  formatTsFromSeconds,
  getUsageDisplayBuckets,
  isBannedAccount,
  isPrimaryWindowOnlyUsage,
  isSecondaryWindowOnlyUsage,
} from "@/lib/utils/usage";
import { Account } from "@/types";

type StatusFilter = "all" | "available" | "low_quota" | "banned";
type TranslateFn = ReturnType<typeof useI18n>["t"];

function formatAccountPlanValueLabel(value: string, t: TranslateFn) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  switch (normalized) {
    case "free":
      return "FREE";
    case "go":
      return "GO";
    case "plus":
      return "PLUS";
    case "pro":
      return "PRO";
    case "team":
      return "TEAM";
    case "business":
      return "BUSINESS";
    case "enterprise":
      return "ENTERPRISE";
    case "edu":
      return "EDU";
    case "unknown":
      return t("未知");
    default:
      return normalized ? normalized.toUpperCase() : t("未知");
  }
}

function normalizeAccountPlanKey(account: Account) {
  return String(account.planType || "")
    .trim()
    .toLowerCase() || "unknown";
}

function formatPlanFilterLabel(value: string, t: TranslateFn) {
  const nextValue = String(value || "").trim();
  if (!nextValue || nextValue === "all") {
    return t("全部类型");
  }
  return formatAccountPlanValueLabel(nextValue, t);
}

function formatStatusFilterLabel(value: string, t: TranslateFn) {
  const nextValue = String(value || "").trim();
  switch (nextValue) {
    case "available":
      return t("可用");
    case "low_quota":
      return t("低配额");
    case "banned":
      return t("封禁");
    case "all":
    default:
      return t("全部");
  }
}

interface QuotaProgressProps {
  label: string;
  remainPercent: number | null;
  resetsAt: number | null;
  icon: LucideIcon;
  tone: "green" | "blue";
  emptyText?: string;
  emptyResetText?: string;
}

function QuotaProgress({
  label,
  remainPercent,
  resetsAt,
  icon: Icon,
  tone,
  emptyText = "--",
  emptyResetText = "未知",
}: QuotaProgressProps) {
  const { t } = useI18n();
  const value = remainPercent ?? 0;
  const trackClassName = tone === "blue" ? "bg-blue-500/20" : "bg-green-500/20";
  const indicatorClassName = tone === "blue" ? "bg-blue-500" : "bg-green-500";

  return (
    <div className="flex min-w-[120px] flex-col gap-1">
      <div className="flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Icon className="h-3 w-3" />
          <span>{t(label)}</span>
        </div>
        <span className="font-medium">
          {remainPercent == null ? t(emptyText) : `${value}%`}
        </span>
      </div>
      <Progress
        value={value}
        trackClassName={trackClassName}
        indicatorClassName={indicatorClassName}
      />
      <div className="text-[10px] text-muted-foreground">
        {t("重置: {value}", {
          value: formatTsFromSeconds(resetsAt, t(emptyResetText)),
        })}
      </div>
    </div>
  );
}

function getAccountStatusAction(account: Account, t: TranslateFn): {
  enable: boolean;
  label: string;
  icon: LucideIcon;
} {
  const normalizedStatus = String(account.status || "")
    .trim()
    .toLowerCase();
  if (normalizedStatus === "disabled") {
    return { enable: true, label: t("启用账号"), icon: Power };
  }
  if (normalizedStatus === "inactive") {
    return { enable: true, label: t("恢复账号"), icon: Power };
  }
  return { enable: false, label: t("禁用账号"), icon: PowerOff };
}

function formatAccountPlanLabel(account: Account, t: TranslateFn): string | null {
  const normalized = normalizeAccountPlanKey(account);
  return normalized === "unknown"
    ? null
    : formatAccountPlanValueLabel(normalized, t);
}

function getAccountPlanBadgeClassName(planLabel: string | null): string {
  switch (planLabel) {
    case "FREE":
      return "bg-slate-500/10 text-slate-700 dark:text-slate-300";
    case "GO":
      return "bg-sky-500/10 text-sky-700 dark:text-sky-300";
    case "PLUS":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300";
    case "PRO":
      return "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-300";
    case "TEAM":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    case "BUSINESS":
      return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300";
    case "ENTERPRISE":
      return "bg-rose-500/10 text-rose-700 dark:text-rose-300";
    case "EDU":
      return "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300";
    default:
      return "bg-accent/50";
  }
}

function formatAccountTags(tags: string[]): string {
  return tags
    .map((tag) => String(tag || "").trim())
    .filter(Boolean)
    .join(", ");
}

function normalizeTagsDraft(tagsDraft: string): string[] {
  return tagsDraft
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function AccountInfoCell({
  account,
  isPreferred,
}: {
  account: Account;
  isPreferred: boolean;
}) {
  const { t } = useI18n();
  const accountPlanLabel = formatAccountPlanLabel(account, t);
  const tagsText = formatAccountTags(account.tags);
  const noteText = String(account.note || "").trim();

  return (
    <Tooltip>
      <TooltipTrigger render={<div />} className="block cursor-help text-left">
        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="truncate text-sm font-semibold">{account.name}</span>
            {accountPlanLabel ? (
              <Badge
                variant="secondary"
                className={cn(
                  "h-4 shrink-0 px-1.5 text-[9px]",
                  getAccountPlanBadgeClassName(accountPlanLabel),
                )}
              >
                {accountPlanLabel}
              </Badge>
            ) : null}
            {isPreferred ? (
              <Badge
                variant="secondary"
                className="h-4 shrink-0 bg-amber-500/15 px-1.5 text-[9px] text-amber-700 dark:text-amber-300"
              >
                {t("优先")}
              </Badge>
            ) : null}
          </div>
          <span className="truncate font-mono text-[10px] uppercase text-muted-foreground opacity-60">
            {account.id.slice(0, 16)}...
          </span>
          <span className="mt-1 text-[10px] text-muted-foreground">
            {t("最近刷新: {value}", {
              value: formatTsFromSeconds(account.lastRefreshAt, t("从未刷新")),
            })}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-sm">
        <div className="flex min-w-[260px] flex-col gap-2">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-0.5">
              <div className="text-[10px] text-background/70">{t("账号类型")}</div>
              <div className="font-medium">{accountPlanLabel || t("未知")}</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px] text-background/70">{t("当前状态")}</div>
              <div className="font-medium">{t(account.availabilityText || "未知")}</div>
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] text-background/70">{t("标签")}</div>
            <div className="break-words">{tagsText || t("未设置")}</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] text-background/70">{t("备注")}</div>
            <div className="whitespace-pre-wrap break-words">
              {noteText || t("未设置")}
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-[10px] text-background/70">{t("账号 ID")}</div>
            <div className="break-all font-mono text-[11px]">{account.id}</div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

export default function AccountsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { isDesktopRuntime, canUseBrowserDownloadExport } = useRuntimeCapabilities();
  const {
    accounts,
    planTypes,
    isLoading,
    isServiceReady,
    refreshAccount,
    refreshAllAccounts,
    deleteAccount,
    deleteManyAccounts,
    deleteUnavailableFree,
    importByFile,
    importByDirectory,
    exportAccounts,
    isRefreshingAccountId,
    isRefreshingAllAccounts,
    isExporting,
    isDeletingMany,
    manualPreferredAccountId,
    setPreferredAccount,
    clearPreferredAccount,
    isUpdatingPreferred,
    updateAccountProfile,
    isUpdatingProfileAccountId,
    toggleAccountStatus,
    isUpdatingStatusAccountId,
  } = useAccounts();
  const isPageActive = useDesktopPageActive("/accounts/");
  usePageTransitionReady("/accounts/", !isServiceReady || !isLoading);

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pageSize, setPageSize] = useState("20");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);
  const [usageModalOpen, setUsageModalOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [labelDraft, setLabelDraft] = useState("");
  const [tagsDraft, setTagsDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [sortDraft, setSortDraft] = useState("");
  const [accountEditorState, setAccountEditorState] = useState<{
    accountId: string;
    accountName: string;
    currentLabel: string;
    currentTags: string;
    currentNote: string;
    currentSort: number;
  } | null>(null);
  const [deleteDialogState, setDeleteDialogState] = useState<
    | { kind: "single"; account: Account }
    | { kind: "selected"; ids: string[]; count: number }
    | null
  >(null);
  const importFileActionLabel = isDesktopRuntime
    ? t("按文件导入")
    : t("选择文件导入");
  const importDirectoryActionLabel = isDesktopRuntime
    ? t("按文件夹导入")
    : t("选择目录导入");
  const exportActionLabel =
    !isDesktopRuntime && canUseBrowserDownloadExport
      ? t("导出到浏览器")
      : t("导出账号");
  const exportActionShortcut = isExporting
    ? "..."
    : !isDesktopRuntime && canUseBrowserDownloadExport
      ? "DL"
      : "ZIP";

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const matchSearch =
        !search ||
        account.name.toLowerCase().includes(search.toLowerCase()) ||
        account.id.toLowerCase().includes(search.toLowerCase());
      const matchPlan =
        planFilter === "all" || normalizeAccountPlanKey(account) === planFilter;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && account.isAvailable) ||
        (statusFilter === "low_quota" && account.isLowQuota) ||
        (statusFilter === "banned" && isBannedAccount(account));
      return matchSearch && matchPlan && matchStatus;
    });
  }, [accounts, planFilter, search, statusFilter]);

  const statusFilterOptions = useMemo(
    () => [
      { id: "all" as const, label: t("全部 ({count})", { count: accounts.length }) },
      {
        id: "available" as const,
        label: t("可用 ({count})", {
          count: accounts.filter((account) => account.isAvailable).length,
        }),
      },
      {
        id: "low_quota" as const,
        label: t("低配额 ({count})", {
          count: accounts.filter((account) => account.isLowQuota).length,
        }),
      },
      {
        id: "banned" as const,
        label: t("封禁 ({count})", {
          count: accounts.filter((account) => isBannedAccount(account)).length,
        }),
      },
    ],
    [accounts, t],
  );
  const pageSizeNumber = Number(pageSize) || 20;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAccounts.length / pageSizeNumber),
  );
  const safePage = Math.min(page, totalPages);
  const accountIdSet = useMemo(
    () => new Set(accounts.map((account) => account.id)),
    [accounts],
  );
  const effectiveSelectedIds = useMemo(
    () => selectedIds.filter((id) => accountIdSet.has(id)),
    [accountIdSet, selectedIds],
  );

  const visibleAccounts = useMemo(() => {
    const offset = (safePage - 1) * pageSizeNumber;
    return filteredAccounts.slice(offset, offset + pageSizeNumber);
  }, [filteredAccounts, pageSizeNumber, safePage]);

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === selectedAccountId) ?? null,
    [accounts, selectedAccountId],
  );
  const currentEditingAccount = useMemo(
    () =>
      accountEditorState
        ? accounts.find((account) => account.id === accountEditorState.accountId) ?? null
        : null,
    [accountEditorState, accounts],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePlanFilterChange = (value: string | null) => {
    setPlanFilter(value || "all");
    setPage(1);
  };

  const handleStatusFilterChange = (value: StatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handlePageSizeChange = (value: string | null) => {
    setPageSize(value || "20");
    setPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const toggleSelectAllVisible = () => {
    const visibleIds = visibleAccounts.map((account) => account.id);
    const allSelected = visibleIds.every((id) =>
      effectiveSelectedIds.includes(id),
    );
    setSelectedIds((current) => {
      if (allSelected) {
        return current.filter((id) => !visibleIds.includes(id));
      }
      return Array.from(new Set([...current, ...visibleIds]));
    });
  };

  const openUsage = (account: Account) => {
    setSelectedAccountId(account.id);
    setUsageModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (!effectiveSelectedIds.length) {
      toast.error(t("请先选择要删除的账号"));
      return;
    }
    setDeleteDialogState({
      kind: "selected",
      ids: [...effectiveSelectedIds],
      count: effectiveSelectedIds.length,
    });
  };

  const handleDeleteBanned = () => {
    const bannedIds = accounts
      .filter((account) => isBannedAccount(account))
      .map((account) => account.id);
    if (!bannedIds.length) {
      toast.error(t("当前没有可清理的封禁账号"));
      return;
    }
    setDeleteDialogState({
      kind: "selected",
      ids: bannedIds,
      count: bannedIds.length,
    });
  };

  const handleDeleteSingle = (account: Account) => {
    setDeleteDialogState({ kind: "single", account });
  };

  const openAccountEditor = (account: Account) => {
    setAccountEditorState({
      accountId: account.id,
      accountName: account.name,
      currentLabel: account.label,
      currentTags: account.tags.join(", "),
      currentNote: account.note || "",
      currentSort: account.priority,
    });
    setLabelDraft(account.label);
    setTagsDraft(account.tags.join(", "));
    setNoteDraft(account.note || "");
    setSortDraft(String(account.priority));
  };

  const handleConfirmAccountEditor = async () => {
    if (!accountEditorState) return;

    const nextLabel = labelDraft.trim();
    const nextTags = normalizeTagsDraft(tagsDraft);
    const nextTagsText = nextTags.join(", ");
    const nextNote = noteDraft.trim();

    if (!nextLabel) {
      toast.error(t("请输入账号名称"));
      return;
    }

    const rawSort = sortDraft.trim();
    if (!rawSort) {
      toast.error(t("请输入顺序值"));
      return;
    }

    const parsed = Number(rawSort);
    if (!Number.isFinite(parsed)) {
      toast.error(t("顺序必须是数字"));
      return;
    }

    const nextSort = Math.max(0, Math.trunc(parsed));
    if (
      nextLabel === accountEditorState.currentLabel &&
      nextTagsText === accountEditorState.currentTags &&
      nextNote === accountEditorState.currentNote &&
      nextSort === accountEditorState.currentSort
    ) {
      setAccountEditorState(null);
      return;
    }

    try {
      await updateAccountProfile(accountEditorState.accountId, {
        label: nextLabel,
        note: nextNote || null,
        tags: nextTags,
        sort: nextSort,
      });
      setAccountEditorState(null);
    } catch {
      // The mutation already shows a toast, so keep the dialog open here.
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteDialogState) return;
    if (deleteDialogState.kind === "single") {
      deleteAccount(deleteDialogState.account.id);
      return;
    }
    deleteManyAccounts(deleteDialogState.ids);
    setSelectedIds((current) =>
      current.filter((id) => !deleteDialogState.ids.includes(id)),
    );
  };

  return (
    <div className="space-y-6">
      {!isServiceReady ? (
        <Card className="glass-card border-none shadow-sm">
          <CardContent className="pt-6 text-sm text-muted-foreground">
            {t("服务未连接，账号列表与相关操作暂不可用；连接恢复后会自动继续加载。")}
          </CardContent>
        </Card>
      ) : null}
      <Card className="glass-card border-none shadow-md backdrop-blur-md">
        <CardContent className="grid gap-3 pt-0 lg:grid-cols-[200px_auto_minmax(0,1fr)_auto] lg:items-center">
          <div className="min-w-0">
            <Input
              placeholder={t("搜索账号名 / 编号...")}
              className="glass-card h-10 rounded-xl px-3"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Select value={planFilter} onValueChange={handlePlanFilterChange}>
              <SelectTrigger className="h-10 w-[140px] shrink-0 rounded-xl bg-card/50">
                <SelectValue placeholder={t("全部类型")}>
                  {(value) => formatPlanFilterLabel(String(value || ""), t)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("全部类型 ({count})", { count: accounts.length })}
                </SelectItem>
                {planTypes.map((planType) => (
                  <SelectItem key={planType.value} value={planType.value}>
                    {formatAccountPlanValueLabel(planType.value, t)} ({planType.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                handleStatusFilterChange(value as StatusFilter)
              }
            >
              <SelectTrigger className="h-10 w-[152px] shrink-0 rounded-xl bg-card/50">
                <SelectValue placeholder={t("全部状态")}>
                  {(value) => formatStatusFilterLabel(String(value || ""), t)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusFilterOptions.map((filter) => (
                  <SelectItem key={filter.id} value={filter.id}>
                    {filter.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden min-w-0 lg:block" />

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0 lg:justify-self-end">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  className="glass-card h-10 min-w-[50px] justify-between gap-2 rounded-xl px-3"
                  render={<span />}
                  nativeButton={false}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t("账号操作")}</span>
                    {effectiveSelectedIds.length > 0 ? (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {effectiveSelectedIds.length}
                      </span>
                    ) : null}
                  </span>
                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 rounded-xl border border-border/70 bg-popover/95 p-2 shadow-xl backdrop-blur-md"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                    {t("账号管理")}
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    className="h-9 rounded-lg px-2"
                    disabled={!isServiceReady}
                    onClick={() => setAddAccountModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> {t("添加账号")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="h-9 rounded-lg px-2"
                    disabled={!isServiceReady}
                    onClick={() => importByFile()}
                  >
                    <FileUp className="mr-2 h-4 w-4" /> {importFileActionLabel}
                    <DropdownMenuShortcut>FILE</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="h-9 rounded-lg px-2"
                    disabled={!isServiceReady}
                    onClick={() => importByDirectory()}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" /> {importDirectoryActionLabel}
                    <DropdownMenuShortcut>DIR</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="h-9 rounded-lg px-2"
                    disabled={!isServiceReady || isExporting}
                    onClick={() => exportAccounts()}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {exportActionLabel}
                    <DropdownMenuShortcut>
                      {exportActionShortcut}
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-2 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground/80">
                    {t("清理")}
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    disabled={!isServiceReady || !effectiveSelectedIds.length || isDeletingMany}
                    variant="destructive"
                    className="h-9 rounded-lg px-2"
                    onClick={handleDeleteSelected}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> {t("删除选中账号")}
                    <DropdownMenuShortcut>
                      {effectiveSelectedIds.length || "-"}
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="h-9 rounded-lg px-2"
                    disabled={!isServiceReady}
                    onClick={() => deleteUnavailableFree()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> {t("一键清理不可用免费")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    className="h-9 rounded-lg px-2"
                    disabled={!isServiceReady}
                    onClick={handleDeleteBanned}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> {t("一键清理封禁账号")}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              className="h-10 w-30 gap-1 rounded-xl shadow-lg shadow-primary/20"
              onClick={() => refreshAllAccounts()}
              disabled={!isServiceReady || isRefreshingAllAccounts}
            >
              <RefreshCw
                className={cn(
                  "h-4 w-1",
                  isRefreshingAllAccounts && "animate-spin",
                )}
              />
              {t("刷新")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card overflow-hidden border-none py-0 shadow-xl backdrop-blur-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">
                  <Checkbox
                    checked={
                      visibleAccounts.length > 0 &&
                      visibleAccounts.every((account) =>
                        effectiveSelectedIds.includes(account.id),
                      )
                    }
                    onCheckedChange={toggleSelectAllVisible}
                  />
                </TableHead>
                <TableHead className="max-w-[220px]">{t("账号信息")}</TableHead>
                <TableHead>{t("5h 额度")}</TableHead>
                <TableHead>{t("7d 额度")}</TableHead>
                <TableHead className="w-20">{t("顺序")}</TableHead>
                <TableHead>{t("状态")}</TableHead>
                <TableHead className="text-center">{t("操作")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="mx-auto h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="mx-auto h-8 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : visibleAccounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Search className="h-8 w-8 opacity-20" />
                      <p>{t("未找到符合条件的账号")}</p>
                    </div>
                  </TableCell>
                </TableRow>
                ) : (
                  visibleAccounts.map((account) => {
                    const primaryWindowOnly = isPrimaryWindowOnlyUsage(
                      account.usage,
                    );
                    const secondaryWindowOnly = isSecondaryWindowOnlyUsage(
                      account.usage,
                    );
                    const usageBuckets = getUsageDisplayBuckets(account.usage);
                    const statusAction = getAccountStatusAction(account, t);
                    const StatusActionIcon = statusAction.icon;
                    return (
                      <TableRow key={account.id} className="group">
                        <TableCell className="text-center">
                          <Checkbox
                            checked={effectiveSelectedIds.includes(account.id)}
                            onCheckedChange={() => toggleSelect(account.id)}
                          />
                        </TableCell>
                        <TableCell className="max-w-[220px]">
                          <AccountInfoCell
                            account={account}
                            isPreferred={manualPreferredAccountId === account.id}
                          />
                        </TableCell>
                        <TableCell>
                          <QuotaProgress
                            label="5小时"
                            remainPercent={account.primaryRemainPercent}
                            resetsAt={usageBuckets.primaryResetsAt}
                            icon={RefreshCw}
                            tone="green"
                            emptyText={secondaryWindowOnly ? "未提供" : "--"}
                            emptyResetText={
                              secondaryWindowOnly ? "未提供" : "未知"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <QuotaProgress
                            label="7天"
                            remainPercent={account.secondaryRemainPercent}
                            resetsAt={usageBuckets.secondaryResetsAt}
                            icon={RefreshCw}
                            tone="blue"
                            emptyText={primaryWindowOnly ? "未提供" : "--"}
                            emptyResetText={primaryWindowOnly ? "未提供" : "未知"}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="rounded bg-muted/50 px-2 py-0.5 font-mono text-xs">
                              {account.priority}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground transition-colors hover:text-primary"
                              disabled={!isServiceReady || isUpdatingProfileAccountId === account.id}
                              onClick={() => openAccountEditor(account)}
                              title={t("编辑账号信息")}
                            >
                              <PencilLine className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <div
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                account.isAvailable
                                  ? "bg-green-500"
                                  : "bg-red-500",
                              )}
                            />
                            <span
                              className={cn(
                                "text-[11px] font-medium",
                                account.isAvailable
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400",
                              )}
                            >
                              {t(account.availabilityText || "未知")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="table-action-cell gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground transition-colors hover:text-primary"
                              disabled={!isServiceReady}
                              onClick={() => openUsage(account)}
                              title={t("用量详情")}
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  render={<span />}
                                  nativeButton={false}
                                  disabled={!isServiceReady}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="gap-2"
                                  disabled={!isServiceReady || isUpdatingPreferred}
                                  onClick={() =>
                                    manualPreferredAccountId === account.id
                                      ? clearPreferredAccount()
                                      : setPreferredAccount(account.id)
                                  }
                                >
                                  <Pin className="h-4 w-4" />
                                  {manualPreferredAccountId === account.id
                                    ? t("取消优先")
                                    : t("设为优先")}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2"
                                  disabled={
                                    !isServiceReady ||
                                    isUpdatingStatusAccountId === account.id
                                  }
                                  onClick={() =>
                                    toggleAccountStatus(
                                      account.id,
                                      statusAction.enable,
                                      account.status,
                                    )
                                  }
                                >
                                  <StatusActionIcon className="h-4 w-4" />
                                  {statusAction.label}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="gap-2"
                                  onClick={() =>
                                    router.push(
                                      buildStaticRouteUrl(
                                        "/logs",
                                        `?query=${encodeURIComponent(account.id)}`,
                                      ),
                                    )
                                  }
                                >
                                  <ExternalLink className="h-4 w-4" /> {t("详情与日志")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="gap-2 text-red-500"
                                  disabled={!isServiceReady}
                                  onClick={() => handleDeleteSingle(account)}
                                >
                                  <Trash2 className="h-4 w-4" /> {t("删除")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-2">
        <div className="text-xs text-muted-foreground">
          {t("共 {count} 个账号", { count: filteredAccounts.length })}
          {effectiveSelectedIds.length > 0 ? (
            <span className="ml-1 text-primary">
              ({t("已选择 {count} 个", { count: effectiveSelectedIds.length })})
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              {t("每页显示")}
            </span>
            <Select value={pageSize} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="h-8 w-[70px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["5", "10", "20", "50", "100", "500"].map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              {t("上一页")}
            </Button>
            <div className="min-w-[60px] text-center text-xs font-medium">
              {t("第 {page} / {totalPages} 页", {
                page: safePage,
                totalPages,
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
              disabled={safePage >= totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            >
              {t("下一页")}
            </Button>
          </div>
        </div>
      </div>

      {addAccountModalOpen ? (
        <AddAccountModal
          open={isPageActive && addAccountModalOpen}
          onOpenChange={setAddAccountModalOpen}
        />
      ) : null}
      <UsageModal
        account={selectedAccount}
        open={isPageActive && usageModalOpen}
        onOpenChange={(open) => {
          setUsageModalOpen(open);
          if (!open) {
            setSelectedAccountId("");
          }
        }}
        onRefresh={refreshAccount}
        isRefreshing={
          isRefreshingAllAccounts ||
          (!!selectedAccount && isRefreshingAccountId === selectedAccount.id)
        }
      />
      <ConfirmDialog
        open={isPageActive && Boolean(deleteDialogState)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteDialogState(null);
          }
        }}
        title={
          deleteDialogState?.kind === "single" ? "删除账号" : "批量删除账号"
        }
        description={
          deleteDialogState?.kind === "single"
            ? t("确定删除账号 {name} 吗？删除后不可恢复。", {
                name: deleteDialogState.account.name,
              })
            : t("确定删除选中的 {count} 个账号吗？删除后不可恢复。", {
                count: deleteDialogState?.count || 0,
              })
        }
        confirmText="删除"
        confirmVariant="destructive"
        onConfirm={handleConfirmDelete}
      />
      <Dialog
        open={isPageActive && Boolean(accountEditorState)}
        onOpenChange={(open) => {
          if (!open && !isUpdatingProfileAccountId) {
            setAccountEditorState(null);
          }
        }}
      >
        <DialogContent className="glass-card border-none sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>{t("编辑账号信息")}</DialogTitle>
            <DialogDescription>
              {accountEditorState
                ? t("修改 {name} 的名称、标签、备注与排序。", {
                    name: accountEditorState.accountName,
                  })
                : t("修改账号的基础资料。")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="account-label-input">{t("账号名称")}</Label>
                <Input
                  id="account-label-input"
                  value={labelDraft}
                  disabled={Boolean(isUpdatingProfileAccountId)}
                  onChange={(event) => setLabelDraft(event.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="account-tags-input">{t("标签（逗号分隔）")}</Label>
                <Input
                  id="account-tags-input"
                  value={tagsDraft}
                  disabled={Boolean(isUpdatingProfileAccountId)}
                  onChange={(event) => setTagsDraft(event.target.value)}
                  placeholder={t("例如：高频, 团队A")}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="account-note-input">{t("备注")}</Label>
              <Textarea
                id="account-note-input"
                value={noteDraft}
                disabled={Boolean(isUpdatingProfileAccountId)}
                onChange={(event) => setNoteDraft(event.target.value)}
                placeholder={t("例如：主账号 / 测试号 / 团队共享")}
                className="min-h-[108px]"
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_120px] sm:items-end">
              <div className="grid gap-2">
                <Label htmlFor="account-sort-input">{t("顺序值")}</Label>
                <Input
                  id="account-sort-input"
                  type="number"
                  min={0}
                  step={1}
                  value={sortDraft}
                  disabled={Boolean(isUpdatingProfileAccountId)}
                  onChange={(event) => setSortDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleConfirmAccountEditor();
                    }
                  }}
                />
              </div>
              <div className="grid gap-1 rounded-xl bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
                <span>{t("值越小越靠前")}</span>
                <span>{t("仅修改当前账号")}</span>
              </div>
            </div>
            <div className="grid gap-3 rounded-xl bg-muted/20 px-3 py-3 text-[11px] text-muted-foreground sm:grid-cols-2">
              <div className="space-y-1">
                <div>{t("账号 ID")}</div>
                <div className="break-all font-mono">
                  {accountEditorState?.accountId || "-"}
                </div>
              </div>
              <div className="space-y-1">
                <div>{t("账号类型")}</div>
                <div className="font-medium text-foreground/80">
                  {currentEditingAccount
                    ? formatAccountPlanLabel(currentEditingAccount, t) || t("未知")
                    : t("未知")}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              disabled={Boolean(isUpdatingProfileAccountId)}
              onClick={() => setAccountEditorState(null)}
            >
              {t("取消")}
            </Button>
            <Button
              disabled={Boolean(isUpdatingProfileAccountId)}
              onClick={() => void handleConfirmAccountEditor()}
            >
              {t("保存")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
