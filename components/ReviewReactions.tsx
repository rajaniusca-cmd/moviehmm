"use client";
import {useEffect,useState} from "react";
import {supabase} from "@/lib/supabase";
type R="exactly"|"partly"|"no";
const opts:[R,string,string][]=[["exactly","👍","Yes, exactly"],["partly","🤔","Partly"],["no","👎","Not really"]];
export default function ReviewReactions({movieSlug}:{movieSlug:string}){
 const [counts,setCounts]=useState<Record<R,number>>({exactly:0,partly:0,no:0});const [selected,setSelected]=useState<R|null>(null);const [id,setId]=useState("");const [busy,setBusy]=useState(true);
 async function load(v:string){const {data}=await supabase.from("review_reactions").select("reaction,visitor_id").eq("movie_slug",movieSlug);const n:Record<R,number>={exactly:0,partly:0,no:0};data?.forEach(x=>{const r=x.reaction as R;if(r in n)n[r]++;if(x.visitor_id===v)setSelected(r)});setCounts(n);setBusy(false)}
 useEffect(()=>{let v=localStorage.getItem("moviehmm_visitor_id");if(!v){v=crypto.randomUUID();localStorage.setItem("moviehmm_visitor_id",v)}setId(v);load(v)},[movieSlug]);
 async function vote(r:R){if(!id||busy)return;setBusy(true);const {error}=await supabase.from("review_reactions").upsert({movie_slug:movieSlug,visitor_id:id,reaction:r,updated_at:new Date().toISOString()},{onConflict:"movie_slug,visitor_id"});if(!error){setSelected(r);await load(id)}else setBusy(false)}
 const total=Object.values(counts).reduce((a,b)=>a+b,0);
 return <section className="reviewReaction"><div className="reviewReactionHead"><span>YOUR TAKE ON OUR TAKE</span><h2>Did this review match your view?</h2></div><div className="reviewReactionChoices">{opts.map(([v,e,l])=><button key={v} disabled={busy} onClick={()=>vote(v)} className={`reviewReactionChoice ${selected===v?"selected":""}`}><span>{e}</span><strong>{l}</strong><small>{busy?"—":counts[v]}</small></button>)}</div><div className="reviewReactionTotal"><strong>{total}</strong> {total===1?"reader responded":"readers responded"}{selected&&<span> · Your response is saved</span>}</div></section>
}