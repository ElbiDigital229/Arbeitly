import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pencil, Trash2, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { useTransactions, type Transaction } from "@/context/TransactionsContext";
import { useCustomers } from "@/context/CustomersContext";

const statusColors: Record<string, string> = {
  paid:      "bg-green-500/10 text-green-400 border-green-400/20",
  pending:   "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",
  refunded:  "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-secondary text-muted-foreground",
};

const emptyForm = (): Omit<Transaction, "id"> => ({
  candidateId: "", candidateName: "",
  planId: "", planName: "", amount: "",
  date: new Date().toISOString().split("T")[0],
  method: "stripe", status: "paid",
});

export default function SuperAdminTransactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { customers } = useCustomers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialog, setDialog] = useState<{ open: boolean; id?: string; form: Omit<Transaction, "id"> }>({ open: false, form: emptyForm() });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter((t) =>
      (t.candidateName.toLowerCase().includes(q) || t.planName.toLowerCase().includes(q) || t.amount.toLowerCase().includes(q)) &&
      (statusFilter === "all" || t.status === statusFilter)
    );
  }, [transactions, search, statusFilter]);

  const totalRevenue = transactions.filter((t) => t.status === "paid").reduce((sum, t) => {
    const n = parseFloat(t.amount.replace(/[^0-9.]/g, ""));
    return sum + (isNaN(n) ? 0 : n);
  }, 0);

  const openAdd = () => setDialog({ open: true, form: emptyForm() });
  const openEdit = (t: Transaction) => {
    const { id, ...rest } = t;
    setDialog({ open: true, id, form: rest });
  };
  const closeDialog = () => setDialog({ open: false, form: emptyForm() });
  const setField = <K extends keyof Omit<Transaction, "id">>(k: K, v: Transaction[K]) =>
    setDialog((prev) => ({ ...prev, form: { ...prev.form, [k]: v } }));

  const handleSave = () => {
    if (dialog.id) updateTransaction(dialog.id, dialog.form);
    else addTransaction(dialog.form);
    closeDialog();
  };

  const handleDelete = (id: string) => { if (confirm("Delete this transaction?")) deleteTransaction(id); };

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return iso; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">Payment history across all customers</p>
        </div>
        <Button onClick={openAdd} className="rounded-full gap-2">
          <Plus className="h-4 w-4" /> Add Transaction
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="p-5">
          <p className="text-xs text-muted-foreground">Total Revenue</p>
          <p className="font-display text-2xl font-bold text-primary mt-1">€{totalRevenue.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <p className="font-display text-2xl font-bold mt-1">{transactions.filter((t) => t.status === "paid").length}</p>
        </CardContent></Card>
        <Card><CardContent className="p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <p className="text-xs text-muted-foreground">Refunded</p>
          </div>
          <p className="font-display text-2xl font-bold mt-1">{transactions.filter((t) => t.status === "refunded").length}</p>
        </CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input placeholder="Search transactions..." className="pl-9 h-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-36 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {["Date", "Candidate", "Plan", "Amount", "Method", "Status", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(t.date)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-card-foreground text-sm">{t.candidateName}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{t.planName}</td>
                  <td className="px-4 py-3 font-semibold text-card-foreground">{t.amount}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-xs text-muted-foreground">{t.method}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${statusColors[t.status] ?? ""}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(t)}>
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(t.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialog.open} onOpenChange={(o) => !o && closeDialog()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">{dialog.id ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Candidate</Label>
              <Select
                value={dialog.form.candidateId}
                onValueChange={(v) => {
                  const c = customers.find((x) => x.id === v);
                  setField("candidateId", v);
                  if (c) setField("candidateName", c.fullName);
                }}
              >
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select candidate" /></SelectTrigger>
                <SelectContent>
                  {customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Plan Name</Label>
                <Input className="mt-1.5" placeholder="e.g. Premium" value={dialog.form.planName} onChange={(e) => setField("planName", e.target.value)} />
              </div>
              <div>
                <Label>Amount</Label>
                <Input className="mt-1.5" placeholder="e.g. €499.00" value={dialog.form.amount} onChange={(e) => setField("amount", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input className="mt-1.5" type="date" value={dialog.form.date} onChange={(e) => setField("date", e.target.value)} />
              </div>
              <div>
                <Label>Method</Label>
                <Select value={dialog.form.method} onValueChange={(v) => setField("method", v as Transaction["method"])}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={dialog.form.status} onValueChange={(v) => setField("status", v as Transaction["status"])}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Input className="mt-1.5" placeholder="e.g. Manual bank transfer" value={dialog.form.notes ?? ""} onChange={(e) => setField("notes", e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSave} disabled={!dialog.form.candidateName || !dialog.form.amount}>{dialog.id ? "Save" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
