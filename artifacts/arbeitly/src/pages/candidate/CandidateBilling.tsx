import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReceiptText, Download, CreditCard } from "lucide-react";
import { useCustomers } from "@/context/CustomersContext";
import { useTransactions, type Transaction } from "@/context/TransactionsContext";

const statusColors: Record<string, string> = {
  paid:      "bg-green-500/10 text-green-400 border-green-400/20",
  pending:   "bg-yellow-500/10 text-yellow-400 border-yellow-400/20",
  refunded:  "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-secondary text-muted-foreground",
};

const formatDate = (iso: string) => {
  try { return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return iso; }
};

const generateInvoiceHtml = (t: Transaction, customerName: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a2e; margin: 0; padding: 0; }
    .page { max-width: 680px; margin: 0 auto; padding: 48px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; border-bottom: 2px solid #0ea5e9; padding-bottom: 24px; }
    .brand { font-size: 1.6rem; font-weight: 700; color: #0ea5e9; }
    .invoice-label { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; }
    .invoice-id { font-size: 1rem; font-weight: 600; color: #0f172a; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; margin-bottom: 8px; }
    .field-label { font-size: 0.8rem; color: #64748b; margin-bottom: 2px; }
    .field-value { font-size: 0.95rem; font-weight: 500; color: #0f172a; }
    .amount-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 24px; margin: 32px 0; }
    .amount-label { font-size: 0.8rem; color: #0284c7; font-weight: 500; margin-bottom: 4px; }
    .amount-value { font-size: 2rem; font-weight: 700; color: #0ea5e9; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 600; background: #dcfce7; color: #16a34a; text-transform: capitalize; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e2e8f0; font-size: 0.8rem; color: #94a3b8; text-align: center; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px 0; vertical-align: top; }
    td:last-child { text-align: right; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand">Arbeitly</div>
      <div style="text-align:right">
        <div class="invoice-label">Invoice</div>
        <div class="invoice-id">#${t.id.slice(0, 8).toUpperCase()}</div>
        <div style="font-size:0.8rem;color:#64748b;margin-top:4px">${formatDate(t.date)}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px" class="section">
      <div>
        <div class="section-title">Billed To</div>
        <div class="field-value">${customerName}</div>
      </div>
      <div>
        <div class="section-title">Payment Method</div>
        <div class="field-value" style="text-transform:capitalize">${t.method}</div>
      </div>
    </div>

    <div class="amount-box">
      <div class="amount-label">Amount Paid</div>
      <div class="amount-value">${t.amount}</div>
      <div style="margin-top:8px"><span class="status-badge">${t.status}</span></div>
    </div>

    <div class="section">
      <div class="section-title">Line Items</div>
      <table>
        <tr style="border-bottom:1px solid #e2e8f0">
          <td style="padding-bottom:12px;font-weight:600;color:#0f172a">${t.planName} Plan</td>
          <td style="padding-bottom:12px;font-weight:600;color:#0f172a">${t.amount}</td>
        </tr>
        <tr>
          <td style="padding-top:12px;color:#64748b">Total</td>
          <td style="padding-top:12px;font-weight:700;font-size:1.1rem;color:#0ea5e9">${t.amount}</td>
        </tr>
      </table>
    </div>

    ${t.notes ? `<div class="section"><div class="section-title">Notes</div><div style="font-size:0.85rem;color:#475569">${t.notes}</div></div>` : ""}

    <div class="footer">
      Arbeitly — Thank you for your business.<br>
      Transaction ID: ${t.id}
    </div>
  </div>
</body>
</html>`;

export default function CandidateBilling() {
  const { currentCustomer } = useCustomers();
  const { transactions } = useTransactions();

  const myTransactions = useMemo(() => {
    if (!currentCustomer) return [];
    return transactions
      .filter((t) => t.candidateId === currentCustomer.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, currentCustomer]);

  const totalPaid = useMemo(() =>
    myTransactions
      .filter((t) => t.status === "paid")
      .reduce((sum, t) => {
        const n = parseFloat(t.amount.replace(/[^0-9.]/g, ""));
        return sum + (isNaN(n) ? 0 : n);
      }, 0),
    [myTransactions]
  );

  const downloadInvoice = (t: Transaction) => {
    const html = generateInvoiceHtml(t, currentCustomer?.fullName ?? "");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.setTimeout(() => win.print(), 400);
  };

  if (!currentCustomer) return null;

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground">Your payment history and invoices</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground">Current Plan</p>
            </div>
            <p className="font-display text-lg font-bold text-primary">{currentCustomer.planName}</p>
            <p className="text-sm text-muted-foreground">{currentCustomer.planPrice}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <ReceiptText className="h-4 w-4 text-green-400" />
              <p className="text-xs text-muted-foreground">Total Paid</p>
            </div>
            <p className="font-display text-lg font-bold text-card-foreground">
              €{totalPaid.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted-foreground">{myTransactions.filter((t) => t.status === "paid").length} payment{myTransactions.filter((t) => t.status === "paid").length !== 1 ? "s" : ""}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quota Usage card — paid users only */}
      {currentCustomer.planType === "paid" && (currentCustomer.applicationQuota ?? 0) > 0 && (() => {
        const used = currentCustomer.applicationsUsed ?? 0;
        const quota = currentCustomer.applicationQuota ?? 0;
        const pct = Math.min(100, Math.round((used / quota) * 100));
        return (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Application Quota
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Arbeitly-submitted applications</span>
                <span className={`text-xs font-semibold tabular-nums ${pct >= 90 ? "text-destructive" : "text-card-foreground"}`}>
                  {used} / {quota}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-yellow-400" : "bg-primary"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {quota - used > 0
                  ? `${quota - used} application${quota - used !== 1 ? "s" : ""} remaining this period.`
                  : "Quota reached for this period."}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Only Arbeitly-submitted applications count toward your quota. Self-added applications are always free.</p>
            </CardContent>
          </Card>
        );
      })()}

      {/* Transactions table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base flex items-center gap-2">
            <ReceiptText className="h-4 w-4" /> Payment History
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {myTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-muted-foreground gap-3">
              <ReceiptText className="h-10 w-10 opacity-20" />
              <p className="text-sm font-medium text-card-foreground">No payments found</p>
              <p className="text-xs text-center max-w-xs">Your payment history will appear here once a transaction is recorded. If you believe this is an error, please reach out.</p>
              <Button variant="outline" size="sm" className="mt-1 rounded-full text-xs h-8" onClick={() => {}}>Contact Support</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    {["Date", "Plan", "Amount", "Method", "Status", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myTransactions.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(t.date)}</td>
                      <td className="px-4 py-3 font-medium text-card-foreground text-sm">{t.planName}</td>
                      <td className="px-4 py-3 font-semibold text-card-foreground">{t.amount}</td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-xs text-muted-foreground">{t.method}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-[11px] font-medium border capitalize ${statusColors[t.status] ?? ""}`} variant="outline">
                          {t.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {t.status === "paid" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 text-xs"
                            onClick={() => downloadInvoice(t)}
                          >
                            <Download className="h-3.5 w-3.5" /> Invoice
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
