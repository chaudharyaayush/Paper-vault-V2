import { SearchX } from "lucide-react";
export default function EmptyState({title="Nothing found",description="Try another search."}){return <div className="brutal-border brutal-shadow-sm bg-lavender p-8 text-center"><SearchX className="mx-auto mb-4" size={38}/><h3 className="display text-4xl">{title}</h3><p className="mono mt-2 text-xs uppercase tracking-wider">{description}</p></div>}
