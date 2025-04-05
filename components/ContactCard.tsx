import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HubSpotContact } from "@/types/hubspot";

export function ContactCard({ contact }: { contact: HubSpotContact }) {
  const { firstname, lastname, email, company, address, city, state, zip } =
    contact.properties;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {firstname ?? "First"} {lastname ?? "Last"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{email ?? "No email"}</p>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        {company && (
          <p>
            <span className="font-medium">Company:</span> {company}
          </p>
        )}
        <p>
          <span className="font-medium">Address:</span>{" "}
          {[address, city, state, zip].filter(Boolean).join(", ") || "N/A"}
        </p>
      </CardContent>
    </Card>
  );
}
