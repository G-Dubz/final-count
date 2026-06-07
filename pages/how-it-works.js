import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import Link from "next/link";

// ── Design tokens (identical to landing page) ─────────────────────────────────
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
};

// ── Logo mark (diamond + FC) ──────────────────────────────────────────────────
function LogoMark({ size = 32, dark = false }) {
  const bg   = dark ? C.gold        : C.espresso;
  const fg   = dark ? C.espressoDeep: C.cream;
  const gold = dark ? C.espressoDeep: C.gold;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="4" fill={bg}/>
      <polygon points="16,4 28,16 16,28 4,16" fill={gold} opacity="0.9"/>
      <text x="16" y="20.5" textAnchor="middle" fontFamily="'DM Sans',sans-serif"
            fontSize="8" fontWeight="700" fill={fg} letterSpacing="0.5">FC</text>
    </svg>
  );
}

// ── Navigation (identical to landing page) ────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle = {
    position:       "fixed",
    top:            0,
    left:           0,
    right:          0,
    zIndex:         100,
    transition:     "all .3s ease",
    background:     scrolled ? "rgba(250,248,244,.96)" : "transparent",
    backdropFilter: scrolled ? "blur(12px)"            : "none",
    borderBottom:   scrolled ? `1px solid ${C.creamBorder}` : "1px solid transparent",
  };

  const linkStyle = {
    fontFamily:     "'DM Sans',sans-serif",
    fontSize:       11,
    fontWeight:     500,
    letterSpacing:  "0.12em",
    textTransform:  "uppercase",
    color:          C.textLight,
    textDecoration: "none",
    transition:     "color .2s",
    cursor:         "pointer",
  };

  const btnDarkStyle = {
    ...linkStyle,
    color:        C.cream,
    background:   C.espresso,
    border:       `1.5px solid ${C.espresso}`,
    borderRadius: 2,
    padding:      "8px 20px",
    display:      "inline-block",
  };

  const btnOutlineStyle = {
    ...linkStyle,
    color:        C.espresso,
    background:   "transparent",
    border:       `1.5px solid ${C.espresso}`,
    borderRadius: 2,
    padding:      "8px 20px",
    display:      "inline-block",
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px",
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    height:72 }}>
        {/* Logo */}
        <Link href="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
          <LogoMark size={32}/>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700,
                         fontSize:16, letterSpacing:"0.06em",
                         textTransform:"uppercase", color:C.espresso }}>
            FinalCount
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display:"flex", alignItems:"center", gap:32 }}
             className="desktop-nav">
          <Link href="/how-it-works" style={{ ...linkStyle, color:C.espresso, fontWeight:700 }}>How it works</Link>
          <Link href="/#demo"        style={linkStyle}>Live demo</Link>
          <Link href="/#pricing"     style={linkStyle}>Pricing</Link>
        </div>

        {/* Desktop CTA buttons */}
        <div style={{ display:"flex", alignItems:"center", gap:12 }}
             className="desktop-nav">
          <Link href="/#waitlist" style={btnDarkStyle}>Join Waitlist</Link>
          <Link href="/dashboard" style={btnOutlineStyle}>Log in</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-menu-btn"
          style={{ background:"none", border:"none", cursor:"pointer",
                   display:"none", padding:4 }}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.espresso} strokeWidth="2">
            {mobileOpen
              ? <><line x1="18" y1="6" x2="6"  y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ background:C.cream, borderTop:`1px solid ${C.creamBorder}`,
                      padding:"20px 24px 28px", display:"flex", flexDirection:"column", gap:20 }}>
          <Link href="/how-it-works" style={{ ...linkStyle, color:C.espresso, fontWeight:700 }} onClick={() => setMobileOpen(false)}>How it works</Link>
          <Link href="/#demo"        style={linkStyle} onClick={() => setMobileOpen(false)}>Live demo</Link>
          <Link href="/#pricing"     style={linkStyle} onClick={() => setMobileOpen(false)}>Pricing</Link>
          <div style={{ height:1, background:C.creamBorder }}/>
          <Link href="/#waitlist" style={{ ...btnDarkStyle, textAlign:"center" }} onClick={() => setMobileOpen(false)}>Join Waitlist</Link>
          <Link href="/dashboard"  style={{ ...btnOutlineStyle, textAlign:"center" }} onClick={() => setMobileOpen(false)}>Log in</Link>
        </div>
      )}
    </nav>
  );
}

