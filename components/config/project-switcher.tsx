"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Project {
  id: string;
  name: string;
}

interface ProjectSwitcherProps {
  projects: Project[];
  currentProjectId: string;
}

export function ProjectSwitcher({
  projects,
  currentProjectId,
}: ProjectSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("projectId", value);
    router.push(`/config?${params.toString()}`);
  };

  return (
    <Select
      value={currentProjectId || undefined}
      onValueChange={handleValueChange}
    >
      <SelectTrigger
        id="project-switcher"
        className="w-full min-w-0 sm:w-[300px]"
      >
        <SelectValue placeholder="Select a project" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            {project.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
