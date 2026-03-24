import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import treeData from "../data/tree.json";
const DATA = treeData as unknown as { base: TreeNode; branches: TreeNode[] };
import ContactUs from "./ContactUs";
import Breadcrumbs from "./Breadcrumbs";
import Sidebar from "./Sidebar";
import About from "./AboutUs";
import JoinUs from "./JoinUs";
import Works from "./Works";
import WorksDetail from "./WorksDetail";
import Initiative from "./Initiative";
import InitiativeDonate from "./InitiativeDonate";
import Projects from "./Projects";
import ProjectsDetail from "./ProjectsDetail";

const TOP_LEVEL_ROUTES = new Set(["base", "works", "initiative", "projects"]);

const BASE_DETAIL_IDS = new Set(["about", "join", "contact"]);

const WORKS_DETAIL_IDS = new Set([
  "ops-automation",
  "product-archt",
  "visual-identity",
  "system-advisory",
]);

const PROJECT_DETAIL_IDS = new Set([
  "admin-scheduling-system",
  "fishnet-recycling",
]);

const CAROUSEL_IDS = new Set([
  "carousel-operational-map",
  "carousel-before-state",
  "carousel-before-workflow",
  "carousel-after-workflow",
  "carousel-high-identity-ui",
]);

const CAROUSEL_DATA: Record<string, { title: string; images: string[] }> = {
  "carousel-operational-map": {
    title: "Operational Map",
    images: [
      "https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780570/brainstorm-operational-map_viasle.png",
    ],
  },
  "carousel-before-state": {
    title: "Before State",
    images: [
      "https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780578/brainstorm-before-state_sar1km.png",
    ],
  },
  "carousel-before-workflow": {
    title: "Before Workflow",
    images: [
      "https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780572/brainstorm-before-workflow_b6m8df.png",
    ],
  },
  "carousel-after-workflow": {
    title: "After Workflow",
    images: [
      "https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780573/brainstorm-after-workflow_yh7jrq.png",
    ],
  },
  "carousel-high-identity-ui": {
    title: "High Identity UI",
    images: [
      "https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780571/brainstorm-ui-1_zxm4sa.png",
      "https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780571/brainstorm-ui-2_iadknn.png",
      "https://res.cloudinary.com/dp1lnbar5/image/upload/v1772780575/brainstorm-ui-3_wmrrze.png",
    ],
  },
};

type ValueItem = {
  title: string;
  desc?: string;
};

type TeamMember = {
  name: string;
  role?: string;
  bio?: string;
  avatar?: string;
};

type Collaborate = {
  title?: string;
  text?: string;
  cta?: { label?: string; href?: string };
};

type TreeNode = {
  id: string;
  label?: string;
  title?: string;
  content?: string;
  summary?: string;
  children?: TreeNode[];
  intro?: string[];
  values?: ValueItem[];
  vision?: string;
  team?: TeamMember[];
  collaborate?: Collaborate;
};

type Node = TreeNode;

const CUSTOM_PAGES: Record<
  string,
  { label: string; kind: "about" | "waitlist" | "contact" | "donate" }
> = {
  about: { label: "About Us", kind: "about" },
  waitlist: { label: "Join Us", kind: "waitlist" },
  join: { label: "Join Us", kind: "waitlist" },
  contact: { label: "Contact us", kind: "contact" },
  donate: { label: "Donate", kind: "donate" },
};

function findBranchById(id: string): Node | undefined {
  return DATA.branches.find((b: Node) => b.id === id);
}

function findNodeById(id: string, nodes?: Node[]): Node | undefined {
  if (!nodes) return undefined;
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const sub = findNodeById(id, n.children);
      if (sub) return sub;
    }
  }
  return undefined;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

