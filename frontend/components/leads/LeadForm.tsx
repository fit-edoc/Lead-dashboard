"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLeadStore, Lead } from "@/store/leadStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const leadSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  status: z.enum(["New", "Contacted", "Qualified", "Lost"]),
  source: z.enum(["Website", "Instagram", "Referral"]),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export function LeadForm({ initialData, onSuccess }: { initialData?: Lead | null, onSuccess: () => void }) {
  const { createLead, updateLead } = useLeadStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      status: (initialData?.status as any) || "New",
      source: (initialData?.source as any) || "Website",
    }
  });

  const onSubmit = async (data: LeadFormValues) => {
    setLoading(true);
    try {
      if (initialData) {
        await updateLead(initialData._id, data);
        toast.success("Lead updated successfully");
      } else {
        await createLead(data);
        toast.success("Lead created successfully");
      }
      onSuccess();
    } catch (error) {
      // Error is handled in store, sonner will not be shown here unless thrown
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Lead Name" {...register("name")} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="email@example.com" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          onValueChange={(val) => setValue("status", val as any)} 
          defaultValue={initialData?.status || "New"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="source">Source</Label>
        <Select 
          onValueChange={(val) => setValue("source", val as any)} 
          defaultValue={initialData?.source || "Website"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Website">Website</SelectItem>
            <SelectItem value="Instagram">Instagram</SelectItem>
            <SelectItem value="Referral">Referral</SelectItem>
          </SelectContent>
        </Select>
        {errors.source && <p className="text-sm text-red-500">{errors.source.message}</p>}
      </div>
      
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? "Saving..." : "Save Lead"}
        </Button>
      </div>
    </form>
  );
}
