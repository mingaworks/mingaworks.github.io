import { type ReactNode, useRef, useEffect, useCallback } from "react";

type ServiceCard = {
  id: string;
  title: string;
  description: string;
  iconPath: string;
};

type Props = {
  breadcrumbs: ReactNode;
  onSelect: (id: string) => void;
};

const SERVICES: ServiceCard[] = [
  {
    id: "ops-automation",
    title: "Operational Architecture",
    description:
      "We look at how your team actually works, find where time and energy leak out, and build automated systems to close those gaps. Less friction. More output.",
    iconPath: "/icons/consultancy/digital-tools-automation.svg",
  },
  {
    id: "product-archt",
    title: "Product Architecture & Launch",
    description:
      "From idea to working platform. We scope, design, and build the version of your product that proves the concept, attracts investment, and doesn't collapse under its own weight when it's time to scale.",
    iconPath: "/icons/consultancy/product-development.svg",
  },
  {
    id: "visual-identity",
    title: "Visual Identity & UX Design",
    description:
      "Digital tools are only as good as they are usable. We combine strategic branding with intuitive interface design to ensure your system is as beautiful as it is functional.",
    iconPath: "/icons/consultancy/branding-web-presence.svg",
  },
  {
    id: "system-advisory",
    title: "Strategic Systems Advisory",
    description:
      "For founders and teams who need a senior technical and creative voice in the room. We bring systems thinking and user experience on the table, helping you make better decisions on architecture, tooling, design direction, and growth.",
    iconPath: "/icons/consultancy/community-projects.svg",
  },
];

export default function Works({ breadcrumbs, onSelect }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const scrollOrigin = useRef(0);
  const hasDragged = useRef(false);

  // Non-passive wheel → horizontal scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // let native horizontal scroll through
      if (el.scrollWidth <= el.clientWidth) return; // no horizontal overflow → let event bubble to parent
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const startDrag = useCallback((pageX: number) => {
    if (!trackRef.current) return;
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = pageX - trackRef.current.getBoundingClientRect().left;
    scrollOrigin.current = trackRef.current.scrollLeft;
    trackRef.current.classList.add("dragging");
  }, []);

  const moveDrag = useCallback((pageX: number) => {
    if (!isDragging.current || !trackRef.current) return;
    const x = pageX - trackRef.current.getBoundingClientRect().left;
    const delta = x - dragStartX.current;
    if (Math.abs(delta) > 4) hasDragged.current = true;
    trackRef.current.scrollLeft = scrollOrigin.current - delta;
  }, []);

  const endDrag = useCallback(() => {
    isDragging.current = false;
    trackRef.current?.classList.remove("dragging");
  }, []);

  return (
    <section className="works-page root-page">
      <div className="page-header">
        {breadcrumbs}
        <h1>
          Digital Infrastructure{" "}
          <span className="title-suffix">for Humans</span>
        </h1>
      </div>
      <p className="works-lead">
        We help small teams and fast-moving organizations overcome fragmented
        tools and cognitive overload. We don&apos;t just add features; we design
        lean, reliable systems that turn operational friction into flow.
      </p>

      <div className="works-services-shell">
        <div
          ref={trackRef}
          className="works-services"
          role="list"
          onMouseDown={(e) => startDrag(e.pageX)}
          onMouseMove={(e) => moveDrag(e.pageX)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
        >
          {SERVICES.map((service) => (
            <article key={service.id} className="service-card" role="listitem">
              <div className="service-card-top">
                <div className="service-card-icon" aria-hidden>
                  <img src={service.iconPath} alt="" />
                </div>
                <p className="service-card-desc">{service.description}</p>
              </div>
              <div className="service-card-middle">
                <h2 className="service-card-title">{service.title}</h2>
              </div>
              <div className="service-card-bottom">
                <button
                  type="button"
                  className="service-card-link"
                  onClick={() => {
                    if (!hasDragged.current) onSelect(service.id);
                  }}
                  aria-label={`View details for ${service.title}`}
                >
                  View details
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
