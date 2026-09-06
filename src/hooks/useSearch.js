import { useMemo, useState } from "react";
export function useSearch(items,getText){const [query,setQuery]=useState("");const filtered=useMemo(()=>{const normalized=query.trim().toLowerCase();if(!normalized)return items;return items.filter(item=>getText(item).toLowerCase().includes(normalized))},[items,query,getText]);return {query,setQuery,filtered};}
