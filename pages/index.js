import React, { useState } from 'react';

const SCENARIOS = [
  {
    id: 1,
    buttonLabel: "They're both coming (with a dietary note)",
    botPrompt: "Hey Uncle Dave! Finalizing the headcount for Sarah & Mike's wedding. Will you and Aunt Clara make it to the Rehearsal Dinner and Reception?",
    userReply: "Yes we are coming to both, but Aunt Clara is strictly gluten-free now!",
    botConfirm: "Perfect, got you down for 2 guests for both events, and noted the gluten-free diet for Aunt Clara. Spreadsheet updated!",
    parsed: { name: "Uncle Dave & Aunt Clara", status: "Confirmed", events: "All events", plusOne: "Yes", dietary: "Gluten-Free" }
  },
  {
    id: 2,
    buttonLabel: "They changed their mind last minute",
    botPrompt: "Hi Emily! Checking in for Sarah & Mike's wedding. Are you still able to make the welcome dinner and the ceremony?",
    userReply: "Actually it's just going to be me now, sorry! My partner has to work. Can't wait for the ceremony though!",
    botConfirm: "No problem at all, I've updated your RSVP to just 1 guest for the ceremony. See you there!",
    parsed: { name: "Emily Jenkins", status: "Confirmed", events: "Ceremony Only", plusOne: "No", dietary: "None" }
  },
  {
    id: 3,
    buttonLabel: "They can't make it",
    botPrompt: "Hi Cousin Marcus! We are finalizing the numbers for the wedding this weekend. Will you be joining us?",
    userReply: "Oh no, I am so bummed but my flight got canceled and I won't be able to make it. Sending so much love!!",
    botConfirm: "Oh no, we will miss you! I've updated the list. Thank you for letting us know!",
    parsed: { name: "Cousin Marcus", status: "Declined", events: "None", plusOne: "N/A", dietary: "N/A" }
  },
  {
    id: 4,
    buttonLabel: "It's a multi-day wedding",
    botPrompt: "Hi David! We're finalizing counts for the weekend. Will you make it to the Welcome Party (Fri), Ceremony (Sat), and Farewell Brunch (Sun)?",
    userReply: "Hey! Yes to the Welcome Party and Ceremony, but we have to hit the road early Sunday so we'll skip the brunch.",
    botConfirm: "Got it! Logged you for Friday and Saturday, skipping Sunday. Safe travels!",
    parsed: { name: "David & Guest", status: "Confirmed", events: "Fri & Sat", plusOne: "Yes", dietary: "None" }
  }
];