// ── Step data ──────────────────────────────────────────────────────────────────
const STEPS = [
  {
    number: "01",
    title:  "You upload your guest list",
    body:   "Start with a simple spreadsheet — guest names and phone numbers, nothing more. No complicated setup, no onboarding call. We'll handle everything from here.",
    detail: "FinalCount accepts a standard .csv or Google Sheet. We map the columns automatically, so even a messy export from your venue's system works perfectly.",
    visual: "spreadsheet",
  },
  {
    number: "02",
    title:  "Guests receive a personal text",
    body:   "Each guest gets a warm, personalized message from your dedicated FinalCount number — the same one printed on your invitation. It feels like it came from you.",
    detail: "Messages are sent in batches to avoid spam filters. The assistant introduces itself by name (e.g. \"I'm helping Sarah & Mike\") so guests know exactly what it's about.",
    visual: "sms",
  },
  {
    number: "03",
    title:  "Real conversation happens",
    body:   "Guests reply however feels natural — a full paragraph, a quick yes, even a voice memo transcription. The AI understands all of it and asks smart follow-up questions.",
    detail: "If someone says \"probably just me, depends on work\" the assistant flags them as tentative and follows up closer to the date. No ambiguous responses slip through.",
    visual: "chat",
  },
  {
    number: "04",
    title:  "Your spreadsheet updates itself",
    body:   "Every reply is parsed and synced to your Google Sheet in real time. RSVP status, plus-one, dietary needs, event attendance — all in the right columns, automatically.",
    detail: "Share the live sheet with your planner, venue coordinator, or caterer. They always see the latest data without you lifting a finger.",
    visual: "sheet",
  },
  {
    number: "05",
    title:  "Guests print the number on their invitation",
    body:   "Your dedicated number goes right on the invitation card. Guests who haven't replied yet can text in at any time — the assistant picks up the conversation seamlessly.",
    detail: "This is the moment that makes FinalCount stand out. No portal link to click, no app to download. If they can text, they can RSVP — even grandma.",
    visual: "invite",
  },
  {
    number: "06",
    title:  "Polite follow-ups run automatically",
    body:   "Guests who haven't responded get a gentle nudge before your RSVP deadline. You set the date; we handle the awkward reminders so you don't have to.",
    detail: "Follow-ups are timed to feel human — not automated. One nudge, spaced appropriately, with a warm tone that reflects your event's personality.",
    visual: "followup",
  },
];

