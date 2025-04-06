import {
  fetchContactProperties,
  fetchHubSpotContacts,
} from "./actions/actions";

export default async function Home() {
  const properties = await fetchContactProperties();
  const contacts = await fetchHubSpotContacts();

  if (!properties.success) {
    return <div>Error: {properties.error}</div>;
  }

  if (!contacts.success) {
    return <div>Error: {contacts.error}</div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Welcome
    </div>
  );
}
