"use server";

import {
  HubSpotContactResult,
  HubSpotFieldsResult,
  HubSpotContact,
} from "@/types/hubspot";

export async function fetchHubSpotContacts(): Promise<HubSpotContactResult> {
  const baseUrl = process.env.HUBSPOT_API_BASE;
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!baseUrl || !token) {
    return {
      success: false,
      error: "Missing HUBSPOT_API_BASE or HUBSPOT_ACCESS_TOKEN",
    };
  }

  const fullUrl = `${baseUrl}/crm/v3/objects/contacts?limit=100&properties=firstname,lastname,email,company,city,state,zip,address`;

  try {
    const res = await fetch(fullUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        success: false,
        error: `HubSpot error: ${res.status} - ${text}`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      contacts: data.results,
    };
  } catch (err) {
    return {
      success: false,
      error: (err as Error).message,
    };
  }
}

export async function fetchAllContactFields(): Promise<HubSpotFieldsResult> {
  const baseUrl = process.env.HUBSPOT_API_BASE;
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

  if (!baseUrl || !token) {
    return {
      success: false,
      error: "Missing HUBSPOT_API_BASE or HUBSPOT_ACCESS_TOKEN",
    };
  }

  const fullUrl = `${baseUrl}/crm/v3/properties/contacts`;

  try {
    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Error fetching contact fields: ${response.status} - ${errorText}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      fields: data.results,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}

export async function searchContactsByCompany(
  company: string
): Promise<HubSpotContact[]> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  const baseUrl = process.env.HUBSPOT_API_BASE;

  const url = `${baseUrl}/crm/v3/objects/contacts/search`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "company",
              operator: "CONTAINS_TOKEN",
              value: company,
            },
          ],
        },
      ],
      properties: ["firstname", "lastname", "email", "company"],
      limit: 10,
    }),
  });

  const data = await response.json();
  return data.results ?? [];
}

export async function fetchHubSpotContactsPaginated(limit = 10, after = "") {
  const baseUrl = process.env.HUBSPOT_API_BASE;
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

  const url = `${baseUrl}/crm/v3/objects/contacts?limit=${limit}${
    after ? `&after=${after}` : ""
  }&properties=firstname,lastname,email,company`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch paginated contacts");
  }

  const data = await response.json();

  return {
    results: data.results,
    paging: data.paging?.next?.after ?? null,
  };
}

// actions/actions.ts
export async function fetchHubSpotContactsTotalCount(): Promise<number> {
  const baseUrl = process.env.HUBSPOT_API_BASE;
  const token = process.env.HUBSPOT_ACCESS_TOKEN;

  const url = `${baseUrl}/crm/v3/objects/contacts?limit=1`; // Only need one item

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch total count");
  }

  const data = await response.json();

  // HubSpot doesn't give a true total, but we can *approximate* using paging
  // If your account has a Pro+ plan you may use `/search` with a blank filter + count

  // OPTION 1: use paging.next.after + count fetched so far
  // OPTION 2: if you really want a reliable total, use /search instead:
  // `/crm/v3/objects/contacts/search` with filterGroups: [] and get `total` from response

  return data.total ?? 0;
}