// ── Inline visuals for each step ──────────────────────────────────────────────
function StepVisual({ type }) {
  const base = {
    width:"100%", height:"100%",
    display:"flex", alignItems:"center", justifyContent:"center",
    borderRadius:8,
  };

  if (type === "spreadsheet") return (
    <div style={{ ...base, padding:24 }}>
      <div style={{ width:"100%", border:`1px solid ${C.creamBorder}`,
                    borderRadius:6, overflow:"hidden",
                    fontFamily:"'DM Sans',sans-serif", fontSize:12 }}>
        <div style={{ background:C.espresso, color:C.goldLight,
                      display:"grid", gridTemplateColumns:"2fr 1.2fr 1fr",
                      padding:"8px 14px", fontWeight:600, letterSpacing:"0.08em",
                      fontSize:10, textTransform:"uppercase" }}>
          <span>Guest Name</span><span>Phone</span><span>Events</span>
        </div>
        {[
          ["Margaret & Tom Liu",   "+1 (843) 555-0182", "All"],
          ["Uncle Dave",           "+1 (704) 555-0291", "—"],
          ["Cousin Marcus",        "+1 (919) 555-0374", "—"],
          ["Grandma Helen",        "+1 (252) 555-0415", "All"],
          ["Bridesmaid Claire",    "+1 (910) 555-0538", "—"],
        ].map(([name, phone, events], i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"2fr 1.2fr 1fr",
                                padding:"9px 14px",
                                background: i % 2 === 0 ? C.cream : C.creamMid,
                                borderTop:`1px solid ${C.creamBorder}`,
                                color:C.textMid }}>
            <span style={{ fontWeight:500 }}>{name}</span>
            <span style={{ color:C.textFaint }}>{phone}</span>
            <span style={{ color:C.textFaint }}>{events}</span>
          </div>
        ))}
        <div style={{ padding:"10px 14px", background:C.creamMid,
                      borderTop:`1px solid ${C.creamBorder}`,
                      color:C.textFaint, fontSize:10.5, fontStyle:"italic" }}>
          + 95 more rows…
        </div>
      </div>
    </div>
  );

  if (type === "sms") return (
    <div style={{ ...base, padding:24 }}>
      <div style={{ width:260, background:C.espresso, borderRadius:20,
                    padding:"24px 16px 20px", boxShadow:"0 8px 32px rgba(42,33,24,.18)" }}>
        {/* status bar */}
        <div style={{ display:"flex", justifyContent:"space-between",
                      color:C.goldLight, fontSize:10, marginBottom:14,
                      fontFamily:"'DM Sans',sans-serif", opacity:.7 }}>
          <span>9:41</span><span>●●●● 📶 87%</span>
        </div>
        {/* header */}
        <div style={{ textAlign:"center", marginBottom:16 }}>
          <div style={{ width:38, height:38, borderRadius:"50%",
                        background:C.gold, margin:"0 auto 6px",
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
            <LogoMark size={24} dark/>
          </div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600,
                        color:"#fff", fontSize:13 }}>FinalCount</div>
          <div style={{ color:C.goldLight, fontSize:10.5, opacity:.7 }}>+1 (866) 477-9638</div>
        </div>
        {/* bubble */}
        <div style={{ background:"rgba(255,255,255,.1)", borderRadius:"16px 16px 4px 16px",
                      padding:"11px 14px", color:"#fff",
                      fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:14,
                      lineHeight:1.55, marginBottom:8 }}>
          Hey Margaret! 👋 I'm helping Sarah &amp; Mike finalize their guest list. Will you and Tom be joining for the wedding on June 14th?
        </div>
        <div style={{ textAlign:"right", color:C.goldLight, fontSize:10, opacity:.55,
                      fontFamily:"'DM Sans',sans-serif", marginBottom:12 }}>Delivered</div>
        {/* typing indicator */}
        <div style={{ display:"flex", justifyContent:"flex-end", gap:4, marginTop:4 }}>
          <div style={{ background:C.gold, borderRadius:"16px 16px 16px 4px",
                        padding:"10px 14px", display:"flex", gap:5, alignItems:"center" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width:6, height:6, borderRadius:"50%",
                                    background:C.espresso, opacity:.6,
                                    animation:`bounce .9s ease-in-out ${i*.15}s infinite` }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (type === "chat") return (
    <div style={{ ...base, padding:20, flexDirection:"column", gap:8 }}>
      {[
        { from:"guest", text:"We'll both be there!! Jan is gluten-free btw. Skipping the Friday thing but definitely Saturday 🎉" },
        { from:"bot",   text:"Wonderful! Confirmed you and Jan for Saturday. Her gluten-free diet is flagged for the caterer. See you both then! 💐" },
        { from:"guest", text:"Oh wait — Jan might not be able to make it. Work is being weird. I'll let you know closer to the date?" },
        { from:"bot",   text:"No worries! I've updated Jan to Tentative and will follow up a week before. Just you is confirmed for Saturday for now. 😊" },
      ].map((msg, i) => (
        <div key={i} style={{ display:"flex",
                               justifyContent: msg.from === "guest" ? "flex-end" : "flex-start" }}>
          <div style={{
            maxWidth:"80%",
            background:   msg.from === "guest" ? C.gold        : C.cream,
            color:        msg.from === "guest" ? C.espressoDeep: C.textMid,
            borderRadius: msg.from === "guest" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
            padding:      "9px 13px",
            fontFamily:   "'Cormorant Garamond',Georgia,serif",
            fontSize:     13.5,
            lineHeight:   1.55,
            border:       msg.from === "bot" ? `1px solid ${C.creamBorder}` : "none",
          }}>
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );

  if (type === "sheet") return (
    <div style={{ ...base, padding:20 }}>
      <div style={{ width:"100%", border:`1px solid ${C.creamBorder}`,
                    borderRadius:6, overflow:"hidden",
                    fontFamily:"'DM Sans',sans-serif", fontSize:11 }}>
        <div style={{ background:"#1a73e8", color:"#fff",
                      display:"grid", gridTemplateColumns:"1.8fr 1fr 0.8fr 1.2fr 1.2fr",
                      padding:"7px 12px", fontWeight:600,
                      fontSize:10, letterSpacing:"0.05em" }}>
          <span>Name</span><span>RSVP</span><span>+1</span><span>Dietary</span><span>Events</span>
        </div>
        {[
          { name:"Margaret Liu", rsvp:"✓ Confirmed", plus1:"Tom",    diet:"Gluten-free", events:"Sat only",  color:"#e8f5e9" },
          { name:"Uncle Dave",   rsvp:"✗ Declined",  plus1:"—",      diet:"—",           events:"—",         color:"#fce8e8" },
          { name:"Cousin Marcus",rsvp:"⏳ Pending",  plus1:"—",      diet:"—",           events:"—",         color:"#fffde7" },
          { name:"Grandma Helen",rsvp:"✓ Confirmed", plus1:"—",      diet:"Low sodium",  events:"All",       color:"#e8f5e9" },
        ].map((row, i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"1.8fr 1fr 0.8fr 1.2fr 1.2fr",
                                padding:"8px 12px", background:row.color,
                                borderTop:`1px solid ${C.creamBorder}`,
                                color:C.textMid, fontSize:11 }}>
            <span style={{ fontWeight:500 }}>{row.name}</span>
            <span>{row.rsvp}</span>
            <span>{row.plus1}</span>
            <span style={{ fontSize:10 }}>{row.diet}</span>
            <span style={{ fontSize:10 }}>{row.events}</span>
          </div>
        ))}
        <div style={{ padding:"6px 12px", background:"#f8f9fa",
                      borderTop:`1px solid ${C.creamBorder}`,
                      color:"#888", fontSize:10, fontStyle:"italic" }}>
          Auto-synced · Last updated just now
        </div>
      </div>
    </div>
  );

  if (type === "invite") return (
    <div style={{ ...base, padding:24 }}>
      <div style={{ width:220, background:"#faf8f4",
                    border:`1.5px solid #c9b99a`,
                    padding:"24px 22px 20px",
                    textAlign:"center",
                    boxShadow:"0 4px 18px rgba(0,0,0,.07)",
                    position:"relative" }}>
        <div style={{ position:"absolute", inset:6, border:"0.75px solid #d9c9a8", pointerEvents:"none" }}/>
        <div style={{ fontFamily:"'Playfair Display',Georgia,serif",
                      fontStyle:"italic", fontSize:18, color:"#3a2f24", marginBottom:4 }}>
          Charlotte
        </div>
        <div style={{ color:"#8a7155", fontSize:14, marginBottom:4 }}>&amp;</div>
        <div style={{ fontFamily:"'Playfair Display',Georgia,serif",
                      fontStyle:"italic", fontSize:18, color:"#3a2f24", marginBottom:12 }}>
          James
        </div>
        <div style={{ height:"0.75px", background:"#c9b99a", margin:"0 16px 12px" }}/>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                      fontSize:8.5, letterSpacing:"2.5px", textTransform:"uppercase",
                      color:"#9c8a73", marginBottom:12 }}>
          June 14, 2026 · Charleston, SC
        </div>
        {/* RSVP box */}
        <div style={{ border:"0.75px solid #c9b99a", background:"rgba(201,185,154,.07)",
                      padding:"11px 14px 10px" }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                        fontSize:7.5, letterSpacing:"3px", textTransform:"uppercase",
                        color:"#8a7155", marginBottom:6 }}>RSVP by June 1st</div>
          <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                        fontStyle:"italic", fontSize:12, color:"#4a3d30",
                        lineHeight:1.55, marginBottom:7 }}>
            Text your name to
          </div>
          <div style={{ fontFamily:"'Playfair Display',Georgia,serif",
                        fontStyle:"italic", fontSize:15, color:"#3a2f24",
                        letterSpacing:"0.5px", marginBottom:7 }}>
            +1 (866) 477-9638
          </div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                        fontSize:7, letterSpacing:"0.3px", color:"#b0a090",
                        lineHeight:1.7, borderTop:"0.5px solid #d9c9a8", paddingTop:7 }}>
            Msg &amp; data rates may apply.<br/>Reply STOP to unsubscribe.
          </div>
        </div>
      </div>
    </div>
  );

  if (type === "followup") return (
    <div style={{ ...base, padding:20, flexDirection:"column", gap:10 }}>
      {/* Timeline */}
      {[
        { day:"Day 1",    label:"Initial invitation sent",        done:true  },
        { day:"Day 14",   label:"First follow-up to non-replies", done:true  },
        { day:"Day 21",   label:"Final nudge before deadline",    done:false },
        { day:"Day 30",   label:"RSVP deadline",                  done:false },
      ].map((item, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ width:56, fontFamily:"'DM Sans',sans-serif",
                        fontSize:10, fontWeight:600, letterSpacing:"0.08em",
                        color: item.done ? C.gold : C.textFaint,
                        textTransform:"uppercase", flexShrink:0, textAlign:"right" }}>
            {item.day}
          </div>
          <div style={{ width:12, height:12, borderRadius:"50%", flexShrink:0,
                        background: item.done ? C.gold        : "transparent",
                        border:     item.done ? "none"        : `2px solid ${C.creamBorder}` }}/>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12.5,
                        color: item.done ? C.textMid : C.textFaint }}>
            {item.label}
          </div>
        </div>
      ))}
      {/* connector lines */}
      <style>{`
        @keyframes bounce {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)}
        }
      `}</style>
    </div>
  );

  return null;
}

