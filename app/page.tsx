import { FluidPrototype } from "../components/fluid-prototype";
import { interactions, modes, phases, states } from "../lib/mobile-plan";

const readiness = [
  "Next.js app at the repository root for Vercel framework detection.",
  "Mobile viewport metadata, safe-area spacing, and responsive controls.",
  "Touch-first fallback so camera permission is optional.",
  "Vercel build and install commands committed in vercel.json.",
  "Legacy Visual Studio/OpenGL artifacts ignored during Vercel deploy.",
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Fluid Wall mobile version</p>
          <h1>Plan mode for a touch-first, Vercel-ready web app.</h1>
          <p>
            The original app is a C++/OpenGL Kinect installation. This branch adds a mobile
            web surface that documents the interaction plan, previews touch behavior, and prepares
            the project for deployment to the user&apos;s Vercel account.
          </p>
          <div className="hero-actions" aria-label="Project readiness">
            <a href="#prototype">Test prototype</a>
            <a href="#vercel" className="secondary">
              Vercel checklist
            </a>
          </div>
        </div>
        <div className="hero-card" aria-label="Mobile planning summary">
          <span className="status-pill">Plan mode</span>
          <h2>Native controls become mobile patterns</h2>
          <p>
            Keyboard shortcuts, mouse buttons, and Kinect depth are translated into segmented
            controls, thumb tools, permission states, and touch/camera fallbacks.
          </p>
          <ul>
            <li>Canvas-first layout with safe-area controls</li>
            <li>Camera is progressive enhancement, not a blocker</li>
            <li>Performance states are visible in the UI plan</li>
          </ul>
        </div>
      </section>

      <section className="mode-grid" aria-labelledby="modes-title">
        <div className="section-heading">
          <p className="eyebrow">Display modes</p>
          <h2 id="modes-title">Original render modes mapped to mobile</h2>
        </div>
        <div className="cards four-up">
          {modes.map((mode) => (
            <article className="mode-card" key={mode.id}>
              <div
                className="swatch"
                style={{
                  background: `linear-gradient(135deg, ${mode.palette.join(", ")})`,
                }}
              />
              <h3>{mode.name}</h3>
              <p>{mode.summary}</p>
              <dl>
                <div>
                  <dt>Native</dt>
                  <dd>{mode.nativeControl}</dd>
                </div>
                <div>
                  <dt>Mobile</dt>
                  <dd>{mode.mobilePattern}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <div id="prototype">
        <FluidPrototype modes={modes} />
      </div>

      <section className="interactions" aria-labelledby="interactions-title">
        <div className="section-heading">
          <p className="eyebrow">Patterns and interactions</p>
          <h2 id="interactions-title">How the desktop installation becomes a phone experience</h2>
        </div>
        <div className="timeline">
          {interactions.map((interaction) => (
            <article key={interaction.title}>
              <span />
              <div>
                <h3>{interaction.title}</h3>
                <p>
                  <strong>Native:</strong> {interaction.native}
                </p>
                <p>
                  <strong>Mobile:</strong> {interaction.mobile}
                </p>
                <p className="muted">{interaction.state}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="states" aria-labelledby="states-title">
        <div className="section-heading">
          <p className="eyebrow">State model</p>
          <h2 id="states-title">Mobile states to design before porting the solver</h2>
        </div>
        <div className="cards three-up">
          {states.map((state) => (
            <article className="state-card" key={state.name}>
              <h3>{state.name}</h3>
              <p className="muted">{state.trigger}</p>
              <p>{state.response}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="phases" aria-labelledby="phases-title">
        <div className="section-heading">
          <p className="eyebrow">Implementation path</p>
          <h2 id="phases-title">Scoped plan from prototype to production mobile app</h2>
        </div>
        <div className="phase-list">
          {phases.map((phase) => (
            <article key={phase.title}>
              <h3>{phase.title}</h3>
              <p>{phase.detail}</p>
              <ul>
                {phase.deliverables.map((deliverable) => (
                  <li key={deliverable}>{deliverable}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="vercel" id="vercel" aria-labelledby="vercel-title">
        <div>
          <p className="eyebrow">Vercel readiness</p>
          <h2 id="vercel-title">Prepared for the user&apos;s Vercel account</h2>
          <p>
            The repo now contains a standard Next.js project with committed dependency lockfile and
            Vercel config. Connect this branch in Vercel and use the detected Next.js preset.
          </p>
        </div>
        <ul>
          {readiness.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
