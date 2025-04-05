// components/nav-main.tsx
"use client";

import { Input } from "@/components/ui/input";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconCirclePlusFilled,
  IconMail,
  IconSearch,
  type Icon,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export function NavMain({
  items,
  query,
  setQuery,
  runSearch,
  isPending,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  query: string;
  setQuery: (val: string) => void;
  runSearch: () => void;
  isPending: boolean;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {/* 🔍 Search Input + Button */}
        <div className="flex items-center gap-2 px-3">
          <Input
            placeholder="Search store..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-sm flex-1"
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
          />
          <Button
            size="icon"
            variant="outline"
            onClick={runSearch}
            disabled={isPending}
          >
            <IconSearch className="w-4 h-4" />
          </Button>
        </div>

        {/* ➕ Quick Create */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="cursor-pointer bg-primary text-primary-foreground hover:text-white hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* 🔗 Nav Items */}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                className="cursor-pointer"
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
