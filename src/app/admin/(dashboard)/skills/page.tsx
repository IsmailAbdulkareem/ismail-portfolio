import type { Metadata } from "next";
import {
  createSkill,
  createSkillGroup,
  deleteSkill,
  deleteSkillGroup,
  updateSkill,
  updateSkillGroup,
} from "@/app/admin/actions/skills";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { InlineForm, type InlineField } from "@/components/admin/InlineForm";
import { EmptyState, PageHeader } from "@/components/admin/PageHeader";
import { requireAdmin } from "@/lib/auth";
import type { SkillGroup } from "@/lib/types";

export const metadata: Metadata = { title: "Skills" };

const GROUP_FIELDS: InlineField[] = [
  { name: "category", label: "Category", placeholder: "Category", required: true, maxLength: 60 },
  { name: "sort_order", label: "Sort order", type: "number", placeholder: "0", mono: true },
];
const GROUP_COLUMNS = "grid-cols-[minmax(0,1fr)_5rem] sm:grid-cols-[minmax(0,1fr)_6rem_auto]";

const SKILL_FIELDS: InlineField[] = [
  { name: "name", label: "Skill name", placeholder: "Name", required: true, maxLength: 60 },
  {
    name: "icon_slug",
    label: "Icon slug",
    placeholder: "icon slug",
    hint: "Optional simple-icons slug, e.g. nextdotjs",
    maxLength: 60,
    mono: true,
  },
  { name: "sort_order", label: "Sort order", type: "number", placeholder: "0", mono: true },
];
const SKILL_COLUMNS = "grid-cols-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_5rem_auto]";

export default async function SkillsPage() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("skill_groups")
    .select("id, category, sort_order, skills (id, name, icon_slug, sort_order)")
    .order("sort_order")
    .order("sort_order", { referencedTable: "skills" });
  if (error) throw new Error(`Failed to load skills: ${error.message}`);
  const groups = data as SkillGroup[];

  return (
    <>
      <PageHeader title="Skills" description="Grouped skills shown in the About section. Icons use simple-icons slugs." />

      <div className="grid gap-4">
        {groups.length === 0 ? <EmptyState>No skill groups yet. Add one below.</EmptyState> : null}

        {groups.map((group) => (
          <section key={group.id} className="rounded-xl border border-white/[0.08] bg-surface/60">
            <div className="border-b border-white/[0.06] p-4">
              <InlineForm
                action={updateSkillGroup}
                idPrefix={`group-${group.id}`}
                fields={GROUP_FIELDS}
                defaults={{ category: group.category, sort_order: String(group.sort_order) }}
                hidden={{ id: group.id }}
                submitLabel="Save"
                columns={GROUP_COLUMNS}
                actions={
                  <ConfirmDeleteButton
                    action={deleteSkillGroup}
                    id={group.id}
                    confirmMessage={`Delete "${group.category}" and its ${group.skills.length} skills?`}
                    label="Delete group"
                  />
                }
              />
            </div>

            <div className="grid gap-2 p-4">
              <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                {group.skills.length} {group.skills.length === 1 ? "skill" : "skills"}
              </p>
              {group.skills.map((skill) => (
                <InlineForm
                  key={skill.id}
                  action={updateSkill}
                  idPrefix={`skill-${skill.id}`}
                  fields={SKILL_FIELDS}
                  defaults={{
                    name: skill.name,
                    icon_slug: skill.icon_slug ?? "",
                    sort_order: String(skill.sort_order),
                  }}
                  hidden={{ id: skill.id }}
                  submitLabel="Save"
                  columns={SKILL_COLUMNS}
                  actions={
                    <ConfirmDeleteButton action={deleteSkill} id={skill.id} confirmMessage={`Delete "${skill.name}"?`} />
                  }
                />
              ))}

              <div className="mt-2 rounded-lg border border-dashed border-white/[0.1] p-3">
                <InlineForm
                  action={createSkill}
                  idPrefix={`new-skill-${group.id}`}
                  fields={SKILL_FIELDS}
                  defaults={{ sort_order: String(group.skills.length) }}
                  hidden={{ group_id: group.id }}
                  submitLabel="Add skill"
                  columns={SKILL_COLUMNS}
                  showLabels
                />
              </div>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-medium">Add group</h2>
        <div className="rounded-xl border border-white/[0.08] bg-surface/60 p-4">
          <InlineForm
            action={createSkillGroup}
            idPrefix="new-group"
            fields={GROUP_FIELDS}
            defaults={{ sort_order: String(groups.length) }}
            submitLabel="Add group"
            columns={GROUP_COLUMNS}
            showLabels
          />
        </div>
      </section>
    </>
  );
}
