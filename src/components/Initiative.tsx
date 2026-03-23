import type { ReactNode } from "react";

type Props = {
  breadcrumbs: ReactNode;
  isSplit?: boolean;
  onJoinClick: () => void;
};

export default function Initiative({ breadcrumbs, onJoinClick }: Props) {
  return (
    <section className="root-page" data-page="initiative">
      <div className="page-header">
        {breadcrumbs}
        <h1>Common Ground</h1>
      </div>

      <p className="root-lead-p">
        Minga Initiative is where collective effort takes precedence over
        ownership.
      </p>

      <p>
        It is a space for projects that grow through shared responsibility,
        long-term commitment, and care for both people and ecosystems. Some
        initiatives emerge from our professional work, others exist entirely
        outside commercial structures. What connects them is the intention to
        build systems that support collective stability rather than individual
        gain.
      </p>

      <div className="initiative-columns">
        <section>
          <h2>What this initiative supports</h2>
          <p>
            The initiative brings together work that is exploratory,
            community-driven, and value-led. These projects are often slower,
            messier, and more human than commercial work and that is
            intentional.
          </p>
          <ul>
            <li>Community-led and ecological projects,</li>
            <li>Long-term collaborations beyond delivery,</li>
            <li>Shared ownership and co-creation,</li>
            <li>Knowledge exchange and collective learning,</li>
          </ul>
        </section>

        <section>
          <h2>How this connects to our consultancy</h2>
          <p>
            Some of our initiative work informs how we approach consultancy and
            system design. Likewise, certain community projects begin as
            professional collaborations and later continue through the
            initiative. This exchange allows practice and values to inform each
            other without collapsing into a single model
          </p>

          <p>
            If you want to lend a hand, join us, or support the continuation of
            this work, there are different ways to take part.
          </p>

          <div className="initiative-action-row">
            <button type="button" className="cta" onClick={onJoinClick}>
              Join Us
            </button>
          </div>
        </section>
      </div>
    </section>
  );
}
