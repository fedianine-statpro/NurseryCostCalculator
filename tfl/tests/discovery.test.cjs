const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('calculator has one clean canonical, crawlable copy and no indexing block',()=>{
 const html=fs.readFileSync(path.join(root,'calculator.html'),'utf8');assert(!/noindex|nofollow|noarchive/i.test(html));assert.equal((html.match(/rel="canonical"/g)||[]).length,1);assert(html.includes('href="https://fedianine.com/tfl/calculator.html"'));assert(html.includes('London Travelcard vs Pay As You Go Calculator'));assert(html.includes('Does a Travelcard include buses and trams?'));assert(html.includes('https://content.tfl.gov.uk/adult-fares.pdf'));
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);assert.equal(schema['@type'],'WebApplication');assert.equal(schema.offers.price,'0');assert.equal(schema.aggregateRating,undefined);
});
test('public sitemap and home page point directly to the calculator',()=>{
 const sitemap=fs.readFileSync(path.join(root,'../sitemap.xml'),'utf8'),robots=fs.readFileSync(path.join(root,'../robots.txt'),'utf8'),home=fs.readFileSync(path.join(root,'../index.html'),'utf8');assert(sitemap.includes('<loc>https://fedianine.com/tfl/calculator.html</loc>'));assert(robots.includes('Sitemap: https://fedianine.com/sitemap.xml'));assert(home.includes('href="tfl/calculator.html"'));assert(!sitemap.includes('nata_2026'));
});
test('social preview exists as a 1200 by 630 PNG',()=>{const png=fs.readFileSync(path.join(root,'assets/share-card.png'));assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);});
