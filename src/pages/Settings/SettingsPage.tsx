import * as Tabs from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/forms/FormField";

const tabs = ["Profile", "Team Management", "Roles & Permissions", "API Keys", "Billing", "Security"];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Settings" description="Configure workspace identity, access, billing, security, and integrations." />
      <Tabs.Root defaultValue={tabs[0]} className="grid gap-5 lg:grid-cols-[260px_1fr]">
        <Tabs.List className="glass-panel flex gap-1 overflow-x-auto rounded-lg p-2 lg:flex-col">
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab}
              className="whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-semibold text-muted data-[state=active]:bg-secondary/20 data-[state=active]:text-white"
            >
              {tab}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Content key={tab} value={tab}>
            <Card>
              <h3 className="text-lg font-bold">{tab}</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <FormField label="Name">
                  <Input placeholder={`${tab} setting`} />
                </FormField>
                <FormField label="Owner">
                  <Input placeholder="Operations admin" />
                </FormField>
                <FormField label="Policy">
                  <Input placeholder="Enterprise default" />
                </FormField>
                <FormField label="Status">
                  <Input placeholder="Enabled" />
                </FormField>
              </div>
              <Button className="mt-6">Save changes</Button>
            </Card>
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
}