function deriveBasePath(pathname: string): string {
  const normalized = normalizePath(pathname);
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) return "";
  // 3-segment carousel URLs like /projects/admin-scheduling-system/carousel-operational-map
  if (segments.length >= 3) {
    const maybeCarousel = segments[segments.length - 1];
    const maybeDetail = segments[segments.length - 2];
    const maybeTop = segments[segments.length - 3];
    if (
      TOP_LEVEL_ROUTES.has(maybeTop) &&
      PROJECT_DETAIL_IDS.has(maybeDetail) &&
      CAROUSEL_IDS.has(maybeCarousel)
    ) {
      const prefix = segments.slice(0, -3).join("/");
      return prefix ? `/${prefix}` : "";
    }
  }
  // 2-segment detail URLs like /works/ops-automation, /projects/admin-scheduling-system, or /base/about
  if (segments.length >= 2) {
    const maybeSub = segments[segments.length - 1];
    const maybeTop = segments[segments.length - 2];
    if (
      TOP_LEVEL_ROUTES.has(maybeTop) &&
      (WORKS_DETAIL_IDS.has(maybeSub) ||
        PROJECT_DETAIL_IDS.has(maybeSub) ||
        (maybeTop === "base" && BASE_DETAIL_IDS.has(maybeSub)))
    ) {
      const prefix = segments.slice(0, -2).join("/");
      return prefix ? `/${prefix}` : "";
    }
  }
  const last = segments[segments.length - 1];
  if (TOP_LEVEL_ROUTES.has(last)) {
    const prefix = segments.slice(0, -1).join("/");
    return prefix ? `/${prefix}` : "";
  }
  return `/${segments.join("/")}`;
}

/** Returns the full breadcrumb array that matches the current URL. */
function breadcrumbFromPath(pathname: string, basePath: string): string[] {
  const normalized = normalizePath(pathname);
  if (normalized === basePath || (normalized === "/" && basePath === ""))
    return ["base"];

  let suffix = "";
  if (basePath && normalized.startsWith(`${basePath}/`)) {
    suffix = normalized.slice(basePath.length + 1);
  } else if (!basePath) {
    suffix = normalized.replace(/^\//, "");
  }

  const segments = suffix.split("/").filter(Boolean);
  if (segments.length === 0) return ["base"];
  const [first, second, third] = segments;
  if (!TOP_LEVEL_ROUTES.has(first)) return ["base"];
  if (
    second &&
    (WORKS_DETAIL_IDS.has(second) ||
      PROJECT_DETAIL_IDS.has(second) ||
      (first === "base" && BASE_DETAIL_IDS.has(second)))
  ) {
    if (third && CAROUSEL_IDS.has(third)) {
      return [first, second, third];
    }
    return [first, second];
  }
  return [first];
}

/** Maps the full breadcrumb array to a URL path. */
function pathFromBreadcrumb(crumbs: string[], basePath: string): string {
  const base = basePath === "" ? "" : basePath;
  const [first, second, third] = crumbs;
  if (!first || first === "base") {
    if (second && BASE_DETAIL_IDS.has(second)) {
      return `${base}/base/${second}`;
    }
    return base || "/";
  }
  if (!TOP_LEVEL_ROUTES.has(first)) return base || "/";
  if (
    second &&
    (WORKS_DETAIL_IDS.has(second) || PROJECT_DETAIL_IDS.has(second))
  ) {
    if (third && CAROUSEL_IDS.has(third)) {
      return `${base}/${first}/${second}/${third}`;
    }
    return `${base}/${first}/${second}`;
  }
  return `${base}/${first}`;
}

function CarouselPage({
  data,
  breadcrumbs,
  onClose,
}: {
  data: { title: string; images: string[] };
  breadcrumbs: React.ReactNode;
  onClose: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function onScroll() {
      const el = trackRef.current;
      if (!el) return;
      const trackRect = el.getBoundingClientRect();
      const children = Array.from(el.children) as HTMLElement[];
      let closest = 0;
      let minDist = Infinity;
      for (let i = 0; i < children.length; i++) {
        const childRect = children[i].getBoundingClientRect();
        const dist = Math.abs(childRect.left - trackRect.left);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      }
      setActiveIndex(closest);
    }
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const child = track.children[index] as HTMLElement | undefined;
    if (child) {
      track.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    }
  }

  return (
    <section className="sticky-page carousel-page">
      <div className="page-header">
        <div className="page-breadcrumb">
          {breadcrumbs}
          <button
            type="button"
            className="operational-close"
            onClick={onClose}
            aria-label={`Close ${data.title}`}
          >
            <img src="/icons/close.svg" alt="" />
          </button>
        </div>
        <h2>{data.title}</h2>
      </div>
      <div className="carousel-track" ref={trackRef}>
        {data.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${data.title} ${i + 1}`}
            className="carousel-slide"
          />
        ))}
      </div>
      <div className="carousel-preview">
        {data.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Thumbnail ${i + 1}`}
            className={`carousel-thumb${i === activeIndex ? " active" : ""}`}
            onClick={() => scrollTo(i)}
          />
        ))}
      </div>
    </section>
  );
}

