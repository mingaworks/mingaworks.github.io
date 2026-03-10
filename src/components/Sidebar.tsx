import { forwardRef, useMemo, useState } from "react";
import Icon from "./Icon";

type Branch = { id: string; label?: string };

type Props = {
  branches: Branch[];
  breadcrumb: string[];
  onClick: (id: string) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  collapsed: boolean;
};

type MenuChild = {
  id: string;
  label: string;
};

type MenuEntry = {
  id: string;
  label: string;
  iconName: string;
  children?: MenuChild[];
};

const BASE_CHILDREN: MenuChild[] = [
  { id: "about", label: "About" },
  { id: "waitlist", label: "Join" },
  { id: "contact", label: "Contact" },
];

const WORKS_CHILDREN: MenuChild[] = [
  { id: "ops-automation", label: "Operational Architecture" },
  { id: "product-archt", label: "Product Architecture & Launch" },
  { id: "visual-identity", label: "Visual Identity & UX Design" },
  { id: "system-advisory", label: "Strategic Systems Advisory" },
];

const Sidebar = forwardRef<HTMLElement, Props>(function Sidebar(
  { branches, breadcrumb, onClick, onMouseEnter, onMouseLeave, collapsed },
  ref,
) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const worksBranch = useMemo(
    () => branches.find((branch) => branch.id === "works"),
    [branches],
  );

  const otherBranches = useMemo(
    () => branches.filter((branch) => branch.id !== "works"),
    [branches],
  );

  const menuEntries = useMemo<MenuEntry[]>(() => {
    const entries: MenuEntry[] = [
      {
        id: "base",
        label: ".home",
        iconName: "base",
        children: BASE_CHILDREN,
      },
    ];

    if (worksBranch) {
      entries.push({
        id: worksBranch.id,
        label: worksBranch.label ?? ".works",
        iconName: worksBranch.id,
        children: WORKS_CHILDREN,
      });
    }

    entries.push(
      ...otherBranches.map((branch) => ({
        id: branch.id,
        label: branch.label ?? branch.id,
        iconName: branch.id,
      })),
    );

    return entries;
  }, [otherBranches, worksBranch]);

  function toggleMenu(id: string) {
    setOpenMenuId((current) => (current === id ? null : id));
  }

  function closeMenuOnLeave(id: string) {
    setOpenMenuId((current) => (current === id ? null : current));
  }

  return (
    <aside
      ref={ref}
      className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}
      aria-label="Primary"
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => {
        setOpenMenuId(null);
        onMouseLeave();
      }}
    >
      <div className="sidebar-brand">
        <img src="/icons/mingaworks-border.svg" alt="Minga Works" />
      </div>
      <nav aria-label="Main menu">
        <ul className="sidebar-menu">
          {menuEntries.map((entry) => {
            const hasChildren = Boolean(entry.children?.length);
            const isOpen = openMenuId === entry.id;

            return (
              <li
                key={entry.id}
                className={`menu-item ${isOpen ? "open" : ""}`}
                onMouseLeave={
                  hasChildren ? () => closeMenuOnLeave(entry.id) : undefined
                }
              >
                <div className="menu-toggle">
                  <button
                    onClick={() => onClick(entry.id)}
                    className={breadcrumb[0] === entry.id ? "active" : ""}
                  >
                    <Icon
                      name={entry.iconName}
                      className="submenu-icon"
                      title={entry.label}
                    />
                    <span className="menu-label">{entry.label}</span>
                  </button>

                  {hasChildren ? (
                    <button
                      type="button"
                      className="collapse-toggle"
                      onClick={() => toggleMenu(entry.id)}
                      aria-label={`${isOpen ? "Collapse" : "Expand"} ${entry.label} menu`}
                      aria-expanded={isOpen}
                    >
                      <img
                        src="/icons/downarrow.svg"
                        alt=""
                        className="collapse-icon"
                        aria-hidden
                      />
                    </button>
                  ) : null}
                </div>

                {hasChildren ? (
                  <ul
                    className={`sub-menu ${isOpen ? "open" : ""}`}
                    aria-hidden={!isOpen}
                  >
                    {entry.children?.map((child) => (
                      <li key={child.id}>
                        <button onClick={() => onClick(child.id)}>
                          <span className="menu-label submenu-label">
                            {child.label}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
});

export default Sidebar;