export default function FinalCountLanding() {
  const [isRunning, setIsRunning] = useState(false);
  const [activeScenario, setActiveScenario] = useState(null);
  const [demoStep, setDemoStep] = useState(0); 
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Pick a scenario above to start the interactive walkthrough." }
  ]);
  const [spreadsheetData, setSpreadsheetData] = useState({
    name: "Uncle Dave & Aunt Clara", status: "Pending", events: "—", plusOne: "—", dietary: "—"
  });

  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSimulate = (scenario) => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveScenario(scenario.id);
    
    // Step 1: Outbound Assistant Text
    setDemoStep(1);
    setChatMessages([{ sender: 'bot', text: scenario.botPrompt }]);
    
    // Step 2: Guest replies naturally
    setTimeout(() => {
      setDemoStep(2);
      setChatMessages(prev => [...prev, { sender: 'user', text: scenario.userReply }]);
      
      // Step 3: AI intercepts and responds
      setTimeout(() => {
        setDemoStep(3);
        setChatMessages(prev => [...prev, { sender: 'bot', text: scenario.botConfirm }]);
        
        // Step 4: Spreadsheet Updates Live
        setTimeout(() => {
          setDemoStep(4);
          setSpreadsheetData(scenario.parsed);
          
          // Cool down and clear presentation states
          setTimeout(() => {
            setIsRunning(false);
            setDemoStep(0);
            setActiveScenario(null);
          }, 6000);
        }, 4500);
      }, 5000);
    }, 4500);
  };

  const renderInstructionText = () => {
    switch (demoStep) {
      case 1: return "👉 STEP 1: FinalCount checks in automatically via a friendly, personalized SMS prompt.";
      case 2: return "💬 STEP 2: The guest texts back a messy, standard response without opening any external links.";
      case 3: return "🧠 STEP 3: The AI parses the exact intent, confirms the multi-event itinerary, and acknowledges the notes.";
      case 4: return "📊 STEP 4: The structured metrics update across your live master workbook logs instantly!";
      default: return "Click any premium scenario block below to engage the animated simulator:";
    }
  };

  return (
    <div style={{ backgroundColor: '#faf7f2', color: '#332a22', fontFamily: 'sans-serif', minHeight: '100vh', paddingBottom: '80px' }}>
      <style>{`
        .wrapper { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
        .nav { display: flex; justify-content: space-between; align-items: center; padding: 32px 0; border-b: 1px solid #ebdccb; }
        
        /* Premium CSS Micro-Animations */
        .hero-lift { animation: heroLift 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .badge-pulse { animation: badgePulse 2s infinite ease-in-out; }
        
        @keyframes heroLift {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(191, 168, 143, 0.4); }
          50% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(191, 168, 143, 0); }
        }
        @keyframes messageIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .demo-container { background: #f0eae1; border: 1px solid #ebdccb; border-radius: 16px; padding: 48px 24px; margin: 40px 0; position: relative; }
        
        /* High-Contrast Standalone Walkthrough Instruction Banner */
        .instruction-banner { background: #332a22; color: #faf7f2; padding: 20px 24px; border-radius: 12px; font-family: serif; font-size: 18px; font-weight: 500; text-align: center; margin-bottom: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); border: 1px solid #bfa88f; transition: all 0.4s ease; }
        .instruction-banner.active-mode { background: #bfa88f; color: #332a22; font-weight: bold; box-shadow: 0 0 0 4px rgba(51,42,34,0.1); }

        .btn-preset { background: #ffffff; color: #332a22; border: 2px solid #bfa88f; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; margin: 6px; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .btn-preset:hover:not(:disabled) { background: #332a22; color: #ffffff; border-color: #332a22; }
        .btn-preset.active { background: #332a22; color: #ffffff; border-color: #332a22; }
        .btn-preset:disabled:not(.active) { opacity: 0.35; background: #faf7f2; border-color: #ebdccb; color: #aaa; cursor: not-allowed; }

        .grid-layout { display: grid; grid-template-columns: 1fr; gap: 40px; margin-top: 40px; position: relative; }
        @media (min-width: 768px) { .grid-layout { grid-template-columns: 1fr 1fr; } }
        
        /* Flawless Inverted Spotlight Masks */
        .spotlight-mask { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .spotlight-dimmed { opacity: 0.25; filter: blur(1px); transform: scale(0.99); }
        .spotlight-focused { opacity: 1; filter: none; transform: scale(1.01); }
        .focus-aura { box-shadow: 0 0 0 6px rgba(191, 168, 143, 0.5), 0 25px 60px rgba(0,0,0,0.2) !important; }

        .phone-mock { background-color: #ffffff; border: 12px solid #1a1a1a; border-radius: 40px; height: 600px; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); overflow: hidden; position: relative; }
        .sheet-mock { background: white; border-radius: 12px; border: 1px solid #ebdccb; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.08); }
        .sheet-header { background: #332a22; color: #faf7f2; padding: 16px; font-family: serif; font-size: 14px; display: flex; justify-content: space-between; }
        
        .table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
        .table th { background: #faf7f2; color: #665a4e; font-size: 11px; text-transform: uppercase; padding: 12px; border-bottom: 1px solid #ebdccb; }
        .table td { padding: 14px 12px; border-bottom: 1px solid #f0eae1; color: #444; }
        
        .animated-msg { animation: messageIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .msg-bubble { max-width: 80%; padding: 10px 14px; border-radius: 18px; margin-bottom: 8px; font-size: 14px; line-height: 1.4; word-wrap: break-word; white-space: normal; }
        .msg-bot { background: #E5E5EA; color: #000000; align-self: flex-start; border-bottom-left-radius: 4px; }
        .msg-user { background: #007AFF; color: white; align-self: flex-end; margin-left: auto; border-bottom-right-radius: 4px; }
        
        .card-pricing { background: #332a22; color: white; border-radius: 16px; padding: 48px; text-align: center; max-width: 450px; margin: 60px auto 0 auto; }
        .btn-cta { background: #332a22; color: white; border: none; padding: 14px 28px; border-radius: 6px; font-weight: bold; cursor: pointer; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; transition: background 0.2s; }
        .btn-cta:hover { background: #4a3e33; }
        .input-text { width: 100%; padding: 12px; border-radius: 6px; border: 1px solid #ccc; margin: 12px 0; box-sizing: border-box; }
      `}</style>

      <div className="wrapper">
        {/* Top Navbar */}
        <div className="nav">
          <div style={{ fontSize: '24px', fontFamily: 'serif', fontWeight: 'bold' }}>
            FinalCount<span style={{ color: '#bfa88f' }}>.</span>
          </div>
          <a href="#waitlist"><button className="btn-cta text-shadow" style={{ padding: '10px 20px' }}>Join Waitlist</button></a>
        </div>

        {/* Hero Section Container */}
        <div className="hero hero-lift">
          <div className="badge badge-pulse">The Ultimate Wedding RSVP Solution</div>
          <h1 className="title">Stop chasing RSVPs. Let AI get your final numbers.</h1>
          <p className="subtitle">
            The automated text assistant that chats with your guests, tracks dietary restrictions, maps multi-day events, and updates your spreadsheet automatically.
          </p>
          <div style={{ marginTop: '32px' }}>
            <a href="#demo"><button className="btn-cta">Get Your Evenings Back</button></a>
          </div>
        </div>

        {/* INTERACTIVE DEMO GRAPHIC CONSOLE */}
        <div id="demo" className="demo-container">
          
          {/* Dynamic Extracted Instruction Banner Panel */}
          <div className={`instruction-banner ${isRunning ? 'active-mode' : ''}`}>
            {renderInstructionText()}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ maxWidth: '850px', margin: '0 auto' }}>
              {SCENARIOS.map((scenario) => (
                <button 
                  key={scenario.id} 
                  onClick={() => handleSimulate(scenario)} 
                  disabled={isRunning}
                  className={`btn-preset ${activeScenario === scenario.id ? 'active' : ''}`}
                >
                  {scenario.buttonLabel}
                </button>
              ))}
            </div>
          </div>

          <div className="grid-layout">
            
            {/* PHONE BLOCK LAYER */}
            <div className={`spotlight-mask ${isRunning && demoStep < 4 ? 'spotlight-focused' : isRunning ? 'spotlight-dimmed' : ''}`}>
              <h4 style={{ margin: '0 0 16px 0', fontFamily: 'serif', color: '#665a4e', fontSize: '18px', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>Guest's Phone</h4>
              
              <div className={`phone-mock ${isRunning && demoStep < 4 ? 'focus-aura' : ''}`}>
                
                {/* Fixed, Space-Aware iOS Status Header Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px 10px 24px', fontSize: '14px', fontWeight: 'bold', borderBottom: '1px solid #f4f4f5', backgroundColor: '#ffffff', zIndex: 10 }}>
                  <span>9:41</span>
                  {/* Structural System Notch Frame */}
                  <div style={{ width: '90px', height: '28px', backgroundColor: 'black', borderRadius: '20px' }}></div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M1 9.5H3V11.5H1V9.5ZM5 7.5H7V11.5H5V7.5ZM9 4.5H11V11.5H9V4.5ZM13 1.5H15V11.5H13V1.5Z" fill="black"/></svg>
                    <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 1.5C4.5 1.5 1.5 3 0 4.5L8 11.5L16 4.5C14.5 3 11.5 1.5 8 1.5Z" fill="black"/></svg>
                    <svg width="22" height="10" viewBox="0 0 22 10" fill="none"><rect x="0.5" y="0.5" width="19" height="9" rx="2.5" stroke="black"/><path d="M22 3.5V6.5C22 7.05228 21.5523 7.5 21 7.5H20V2.5H21C21.5523 2.5 22 2.94772 22 3.5Z" fill="black"/><rect x="2" y="2" width="14" height="6" rx="1" fill="black"/></svg>
                  </div>
                </div>

                {/* Contact Banner Deck */}
                <div style={{ borderBottom: '1px solid #E5E5EA', paddingBottom: '12px', paddingTop: '8px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#ffffff', zIndex: 5 }}>
                  <div style={{ position: 'absolute', left: '16px', bottom: '20px', color: '#007AFF', fontSize: '24px', cursor: 'pointer' }}>⟨</div>
                  <div style={{ width: '45px', height: '45px', backgroundColor: '#bfa88f', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '18px', marginBottom: '4px' }}>FC</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#1a1a1a' }}>FinalCount Assistant ›</div>
                </div>

                {/* Message Body Track List Grid */}
                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflowY: 'auto', backgroundColor: '#ffffff' }}>
                  {chatMessages.map((m, i) => (
                    <div key={i} className="animated-msg" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <div className={`msg-bubble ${m.sender === 'bot' ? 'msg-bot' : 'msg-user'}`}>
                        {m.text}
                      </div>
                      
                      {/* Operational Timestamp Indicators */}
                      {(m.sender === 'user' || (m.sender === 'bot' && demoStep >= 3 && i === chatMessages.length - 1 && m.text.includes("Spreadsheet updated!"))) && (
                        <span style={{ alignSelf: 'flex-end', fontSize: '10px', color: '#8E8E93', marginTop: '2px', marginBottom: '8px', fontWeight: '500' }}>Delivered</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Static Input Footer Chassis Area */}
                <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E5EA', display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '24px', backgroundColor: '#ffffff' }}>
                  <div style={{ color: '#007AFF', fontSize: '28px', fontWeight: '300' }}>+</div>
                  <div style={{ flex: 1, border: '1px solid #E5E5EA', borderRadius: '20px', padding: '6px 12px', fontSize: '14px', color: '#8E8E93', display: 'flex', justifyContent: 'space-between' }}>
                    <span>iMessage</span>
                    <span>🎤</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SPREADSHEET LAYER SECTION - ISOLATED HIGHLIGHT */}
            <div className={`spotlight-mask ${isRunning && demoStep === 4 ? 'spotlight-focused' : isRunning ? 'spotlight-dimmed' : ''}`}>
              <h4 style={{ margin: '0 0 16px 0', fontFamily: 'serif', color: '#665a4e', fontSize: '18px', textAlign: 'center', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 'bold' }}>Your Spreadsheet</h4>

              <div className={`sheet-mock ${isRunning && demoStep === 4 ? 'focus-aura' : ''}`}>
                <div className="sheet-header">
                  <span>Sarah & Mike — Live Master Log</span>
                  <span style={{ color: '#bfa88f', fontSize: '12px', fontWeight: 'bold' }}>● Sync Activated</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Guest</th>
                        <th>RSVP Status</th>
                        <th>Attending</th>
                        <th>+1</th>
                        <th>Dietary Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ color: '#bbb' }}>
                        <td style={{ fontWeight: '600', color: '#aaa' }}>Aunt Lisa</td>
                        <td><span style={{ color: '#15803d', background: '#dcfce7', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>Confirmed</span></td>
                        <td>All events</td>
                        <td>No</td>
                        <td>Vegan</td>
                      </tr>
                      {/* Dynamic spreadsheet row highlighting logic */}
                      <tr style={{ background: demoStep === 4 ? '#fffbeb' : 'transparent', borderLeft: demoStep === 4 ? '4px solid #bfa88f' : 'none', transition: 'background-color 0.4s ease' }}>
                        <td style={{ fontWeight: '600', color: '#332a22' }}>{spreadsheetData.name}</td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '4px', 
                            fontWeight: 'bold',
                            fontSize: '12px',
                            color: spreadsheetData.status === 'Confirmed' ? '#15803d' : spreadsheetData.status === 'Declined' ? '#b91c1c' : '#78350f',
                            background: spreadsheetData.status === 'Confirmed' ? '#dcfce7' : spreadsheetData.status === 'Declined' ? '#fee2e2' : '#fef3c7'
                          }}>
                            {spreadsheetData.status}
                          </span>
                        </td>
                        <td style={{ fontWeight: '500', color: '#332a22' }}>{spreadsheetData.events}</td>
                        <td style={{ fontWeight: '500', color: '#332a22' }}>{spreadsheetData.plusOne}</td>
                        <td style={{ fontWeight: '500', color: '#332a22' }}>{spreadsheetData.dietary}</td>
                      </tr>
                      <tr style={{ color: '#bbb' }}>
                        <td style={{ fontWeight: '600', color: '#bbb' }}>Cousin Marcus</td>
                        <td><span style={{ color: '#78350f', background: '#fef3c7', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>Pending</span></td>
                        <td>—</td>
                        <td>—</td>
                        <td>—</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Live Metric Tracker Pods */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #ebdccb', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: '#665a4e' }}>CONFIRMED GUESTS</div>
                  <div style={{ fontSize: '28px', fontFamily: 'serif', color: '#332a22', marginTop: '4px' }}>{demoStep === 4 && spreadsheetData.status === 'Confirmed' ? '2' : '1'}</div>
                </div>
                <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #ebdccb', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: '#665a4e' }}>PENDING PROFILES</div>
                  <div style={{ fontSize: '28px', fontFamily: 'serif', color: '#332a22', marginTop: '4px' }}>{demoStep === 4 && spreadsheetData.status !== 'Pending' ? '1' : '2'}</div>
                </div>
                <div style={{ flex: 1, background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #ebdccb', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', color: '#665a4e' }}>DECLINED TOTALS</div>
                  <div style={{ fontSize: '28px', fontFamily: 'serif', color: '#332a22', marginTop: '4px' }}>{demoStep === 4 && spreadsheetData.status === 'Declined' ? '1' : '0'}</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* BACKEND DASHBOARD REVIEW TRANSCRIPT PANEL MODULE */}
        <div style={{ padding: '80px 0', borderTop: '1px solid #ebdccb' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div className="badge">100% Transparency</div>
            <h2 style={{ fontFamily: 'serif', fontSize: '36px', color: '#332a22', marginTop: '16px' }}>Total Transparency. Read Every Reply.</h2>
            <p style={{ color: '#665a4e', fontSize: '18px', maxWidth: '650px', margin: '16px auto 0 auto', lineHeight: '1.6' }}>
              Want to verify an annotation parameters or read an individual guest statement manually? Your custom workspace dashboard archives entire conversational logs instantly.
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #ebdccb', padding: '0', display: 'flex', overflow: 'hidden', height: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.04)' }}>
            {/* Sidebar Folder Directory Navigation */}
            <div style={{ width: '35%', borderRight: '1px solid #ebdccb', background: '#faf7f2', display: 'flex', flexDirection: 'column' }}>
               <div style={{ padding: '16px', borderBottom: '1px solid #ebdccb', fontWeight: 'bold', fontSize: '14px', color: '#665a4e', textTransform: 'uppercase', letterSpacing: '1px' }}>Guest Message Feeds</div>
               <div style={{ padding: '16px', background: '#fff', borderBottom: '1px solid #ebdccb', borderLeft: '4px solid #332a22', cursor: 'pointer' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#332a22' }}>Uncle Dave & Aunt Clara</div>
                  <div style={{ fontSize: '12px', color: '#15803d', marginTop: '6px', fontWeight: '600' }}>● Confirmed Checked</div>
               </div>
               <div style={{ padding: '16px', borderBottom: '1px solid #ebdccb', cursor: 'pointer', opacity: 0.5 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#332a22' }}>Cousin Marcus</div>
                  <div style={{ fontSize: '12px', color: '#78350f', marginTop: '6px', fontWeight: '600' }}>● Pending Queue</div>
               </div>
            </div>
            
            {/* Right Active Conversation Stream Module */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
               <div style={{ padding: '16px 24px', borderBottom: '1px solid #ebdccb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#332a22' }}>Transcript History: Uncle Dave</div>
                  <button className="btn-preset" style={{ margin: 0, padding: '8px 16px', fontSize: '12px' }}>Override RSVP State</button>
               </div>
               <div style={{ padding: '24px', flex: 1, overflowY: 'auto', background: '#faf7f2', display: 'flex', flexDirection: 'column' }}>
                  
                  <div style={{ marginBottom: '24px' }}>
                     <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#665a4e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>FinalCount Engine Dispatched</span>
                     <div style={{ background: '#E5E5EA', padding: '12px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px', display: 'inline-block', marginTop: '6px', fontSize: '14px', color: '#000', maxWidth: '80%', lineHeight: '1.4' }}>
                        Hey Uncle Dave! Finalizing the headcount for Sarah & Mike's wedding. Will you and Aunt Clara make it to the Rehearsal Dinner and Reception?
                     </div>
                  </div>
                  
                  <div style={{ marginBottom: '24px', alignSelf: 'flex-end', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                     <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#665a4e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Incoming Guest Response SMS</span>
                     <div style={{ background: '#007AFF', padding: '12px 16px', borderRadius: '16px', borderBottomRightRadius: '4px', display: 'inline-block', marginTop: '6px', fontSize: '14px', color: '#fff', textAlign: 'left', maxWidth: '80%', lineHeight: '1.4' }}>
                        Yes we are coming to both, but Aunt Clara is strictly gluten-free now!
                     </div>
                  </div>

               </div>
            </div>
          </div>
        </div>

        {/* Lead Waitlist Form Pod Module */}
        <div id="waitlist" className="card-pricing">
          <span style={{ textTransform: 'uppercase', fontSize: '11px', letterSpacing: '2px', color: '#bfa88f', fontWeight: 'bold' }}>Limited Launch Allocation</span>
          <h3 style={{ fontFamily: 'serif', fontSize: '32px', margin: '12px 0' }}>Join the Private Beta</h3>
          <p style={{ color: '#dfd3c3', fontSize: '14px', lineHeight: '1.6', fontWeight: '300' }}>
            We're letting a select group of couples lock in standard concierge features for a single, low fixed flat fee before regular commercial licensing starts.
          </p>
          
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', color: '#332a22', textAlign: 'left', marginTop: '32px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '12px 0' }}>
                <span style={{ fontSize: '28px' }}>✨</span>
                <h4 style={{ fontFamily: 'serif', margin: '12px 0 4px 0', fontSize: '20px' }}>Reservation Secured</h4>
                <p style={{ fontSize: '14px', color: '#665a4e' }}>We will email you access credentials shortly.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#665a4e' }}>Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-text" 
                  placeholder="Enter your email address..."
                />
                <button type="submit" className="btn-cta" style={{ width: '100%', marginTop: '12px', fontSize: '14px', padding: '16px' }}>Request Invitation</button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
