import { fetchAllContactFields, fetchHubSpotContacts } from "./actions/actions";
// import HubSpotContacts from "@/components/HubspotContacts";
import { HubSpotContact, HubSpotProperty } from "@/types/hubspot";

export default async function Home() {
  const result = await fetchHubSpotContacts();

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <HubSpotContacts contacts={result.contacts} />
      </main> */}
      Welcome
    </div>
  );
}
