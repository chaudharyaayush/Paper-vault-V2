import { Link } from "react-router-dom";
import Button from "../components/common/Button";
export default function NotFound(){return <section className="grid-paper grid min-h-[75vh] place-items-center px-5 py-20 text-center"><div><div className="display text-[10rem] leading-none sm:text-[14rem]">404</div><p className="mono mx-auto mt-4 max-w-md text-xs uppercase">This page is outside the current archive.</p><Link to="/" className="mt-8 inline-block"><Button>Back home</Button></Link></div></section>}