// ── FAQ section data ──────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Do guests need to download an app or create an account?",
    a: "No. Everything happens over native SMS — the same messaging app already on every phone. There's nothing to download, no link to click, and no account to create. If your guest can text a friend, they can RSVP perfectly.",
  },
  {
    q: "What happens if a guest replies with something confusing?",
    a: "The AI is built to handle real human replies — messy paragraphs, emoji-only responses, mid-sentence changes of plan. If it genuinely can't parse a reply, it asks a polite clarifying question. You can also override any entry from the dashboard at any time.",
  },
  {
    q: "Can guests RSVP after the deadline?",
    a: "Yes. The number stays active as long as your account is live. Late replies are still captured and synced to your sheet — you'll just see them marked with the date they came in.",
  },
  {
    q: "How does the dedicated phone number work?",
    a: "Every couple gets their own dedicated toll-free number when they sign up. That's the number you print on your invitations. All replies to that number come only to you — no shared inboxes, no cross-event confusion.",
  },
  {
    q: "Can I track attendance for a rehearsal dinner, ceremony, and after-party separately?",
    a: "Yes. Multi-day tracking is available on The Grand Affair and Extravaganza plans. Each event gets its own column in the spreadsheet, and the assistant asks about each one separately.",
  },
  {
    q: "What languages does the assistant support?",
    a: "English and Spanish are supported on all plans. Multilingual support (French, Mandarin, Portuguese, and more) is available on The Extravaganza plan — useful for larger international guest lists.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ maxWidth:760, margin:"0 auto", padding:"80px 24px 100px" }}>
      <div style={{ textAlign:"center", marginBottom:52 }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:10,
                      letterSpacing:"0.2em", textTransform:"uppercase",
                      color:C.gold, marginBottom:12 }}>
          Common questions
        </div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                     fontSize:"clamp(28px,4vw,42px)", fontWeight:400,
                     color:C.text, margin:0, lineHeight:1.2 }}>
          Everything you need to know
        </h2>
      </div>

      <div style={{ border:`1px solid ${C.creamBorder}`, borderRadius:8, overflow:"hidden" }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderTop: i > 0 ? `1px solid ${C.creamBorder}` : "none" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width:"100%", textAlign:"left", background:"none", border:"none",
                       padding:"20px 24px", cursor:"pointer",
                       display:"flex", justifyContent:"space-between", alignItems:"center",
                       gap:16 }}>
              <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                             fontSize:18, fontWeight:400, color:C.text, lineHeight:1.3 }}>
                {faq.q}
              </span>
              <span style={{ color:C.gold, fontSize:22, lineHeight:1, flexShrink:0,
                             transform: open === i ? "rotate(45deg)" : "none",
                             transition:"transform .2s" }}>
                +
              </span>
            </button>
            {open === i && (
              <div style={{ padding:"0 24px 20px",
                            fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                            fontSize:15, color:C.textLight, lineHeight:1.7 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CTA banner ────────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section style={{ background:C.espresso, padding:"80px 24px" }}>
      <div style={{ maxWidth:640, margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:10,
                      letterSpacing:"0.22em", textTransform:"uppercase",
                      color:C.gold, marginBottom:16 }}>
          Limited Beta Access
        </div>
        <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                     fontSize:"clamp(28px,4vw,44px)", fontWeight:400,
                     color:C.cream, margin:"0 0 14px", lineHeight:1.2 }}>
          Take your evenings back.
        </h2>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                    fontSize:16, color:C.goldLight, lineHeight:1.7,
                    margin:"0 0 36px", opacity:.85 }}>
          We're onboarding a select group of couples for our private beta at flat launch pricing.
          Drop your email to reserve your spot.
        </p>
        <Link href="/#waitlist"
          style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600,
                   fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase",
                   color:C.espresso, background:C.gold,
                   padding:"14px 36px", borderRadius:2,
                   textDecoration:"none", display:"inline-block",
                   transition:"opacity .2s" }}>
          Request Early Access →
        </Link>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                    fontSize:12, color:C.textFaint, marginTop:16, opacity:.6 }}>
          No spam. Just your access link when we're ready.
        </p>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ borderTop:`1px solid ${C.creamBorder}`,
                     padding:"32px 24px",
                     background:C.cream }}>
      <div style={{ maxWidth:1200, margin:"0 auto",
                    display:"flex", justifyContent:"space-between",
                    alignItems:"center", flexWrap:"wrap", gap:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <LogoMark size={24}/>
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700,
                         fontSize:13, letterSpacing:"0.08em",
                         textTransform:"uppercase", color:C.espresso }}>
            FinalCount.
          </span>
        </div>
        <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                    fontSize:12, color:C.textFaint, margin:0 }}>
          © 2026 · Built for perfection · Passes the Grandmother Test
        </p>
      </div>
    </footer>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  return (
    <>
      <Head>
        <title>How It Works — FinalCount</title>
        <meta name="description" content="See exactly how FinalCount automates your wedding RSVP process — from guest list upload to real-time Google Sheets sync."/>
        <meta property="og:title" content="How It Works — FinalCount"/>
        <meta property="og:description" content="Upload a guest list. Guests text to RSVP. Your spreadsheet fills itself."/>
        <meta property="og:url" content="https://getfinalcount.com/how-it-works"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital@1&display=swap" rel="stylesheet"/>
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: ${C.cream}; }

        .desktop-nav { display: flex !important; }
        .mobile-menu-btn { display: none !important; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .step-grid { flex-direction: column !important; }
          .step-visual-wrap { width: 100% !important; height: 260px !important; min-height: unset !important; }
          .step-text-wrap { width: 100% !important; }
          .step-row-reverse { flex-direction: column !important; }
        }

        @keyframes bounce {
          0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)}
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                    background:C.cream, color:C.text,
                    minHeight:"100vh", overflowX:"hidden" }}>
        <Nav/>

        {/* ── Hero ── */}
        <section style={{ paddingTop:140, paddingBottom:72,
                          textAlign:"center", maxWidth:800, margin:"0 auto",
                          padding:"140px 24px 72px" }}>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:10,
                        letterSpacing:"0.22em", textTransform:"uppercase",
                        color:C.gold, marginBottom:18, animation:"fadeUp .6s ease both" }}>
            The full picture
          </div>
          <h1 style={{ fontSize:"clamp(36px,5.5vw,64px)", fontWeight:400,
                       lineHeight:1.1, margin:"0 0 20px",
                       animation:"fadeUp .7s .1s ease both" }}>
            From guest list to final count —<br/>
            <em style={{ color:C.textFaint }}>completely hands-free.</em>
          </h1>
          <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                      fontSize:"clamp(15px,2vw,18px)", color:C.textLight,
                      lineHeight:1.75, maxWidth:580, margin:"0 auto 36px",
                      animation:"fadeUp .7s .2s ease both" }}>
            Six steps. No portals. No awkward phone calls.<br/>
            Here's exactly how FinalCount works.
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap",
                        animation:"fadeUp .7s .3s ease both" }}>
            <Link href="/#demo"
              style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:11,
                       letterSpacing:"0.14em", textTransform:"uppercase",
                       color:C.cream, background:C.espresso,
                       padding:"13px 28px", borderRadius:2,
                       textDecoration:"none", border:`1.5px solid ${C.espresso}` }}>
              See live demo
            </Link>
            <Link href="/#waitlist"
              style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:11,
                       letterSpacing:"0.14em", textTransform:"uppercase",
                       color:C.espresso, background:"transparent",
                       padding:"13px 28px", borderRadius:2,
                       textDecoration:"none", border:`1.5px solid ${C.espresso}` }}>
              Join waitlist
            </Link>
          </div>
        </section>

        {/* ── Thin decorative rule ── */}
        <div style={{ maxWidth:1100, margin:"0 auto 0", padding:"0 24px" }}>
          <div style={{ height:"0.75px", background:`linear-gradient(90deg, transparent, ${C.creamBorder} 20%, ${C.gold} 50%, ${C.creamBorder} 80%, transparent)` }}/>
        </div>

        {/* ── Steps ── */}
        <section style={{ maxWidth:1100, margin:"0 auto", padding:"80px 24px 60px" }}>
          {STEPS.map((step, i) => {
            const isEven = i % 2 === 1;
            return (
              <div key={i} style={{ marginBottom: i < STEPS.length - 1 ? 80 : 40,
                                    position:"relative" }}>
                {/* connector line (not on last) */}
                {i < STEPS.length - 1 && (
                  <div style={{ position:"absolute", left:"50%", bottom:-40,
                                transform:"translateX(-50%)",
                                width:"0.75px", height:40,
                                background:`linear-gradient(to bottom, ${C.creamBorder}, transparent)` }}/>
                )}

                <div
                  className={`step-grid${isEven ? " step-row-reverse" : ""}`}
                  style={{ display:"flex",
                            flexDirection: isEven ? "row-reverse" : "row",
                            alignItems:"center",
                            gap:"clamp(32px,5vw,72px)" }}>

                  {/* Visual panel */}
                  <div className="step-visual-wrap"
                       style={{ flex:"0 0 auto", width:"48%",
                                height:320, minHeight:280,
                                background:C.creamMid,
                                border:`1px solid ${C.creamBorder}`,
                                borderRadius:10, overflow:"hidden" }}>
                    <StepVisual type={step.visual}/>
                  </div>

                  {/* Text panel */}
                  <div className="step-text-wrap" style={{ flex:1 }}>
                    <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700,
                                  fontSize:11, letterSpacing:"0.18em",
                                  textTransform:"uppercase", color:C.gold,
                                  marginBottom:12, display:"flex",
                                  alignItems:"center", gap:10 }}>
                      <span style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                                     fontSize:40, fontWeight:300, color:C.creamBorder,
                                     lineHeight:1, marginRight:2 }}>
                        {step.number}
                      </span>
                      Step {step.number}
                    </div>
                    <h2 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                                 fontSize:"clamp(24px,3vw,34px)", fontWeight:400,
                                 color:C.text, lineHeight:1.2, margin:"0 0 16px" }}>
                      {step.title}
                    </h2>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                                fontSize:16, color:C.textLight, lineHeight:1.75,
                                margin:"0 0 14px" }}>
                      {step.body}
                    </p>
                    <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                                fontSize:13.5, color:C.textFaint, lineHeight:1.75,
                                margin:0, paddingLeft:14,
                                borderLeft:`2px solid ${C.goldLight}` }}>
                      {step.detail}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}
        </section>

        {/* ── Twilio / Invitation callout ── */}
        <section style={{ background:C.creamMid, borderTop:`1px solid ${C.creamBorder}`,
                          borderBottom:`1px solid ${C.creamBorder}`,
                          padding:"64px 24px" }}>
          <div style={{ maxWidth:900, margin:"0 auto",
                        display:"flex", alignItems:"center",
                        gap:"clamp(32px,5vw,64px)", flexWrap:"wrap" }}>
            {/* Mini invitation */}
            <div style={{ flex:"0 0 auto", width:200,
                          background:"#faf8f4", border:"1.5px solid #c9b99a",
                          padding:"20px 18px 18px", textAlign:"center",
                          boxShadow:"0 4px 18px rgba(0,0,0,.06)",
                          position:"relative" }}>
              <div style={{ position:"absolute", inset:5,
                            border:"0.75px solid #d9c9a8", pointerEvents:"none" }}/>
              <div style={{ fontFamily:"'Playfair Display',Georgia,serif",
                            fontStyle:"italic", fontSize:15, color:"#3a2f24",
                            marginBottom:3 }}>Charlotte</div>
              <div style={{ color:"#8a7155", fontSize:12, marginBottom:3 }}>&amp;</div>
              <div style={{ fontFamily:"'Playfair Display',Georgia,serif",
                            fontStyle:"italic", fontSize:15, color:"#3a2f24",
                            marginBottom:10 }}>James</div>
              <div style={{ height:"0.75px", background:"#c9b99a", margin:"0 12px 10px" }}/>
              <div style={{ border:"0.75px solid #c9b99a", background:"rgba(201,185,154,.07)",
                            padding:"9px 10px 8px" }}>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                              fontSize:6.5, letterSpacing:"2.5px", textTransform:"uppercase",
                              color:"#8a7155", marginBottom:5 }}>RSVP by June 1st</div>
                <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                              fontStyle:"italic", fontSize:11, color:"#4a3d30",
                              lineHeight:1.5, marginBottom:5 }}>
                  Text your name to
                </div>
                <div style={{ fontFamily:"'Playfair Display',Georgia,serif",
                              fontStyle:"italic", fontSize:12.5, color:"#3a2f24",
                              letterSpacing:"0.3px", marginBottom:6 }}>
                  +1 (866) 477-9638
                </div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                              fontSize:6, letterSpacing:"0.2px", color:"#b0a090",
                              lineHeight:1.65, borderTop:"0.5px solid #d9c9a8", paddingTop:6 }}>
                  Msg &amp; data rates may apply.<br/>Reply STOP to unsubscribe.
                </div>
              </div>
            </div>

            {/* Copy */}
            <div style={{ flex:1, minWidth:260 }}>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:10,
                            letterSpacing:"0.2em", textTransform:"uppercase",
                            color:C.gold, marginBottom:14 }}>
                The invitation moment
              </div>
              <h3 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif",
                           fontSize:"clamp(22px,3vw,32px)", fontWeight:400,
                           color:C.text, margin:"0 0 14px", lineHeight:1.25 }}>
                One number.<br/>Printed on every invitation.
              </h3>
              <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                          fontSize:15, color:C.textLight, lineHeight:1.75, margin:0 }}>
                Your dedicated FinalCount number goes right in the RSVP section of your invitation.
                Guests who haven't replied yet — or want to update their answer — just text in at any time.
                No portal, no app, no friction. Just a text from someone who cares enough to show up.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <FAQ/>

        {/* ── CTA ── */}
        <CTABanner/>

        {/* ── Footer ── */}
        <Footer/>
      </div>
    </>
  );
}
