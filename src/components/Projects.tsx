import type { ReactNode } from "react";

type ProjectCard = {
  id: string;
  title: string;
  description: string;
  iconPath: string;
  services: string[];
};

type Props = {
  breadcrumbs: ReactNode;
  isSplit?: boolean;
  onSelect: (projectId: string) => void;
};

const PROJECTS: ProjectCard[] = [
  {
    id: "admin-scheduling-system",
    title: "Admin Scheduling System",
    description:
      "A scheduling system redesign focused on reducing cognitive load for administrators working across fragmented tools.",
    iconPath: "/icons/projects/admin-scheduling-system.svg",
    services: ["Operational Architecture", "Digital Infrastructure"],
  },
  {
    id: "fishnet-recycling",
    title: "Fishnet Recycling Management System",
    description:
      "A management system developed to support the collection, tracking, and reuse of discarded fishnets through community collaboration.",
    iconPath: "/icons/projects/fishnet-recycling.svg",
    services: ["Community Project", "Initiative-driven Project"],
  },
];

export default function Projects({ breadcrumbs, onSelect }: Props) {
  return (
    <section className="projects-page root-page">
      <div className="page-header">
        {breadcrumbs}
        <h1>Projects & Case Studies</h1>
      </div>
      <p className="projects-lead">
        Here you will find selected projects resulting from Minga's consulting
        and initiative work.
      </p>
      <p className="projects-intro">
        Each project reflects a specific context, constraint, and collaboration
        rather than a repeatable formula. Some projects begin as services,
        others evolve into long-term community efforts. What connects them is a
        shared focus on systems that support people over time.
      </p>

      <div className="projects-list" role="list">
        {PROJECTS.map((project) => (
          <article className="project-card" key={project.id} role="listitem">
            <div className="project-card-icon" aria-hidden>
              <img src={project.iconPath} alt="" />
            </div>
            <div className="project-card-content">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className="project-card-services">
                {project.services.map((s) => (
                  <span key={s} className="project-card-service-tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="project-card-link"
              onClick={() => onSelect(project.id)}
            >
              View case study
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
