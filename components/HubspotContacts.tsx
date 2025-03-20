"use client";
import { useEffect, useState } from "react";
import { fetchHubSpotContacts, HubSpotContact } from "@/lib/useHubspot";

export default function HubSpotContacts() {
  const [contacts, setContacts] = useState<HubSpotContact[] | null>(null);

  useEffect(() => {
    async function getContacts() {
      const data = await fetchHubSpotContacts();
      setContacts(data);
    }

    getContacts();
  }, []);

  return (
    <div>
      <h2>HubSpot Contacts</h2>
      {contacts ? (
        <ul>
          {contacts.map((contact) => (
            <li key={contact.id}>
              {contact.properties.firstname} {contact.properties.lastname} -{" "}
              {contact.properties.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading contacts...</p>
      )}
    </div>
  );
}
