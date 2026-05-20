"use client";

import { useAuthStore } from "@/store/authStore";
import { useLeadStore, Lead } from "@/store/leadStore";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export function LeadTable({ 
  leads, 
  loading, 
  onEdit, 
  page, 
  totalPages, 
  onPageChange 
}: { 
  leads: Lead[]; 
  loading: boolean; 
  onEdit: (lead: Lead) => void;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
  const { user } = useAuthStore();
  const { deleteLead, fetchLeads } = useLeadStore();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(id);
        toast.success("Lead deleted successfully");
        fetchLeads(); // Reload current page
      } catch (error) {
        // Error handled in store
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "New": return "default";
      case "Contacted": return "secondary";
      case "Qualified": return "success";
      case "Lost": return "destructive";
      default: return "default";
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">Loading leads...</TableCell>
            </TableRow>
          ) : leads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">No leads found. Adjust filters or add a new lead.</TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(lead.status) as any}>{lead.status}</Badge>
                </TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell>{format(new Date(lead.createdAt), 'MMM dd, yyyy')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-8 w-8 p-0 items-center justify-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(lead)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      {user?.role === "Admin" && (
                        <DropdownMenuItem onClick={() => handleDelete(lead._id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {!loading && leads.length > 0 && totalPages > 1 && (
        <div className="py-4 flex justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(Math.max(1, page - 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm px-4">Page {page} of {totalPages}</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
