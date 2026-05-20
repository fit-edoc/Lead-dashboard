"use client"

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useLeadStore } from "@/store/leadStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadTable } from "@/components/leads/LeadTable";
import { LeadForm } from "@/components/leads/LeadForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut, Plus, Download, Moon, Sun } from "lucide-react";

import { exportToCSV } from "@/lib/utils";

// Custom debounce
const useDebounce = (callback: Function, delay: number) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  return useCallback((...args: any) => {
    if (timer) clearTimeout(timer);
    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);
    setTimer(newTimer);
  }, [callback, delay, timer]);
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { leads, pagination, loading, fetchLeads } = useLeadStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  // Dark mode
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router, mounted]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      setIsDark(document.documentElement.classList.contains("dark"));
    }
  }, []);

  const toggleDarkMode = () => {
    const isDarkNow = document.documentElement.classList.toggle("dark");
    setIsDark(isDarkNow);
  };

  const loadLeads = () => {
    fetchLeads({
      search,
      status: status === "all" ? "" : status,
      source: source === "all" ? "" : source,
      sort,
      page,
    });
  };

  useEffect(() => {
    loadLeads();
  }, [status, source, sort, page]);

  // Debounced search
  const debouncedSearch = useDebounce((val: string) => {
    setSearch(val);
    setPage(1);
  }, 500);

  useEffect(() => {
    loadLeads();
  }, [search]); // Runs when debounced search updates

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleExport = () => {
    // Export current leads (or fetch all if needed, but requirements imply exporting table data)
    exportToCSV(leads, "leads_export.csv");
  };

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads Dashboard</h1>
            <p className="text-sm text-zinc-500">Welcome back, {user?.name} ({user?.role})</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={toggleDarkMode}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-1 gap-4 flex-wrap w-full">
            <Input
              placeholder="Search Name or Email..."
              className="max-w-[200px]"
              onChange={handleSearchChange}
            />
            <Select value={status} onValueChange={(val) => { setStatus(val as string); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={source} onValueChange={(val) => { setSource(val as string); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={(val) => { setSort(val as string); setPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
            <Button onClick={() => { setSelectedLead(null); setIsFormOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Lead
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <LeadTable
            leads={leads}
            loading={loading}
            onEdit={(lead) => { setSelectedLead(lead); setIsFormOpen(true); }}
            page={pagination.page}
            totalPages={pagination.pages}
            onPageChange={setPage}
          />
        </div>

        {/* Lead Form Modal */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedLead ? "Edit Lead" : "Create Lead"}</DialogTitle>
            </DialogHeader>
            <LeadForm
              initialData={selectedLead}
              onSuccess={() => { setIsFormOpen(false); loadLeads(); }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
