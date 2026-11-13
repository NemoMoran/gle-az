interface PageHeadProps {
  title: string
  lead?: string
}

export function PageHead({ title, lead }: PageHeadProps) {
  return (
    <div className="container page-head">
      <h1>{title}</h1>
      {lead && <p className="lead">{lead}</p>}
    </div>
  )
}
