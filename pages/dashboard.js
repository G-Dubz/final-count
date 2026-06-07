import { useState, useEffect, useRef } from "react";
import Head from "next/head";

// ── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  espresso:    "#2a2118",
  espressoDark:"#1a1410",
  espressoDeep:"#111009",
  gold:        "#c9a97a",
  goldLight:   "#e8d8c0",
  cream:       "#faf8f4",
  creamMid:    "#f2ead8",
  creamBorder: "#e0d4c4",
  text:        "#1a1410",
  textMid:     "#3d2e1e",
  textLight:   "#6b5c4d",
  textFaint:   "#8a7a6a",
  green:       "#2e7d32",
  greenBg:     "#e8f5e9",
  red:         "#b91c1c",
  redBg:       "#fce8e8",
  amber:       "#92400e",
  amberBg:     "#fef3c7",
};

// ── Logo mark ─────────────────────────────────────────────────────────────────
function LogoMark({ size = 36, dark = false }) {
  const bg   = dark ? C.gold        : C.espresso;
  const fg   = dark ? C.espressoDeep: C.cream;
  const gold = dark ? C.espressoDeep: C.gold;
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 72 72" fill="none">
      <path d="M36 2 L70 36 L36 70 L2 36 Z" fill={bg}/>
      <path d="M36 10 L62 36 L36 62 L10 36 Z" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.3"/>
      <line x1="22" y1="24" x2="22" y2="48" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="24" x2="38" y2="24" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <line x1="22" y1="34" x2="34" y2="34" stroke={fg} strokeWidth="3" strokeLinecap="round"/>
      <polyline points="32,40 39,49 52,30" fill="none" stroke={gold} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── Seed guest data ───────────────────────────────────────────────────────────
const SEED_GUESTS = [
  { id:1,  name:"Margaret & Tom Liu",   phone:"(843) 555-0182", status:"Confirmed", events:"All events", plusOne:"Yes", dietary:"Gluten-free", notes:"" },
  { id:2,  name:"Uncle Dave & Aunt Clara", phone:"(704) 555-0291", status:"Pending",   events:"—",          plusOne:"—",   dietary:"—",           notes:"" },
  { id:3,  name:"Cousin Marcus",        phone:"(919) 555-0374", status:"Declined",  events:"None",        plusOne:"N/A", dietary:"N/A",         notes:"Flight canceled" },
  { id:4,  name:"Grandma Helen",        phone:"(252) 555-0415", status:"Confirmed", events:"All events",  plusOne:"No",  dietary:"Low sodium",  notes:"" },
  { id:5,  name:"Bridesmaid Claire",    phone:"(910) 555-0538", status:"Confirmed", events:"All events",  plusOne:"Yes", dietary:"Vegan",       notes:"" },
  { id:6,  name:"David & Sarah Park",   phone:"(336) 555-0621", status:"Pending",   events:"—",          plusOne:"—",   dietary:"—",           notes:"" },
  { id:7,  name:"Aunt Rosa",            phone:"(828) 555-0743", status:"Pending",   events:"—",          plusOne:"—",   dietary:"—",           notes:"" },
  { id:8,  name:"Best Man Jordan",      phone:"(980) 555-0819", status:"Confirmed", events:"All events",  plusOne:"Yes", dietary:"None",        notes:"" },
];

const FINALCOUNT_NUMBER = "(866) 477-9638";

// ── Template definitions ──────────────────────────────────────────────────────
function buildTemplates(guestName, couplePhone) {
  return [
    {
      id: "redirect",
      label: "Polite redirect",
      sublabel: "For guests who texted you directly",
      icon: "↩",
      color: C.amber,
      colorBg: C.amberBg,
      build: (name) =>
        `Hey${name ? ` — so glad you can make it` : ""}! To make sure your RSVP doesn't get lost in my messages, could you do me a huge favor and text your name to our digital assistant at ${FINALCOUNT_NUMBER}? It takes two seconds! 🙏`,
    },
    {
      id: "reminder",
      label: "Gentle reminder",
      sublabel: "For guests who haven't responded yet",
      icon: "⏰",
      color: C.gold,
      colorBg: C.creamMid,
      build: (name) =>
        `Hi${name ? ` ${name.split(" ")[0]}` : ""}! We're finalizing our headcount for the caterer and still need your RSVP. Could you quickly text your name to ${FINALCOUNT_NUMBER}? It only takes a second — thank you! 💍`,
    },
    {
      id: "savethedate",
      label: "Save the date opt-in",
      sublabel: "To collect consent early",
      icon: "💌",
      color: C.green,
      colorBg: C.greenBg,
      build: (_name) =>
        `We're officially getting married! 💍 Please text your first and last name to our digital wedding assistant at ${FINALCOUNT_NUMBER} so we have your info for the invitation. Can't wait to celebrate with you!`,
    },
  ];
}

// ── Template Modal ────────────────────────────────────────────────────────────
function TemplateModal({ guest, onClose, couplePhone }) {
  const templates = buildTemplates(guest?.name, couplePhone);
  const [sent, setSent] = useState(null);
  const [sending, setSending] = useState(null);
  const isPersonalized = !!guest;

  async function handleSend(tpl) {
    if (sending) return;
    setSending(tpl.id);
    // Simulate sending — in production this POSTs to /api/send-template
    await new Promise(r => setTimeout(r, 900));
    setSent(tpl.id);
    setSending(null);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(26,20,16,.6)", zIndex:200,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
         onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background:C.cream, borderRadius:10, width:"100%", maxWidth:520,
                    boxShadow:"0 24px 64px rgba(0,0,0,.22)", overflow:"hidden" }}>

        {/* Header */}
        <div style={{ background:C.espresso, padding:"20px 24px", display:"flex",
                      justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, fontSize:15,
                          color:C.cream, marginBottom:2 }}>
              📱 Text me a template
            </div>
            <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:12.5,
                          color:C.goldLight, opacity:.85 }}>
              {isPersonalized
                ? `Pre-filled for ${guest.name.split(" ")[0]} · sent to your phone`
                : "Sent to your registered phone number"}
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,.1)", border:"none", borderRadius:"50%",
                     width:32, height:32, cursor:"pointer", color:C.cream, fontSize:18,
                     display:"flex", alignItems:"center", justifyContent:"center" }}>
            ×
          </button>
        </div>

        {/* Templates */}
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:14 }}>
          {templates.map(tpl => {
            const isSent = sent === tpl.id;
            const isSending = sending === tpl.id;
            const text = tpl.build(guest?.name);
            return (
              <div key={tpl.id} style={{ border:`1.5px solid ${C.creamBorder}`, borderRadius:8,
                                         overflow:"hidden" }}>
                {/* Template label */}
                <div style={{ background:C.creamMid, padding:"10px 14px",
                              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:16 }}>{tpl.icon}</span>
                    <div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600,
                                    fontSize:13, color:C.text }}>{tpl.label}</div>
                      <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                                    fontSize:11.5, color:C.textFaint }}>{tpl.sublabel}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSend(tpl)}
                    disabled={isSending || isSent}
                    style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:11.5,
                             letterSpacing:"0.08em", textTransform:"uppercase",
                             background: isSent ? C.greenBg : C.espresso,
                             color: isSent ? C.green : C.cream,
                             border:"none", borderRadius:4, padding:"7px 14px",
                             cursor: isSent ? "default" : "pointer",
                             transition:"all .2s", minWidth:80 }}>
                    {isSending ? "Sending…" : isSent ? "✓ Sent" : "Send →"}
                  </button>
                </div>
                {/* Preview */}
                <div style={{ padding:"10px 14px", background:"white",
                              fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                              fontSize:13, color:C.textMid, lineHeight:1.65,
                              borderTop:`1px solid ${C.creamBorder}` }}>
                  {text}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding:"0 24px 20px", fontFamily:"'DM Sans',sans-serif",
                      fontWeight:300, fontSize:12, color:C.textFaint, textAlign:"center" }}>
          Templates arrive as a text to your registered phone number so you can copy &amp; paste directly from your messages app.
        </div>
      </div>
    </div>
  );
}

