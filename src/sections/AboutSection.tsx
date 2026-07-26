export function AboutSection() {
  return (
    <section className="about">
      <div className="portrait-wrap reveal" aria-hidden="true">
        <img
          className="portrait-artwork"
          src="/assets/about-vector.svg"
          alt=""
        />
      </div>
      <div className="about-copy reveal">
        <p>I’m Marban, a full-stack developer, UI/UX designer, and Agentic AI developer building tools that make work more efficient.</p>
        <p className="muted">I move from <u>product thinking</u> and interface design to <u>production code</u>, creating thoughtful systems where people and AI work better together.</p>
      </div>
    </section>
  )
}
