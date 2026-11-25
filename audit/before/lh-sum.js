const fs=require('fs'),path=require('path');const dir=process.argv[2];
const rows=[];
for(const f of fs.readdirSync(dir).filter(f=>/^lh-.*\.report\.json$/.test(f)).sort()){
  const r=JSON.parse(fs.readFileSync(path.join(dir,f)));const a=r.audits,c=r.categories;
  if(r.runtimeError){rows.push([f,'ERR '+r.runtimeError.code]);continue}
  const s=k=>c[k]?Math.round(c[k].score*100):'-';
  const nr=a['network-requests']?.details?.items||[];
  rows.push([f.replace(/^lh-|\.report\.json$/g,''),s('performance'),s('accessibility'),s('best-practices'),s('seo'),
   (a['first-contentful-paint'].numericValue/1000).toFixed(2),(a['largest-contentful-paint'].numericValue/1000).toFixed(2),
   Math.round(a['total-blocking-time'].numericValue),a['cumulative-layout-shift'].numericValue.toFixed(3),
   (a['speed-index'].numericValue/1000).toFixed(2),Math.round(a['total-byte-weight'].numericValue/1024),nr.length,
   (a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.selector||'').slice(0,40)]);
}
console.log(['page','perf','a11y','bp','seo','FCP','LCP','TBT','CLS','SI','KB','reqs','LCP el'].join('\t'));
rows.forEach(r=>console.log(r.join('\t')));
