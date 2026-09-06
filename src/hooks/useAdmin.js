import { useEffect, useState } from "react";
const STORAGE_KEY="papervault-demo-admin"; const UPLOADS_KEY="papervault-demo-uploads";
export function useAdmin(){
 const [authenticated,setAuthenticated]=useState(()=>localStorage.getItem(STORAGE_KEY)==="true");
 const [uploads,setUploads]=useState(()=>{try{return JSON.parse(localStorage.getItem(UPLOADS_KEY)||"[]")}catch{return []}});
 useEffect(()=>localStorage.setItem(UPLOADS_KEY,JSON.stringify(uploads)),[uploads]);
 function login(password){const expected=import.meta.env.VITE_DEMO_ADMIN_PASSWORD||"demo"; if(password===expected){localStorage.setItem(STORAGE_KEY,"true");setAuthenticated(true);return true}return false}
 function logout(){localStorage.removeItem(STORAGE_KEY);setAuthenticated(false)}
 function addUpload(upload){setUploads(current=>[{...upload,id:crypto.randomUUID?.()||String(Date.now())},...current])}
 function removeUpload(id){setUploads(current=>current.filter(item=>item.id!==id))}
 return {authenticated,uploads,login,logout,addUpload,removeUpload};
}
