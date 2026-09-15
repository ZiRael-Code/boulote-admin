import axiosInstance from "../axios-config";

type ProfessionWithSkills = {
  id: number;
  name: string;
  professionSkills: { id: number; name: string }[];
};

// Job "category" filtering matches against Project.requiredSkills, which is
// populated from this same skill catalog — flatten it into one deduped list
// so the dropdown options actually match what's filterable server-side.
export async function getJobCategoryOptions(): Promise<string[]> {
  const response = await axiosInstance.get<ProfessionWithSkills[]>(
    "/profession/getProfessionsWithSkills",
  );
  const skills = new Set<string>();
  for (const profession of response.data) {
    for (const skill of profession.professionSkills ?? []) {
      if (skill.name) skills.add(skill.name);
    }
  }
  return Array.from(skills).sort((a, b) => a.localeCompare(b));
}
