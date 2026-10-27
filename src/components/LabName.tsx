/** Keep the long laboratory name balanced without an orphaned final word. */
export default function LabName({ name }: { name: string }) {
  const ending = 'Spectroscopy Laboratory'
  if (!name.endsWith(ending)) return <>{name}</>
  return <><span className="lab-name-line">{name.slice(0, -ending.length).trim()}</span>{' '}<span className="lab-name-line">{ending}</span></>
}
