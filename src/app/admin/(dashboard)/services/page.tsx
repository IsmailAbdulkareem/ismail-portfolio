import type { Metadata } from "next";
import Link from "next/link";
import { deleteService } from "@/app/admin/actions/services";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { ServiceForm } from "@/components/admin/services/ServiceForm";
import { buttonClass } from "@/components/admin/button-styles";
import { requireAdmin } from "@/lib/auth";
import type { Service } from "@/lib/types";

export const metadata: Metadata = { title: "Services" };

export default async function ServicesPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("services")
    .select("id, title, description, flow, core, sort_order")
    .order("sort_order")
    .order("created_at");
  if (error) throw new Error(`Failed to load services: ${error.message}`);
  const services = data as Service[];

  return (
    <>
      <PageHeader
        title="Services"
        description="Shown on the home page and /services, in sort order."
        actions={
          <Link href="#add-service" className={buttonClass("primary")}>
            Add service
          </Link>
        }
      />

      <div className="grid gap-4">
        {services.length === 0 ? <EmptyState>No services yet. Add the first one below.</EmptyState> : null}
        {services.map((service) => (
          <ServiceForm
            key={service.id}
            service={service}
            actions={
              <ConfirmDeleteButton
                action={deleteService}
                id={service.id}
                confirmMessage={`Delete the "${service.title}" service?`}
              />
            }
          />
        ))}
      </div>

      <section id="add-service" className="mt-10">
        <h2 className="mb-3 text-sm font-medium">Add service</h2>
        <ServiceForm />
      </section>
    </>
  );
}