// ── Pending banner ────────────────────────────────────────────────────────────
function PendingBanner({ count, onOpenTemplates }) {
  if (count < 3) return null;
  return (
    <div style={{ background:C.amberBg, border:`1.5px solid #d4a84b`,
                  borderRadius:8, padding:"13px 18px", marginBottom:20,
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  gap:12, flexWrap:"wrap" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize:18 }}>⏰</span>
        <div>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:13.5,
                         color:C.amber }}>
            {count} guests haven't responded yet.
          </span>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:13,
                         color:C.amber, marginLeft:6 }}>
            Send yourself a reminder template to forward.
          </span>
        </div>
      </div>
      <button onClick={onOpenTemplates}
        style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:11.5,
                 letterSpacing:"0.08em", textTransform:"uppercase",
                 background:C.espresso, color:C.cream, border:"none",
                 borderRadius:4, padding:"8px 16px", cursor:"pointer",
                 whiteSpace:"nowrap" }}>
        📱 Text me a template
      </button>
    </div>
  );
}

// ── Guest form modal ──────────────────────────────────────────────────────────
function GuestForm({ guest, onSave, onClose }) {
  const [form, setForm] = useState(guest || {
    name:"", phone:"", status:"Pending", events:"—", plusOne:"—", dietary:"—", notes:""
  });
  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }
  function submit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }
  const inp = (extra={}) => ({
    style:{ width:"100%", padding:"10px 12px", border:`1.5px solid ${C.creamBorder}`,
            borderRadius:4, fontFamily:"'DM Sans',sans-serif", fontSize:14,
            background:"white", color:C.text, outline:"none", ...extra.style },
    ...extra
  });
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(26,20,16,.55)", zIndex:200,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
         onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div style={{ background:C.cream, borderRadius:10, width:"100%", maxWidth:460,
                    boxShadow:"0 24px 64px rgba(0,0,0,.2)" }}>
        <div style={{ background:C.espresso, padding:"18px 24px", borderRadius:"10px 10px 0 0",
                      display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20,
                         fontWeight:400, color:C.cream }}>
            {guest ? "Edit guest" : "Add guest"}
          </span>
          <button onClick={onClose}
            style={{ background:"none", border:"none", color:C.cream, fontSize:22,
                     cursor:"pointer", lineHeight:1 }}>×</button>
        </div>
        <form onSubmit={submit} style={{ padding:24, display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600,
                            letterSpacing:"0.08em", textTransform:"uppercase", color:C.textLight,
                            display:"block", marginBottom:5 }}>Name *</label>
            <input value={form.name} onChange={e=>set("name",e.target.value)} required
                   placeholder="e.g. Margaret & Tom Liu" {...inp()}/>
          </div>
          <div>
            <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600,
                            letterSpacing:"0.08em", textTransform:"uppercase", color:C.textLight,
                            display:"block", marginBottom:5 }}>Phone</label>
            <input value={form.phone} onChange={e=>set("phone",e.target.value)}
                   placeholder="(555) 000-0000" {...inp()}/>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600,
                              letterSpacing:"0.08em", textTransform:"uppercase", color:C.textLight,
                              display:"block", marginBottom:5 }}>RSVP Status</label>
              <select value={form.status} onChange={e=>set("status",e.target.value)}
                style={{ width:"100%", padding:"10px 12px", border:`1.5px solid ${C.creamBorder}`,
                         borderRadius:4, fontFamily:"'DM Sans',sans-serif", fontSize:14,
                         background:"white", color:C.text, outline:"none" }}>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Declined</option>
              </select>
            </div>
            <div>
              <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600,
                              letterSpacing:"0.08em", textTransform:"uppercase", color:C.textLight,
                              display:"block", marginBottom:5 }}>Plus One</label>
              <select value={form.plusOne} onChange={e=>set("plusOne",e.target.value)}
                style={{ width:"100%", padding:"10px 12px", border:`1.5px solid ${C.creamBorder}`,
                         borderRadius:4, fontFamily:"'DM Sans',sans-serif", fontSize:14,
                         background:"white", color:C.text, outline:"none" }}>
                <option>—</option>
                <option>Yes</option>
                <option>No</option>
                <option>N/A</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600,
                            letterSpacing:"0.08em", textTransform:"uppercase", color:C.textLight,
                            display:"block", marginBottom:5 }}>Dietary needs</label>
            <input value={form.dietary} onChange={e=>set("dietary",e.target.value)}
                   placeholder="e.g. Vegan, Gluten-free, None" {...inp()}/>
          </div>
          <div>
            <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600,
                            letterSpacing:"0.08em", textTransform:"uppercase", color:C.textLight,
                            display:"block", marginBottom:5 }}>Notes</label>
            <input value={form.notes} onChange={e=>set("notes",e.target.value)}
                   placeholder="Any additional notes" {...inp()}/>
          </div>
          <div style={{ display:"flex", gap:10, paddingTop:4 }}>
            <button type="button" onClick={onClose}
              style={{ flex:1, padding:"12px", fontFamily:"'DM Sans',sans-serif", fontWeight:600,
                       fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase",
                       background:"transparent", color:C.espresso,
                       border:`1.5px solid ${C.espresso}`, borderRadius:2, cursor:"pointer" }}>
              Cancel
            </button>
            <button type="submit"
              style={{ flex:2, padding:"12px", fontFamily:"'DM Sans',sans-serif", fontWeight:600,
                       fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase",
                       background:C.espresso, color:C.cream, border:"none",
                       borderRadius:2, cursor:"pointer" }}>
              {guest ? "Save changes" : "Add guest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Status pill ───────────────────────────────────────────────────────────────
function Pill({ status }) {
  const map = {
    Confirmed: { bg:C.greenBg,  color:C.green,  label:"✓ Confirmed" },
    Declined:  { bg:C.redBg,    color:C.red,    label:"✗ Declined"  },
    Pending:   { bg:C.amberBg,  color:C.amber,  label:"⏳ Pending"  },
  };
  const s = map[status] || map.Pending;
  return (
    <span style={{ display:"inline-block", padding:"3px 10px", borderRadius:10,
                   fontSize:11.5, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                   background:s.bg, color:s.color }}>
      {s.label}
    </span>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ userEmail, onLogout }) {
  const [guests, setGuests]         = useState(SEED_GUESTS);
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState("All");
  const [editGuest, setEditGuest]   = useState(null);
  const [showAdd, setShowAdd]       = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [tplGuest, setTplGuest]     = useState(undefined); // undefined=closed, null=generic, obj=personalized
  const [logGuest, setLogGuest]     = useState(null);

  const confirmed = guests.filter(g=>g.status==="Confirmed").length;
  const pending   = guests.filter(g=>g.status==="Pending").length;
  const declined  = guests.filter(g=>g.status==="Declined").length;
  const total     = guests.length;
  const pct       = total ? Math.round((confirmed/total)*100) : 0;

  const filtered = guests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
                        g.phone.includes(search);
    const matchFilter = filter === "All" || g.status === filter;
    return matchSearch && matchFilter;
  });

  function addGuest(form) {
    setGuests(g => [...g, { ...form, id: Date.now() }]);
    setShowAdd(false);
  }
  function saveGuest(form) {
    setGuests(g => g.map(x => x.id===form.id ? form : x));
    setEditGuest(null);
  }
  function deleteGuest(id) {
    setGuests(g => g.filter(x => x.id !== id));
    setDeleteId(null);
  }

  const btnStyle = (active) => ({
    fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:11.5,
    letterSpacing:"0.08em", textTransform:"uppercase",
    padding:"7px 16px", borderRadius:4, cursor:"pointer", border:"none",
    background: active ? C.espresso : C.creamMid,
    color:       active ? C.cream    : C.textLight,
    transition:"all .15s",
  });

  return (
    <div style={{ minHeight:"100vh", background:C.cream, fontFamily:"'DM Sans',sans-serif" }}>

      {/* ── Top nav ── */}
      <nav style={{ background:C.espresso, borderBottom:`1px solid rgba(255,255,255,.06)`,
                    padding:"0 28px", height:64,
                    display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <LogoMark size={32} dark/>
          <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:20,
                         fontWeight:600, color:C.cream, letterSpacing:"0.01em" }}>
            Final<span style={{ color:C.gold }}>Count</span>
          </span>
          <span style={{ marginLeft:12, background:"rgba(201,169,122,.15)", color:C.gold,
                         fontSize:10.5, fontWeight:600, letterSpacing:"0.1em",
                         textTransform:"uppercase", padding:"3px 10px", borderRadius:10 }}>
            Dashboard
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <span style={{ fontSize:12.5, color:C.goldLight, opacity:.7 }}>{userEmail}</span>
          {/* ── Global "Text me a template" button ── */}
          <button
            onClick={() => setTplGuest(null)}
            style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:11,
                     letterSpacing:"0.08em", textTransform:"uppercase",
                     background:"rgba(201,169,122,.18)", color:C.gold,
                     border:`1px solid rgba(201,169,122,.4)`, borderRadius:4,
                     padding:"7px 14px", cursor:"pointer", display:"flex",
                     alignItems:"center", gap:6 }}>
            📱 Templates
          </button>
          <button onClick={onLogout}
            style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:500, fontSize:12,
                     color:C.goldLight, background:"none", border:"none",
                     cursor:"pointer", opacity:.7 }}>
            Log out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"28px 24px" }}>

        {/* ── Pending banner ── */}
        <PendingBanner count={pending} onOpenTemplates={() => setTplGuest(null)}/>

        {/* ── Stat cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
          {[
            ["Total guests", total,     C.espresso, C.goldLight],
            ["Confirmed",    confirmed,  C.green,    C.greenBg  ],
            ["Pending",      pending,    C.amber,    C.amberBg  ],
            ["Declined",     declined,   C.red,      C.redBg    ],
          ].map(([label, val, color, bg]) => (
            <div key={label} style={{ background:"white", border:`1.5px solid ${C.creamBorder}`,
                                      borderRadius:8, padding:"16px 18px" }}>
              <div style={{ fontSize:10.5, fontWeight:600, letterSpacing:"0.1em",
                            textTransform:"uppercase", color:C.textFaint, marginBottom:6 }}>
                {label}
              </div>
              <div style={{ fontSize:34, fontWeight:500, color,
                            fontFamily:"'Cormorant Garamond',Georgia,serif", lineHeight:1 }}>
                {val}
              </div>
            </div>
          ))}
        </div>

        {/* ── Progress bar ── */}
        <div style={{ background:"white", border:`1.5px solid ${C.creamBorder}`,
                      borderRadius:8, padding:"14px 18px", marginBottom:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
            <span style={{ fontSize:12.5, fontWeight:600, color:C.textLight }}>Response rate</span>
            <span style={{ fontSize:12.5, fontWeight:700, color:C.espresso }}>{pct}%</span>
          </div>
          <div style={{ height:6, background:C.creamMid, borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:C.gold,
                          borderRadius:3, transition:"width .6s ease" }}/>
          </div>
        </div>

        {/* ── Guest list header ── */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                      marginBottom:14, flexWrap:"wrap", gap:10 }}>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {["All","Confirmed","Pending","Declined"].map(f => (
              <button key={f} style={btnStyle(filter===f)} onClick={()=>setFilter(f)}>{f}</button>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <input
              value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search guests…"
              style={{ padding:"8px 13px", border:`1.5px solid ${C.creamBorder}`, borderRadius:4,
                       fontFamily:"'DM Sans',sans-serif", fontSize:13.5, background:"white",
                       color:C.text, outline:"none", width:200 }}
            />
            <button onClick={()=>setShowAdd(true)}
              style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:11.5,
                       letterSpacing:"0.1em", textTransform:"uppercase",
                       background:C.espresso, color:C.cream, border:"none",
                       borderRadius:4, padding:"9px 18px", cursor:"pointer" }}>
              + Add guest
            </button>
          </div>
        </div>

        {/* ── Guest table ── */}
        <div style={{ background:"white", border:`1.5px solid ${C.creamBorder}`,
                      borderRadius:8, overflow:"hidden" }}>

          {/* Table head */}
          <div style={{ display:"grid",
                        gridTemplateColumns:"2fr 1.3fr 1.1fr 0.8fr 1.1fr 1fr 1.4fr",
                        background:C.creamMid, padding:"10px 16px",
                        borderBottom:`1px solid ${C.creamBorder}` }}>
            {["Guest","Phone","RSVP","+ 1","Dietary","Events","Actions"].map(h => (
              <span key={h} style={{ fontSize:10.5, fontWeight:600, letterSpacing:"0.08em",
                                     textTransform:"uppercase", color:C.textFaint }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ padding:"40px 16px", textAlign:"center", color:C.textFaint,
                          fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:18,
                          fontStyle:"italic" }}>
              No guests match your search.
            </div>
          )}

          {filtered.map((g, i) => (
            <div key={g.id}
              style={{ display:"grid",
                       gridTemplateColumns:"2fr 1.3fr 1.1fr 0.8fr 1.1fr 1fr 1.4fr",
                       padding:"13px 16px", alignItems:"center",
                       borderBottom: i < filtered.length-1 ? `1px solid ${C.creamBorder}` : "none",
                       background: i%2===0 ? "white" : C.cream,
                       transition:"background .15s" }}>

              {/* Name */}
              <span style={{ fontWeight:500, color:C.text, fontSize:13.5 }}>{g.name}</span>

              {/* Phone */}
              <span style={{ color:C.textFaint, fontSize:13 }}>{g.phone}</span>

              {/* RSVP */}
              <span><Pill status={g.status}/></span>

              {/* Plus one */}
              <span style={{ color:C.textMid, fontSize:13 }}>{g.plusOne}</span>

              {/* Dietary */}
              <span style={{ color:g.dietary==="—"||g.dietary==="N/A" ? C.textFaint : C.textMid,
                             fontSize:13 }}>{g.dietary}</span>

              {/* Events */}
              <span style={{ color:C.textFaint, fontSize:12.5 }}>{g.events}</span>

              {/* Actions */}
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <button
                  onClick={()=>setEditGuest(g)}
                  title="Edit"
                  style={{ fontSize:12, padding:"4px 9px", borderRadius:4, border:`1px solid ${C.creamBorder}`,
                           background:"white", color:C.textLight, cursor:"pointer",
                           fontFamily:"'DM Sans',sans-serif", fontWeight:500 }}>
                  Edit
                </button>

                {/* ── Contextual template button — only for Pending guests ── */}
                {g.status === "Pending" && (
                  <button
                    onClick={() => setTplGuest(g)}
                    title="Send reminder template"
                    style={{ fontSize:11, padding:"4px 9px", borderRadius:4,
                             border:`1px solid #d4a84b`,
                             background:C.amberBg, color:C.amber,
                             cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                             fontWeight:600, whiteSpace:"nowrap" }}>
                    ⏰ Remind
                  </button>
                )}

                {/* ── Redirect template button — for all guests with a phone number ── */}
                {g.status !== "Pending" && g.phone && (
                  <button
                    onClick={() => setTplGuest(g)}
                    title="Send redirect template"
                    style={{ fontSize:11, padding:"4px 9px", borderRadius:4,
                             border:`1px solid #d4a84b`,
                             background:C.amberBg, color:C.amber,
                             cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                             fontWeight:600, whiteSpace:"nowrap" }}>
                    ↩ Redirect
                  </button>
                )}

                <button
                  onClick={()=>setDeleteId(g.id)}
                  title="Delete"
                  style={{ fontSize:12, padding:"4px 9px", borderRadius:4,
                           border:`1px solid ${C.redBg}`,
                           background:C.redBg, color:C.red,
                           cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
                           fontWeight:500 }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div style={{ marginTop:16, textAlign:"center", fontSize:12, color:C.textFaint }}>
          {filtered.length} of {total} guests shown
          {filter !== "All" && ` · filtered by ${filter}`}
        </div>
      </div>

      {/* ── Modals ── */}
      {showAdd && <GuestForm onSave={addGuest} onClose={()=>setShowAdd(false)}/>}
      {editGuest && <GuestForm guest={editGuest} onSave={saveGuest} onClose={()=>setEditGuest(null)}/>}
      {tplGuest !== undefined && (
        <TemplateModal
          guest={tplGuest}
          couplePhone={userEmail}
          onClose={() => setTplGuest(undefined)}
        />
      )}

      {/* ── Delete confirmation ── */}
      {deleteId && (
        <div style={{ position:"fixed", inset:0, background:"rgba(26,20,16,.55)", zIndex:200,
                      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:C.cream, borderRadius:10, padding:"28px 32px",
                        maxWidth:360, width:"100%", textAlign:"center",
                        boxShadow:"0 24px 64px rgba(0,0,0,.2)" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:22,
                          fontWeight:400, color:C.text, marginBottom:10 }}>
              Remove this guest?
            </div>
            <p style={{ fontSize:13.5, color:C.textLight, marginBottom:22, lineHeight:1.6 }}>
              This will permanently delete them from your guest list. This action can't be undone.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setDeleteId(null)}
                style={{ flex:1, padding:"11px", fontFamily:"'DM Sans',sans-serif",
                         fontWeight:600, fontSize:12, letterSpacing:"0.1em",
                         textTransform:"uppercase", background:"transparent",
                         color:C.espresso, border:`1.5px solid ${C.espresso}`,
                         borderRadius:2, cursor:"pointer" }}>
                Cancel
              </button>
              <button onClick={()=>deleteGuest(deleteId)}
                style={{ flex:1, padding:"11px", fontFamily:"'DM Sans',sans-serif",
                         fontWeight:600, fontSize:12, letterSpacing:"0.1em",
                         textTransform:"uppercase", background:C.red, color:"white",
                         border:"none", borderRadius:2, cursor:"pointer" }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Login page ────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail]   = useState("");
  const [code, setCode]     = useState("");
  const [sent, setSent]     = useState(false);
  const [testCode, setTest] = useState("");
  const [error, setError]   = useState("");

  function sendCode(e) {
    e.preventDefault();
    if (!email) return;
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setTest(c);
    setSent(true);
    setError("");
  }
  function verify(e) {
    e.preventDefault();
    if (code === testCode) { onLogin(email); }
    else { setError("Incorrect code — try again."); }
  }

  return (
    <div style={{ minHeight:"100vh", background:C.espresso, display:"flex",
                  alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ width:"100%", maxWidth:400 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <LogoMark size={52} dark/>
          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:28,
                        fontWeight:400, color:C.cream, marginTop:14 }}>
            Final<span style={{ color:C.gold }}>Count</span>
          </div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontSize:13,
                        color:C.goldLight, opacity:.75, marginTop:4 }}>
            Couple dashboard
          </div>
        </div>

        <div style={{ background:C.espressoDark, borderRadius:8, padding:32,
                      border:`1px solid rgba(201,169,122,.15)` }}>
          {!sent ? (
            <form onSubmit={sendCode} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11.5, fontWeight:600,
                                letterSpacing:"0.1em", textTransform:"uppercase",
                                color:C.goldLight, display:"block", marginBottom:6 }}>
                  Email address
                </label>
                <input type="email" required value={email}
                       onChange={e=>setEmail(e.target.value)}
                       placeholder="your@email.com"
                       style={{ width:"100%", padding:"12px 14px",
                                border:`1.5px solid rgba(201,169,122,.25)`,
                                borderRadius:4, background:"rgba(255,255,255,.06)",
                                color:C.cream, fontFamily:"'DM Sans',sans-serif",
                                fontSize:14, outline:"none" }}/>
              </div>
              <button type="submit"
                style={{ padding:13, fontFamily:"'DM Sans',sans-serif", fontWeight:700,
                         fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase",
                         background:C.gold, color:C.espressoDeep, border:"none",
                         borderRadius:4, cursor:"pointer", marginTop:4 }}>
                Send login code →
              </button>
            </form>
          ) : (
            <form onSubmit={verify} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div style={{ background:"rgba(201,169,122,.1)", border:`1px solid rgba(201,169,122,.25)`,
                            borderRadius:6, padding:"12px 16px", textAlign:"center" }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:C.goldLight,
                              marginBottom:4, letterSpacing:"0.08em", textTransform:"uppercase" }}>
                  Test mode — your code
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:38,
                              fontWeight:400, color:C.gold, letterSpacing:8 }}>
                  {testCode}
                </div>
              </div>
              <input value={code} onChange={e=>{ setCode(e.target.value); setError(""); }}
                     placeholder="Enter 6-digit code"
                     style={{ width:"100%", padding:"12px 14px",
                              border:`1.5px solid ${error ? "#e05050" : "rgba(201,169,122,.25)"}`,
                              borderRadius:4, background:"rgba(255,255,255,.06)",
                              color:C.cream, fontFamily:"'DM Sans',sans-serif",
                              fontSize:20, outline:"none", textAlign:"center",
                              letterSpacing:6 }}/>
              {error && <div style={{ color:"#e08080", fontSize:12.5, textAlign:"center" }}>{error}</div>}
              <button type="submit"
                style={{ padding:13, fontFamily:"'DM Sans',sans-serif", fontWeight:700,
                         fontSize:12, letterSpacing:"0.12em", textTransform:"uppercase",
                         background:C.gold, color:C.espressoDeep, border:"none",
                         borderRadius:4, cursor:"pointer" }}>
                Verify &amp; enter dashboard →
              </button>
              <button type="button" onClick={()=>{ setSent(false); setCode(""); setError(""); }}
                style={{ background:"none", border:"none", color:C.goldLight, fontSize:12.5,
                         cursor:"pointer", opacity:.7, fontFamily:"'DM Sans',sans-serif" }}>
                ← Use a different email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  return user
    ? <><Head><title>Dashboard — FinalCount</title></Head><Dashboard userEmail={user} onLogout={()=>setUser(null)}/></>
    : <><Head><title>Log in — FinalCount</title></Head><LoginPage onLogin={setUser}/></>;
}
