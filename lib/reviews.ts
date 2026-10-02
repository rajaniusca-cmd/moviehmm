import fs from "node:fs";import path from "node:path";
export type Review={title:string;slug:string;year:number;language:string;genre:string;runtime:string;score:number;verdict:string;poster:string;publishedDate:string;featured:boolean;displayOrder?:number;dek:string;review:string[];works:string;misses:string;watched?:{date:string;time:string;venue:string;city:string;auditorium?:string;seat?:string;format:string}};
const dir=path.join(process.cwd(),"content","reviews");
export function getAllReviews():Review[]{return fs.readdirSync(dir).filter(f=>f.endsWith(".json")).map(f=>JSON.parse(fs.readFileSync(path.join(dir,f),"utf8")) as Review).sort((a,b)=>(b.displayOrder??0)-(a.displayOrder??0)||b.publishedDate.localeCompare(a.publishedDate))}
export function getFeaturedReview(){const a=getAllReviews();return a.find(r=>r.featured)||a[0]}
export function getReview(slug:string){return getAllReviews().find(r=>r.slug===slug)}
export function mark(score:number){if(score>=9)return{symbol:"★",label:"WOW"};if(score>=8)return{symbol:"✓",label:"YES"};if(score>=7)return{symbol:"✓",label:"GOOD"};if(score>=6)return{symbol:"?",label:"MAYBE"};return{symbol:"×",label:"NO"}}
