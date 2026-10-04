"use client";
import {useEffect,useState} from "react";
import {supabase} from "@/lib/supabase";
type R="love"|"good"|"hmm"|"no";
const opts:[R,string,string][]=[["love","😍","Loved it"],["good","🙂","Good"],["hmm","🤔","Hmm..."],["no","😕","Not for me"]];
export default function MovieReactions({movieSlug}:{movieSlug:string}){
 const [counts,setCounts]=useState<Record<R,number>>({love:0,good:0,hmm:0,no:0}); const [selected,setSelected]=useState<R|null>(null); const [id,setId]=useState(""); const [busy,setBusy]=useState(true);
 async function load(v:string){const {data}=await supabase.from("movie_reactions").select("reaction,visitor_id").eq("movie_slug",movieSlug);const n:Record<R,number>={love:0,good:0,hmm:0,no:0};data?.forEach(x=>{const r=x.reaction as R;if(r in n)n[r]++;if(x.visitor_id===v)setSelected(r)});setCounts(n);setBusy(false)}
 useEffect(()=>{let v=localStorage.getItem("moviehmm_visitor_id");if(!v){v=crypto.randomUUID();localStorage.setItem("moviehmm_visitor_id",v)}setId(v);load(v)},[movieSlug]);
 async function vote(r:R){if(!id||busy)return;setBusy(true);const {error}=await supabase.from("movie_reactions").upsert({movie_slug:movieSlug,visitor_id:id,reaction:r,updated_at:new Date().toISOString()},{onConflict:"movie_slug,visitor_id"});if(!error){setSelected(r);await load(id)}else setBusy(false)}
 const total=Object.values(counts).reduce((a,b)=>a+b,0);
 return <section className="readerReaction"><div className="readerReactionHead"><span>READER REACTION</span><h2>What did you think?</h2><p>Your movie. Your reaction.</p></div><div className="reactionChoices">{opts.map(([v,e,l])=><button key={v} disabled={busy} onClick={()=>vote(v)} className={`reactionChoice ${selected===v?"selected":""}`}><span className="reactionEmoji">{e}</span><strong>{l}</strong><small>{busy?"—":counts[v]}</small></button>)}</div><div className="reactionTotal"><strong>{total}</strong> {total===1?"reader reaction":"reader reactions"}{selected&&<span> · Your reaction is saved</span>}</div></section>
}