export default function TwoPaneLayout() {
  const initialBasePath = deriveBasePath(window.location.pathname);
  const basePathRef = useRef<string>(initialBasePath);
  const isApplyingPopStateRef = useRef(false);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(() =>
    breadcrumbFromPath(window.location.pathname, initialBasePath),
  );
  const [sidebarHover, setSidebarHover] = useState(false);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const [contactDirty, setContactDirty] = useState(false);
  const slotARef = useRef<HTMLDivElement>(null);
  const slotBRef = useRef<HTMLDivElement>(null);
  const savedScrollRef = useRef<{ id: string; scrollTop: number } | null>(null);

  useEffect(() => {
    function onPopState() {
      isApplyingPopStateRef.current = true;
      setBreadcrumb(
        breadcrumbFromPath(window.location.pathname, basePathRef.current),
      );
      setContactDirty(false);
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const targetPath = pathFromBreadcrumb(breadcrumb, basePathRef.current);
    const currentPath = normalizePath(window.location.pathname);
    if (targetPath === currentPath) {
      isApplyingPopStateRef.current = false;
      return;
    }
    if (isApplyingPopStateRef.current) {
      isApplyingPopStateRef.current = false;
      return;
    }
    window.history.pushState(null, "", targetPath);
  }, [breadcrumb]);

  function confirmDiscard(): boolean {
    return window.confirm("You have unsaved changes. Discard and continue?");
  }

  const contactOpen = breadcrumb[breadcrumb.length - 1] === "contact";

  function attemptNavigate(action: () => void) {
    if (contactOpen && contactDirty) {
      if (!confirmDiscard()) return;
    }
    setContactDirty(false);
    action();
  }

  function handleSidebarClick(id: string) {
    attemptNavigate(() => {
      if (BASE_DETAIL_IDS.has(id)) setBreadcrumb(["base", id]);
      else if (TOP_LEVEL_ROUTES.has(id)) setBreadcrumb([id]);
      else if (WORKS_DETAIL_IDS.has(id)) setBreadcrumb(["works", id]);
      else if (PROJECT_DETAIL_IDS.has(id)) setBreadcrumb(["projects", id]);
      else setBreadcrumb(["base", id]);
      setSidebarHover(false);
    });
  }

  function handleSidebarMouseEnter() {
    const el = sidebarRef.current;
    if (!el) return;
    const interactiveRows = Array.from(
      el.querySelectorAll<HTMLElement>(".menu-toggle, .sub-menu button"),
    );

    let widest = 0;
    for (const row of interactiveRows) {
      widest = Math.max(widest, row.scrollWidth);
    }

    const styles = window.getComputedStyle(el);
    const horizontalPadding =
      Number.parseFloat(styles.paddingLeft) +
      Number.parseFloat(styles.paddingRight);
    const horizontalBorder =
      Number.parseFloat(styles.borderLeftWidth) +
      Number.parseFloat(styles.borderRightWidth);

    const desired = Math.ceil(widest + horizontalPadding + horizontalBorder);
    el.style.setProperty("--expanded-width", `${desired}px`);
    setSidebarHover(true);
  }

  function handleSidebarMouseLeave() {
    setSidebarHover(false);
    if (sidebarRef.current)
      sidebarRef.current.style.removeProperty("--expanded-width");
  }

  function handleSlotAClick(id: string) {
    attemptNavigate(() => {
      setBreadcrumb((b) => {
        if (b.length === 1) return ["base", id];
        return [...b.slice(0, -1), id];
      });
    });
  }

  function handleSlotBClick(id: string) {
    attemptNavigate(() => {
      setBreadcrumb((b) => [...b, id]);
    });
  }

  function handleBreadcrumbClick(index: number) {
    attemptNavigate(() => {
      setBreadcrumb((b) => b.slice(0, index + 1));
    });
  }

  const hasSlotB = breadcrumb.length > 1;
  const slotAId = useMemo(() => {
    if (breadcrumb.length === 1) return breadcrumb[0];
    return breadcrumb[breadcrumb.length - 2];
  }, [breadcrumb]);
  const slotBId = useMemo(() => {
    if (!hasSlotB) return null;
    return breadcrumb[breadcrumb.length - 1];
  }, [breadcrumb, hasSlotB]);

  useEffect(() => {
    if (slotBRef.current) slotBRef.current.scrollTop = 0;
  }, [slotBId]);

  // Restore the saved slot-b scroll position when that content moves into slot-a.
  useLayoutEffect(() => {
    const saved = savedScrollRef.current;
    savedScrollRef.current = null; // always consume, prevents stale restores
    if (saved && saved.id === slotAId && slotARef.current) {
      slotARef.current.scrollTop = saved.scrollTop;
    }
  }, [slotAId]);

  // Assign IDs + click handlers to sticky section headers; scroll to URL hash on navigation.
  useEffect(() => {
    const slotEls = [slotARef.current, slotBRef.current].filter(
      (el): el is HTMLDivElement => el !== null,
    );

    // Scroll a slot so that `h2` is just below the sticky page-header stack.
    // Uses the next sibling element as the scroll anchor — unlike the sticky h2
    // itself, a normal sibling always reports its true scrollable position via
    // getBoundingClientRect(), making this reliable for both scrolling up and down.
    function scrollToH2(h2: HTMLElement) {
      const slot = h2.closest<HTMLElement>(".slot");
      if (!slot) return;
      const stickyTop = parseFloat(window.getComputedStyle(h2).top) || 0;
      const h2Height = h2.getBoundingClientRect().height;
      const anchor = (h2.nextElementSibling as HTMLElement | null) ?? h2;
      const slotRect = slot.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const currentAnchorOffset = anchorRect.top - slotRect.top;
      const targetAnchorOffset =
        anchor === h2 ? stickyTop : stickyTop + h2Height;
      const delta = currentAnchorOffset - targetAnchorOffset;
      slot.scrollTo({ top: slot.scrollTop + delta, behavior: "smooth" });
    }

    const cleanups: Array<() => void> = [];

    // Assign IDs to section h2s now so clicks and hash links both work.
    for (const slot of slotEls) {
      for (const h2 of slot.querySelectorAll<HTMLElement>(
        ".sticky-page > h2",
      )) {
        if (!h2.id) {
          const slug = slugify(h2.textContent ?? "");
          if (slug) h2.id = slug;
        }
      }
      // Also assign IDs to page-header h2s so hash links reach them too.
      for (const h2 of slot.querySelectorAll<HTMLElement>(
        ".sticky-page > .page-header > h2",
      )) {
        if (!h2.id) {
          const slug = slugify(h2.textContent ?? "");
          if (slug) h2.id = slug;
        }
      }
    }

    // Single delegated listener per slot handles both kinds of sticky h2.
    for (const slot of slotEls) {
      const handler = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Page-header h2: scroll to the very top.
        const pageHeaderH2 = target.closest<HTMLElement>(
          ".sticky-page > .page-header > h2",
        );
        if (pageHeaderH2) {
          const s = pageHeaderH2.closest<HTMLElement>(".slot");
          if (s) s.scrollTo({ top: 0, behavior: "smooth" });
          if (pageHeaderH2.id) {
            window.history.replaceState(
              null,
              "",
              `${window.location.pathname}#${pageHeaderH2.id}`,
            );
          }
          return;
        }
        // Section h2: scroll to that section.
        const sectionH2 = target.closest<HTMLElement>(".sticky-page > h2");
        if (sectionH2) {
          if (sectionH2.id) {
            window.history.replaceState(
              null,
              "",
              `${window.location.pathname}#${sectionH2.id}`,
            );
          }
          scrollToH2(sectionH2);
        }
      };
      slot.addEventListener("click", handler);
      cleanups.push(() => slot.removeEventListener("click", handler));
    }

    // Scroll to URL hash if present
    const hash = window.location.hash.slice(1);
    if (hash) {
      const escaped = CSS.escape(hash);
      for (const slot of slotEls) {
        const target = slot.querySelector<HTMLElement>(`#${escaped}`);
        if (target) {
          requestAnimationFrame(() => scrollToH2(target));
          break;
        }
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, [slotAId, slotBId]);

  function getNode(id: string | null) {
    if (!id) return null;
    if (id === "base") return DATA.base;
    const b = findBranchById(id);
    if (b) return b;
    return findNodeById(id, DATA.branches);
  }

  const PROJECT_CRUMB_LABELS: Record<string, string> = {
    "admin-scheduling-system": ".case.001",
    "fishnet-recycling": ".case.002",
  };

  function getLabel(id: string) {
    let raw: string;
    if (id === "base") raw = "home";
    else if (PROJECT_CRUMB_LABELS[id]) return PROJECT_CRUMB_LABELS[id];
    else if (CUSTOM_PAGES[id]) raw = CUSTOM_PAGES[id].label;
    else if (CAROUSEL_DATA[id]) raw = CAROUSEL_DATA[id].title;
    else {
      const n = getNode(id);
      raw = n?.label ?? n?.title ?? id;
    }
    if (raw.startsWith(".")) return raw;
    return "." + raw.toLowerCase();
  }

  function getBreadcrumbItemsFor(id: string | null) {
    if (!id) return [];
    const index = breadcrumb.lastIndexOf(id);
    const slice = index >= 0 ? breadcrumb.slice(0, index + 1) : breadcrumb;
    return slice.map((crumbId) => ({ id: crumbId, label: getLabel(crumbId) }));
  }

  function getBreadcrumbVariantFor(id: string | null) {
    if (!id) return "default" as const;
    if (
      id === "base" ||
      id === "works" ||
      id === "initiative" ||
      id === "projects"
    )
      return "inverted" as const;
    return "default" as const;
  }

  function openInitiativeDetail(id: "join" | "donate") {
    attemptNavigate(() => {
      if (id === "join") setBreadcrumb(["initiative", "join"]);
      else setBreadcrumb(["initiative", id]);
    });
  }

  function renderNodePage(
    node: Node,
    slot: "a" | "b",
    breadcrumbs: React.ReactNode,
  ) {
    const content = node.content ?? node.summary ?? "";
    const HeadingTag = slot === "a" ? "h3" : "h2";
    const onChildClick = slot === "a" ? handleSlotAClick : handleSlotBClick;
    return (
      <>
        {breadcrumbs}
        <HeadingTag>{node.label ?? node.title}</HeadingTag>
        <p style={{ whiteSpace: "pre-wrap" }}>{content}</p>
        {node.children && (
          <ul className="children-list">
            {node.children.map((c: Node) => (
              <li key={c.id}>
                <button onClick={() => onChildClick(c.id)}>
                  <span className="menu-label">{c.label ?? c.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  function handleCloseSlotB() {
    attemptNavigate(() => {
      setBreadcrumb((b) => (b.length > 1 ? b.slice(0, -1) : ["base"]));
    });
  }

  function renderSlotContent(
    id: string | null,
    slot: "a" | "b",
    breadcrumbs: React.ReactNode,
  ) {
    if (!id) return null;
    if (id === "base") {
      return (
        <div className="root-page" data-page="base">
          <div className="page-header">
            {breadcrumbs}
            <h1>What is Minga?</h1>
          </div>

          <p className="root-lead-p">
            Minga is a collaborative design and systems practice focused on
            making complex operations&nbsp;
            <span className="root-lead-highlight">
              clearer, safer, and more humane.
            </span>
          </p>

          <div className="base-row base-row-intro">
            <div style={{ flex: 3 }}>
              <p>
                We operate at the intersection of design, logic, and real-world
                friction. We don't focus on decoration or surface-level trends.
                Instead, we solve for cognitive load, invisible labor, and the
                structural risks hidden within everyday workflows. Our goal is
                to replace fragile workarounds with systems that are built to be
                shared, scaled, and trusted.
              </p>
            </div>

            <div style={{ flex: 1 }}>
              <button
                type="button"
                className="cta"
                onClick={() =>
                  attemptNavigate(() => setBreadcrumb(["base", "about"]))
                }
              >
                About Us
              </button>
            </div>
          </div>

          <p className="section-subtitle">
            Future Community Page.
            <span> A space for publishing knowledge.</span>
          </p>

          <div className="base-row base-row-future">
            <div style={{ flex: 3 }}>
              <p>
                We're building open protocols for a more transparent future. If
                you value decentralization, shared infrastructure, and tools
                that belong to the people who use them, let's build the commons
                together.
              </p>
              <div>
                <button
                  type="button"
                  className="cta"
                  onClick={() =>
                    attemptNavigate(() => setBreadcrumb(["base", "join"]))
                  }
                >
                  Join Us
                </button>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <p>
                If you would like to work with us, learn more about our
                services, or collaborate on future projects, feel free to get in
                touch.
              </p>
              <div>
                <button
                  type="button"
                  className="cta"
                  onClick={() =>
                    attemptNavigate(() => setBreadcrumb(["base", "contact"]))
                  }
                >
                  Contact us
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (id === "works") {
      return (
        <Works
          breadcrumbs={breadcrumbs}
          onSelect={(workId) =>
            attemptNavigate(() => {
              setBreadcrumb(["works", workId]);
            })
          }
        />
      );
    }

    if (id === "initiative") {
      return (
        <Initiative
          breadcrumbs={breadcrumbs}
          isSplit={hasSlotB}
          onJoinClick={() => openInitiativeDetail("join")}
        />
      );
    }

    if (id === "projects") {
      return (
        <Projects
          breadcrumbs={breadcrumbs}
          isSplit={hasSlotB}
          onSelect={(projectId) =>
            attemptNavigate(() => {
              setBreadcrumb(["projects", projectId]);
            })
          }
        />
      );
    }

    if (CAROUSEL_IDS.has(id)) {
      const data = CAROUSEL_DATA[id];
      if (!data) return null;
      return (
        <CarouselPage
          data={data}
          breadcrumbs={breadcrumbs}
          onClose={handleCloseSlotB}
        />
      );
    }

    if (PROJECT_DETAIL_IDS.has(id)) {
      return (
        <ProjectsDetail
          id={id}
          breadcrumbs={breadcrumbs}
          onClose={() =>
            attemptNavigate(() => {
              setBreadcrumb(["projects"]);
            })
          }
          onOpenCarousel={(carouselId) =>
            attemptNavigate(() => {
              // When the detail is in slot-b it will be moved to slot-a;
              // save its current scroll depth so we can restore it there.
              if (slot === "b" && slotBRef.current) {
                savedScrollRef.current = {
                  id,
                  scrollTop: slotBRef.current.scrollTop,
                };
              }
              setBreadcrumb((b) => {
                const last = b[b.length - 1];
                if (CAROUSEL_IDS.has(last)) {
                  return [...b.slice(0, -1), carouselId];
                }
                return [...b, carouselId];
              });
            })
          }
        />
      );
    }

    if (WORKS_DETAIL_IDS.has(id)) {
      return (
        <WorksDetail
          id={id}
          breadcrumbs={breadcrumbs}
          onClose={() =>
            attemptNavigate(() => {
              setBreadcrumb(["works"]);
            })
          }
          onOpenProjects={() =>
            attemptNavigate(() => {
              setBreadcrumb(["projects"]);
            })
          }
          onSelectProject={(projectId) =>
            attemptNavigate(() => {
              setBreadcrumb(["projects", projectId]);
            })
          }
          onContact={() =>
            attemptNavigate(() => {
              setBreadcrumb(["base", "contact"]);
            })
          }
        />
      );
    }

    if (CUSTOM_PAGES[id]?.kind === "about")
      return (
        <About
          breadcrumbs={breadcrumbs}
          onClose={handleCloseSlotB}
          onWorksClick={() =>
            attemptNavigate(() => {
              setBreadcrumb(["works"]);
            })
          }
          onInitiativeClick={() =>
            attemptNavigate(() => {
              setBreadcrumb(["initiative"]);
            })
          }
        />
      );
    if (CUSTOM_PAGES[id]?.kind === "waitlist")
      return <JoinUs breadcrumbs={breadcrumbs} onClose={handleCloseSlotB} />;
    if (CUSTOM_PAGES[id]?.kind === "contact")
      return (
        <ContactUs
          breadcrumbs={breadcrumbs}
          onDirtyChange={setContactDirty}
          onClose={handleCloseSlotB}
        />
      );
    if (CUSTOM_PAGES[id]?.kind === "donate") {
      return (
        <InitiativeDonate
          breadcrumbs={breadcrumbs}
          onJoinClick={() => openInitiativeDetail("join")}
          onClose={handleCloseSlotB}
        />
      );
    }

    const node = getNode(id);
    if (!node) return null;
    return renderNodePage(node, slot, breadcrumbs);
  }

  const crumbsA = getBreadcrumbItemsFor(slotAId);
  const variantA = getBreadcrumbVariantFor(slotAId);
  const breadcrumbsA = crumbsA.length ? (
    <Breadcrumbs
      items={crumbsA}
      onClick={handleBreadcrumbClick}
      variant={variantA}
    />
  ) : null;

  const crumbsB = getBreadcrumbItemsFor(slotBId);
  const variantB = getBreadcrumbVariantFor(slotBId);
  const crumbsBDisplay = crumbsB.length > 2 ? crumbsB.slice(-2) : crumbsB;
  const crumbsBOffset = crumbsB.length - crumbsBDisplay.length;
  const breadcrumbsB = crumbsBDisplay.length ? (
    <Breadcrumbs
      items={crumbsBDisplay}
      onClick={(i) => handleBreadcrumbClick(i + crumbsBOffset)}
      variant={variantB}
    />
  ) : null;

  /* ── header height equalization for split mode ── */
  const syncHeaderHeights = useCallback(() => {
    const slotA = slotARef.current;
    const slotB = slotBRef.current;
    if (!slotA || !slotB || !hasSlotB) return;

    const headerA = slotA.querySelector<HTMLElement>(".page-header");
    const headerB = slotB.querySelector<HTMLElement>(".page-header");
    if (!headerA || !headerB) return;

    // reset to natural height
    headerA.style.minHeight = "";
    headerB.style.minHeight = "";

    const hA = headerA.getBoundingClientRect().height;
    const hB = headerB.getBoundingClientRect().height;
    const max = Math.max(hA, hB);

    headerA.style.minHeight = `${max}px`;
    headerB.style.minHeight = `${max}px`;

    // set CSS variable for subsequent sticky h2 offsets in both slots
    const stickyParentA = slotA.querySelector<HTMLElement>(".sticky-page");
    if (stickyParentA) {
      stickyParentA.style.setProperty("--page-header-h", `${max}px`);
    }
    const stickyParentB = slotB.querySelector<HTMLElement>(".sticky-page");
    if (stickyParentB) {
      stickyParentB.style.setProperty("--page-header-h", `${max}px`);
    }
  }, [hasSlotB]);

  useLayoutEffect(() => {
    syncHeaderHeights();
  }, [syncHeaderHeights, slotAId, slotBId]);

  useEffect(() => {
    if (!hasSlotB) return;
    const slotA = slotARef.current;
    const slotB = slotBRef.current;
    if (!slotA || !slotB) return;

    const observer = new ResizeObserver(() => syncHeaderHeights());
    const headerA = slotA.querySelector(".page-header");
    const headerB = slotB.querySelector(".page-header");
    if (headerA) observer.observe(headerA);
    if (headerB) observer.observe(headerB);

    return () => observer.disconnect();
  }, [hasSlotB, slotAId, slotBId, syncHeaderHeights]);

  return (
    <div className="layout-root">
      <Sidebar
        ref={sidebarRef}
        branches={DATA.branches}
        breadcrumb={breadcrumb}
        onClick={handleSidebarClick}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
        collapsed={!sidebarHover}
      />

      <div className="two-pane" data-pane={hasSlotB ? "split" : "single"}>
        <div className="slot slot-a" ref={slotARef}>
          {renderSlotContent(slotAId, "a", breadcrumbsA)}
        </div>

        <div className="slot slot-b" ref={slotBRef} aria-hidden={!hasSlotB}>
          {hasSlotB ? renderSlotContent(slotBId, "b", breadcrumbsB) : null}
        </div>
      </div>
    </div>
  );
}
