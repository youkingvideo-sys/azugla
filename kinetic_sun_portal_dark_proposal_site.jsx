import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Sun, Ship, Film, Calculator, ChevronDown, ChevronUp, Plus, X } from "lucide-react";

/**
 * Kinetic Sun Portal — Dark Proposal Site (interactive calculator)
 * — Чёрный/светло‑серый дизайн, белый/серый текст
 * — Редактирование дней по специалистам
 * — Добавление/удаление специалистов в каждой сцене
 * — Онлайн-пересчёт сцены и общего итога, ревижены/налоги/руш
 * — NEW: Под сценой выводятся «хэштеги» с составом команды и днями
 */

// === 1) RAW DATA (paste your JSON here) ===
const RAW = [
  {
    "project": {
      "title": "Kinetic Sun Portal",
      "client": "DEEA Rawayana",
      "email": "",
      "phone": "",
      "summary": "This project is a VFX visualizer for the band DEEA Rawayana featuring a kinetic sun portal in a desertnight setting. It involves exterior shots of a large kinetic sun sculpture with green screen elements, and an interior sequence with warm orange light and fabric effects enhancing the silhouettes of three girls. Additionally, there is a separate scene of a boat being towed across desert sand with realistic dirt/sand trails.",
      "timeline_weeks": 3,
      "scenes": [
        {
          "scene_id": "scene_01",
          "title": "Kinetic Sun Exterior Shots",
          "description": "15 seconds of exterior shots of the large kinetic sun sculpture in the desert at night, including one wide profile and one straight-on shot. The sun is a 3D structure with overlaid kinetic figures on a helium ball light rigged rather than floated, with green screen used for sun elements.",
          "duration_seconds": 15,
          "tasks": [
            "3D modeling and structure look development of sun sculpture (2 weeks)",
            "Compositing and overlay of kinetic figures onto rigged sphere",
            "Green screen keying and integration of sun in background",
            "Lighting enhancement to reflect on actresses' faces and sand",
            "Cleaning up wires and practical setup for sun rig"
          ]
        },
        {
          "scene_id": "scene_02",
          "title": "Inside Kinetic Sun Sequence",
          "description": "Approximately 5 seconds (minimum) of the three girls inside the sun portal, featuring warm orange light flooding the frame and silhouetted, trippy movements with white fabric around them. This involves practical lighting with possible enhancement and artistic VFX overlays to create liquidy, double exposure-like effects.",
          "duration_seconds": 5,
          "tasks": [
            "Practical lighting setup with warm lights and white fabric enclosure",
            "VFX enhancement of light color and form, light glow and overlays",
            "Cleaning and compositing effects to create silhouettes and double exposure effects",
            "Potential additional trippy visual enhancements as add-ons"
          ]
        },
        {
          "scene_id": "scene_03",
          "title": "Boat Navigating on Desert Sand",
          "description": "A separate 10 second scene featuring a boat being towed by an SUV across desert sand. The boat appears to navigate as if on water, with VFX adding sand trail effects mimicking water foam using 3D animation or practical particle effects.",
          "duration_seconds": 10,
          "tasks": [
            "3D animation of boat and sand trail effects mimicking water navigation wake",
            "Matchmoving and integration of boat movement to live plate",
            "Compositing and color grading of sand trail effects",
            "Potential cleanup and enhancement of practical hydraulics rig for boat movement"
          ]
        }
      ]
    },
    "price": {
      "currency": "USD",
      "tax_percent": 0,
      "revisions_percent_default": 15,
      "services": [
        {"sku":"ai_training","role":"AI Researcher","title":"AI Training","group":"R&D","unit_type":"DAY","rate":550,"min_units":1,"task_keywords":["ai train","style","model"],"units_per_10s":0.5,"notes":"Training AI models for faces/stylization"},
        {"sku":"ai_research","role":"AI Researcher","title":"AI Research","group":"R&D","unit_type":"DAY","rate":400,"min_units":1,"task_keywords":["reference","model test","dataset"],"units_per_10s":0.3,"notes":"Reference and model testing"},
        {"sku":"lead_composer","role":"Lead Composer","title":"Lead Composer","group":"R&D","unit_type":"DAY","rate":550,"min_units":1,"task_keywords":["concept sound","sound design"],"units_per_10s":0.3,"notes":"Concept sound design"},
        {"sku":"composer","role":"Composer","title":"Composer","group":"R&D","unit_type":"DAY","rate":400,"min_units":1,"task_keywords":["music","ambience","scoring"],"units_per_10s":0.3,"notes":"Scoring and ambience"},
        {"sku":"onset_vfx_supervisor","role":"On-set VFX Supervisor","title":"On-set VFX Supervisor","group":"ON SET","unit_type":"DAY","rate":1250,"min_units":1,"task_keywords":["on set","supervision","shoot"],"units_per_10s":0,"notes":"Technical supervision on set"},
        {"sku":"assistant_editor","role":"Assistant Editor","title":"Assistant Editor","group":"EDIT","unit_type":"DAY","rate":500,"min_units":1,"task_keywords":["edit","conform","delivery"],"units_per_10s":0.2,"notes":"Conform and delivery prep"},
        {"sku":"vfx_supervisor","role":"VFX Supervisor","title":"VFX Supervisor","group":"VFX","unit_type":"DAY","rate":2500,"min_units":1,"task_keywords":["supervision","vfx management"],"units_per_10s":0,"notes":"Supervision of creative & technical pipeline"},
        {"sku":"ai_artist","role":"AI Artist","title":"AI Artist","group":"VFX","unit_type":"DAY","rate":500,"min_units":1,"task_keywords":["ai generation","neural render","face","deepfake"],"units_per_10s":0.5,"notes":"AI generation / neural rendering"},
        {"sku":"compositing","role":"Compositor","title":"Compositing","group":"VFX","unit_type":"DAY","rate":450,"min_units":1,"task_keywords":["compositing","keying","integration"],"units_per_10s":0.5,"notes":"Layering, keying, integration"},
        {"sku":"matchmove","role":"Matchmove Artist","title":"Matchmove","group":"VFX","unit_type":"DAY","rate":400,"min_units":1,"task_keywords":["tracking","matchmove","3d camera"],"units_per_10s":0.4,"notes":"Camera tracking & 3D matchmove"},
        {"sku":"roto","role":"Roto Artist","title":"Roto","group":"VFX","unit_type":"DAY","rate":325,"min_units":1,"task_keywords":["roto","masking","isolation"],"units_per_10s":0.3,"notes":"Masking / isolation"},
        {"sku":"cleanup","role":"Cleanup Artist","title":"Cleanup","group":"VFX","unit_type":"DAY","rate":325,"min_units":1,"task_keywords":["cleanup","artifact removal"],"units_per_10s":0.3,"notes":"Artifact removal / clean-ups"},
        {"sku":"artist_3d","role":"3D Artist","title":"3D Artist","group":"VFX","unit_type":"DAY","rate":500,"min_units":1,"task_keywords":["3d modeling","lookdev"],"units_per_10s":0.5,"notes":"Modeling / lookdev"},
        {"sku":"animator_3d","role":"3D Animator","title":"3D Animator","group":"VFX","unit_type":"DAY","rate":500,"min_units":1,"task_keywords":["3d animation","character","motion"],"units_per_10s":0.5,"notes":"Character/object animation"},
        {"sku":"lighting_render","role":"Lighting TD","title":"Lighting / Render","group":"VFX","unit_type":"DAY","rate":500,"min_units":1,"task_keywords":["lighting","rendering"],"units_per_10s":0.5,"notes":"Lighting setups and renders"},
        {"sku":"beauty_retouch","role":"Beauty Retouch Artist","title":"Beauty Retouch","group":"VFX","unit_type":"DAY","rate":600,"min_units":1,"task_keywords":["retouch","skin cleanup","beauty"],"units_per_10s":0.3,"notes":"Skin cleanup, cosmetics"},
        {"sku":"pipeline_td","role":"Pipeline TD","title":"Pipeline TD","group":"VFX","unit_type":"DAY","rate":450,"min_units":1,"task_keywords":["pipeline","automation","tool"],"units_per_10s":0,"notes":"Pipeline tools & automations"},
        {"sku":"ai_gas","role":"AI Infra","title":"AI Gas / GPU Time","group":"VFX","unit_type":"FLAT","rate":900,"min_units":1,"task_keywords":["gpu","ai render","compute"],"units_per_10s":0,"notes":"Compute cost for AI models"},
        {"sku":"post_producer","role":"Post-producer","title":"Post-production Producer","group":"EXTRA","unit_type":"FLAT","rate":4000,"min_units":1,"task_keywords":["producer","management","delivery"],"units_per_10s":0,"notes":"Project coordination & delivery"}
      ],
      "upsells": [
        {"sku":"ai_gas","title":"AI Gas","group":"VFX","unit_type":"FLAT","rate":1000,"notes":"Compute/Models fuel"},
        {"sku":"rush","title":"Rush turnaround","group":"POLICY","unit_type":"PERCENT","rate":25,"notes":"Expedited delivery surcharge"}
      ],
      "assumptions_defaults": [
        "We will be working at HD / 23.98fps.",
        "Edit locked before VFX work commences (R&D starts on award).",
        "Weekend work not included; can be quoted additionally if required."
      ]
    }
  }
];

