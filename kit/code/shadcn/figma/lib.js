// design-system-kit 0.11.0 · profile shadcn · figma: builder library — fix it in the kit, not per client
/**
 * Prepend this file to every `use_figma` script that builds library pages
 * (Setup's Figma step, publish-back's component changes). It assumes the file
 * already has the Primitives + Semantic variable collections, the text and
 * effect styles, and (for I()) the Utilities page's Icon/* components.
 *
 * Every helper binds to variables or styles — nothing takes a hex value:
 *   F(dir, o)   auto-layout frame        C(dir, o)   auto-layout component
 *     o: { name, fill, fillOp, stroke, strokeOp, sw, align, dash, r, p, gap,
 *          effect, op, main, cross, clip } — fill/stroke/r/p/gap take token
 *          names ("primary-normal", "radius-md", "space-2") or numbers
 *   T(text, style, colour, { w, align, name })   text on a text style
 *   I(name, size, colour)   an Icon/<name> instance, rescaled, stroke rebound
 *   sz(node, w, h)          "fill" | "hug" | px, applied after appendChild
 *   gridSet(comps, parent, name, description, rows)   variants in a grid
 *   textProp / boolProp     component properties wired to named layers
 *   ring(node, token, alpha)   a focus/error glow (bound drop shadow)
 *   pageRoot(name) / section(root, title, description) / panel(section)
 *   inst(set, "Prop=value, …") / setProps(instance, { Label: "…" })
 *   getSet(page, name)      a set or component on another page
 *   syncTints(scope)        copy tinted fills from main components to instances
 *
 * Gotchas this library encodes (each one broke a build):
 * - A paint's opacity must be set AFTER the variable is bound
 *   (setBoundVariableForPaint drops it); style() reassigns it.
 * - Instances don't pick up a tinted fill from their main component when
 *   created through setProperties; call syncTints() on composed examples.
 * - Instances can't take appended children: build composed parts as frames
 *   or as their own components.
 * - A TEXT component property sets the same text on every variant. Add one
 *   only where every variant shows the same text (labels), never where states
 *   differ (placeholder vs filled vs error values).
 * - resize() resets sizing to FIXED; sz() sets HUG/FILL after it, and only
 *   once the node is inside an auto-layout parent.
 * - Arrows are 3-point polygons, not rotated rectangles.
 */
const ICONS={};{const U=figma.root.children.find(p=>p.name==='Utilities');if(U){await U.loadAsync();for(const c of U.findAllWithCriteria({types:['COMPONENT']}))if(c.name.startsWith('Icon/'))ICONS[c.name.slice(5)]=c}}
const VARS={};for(const x of await figma.variables.getLocalVariablesAsync())VARS[x.name]=x;
const TS={};for(const s of await figma.getLocalTextStylesAsync())TS[s.name]=s;
const ES={};for(const s of await figma.getLocalEffectStylesAsync())ES[s.name]=s;
for(const s of Object.values(TS))await figma.loadFontAsync(s.fontName);
const tok=n=>n.replace('-','/').replace(/\./g,'_');
const V=n=>{const x=VARS[tok(n)];if(!x)throw new Error('no var '+n);return x};
const paint=(n,op)=>{const p=figma.variables.setBoundVariableForPaint({type:'SOLID',color:{r:0,g:0,b:0}},'color',V(n));return op===undefined?p:{...p,opacity:op}};
const tint=(node,op)=>{node.fills=[{...node.fills[0],opacity:op}]};
const bindN=(f,k,val)=>{if(typeof val==='string')f.setBoundVariable(k,V(val));else f[k]=val};
const rad=(f,r)=>{for(const k of['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'])bindN(f,k,r)};
const pad=(f,p)=>{const a=Array.isArray(p)?p:[p];const [t,r,b,l]=a.length===1?[a[0],a[0],a[0],a[0]]:a.length===2?[a[0],a[1],a[0],a[1]]:a;bindN(f,'paddingTop',t);bindN(f,'paddingRight',r);bindN(f,'paddingBottom',b);bindN(f,'paddingLeft',l)};
async function style(f,o){
 f.fills=o.fill?[paint(o.fill)]:[];if(o.fill&&o.fillOp!==undefined)f.fills=[{...f.fills[0],opacity:o.fillOp}];
 if(o.stroke){f.strokes=[paint(o.stroke,o.strokeOp)];f.strokeWeight=o.sw||1;f.strokeAlign=o.align||'INSIDE';if(o.dash)f.dashPattern=[4,4]}
 if(o.r!==undefined)rad(f,o.r);if(o.p!==undefined)pad(f,o.p);if(o.gap!==undefined)bindN(f,'itemSpacing',o.gap);
 if(o.effect)await f.setEffectStyleIdAsync(ES[o.effect].id);
 if(o.op!==undefined)f.opacity=o.op;
 f.primaryAxisAlignItems=o.main||'MIN';f.counterAxisAlignItems=o.cross||(f.layoutMode==='VERTICAL'?'MIN':'CENTER');
 if(o.clip!==undefined)f.clipsContent=o.clip;
 return f}
async function F(dir,o={}){const f=figma.createAutoLayout(dir==='v'?'VERTICAL':'HORIZONTAL');f.name=o.name||'frame';return style(f,o)}
async function C(dir,o={}){const f=figma.createComponent();f.layoutMode=dir==='v'?'VERTICAL':'HORIZONTAL';f.primaryAxisSizingMode='AUTO';f.counterAxisSizingMode='AUTO';f.name=o.name||'Component';return style(f,o)}
function sz(n,w,h){if(typeof w==='number'||typeof h==='number')n.resize(typeof w==='number'?w:n.width,typeof h==='number'?h:n.height);
 if(w!==undefined)n.layoutSizingHorizontal=w==='fill'?'FILL':w==='hug'?'HUG':'FIXED';if(h!==undefined)n.layoutSizingVertical=h==='fill'?'FILL':h==='hug'?'HUG':'FIXED';return n}
