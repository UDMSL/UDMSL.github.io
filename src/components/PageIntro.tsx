export default function PageIntro({ label, title, description }: { label: string; title: string; description?: string }) {
  return <header className="page-intro"><p className="eyebrow">{label}</p><h1>{title}<span className="blue-dot">.</span></h1>{description && <p className="page-description">{description}</p>}</header>
}