// Use only first unique record
const DATA = RAW[0];

// === 2) UTILS ===
const cls = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");
const money = (num: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(num || 0);

const iconByScene = (id: string) => id === "scene_01" ? <Sun className="w-5 h-5"/> : id === "scene_03" ? <Ship className="w-5 h-5"/> : <Film className="w-5 h-5"/>;

function baseEstimate(scene: any, services: any[]){
  // FIX: properly terminated string in join() separator
  const text = (scene.tasks||[]).join("\n").toLowerCase();
  const blocks10 = (scene.duration_seconds||0)/10;
  const lines: any[] = [];
  for(const svc of services){
    const match = (svc.task_keywords||[]).some((k: string) => text.includes(String(k).toLowerCase()));
    if(!match) continue;
    const units = Math.max(svc.min_units||0, (svc.units_per_10s||0)*blocks10);
    const cost = svc.unit_type === 'DAY' ? units*svc.rate : svc.rate;
    lines.push({
      sku: svc.sku, title: svc.title, role: svc.role, unit_type: svc.unit_type, rate: svc.rate, notes: svc.notes, group: svc.group,
      units: Number(units.toFixed(2)), // editable
      include: true // for FLAT toggle
    });
  }
  // default 0.5 day supervisor if complex
  if(/keying|3d|matchmove|cleanup|comp/i.test((scene.tasks||[]).join(' ').toLowerCase())){
    const sup = services.find(s=>s.sku==='vfx_supervisor');
    if(sup){
      lines.push({ sku:sup.sku, title:sup.title, role:sup.role, unit_type:sup.unit_type, rate:sup.rate, notes:sup.notes, group:sup.group, units:0.5, include:true });
    }
  }
  return lines;
}

function lineCost(line: any){
  if(line.unit_type === 'DAY') return (line.units||0)*(line.rate||0);
  return (line.include? 1:0)*(line.rate||0);
}

function sum(arr: number[]){ return arr.reduce((a,b)=>a+b,0); }

// NEW: helpers for hashtag chips
function fmtDays(n: number){
  const s = Number(n||0).toFixed(2).replace(/\.00$/,"").replace(/0$/,"");
  return s;
}
function lineToTag(line: any){
  if(line.unit_type==='DAY'){
    if((line.units||0) <= 0) return null;
    return `#${line.title} · ${fmtDays(line.units)}d`;
  }
  // FLAT — показываем только если включён
  if(!line.include) return null;
  return `#${line.title} · flat`;
}

// === 3) MAIN ===
export default function ProposalSite(){
  const { project, price } = DATA as any;
  const [query, setQuery] = useState("");
  const [openScene, setOpenScene] = useState(project.scenes?.[0]?.scene_id||"");

  // editable state per scene
  const [sceneState, setSceneState] = useState(() => {
    const init: Record<string, any[]> = {};
    for(const s of project.scenes||[]){
      init[s.scene_id] = baseEstimate(s, price.services);
    }
    return init;
  });

  // totals
  const sceneTotals = useMemo(()=>{
    const t: Record<string, number> = {};
    for(const s of project.scenes||[]){
      const lines = sceneState[s.scene_id]||[];
      t[s.scene_id] = sum(lines.map(lineCost));
    }
    return t;
  }, [sceneState, project.scenes]);

  const subtotal = useMemo(()=> sum(Object.values(sceneTotals)), [sceneTotals]);

  // commercial knobs
  const [revisionsPct, setRevisionsPct] = useState<number>(price.revisions_percent_default||0);
  const [rushPct, setRushPct] = useState<number>(0); // optional rush add-on
  const [taxPct, setTaxPct] = useState<number>(price.tax_percent||0);

  const revisionsCost = subtotal * (revisionsPct/100);
  const rushCost = subtotal * (rushPct/100);
  const taxCost = (subtotal + revisionsCost + rushCost) * (taxPct/100);
  const grandTotal = subtotal + revisionsCost + rushCost + taxCost;

  // services filter
  const filteredServices = useMemo(()=>{
    const q = query.trim().toLowerCase();
    if(!q) return price.services;
    return price.services.filter((s: any) => s.sku.toLowerCase().includes(q) || s.title.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || (s.task_keywords||[]).join(' ').toLowerCase().includes(q));
  }, [query, price.services]);

  function addService(sceneId: string, sku: string){
    const svc = price.services.find((s: any)=>s.sku===sku);
    if(!svc) return;
    setSceneState((prev: Record<string, any[]>)=>{
      const had = prev[sceneId]||[];
      if(had.some((l: any)=>l.sku===sku)) return prev; // already added
      const units = svc.unit_type==='DAY' ? Math.max(1, svc.min_units||0) : 1;
      const next = [...had, { sku:svc.sku, title:svc.title, role:svc.role, unit_type:svc.unit_type, rate:svc.rate, notes:svc.notes, group:svc.group, units, include:true }];
      return { ...prev, [sceneId]: next };
    });
  }

  function removeLine(sceneId: string, sku: string){
    setSceneState((prev: Record<string, any[]>)=>({ ...prev, [sceneId]: (prev[sceneId]||[]).filter((l: any)=>l.sku!==sku) }));
  }

  function updateUnits(sceneId: string, sku: string, units: number | string){
    setSceneState((prev: Record<string, any[]>)=>({
      ...prev,
      [sceneId]: (prev[sceneId]||[]).map((l: any) => l.sku===sku ? { ...l, units: Math.max(0, Number(units)||0) } : l)
    }));
  }

  function toggleInclude(sceneId: string, sku: string, val: boolean){
    setSceneState((prev: Record<string, any[]>)=>({
      ...prev,
      [sceneId]: (prev[sceneId]||[]).map((l: any) => l.sku===sku ? { ...l, include: !!val } : l)
    }));
  }

  return (
    <div className="min-h-screen bg-black text-zinc-200">
      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur bg-black/70 border-b border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div initial={{opacity:0, y:-6}} animate={{opacity:1, y:0}} className="h-10 w-10 rounded-2xl bg-zinc-900 border border-zinc-700 grid place-items-center shadow-inner">
              <Sun className="w-5 h-5 text-zinc-100"/>
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-white">{project.title}</h1>
              <p className="text-sm text-zinc-400">Client: <span className="text-zinc-300">{project.client}</span> · Timeline: <span className="text-zinc-300">{project.timeline_weeks} weeks</span></p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search services…" className="pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-500 outline-none focus:ring-2 focus:ring-zinc-600"/>
            </div>
            <div className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-zinc-300 flex items-center gap-2"><Filter className="w-4 h-4"/>Filters</div>
          </div>
        </div>
      </header>

      {/* Top Summary with live total */}
      <section className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl">
          <h2 className="text-lg text-zinc-300 mb-2">Project Summary</h2>
          <p className="text-zinc-300 leading-relaxed">{project.summary}</p>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <div className="text-sm text-zinc-400">Live Total</div>
            <div className="text-3xl font-semibold text-white mt-1">{money(grandTotal, price.currency)}</div>
            <div className="text-xs text-zinc-500 mt-2">Subtotal {money(subtotal)} · Revisions {money(revisionsCost)} · Rush {money(rushCost)} · Tax {money(taxCost)}</div>
          </div>
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 space-y-3">
            <div className="text-sm text-zinc-400">Commercial knobs</div>
            <label className="flex items-center justify-between text-sm">
              <span className="text-zinc-300">Revisions, %</span>
              <input type="number" min={0} max={100} value={revisionsPct} onChange={e=>setRevisionsPct(Number(e.target.value)||0)} className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-right"/>
            </label>
            <label className="flex items-center justify-between text-sm">
              <span className="text-zinc-300">Rush, %</span>
              <input type="number" min={0} max={100} value={rushPct} onChange={e=>setRushPct(Number(e.target.value)||0)} className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-right"/>
            </label>
            <label className="flex items-center justify-between text-sm">
              <span className="text-zinc-300">Tax, %</span>
              <input type="number" min={0} max={100} value={taxPct} onChange={e=>setTaxPct(Number(e.target.value)||0)} className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-right"/>
            </label>
          </div>
        </div>
      </section>

      {/* Scenes with editable lines */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <h3 className="text-white/90 text-xl mb-4 flex items-center gap-2"><Film className="w-5 h-5"/> Scenes & Calculator</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {(project.scenes||[]).map((scene: any, idx: number)=>{
            const lines = sceneState[scene.scene_id]||[];
            const total = sceneTotals[scene.scene_id]||0;

            // services available to add (exclude already added)
            const available = price.services.filter((s: any) => !lines.some((l: any)=>l.sku===s.sku));

            // NEW: tags list for this scene
            const tagList = lines.map(lineToTag).filter(Boolean) as string[];

            return (
              <motion.div key={scene.scene_id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay: idx*0.05}} className="rounded-3xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                <div className="p-6 border-b border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-300">
                    {iconByScene(scene.scene_id)}
                    <div className="uppercase tracking-wide text-xs text-zinc-400">{scene.scene_id}</div>
                  </div>
                  <h4 className="text-lg text-white mt-1">{scene.title}</h4>
                  <p className="text-sm text-zinc-400 mt-2 line-clamp-4">{scene.description}</p>
                  <div className="mt-3 text-sm text-zinc-300">Duration: <span className="text-zinc-200 font-medium">{scene.duration_seconds}s</span></div>

                  {/* NEW: Hashtag chips under description showing team & days */}
                  {tagList.length>0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tagList.map((t, i)=> (
                        <span key={i} className="text-xs text-zinc-300 border border-zinc-700 bg-zinc-900/60 rounded-full px-2 py-1">{t}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <button onClick={()=> setOpenScene(openScene===scene.scene_id?"":scene.scene_id)} className="w-full flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-zinc-200">
                    <span className="flex items-center gap-2"><Calculator className="w-4 h-4"/> Edit estimate</span>
                    {openScene===scene.scene_id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                  </button>

                  {openScene===scene.scene_id && (
                    <div className="space-y-3">
                      {/* Add service */}
                      <div className="flex items-center gap-2">
                        <select id={`add-${scene.scene_id}`} className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-zinc-200">
                          {available.map((s: any)=> (
                            <option key={s.sku} value={s.sku}>{s.title} — {s.role} ({s.unit_type === 'DAY' ? `${money(s.rate)}/day` : `${money(s.rate)} flat`})</option>
                          ))}
                        </select>
                        <button onClick={()=>{
                          const el = document.getElementById(`add-${scene.scene_id}`) as HTMLSelectElement | null;
                          if(el && el.value) addService(scene.scene_id, el.value);
                        }} className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100">
                          <Plus className="w-4 h-4"/> Add
                        </button>
                      </div>

                      {/* Lines table */}
                      {lines.length===0 && <div className="text-sm text-zinc-400">No services yet — добавь специалиста из списка выше.</div>}

                      {lines.map((line: any) => (
                        <div key={line.sku} className="grid grid-cols-12 gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                          <div className="col-span-6">
                            <div className="text-zinc-200 font-medium">{line.title} <span className="text-xs text-zinc-500">({line.role})</span></div>
                            <div className="text-xs text-zinc-500">{line.notes}</div>
                          </div>
                          <div className="col-span-2 text-sm text-zinc-300 flex items-center">
                            {line.unit_type==='DAY' ? (
                              <label className="w-full">
                                <span className="text-xs text-zinc-500">Days</span>
                                <input type="number" min={0} step={0.25} value={line.units}
                                  onChange={e=>updateUnits(scene.scene_id, line.sku, e.target.value)}
                                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 text-right"/>
                              </label>
                            ) : (
                              <label className="flex items-center gap-2">
                                <input type="checkbox" checked={!!line.include} onChange={e=>toggleInclude(scene.scene_id, line.sku, e.target.checked)} />
                                <span className="text-xs text-zinc-400">Include</span>
                              </label>
                            )}
                          </div>
                          <div className="col-span-3 text-right text-sm text-zinc-300">
                            <div>{line.unit_type==='DAY' ? `${money(line.rate, price.currency)}/day` : `${money(line.rate, price.currency)} flat`}</div>
                            <div className="text-white font-semibold">{money(lineCost(line), price.currency)}</div>
                          </div>
                          <div className="col-span-1 flex items-start justify-end">
                            <button onClick={()=>removeLine(scene.scene_id, line.sku)} className="p-2 rounded-lg border border-zinc-700 hover:bg-zinc-900"><X className="w-4 h-4"/></button>
                          </div>
                        </div>
                      ))}

                      <div className="flex items-center justify-between pt-3 mt-1 border-t border-zinc-800">
                        <div className="text-sm text-zinc-400">Scene subtotal</div>
                        <div className="text-lg text-white font-semibold">{money(total, price.currency)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Services catalogue (reference) */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h3 className="text-white/90 text-xl mb-4 flex items-center gap-2"><Calculator className="w-5 h-5"/> Services & Rates</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((s: any) => (
            <div key={s.sku} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center justify-between">
                <div className="text-zinc-100 font-medium">{s.title}</div>
                <div className="text-zinc-300 text-sm">{s.unit_type==='DAY'? `${money(s.rate, price.currency)}/day` : `${money(s.rate, price.currency)}`}</div>
              </div>
              <div className="text-xs text-zinc-400 mt-1">{s.role} · {s.group}</div>
              <div className="text-xs text-zinc-500 mt-2">Min: {s.min_units} {s.unit_type.toLowerCase()}(s)</div>
              <div className="text-xs text-zinc-500 mt-1">KW: {(s.task_keywords||[]).join(', ')}</div>
              {s.notes && <div className="text-sm text-zinc-300 mt-2">{s.notes}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} OYan Creative · Interactive proposal calculator · All rates in {price.currency}
      </footer>
    </div>
  );
}

// === 4) DEV TESTS (non-invasive)
// Эти простые проверки помогут убедиться, что парсер задач и расчёты работают корректно.
if (typeof window !== 'undefined') {
  try {
    const sampleScene = { duration_seconds: 20, tasks: ["Keying", "3D modeling"] };
    const services = [
      { sku:"compositing", unit_type:"DAY", rate:450, min_units:1, task_keywords:["keying"], units_per_10s:0.5 },
      { sku:"artist_3d", unit_type:"DAY", rate:500, min_units:1, task_keywords:["3d modeling"], units_per_10s:0.5 },
      { sku:"vfx_supervisor", unit_type:"DAY", rate:2500, min_units:1, task_keywords:[], units_per_10s:0 }
    ];
    const lines = baseEstimate(sampleScene as any, services as any);
    // Expect two matched lines + supervisor (regex catches key words)
    console.assert(lines.length >= 2, "baseEstimate should produce at least 2 lines for matching keywords");
    const cost = sum(lines.map(lineCost));
    console.assert(!Number.isNaN(cost) && cost >= 0, "Line costs should be a non-NaN number");
    // NEW: chip formatter
    const tag = lineToTag({ unit_type:'DAY', title:'Compositing', units:1.25, include:true });
    console.assert(tag === '#Compositing · 1.25d', 'lineToTag should format days with d suffix');
  } catch (e) {
    // Don't crash app on failed asserts; just log for dev
    console.warn("DEV TESTS failed:", e);
  }
}
