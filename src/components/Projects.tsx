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
    <section className="root-page" data-page="projects">
      <div className="page-header">
        {breadcrumbs}
        <h1>Projects & Case Studies</h1>
      </div>
      <p className="root-lead-p">
        Here you will find selected projects resulting from Minga's consulting
        and initiative work.
      </p>
      <p>
        Each project reflects a specific context, constraint, and collaboration
        rather than a repeatable formula. Some projects begin as services,
        others evolve into long-term community efforts. What connects them is a
        shared focus on systems that support people over time.
      </p>

      <div className="projects-list" role="list">
        {PROJECTS.map((project) => (
          <article
            className="glassy detail-related-card"
            key={project.id}
            role="listitem"
            onClick={() => onSelect(project.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="detail-related-icon" aria-hidden>
              <img src={project.iconPath} alt="" />
            </div>
            <div className="detail-related-content">
              <h4>{project.title}</h4>
              <div className="detail-related-desc-area">
                <div className="detail-related-tags">
                  {project.services.map((s) => (
                    <p key={s}>{s}</p>
                  ))}
                </div>
                <p className="detail-related-hover-desc">
                  {project.description}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="detail-related-view-link"
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
