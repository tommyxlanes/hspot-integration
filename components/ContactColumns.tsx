"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HubSpotContact } from "@/types/hubspot";

export const contactColumns: ColumnDef<HubSpotContact>[] = [
  {
    accessorKey: "properties.firstname",
    header: "First Name",
    cell: ({ row }) => row.original.properties.firstname ?? "-",
  },
  {
    accessorKey: "properties.lastname",
    header: "Last Name",
    cell: ({ row }) => row.original.properties.lastname ?? "-",
  },
  {
    accessorKey: "properties.email",
    header: "Email",
    cell: ({ row }) => row.original.properties.email ?? "-",
  },
  {
    accessorKey: "properties.company",
    header: "Company",
    cell: ({ row }) => row.original.properties.company ?? "-",
  },
  {
    accessorKey: "properties.city",
    header: "City",
    cell: ({ row }) => row.original.properties.city ?? "-",
  },
];
