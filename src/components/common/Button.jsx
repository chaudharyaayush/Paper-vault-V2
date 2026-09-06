import { ArrowUpRight, LoaderCircle } from "lucide-react";
export default function Button({children,variant="black",icon=true,loading=false,className="",...props}){
 const variants={black:"bg-ink text-white hover:bg-acid hover:text-ink",acid:"bg-acid text-ink hover:bg-green",green:"bg-green text-ink hover:bg-acid",orange:"bg-orange text-ink hover:bg-acid",outline:"bg-paper text-ink hover:bg-acid"};
 return <button className={`focus-ring brutal-border brutal-shadow-sm inline-flex min-h-12 items-center justify-center gap-3 px-5 py-3 font-bold uppercase tracking-wide transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal ${variants[variant]} ${className}`} {...props}>{loading?<LoaderCircle className="animate-spin" size={18}/>:children}{icon&&!loading&&<ArrowUpRight size={18}/>}</button>;
}