function add(parent,...kids){for(const k of kids)if(k)parent.appendChild(k);return parent}
async function T(chars,st,color,o={}){const t=figma.createText();await t.setTextStyleIdAsync(TS[st].id);t.characters=chars;t.fills=[paint(color||'label-normal')];t.name=o.name||chars.slice(0,24);
 if(o.w){t.textAutoResize='HEIGHT';t.resize(o.w,t.height)}if(o.align)t.textAlignHorizontal=o.align;if(o.deco)t.textDecoration=o.deco;return t}
function I(name,size,color){const c=ICONS[name];if(!c)throw new Error('no icon '+name);const i=c.createInstance();i.name='icon/'+name;i.rescale(size/24);if(color)for(const vct of i.findAll(n=>n.type==='VECTOR'||n.type==='ELLIPSE'||n.type==='RECTANGLE'||n.type==='LINE'))vct.strokes=[paint(color)];return i}
function textProp(set,prop,nodeName,def){const k=set.addComponentProperty(prop,'TEXT',def);for(const v of (set.type==='COMPONENT_SET'?set.children:[set]))for(const t of v.findAll(n=>n.type==='TEXT'&&n.name===nodeName))t.componentPropertyReferences={...t.componentPropertyReferences,characters:k};return k}
function boolProp(set,prop,nodeName,def){const k=set.addComponentProperty(prop,'BOOLEAN',def);for(const v of (set.type==='COMPONENT_SET'?set.children:[set]))for(const t of v.findAll(n=>n.name===nodeName))t.componentPropertyReferences={...t.componentPropertyReferences,visible:k};return k}
async function pageRoot(name){let p=figma.root.children.find(x=>x.name===name);if(!p){p=figma.createPage();p.name=name}await figma.setCurrentPageAsync(p);
 let root=p.children.find(n=>n.name===name&&n.type==='FRAME');if(!root){root=await F('v',{name,fill:'background-alternative',p:[80,80],gap:120});p.appendChild(root);root.x=0;root.y=0;root.resize(1600,200);root.layoutSizingHorizontal='FIXED';root.layoutSizingVertical='HUG'}return {p,root}}
async function section(root,title,desc){let s=root.children.find(n=>n.name===title);if(s)s.remove();s=await F('v',{name:title,gap:16});root.appendChild(s);s.layoutSizingHorizontal='FILL';add(s,await T(title,'Display/title-2','label-strong',{name:'Title'}),await T(desc,'Text/body-2','label-alternative',{w:760,name:'Description'}));return s}
async function panel(sec,dir='h',o={}){const pn=await F(dir,{name:o.name||'Examples',fill:'background-normal',r:'radius-xl',p:32,gap:32,stroke:'line-normal',cross:'MIN',...o});sec.appendChild(pn);if(o.wrap){pn.layoutWrap='WRAP';pn.counterAxisSpacing=32;pn.layoutSizingHorizontal='FILL'}return pn}
const STATUS=(s)=>`Status: validated · Source: ${s}`;
function gridSet(comps,parent,name,desc,rows,o={}){const s=figma.combineAsVariants(comps,parent);s.name=name;s.description=desc;s.fills=[paint('background-normal')];s.cornerRadius=16;
 const P=o.pad||32,cg=o.colGap||24,rg=o.rowGap||24;const colW=[];rows.forEach(r=>r.forEach((c,i)=>{if(c)colW[i]=Math.max(colW[i]||0,c.width)}));
 let y=P;for(const r of rows){const h=Math.max(...r.filter(Boolean).map(c=>c.height));let x=P;r.forEach((c,i)=>{if(c){c.x=x;c.y=y+(h-c.height)/2}x+=colW[i]+cg});y+=h+rg}
 s.resize(P*2+colW.reduce((a,b)=>a+b,0)+cg*(colW.length-1),y-rg+P);return s}
const ring=(node,varName,op,spread)=>{const e={type:'DROP_SHADOW',color:{r:0,g:0,b:0,a:1},offset:{x:0,y:0},radius:0,spread:spread||3,visible:true,blendMode:'NORMAL',showShadowBehindNode:false};const b=figma.variables.setBoundVariableForEffect(e,'color',V(varName));node.effects=[...node.effects,{...b,color:{...b.color,a:op}}]};
const inst=(set,name)=>{const c=set.type==='COMPONENT_SET'?set.children.find(x=>x.name===name):set;if(!c)throw new Error('no variant '+name);return c.createInstance()};
const setProps=(i,map)=>{const pr={};for(const k of Object.keys(i.componentProperties)){const base=k.split('#')[0];if(base in map)pr[k]=map[base]}i.setProperties(pr);return i};
async function getSet(pageName,name){const pg=figma.root.children.find(p=>p.name===pageName);await pg.loadAsync();return pg.findOne(n=>(n.type==='COMPONENT_SET'||n.type==='COMPONENT')&&n.name===name)}
function syncTints(scope){for(const i of scope.findAllWithCriteria({types:['INSTANCE']})){const m=i.mainComponent;if(!m||!m.fills||!m.fills.length||!i.fills||!i.fills.length)continue;const mo=m.fills[0].opacity;if(mo<1&&i.fills[0].opacity!==mo)i.fills=m.fills.map(f=>({...f}))}}
