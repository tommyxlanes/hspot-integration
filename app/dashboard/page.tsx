"use client";

import { useEffect, useState, useTransition } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { NavMain } from "@/components/nav-main";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { contactColumns } from "@/components/ContactColumns";
import {
  fetchHubSpotContacts,
  fetchHubSpotContactsPaginated,
  searchContactsByCompany,
  fetchHubSpotContactsTotalCount,
} from "@/app/actions/actions";
import { HubSpotContact } from "@/types/hubspot";
import { IconUsers, IconHome2, IconClipboardList } from "@tabler/icons-react";

import { PaginationControls } from "@/components/PaginationControl";

export default function DashboardPage() {
  const [contacts, setContacts] = useState<HubSpotContact[]>([]);
  const [query, setQuery] = useState("");
  const [prevStack, setPrevStack] = useState<string[]>([]);
  const [after, setAfter] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const pageSize = 10;

  const pageCount =
    totalCount && totalCount > 0 ? Math.ceil(totalCount / pageSize) : undefined; // ✅ use undefined instead of null

  const loadContacts = (afterCursor = "") => {
    startTransition(async () => {
      try {
        const res = await fetchHubSpotContactsPaginated(10, afterCursor);
        setContacts(res.results);
        setAfter(res.paging);

        if (afterCursor && !prevStack.includes(afterCursor)) {
          setPrevStack((prev) => [...prev, afterCursor]);
        }
      } catch (err) {
        console.error("Pagination error", err);
      }
    });
  };

  useEffect(() => {
    startTransition(async () => {
      const count = await fetchHubSpotContactsTotalCount();
      console.log("Total contacts from HubSpot:", count); // 👈 check this
      setTotalCount(count);
    });
  }, []);

  useEffect(() => {
    loadContacts(); // initial load
  }, []);

  const handleNextPage = () => {
    if (after) loadContacts(after);
  };

  const handlePrevPage = () => {
    const prev = [...prevStack];
    prev.pop(); // current
    const prevCursor = prev.pop(); // previous

    setPrevStack(prev);
    if (prevCursor) loadContacts(prevCursor);
    else loadContacts(); // go back to first page
  };

  const data = {
    navMain: [
      { title: "Dashboard", url: "#", icon: IconHome2 },
      { title: "Tasks", url: "#", icon: IconClipboardList },
      { title: "Team", url: "#", icon: IconUsers },
    ],
  };

  const runSearch = () => {
    if (query.length < 2) return;
    startTransition(async () => {
      const res = await searchContactsByCompany(query);
      setContacts(res); // 🔁 main display updates here
    });
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar>
        <NavMain
          items={data.navMain}
          query={query}
          setQuery={setQuery}
          runSearch={runSearch}
          isPending={isPending}
        />
      </AppSidebar>

      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-col gap-6 p-6">
          {isPending ? (
            <div className="w-full border rounded-md">
              <div className="grid grid-cols-5 gap-4 p-4 border-b">
                <Skeleton className="h-6 w-full col-span-1" />
                <Skeleton className="h-6 w-full col-span-1" />
                <Skeleton className="h-6 w-full col-span-1" />
                <Skeleton className="h-6 w-full col-span-1" />
                <Skeleton className="h-6 w-full col-span-1" />
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b">
                  <Skeleton className="h-4 w-full col-span-1" />
                  <Skeleton className="h-4 w-full col-span-1" />
                  <Skeleton className="h-4 w-full col-span-1" />
                  <Skeleton className="h-4 w-full col-span-1" />
                  <Skeleton className="h-4 w-full col-span-1" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <DataTable columns={contactColumns} data={contacts} />
              <PaginationControls
                page={prevStack.length + 1}
                pageCount={pageCount} // now number or undefined ✅
                onNext={handleNextPage}
                onPrev={handlePrevPage}
              />
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
