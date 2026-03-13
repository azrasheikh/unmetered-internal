import React, { useState, useEffect, useMemo } from 'react';
import { Home, Users, FileText, Image, Target, Search, Plus, X, Edit2, Save, Activity, AlertCircle, Clock, DollarSign, TrendingUp, Calendar, Trash2, Flag, CheckSquare, Square, BarChart2, Camera, Link2, MessageSquare } from 'lucide-react';

const DEAL_STAGES = ['Lead','Contacted','Proposal Sent','Negotiating','Closed Won','Closed Lost'];
const REVENUE_TYPES = ['Editorial Licensing','Assignment','Retainer','Brand Partnership','Athlete Direct','Other'];
const CONTENT_STATUSES = ['Idea','Draft','Scheduled','Published'];
const GOAL_STATUSES = ['Not Started','In Progress','Done'];
const STAGE_COLORS = {'Lead':'bg-gray-700 text-gray-300','Contacted':'bg-blue-900 text-blue-300','Proposal Sent':'bg-purple-900 text-purple-300','Negotiating':'bg-yellow-900 text-yellow-300','Closed Won':'bg-green-900 text-green-300','Closed Lost':'bg-red-900 text-red-400'};
const CONTENT_STATUS_COLORS = {'Idea':'bg-purple-900 text-purple-300','Draft':'bg-blue-900 text-blue-300','Scheduled':'bg-yellow-900 text-yellow-300','Published':'bg-green-900 text-green-300'};
const GOAL_STATUS_COLORS = {'Not Started':'bg-gray-700 text-gray-400','In Progress':'bg-yellow-900 text-yellow-300','Done':'bg-green-900 text-green-300'};

const GOTHAM_SUB = [{id:'overview',label:'Overview'},{id:'matches',label:'Matches'},{id:'shots',label:'Shot List'},{id:'calendar',label:'Content Calendar'},{id:'archive',label:'Archive'},{id:'growth',label:'Growth'},{id:'victory',label:'Victory+'}];
const VICTORY_STATUSES = ['Not Started','In Progress','Done'];
const VICTORY_STATUS_COLORS = {'Not Started':'bg-gray-700 text-gray-400','In Progress':'bg-yellow-900 text-yellow-300','Done':'bg-green-900 text-green-300'};
const LICENSING_POTENTIAL = ['High','Medium','Low'];

const INIT_MATCHES = [
  {id:1,label:'Match 1',date:'',opponent:'',photosCaptured:0,videoClips:0,storylineNotes:'',bestMoment:'',contentReady:false,fanCultureNote:'',playerEmotionNote:'',celebrationNote:'',crowdReactionNote:'',mediaUrl:''},
  {id:2,label:'Match 2',date:'',opponent:'',photosCaptured:0,videoClips:0,storylineNotes:'',bestMoment:'',contentReady:false,fanCultureNote:'',playerEmotionNote:'',celebrationNote:'',crowdReactionNote:'',mediaUrl:''},
];
const INIT_SHOTS = [
  {id:1,category:'Stadium establishing shot',target:1,captured:0,notes:''},
  {id:2,category:'Fan portraits',target:2,captured:0,notes:''},
  {id:3,category:'Supporters section',target:2,captured:0,notes:''},
  {id:4,category:'Player warmups',target:2,captured:0,notes:''},
  {id:5,category:'Player intensity',target:3,captured:0,notes:''},
  {id:6,category:'Goal celebration',target:1,captured:0,notes:''},
  {id:7,category:'Team celebration',target:1,captured:0,notes:''},
  {id:8,category:'Coach reaction',target:1,captured:0,notes:''},
  {id:9,category:'Crowd reaction',target:2,captured:0,notes:''},
  {id:10,category:'Post-match emotion',target:2,captured:0,notes:''},
];
const INIT_CALENDAR = [
  {id:1,day:1,postType:'Matchday carousel',contentSource:'Match 1',captionTheme:'Gotham Matchday story',platform:'IG / X',posted:false,notes:''},
  {id:2,day:2,postType:'Goal celebration',contentSource:'Match 1',captionTheme:'Crowd eruption',platform:'IG',posted:false,notes:''},
  {id:3,day:3,postType:'Supporters section',contentSource:'Match 1',captionTheme:'Fan culture',platform:'IG / X',posted:false,notes:''},
  {id:4,day:4,postType:'Player closeup',contentSource:'Match 1',captionTheme:'Player intensity',platform:'IG',posted:false,notes:''},
  {id:5,day:5,postType:'Video clip',contentSource:'Match 1',captionTheme:'Crowd reaction',platform:'IG / TikTok',posted:false,notes:''},
  {id:6,day:6,postType:'Fan portrait',contentSource:'Match 1',captionTheme:'Gotham supporter',platform:'IG',posted:false,notes:''},
  {id:7,day:7,postType:'Stadium cinematic',contentSource:'Match 1',captionTheme:'Red Bull Arena atmosphere',platform:'IG',posted:false,notes:''},
  {id:8,day:8,postType:'Bench reaction',contentSource:'Match 1',captionTheme:'Team energy',platform:'IG / X',posted:false,notes:''},
  {id:9,day:9,postType:'Opponent player',contentSource:'Match 1',captionTheme:'League storytelling',platform:'IG',posted:false,notes:''},
  {id:10,day:10,postType:'Goalkeeper save',contentSource:'Match 1',captionTheme:'Athletic moment',platform:'IG',posted:false,notes:''},
  {id:11,day:11,postType:'Supporter chant video',contentSource:'Match 1',captionTheme:'Stadium energy',platform:'IG / TikTok',posted:false,notes:''},
  {id:12,day:12,postType:'Behind the scenes',contentSource:'Editing process',captionTheme:'Creator insight',platform:'IG',posted:false,notes:''},
  {id:13,day:13,postType:'Player celebration',contentSource:'Match 1',captionTheme:'Emotion',platform:'IG',posted:false,notes:''},
  {id:14,day:14,postType:'Crowd moment',contentSource:'Match 1',captionTheme:'Fans reacting',platform:'IG / X',posted:false,notes:''},
  {id:15,day:15,postType:'Matchday carousel',contentSource:'Match 2',captionTheme:'Gotham Matchday story',platform:'IG / X',posted:false,notes:''},
  {id:16,day:16,postType:'Goal celebration',contentSource:'Match 2',captionTheme:'Crowd eruption',platform:'IG',posted:false,notes:''},
  {id:17,day:17,postType:'Supporters section',contentSource:'Match 2',captionTheme:'Fan culture',platform:'IG / X',posted:false,notes:''},
  {id:18,day:18,postType:'Player closeup',contentSource:'Match 2',captionTheme:'Player intensity',platform:'IG',posted:false,notes:''},
  {id:19,day:19,postType:'Video clip',contentSource:'Match 2',captionTheme:'Crowd reaction',platform:'IG / TikTok',posted:false,notes:''},
  {id:20,day:20,postType:'Fan portrait',contentSource:'Match 2',captionTheme:'Gotham supporter',platform:'IG',posted:false,notes:''},
  {id:21,day:21,postType:'Stadium cinematic',contentSource:'Match 2',captionTheme:'Red Bull Arena atmosphere',platform:'IG',posted:false,notes:''},
  {id:22,day:22,postType:'Bench reaction',contentSource:'Match 2',captionTheme:'Team energy',platform:'IG / X',posted:false,notes:''},
  {id:23,day:23,postType:'Opponent player',contentSource:'Match 2',captionTheme:'League storytelling',platform:'IG',posted:false,notes:''},
  {id:24,day:24,postType:'Goalkeeper save',contentSource:'Match 2',captionTheme:'Athletic moment',platform:'IG',posted:false,notes:''},
  {id:25,day:25,postType:'Supporter chant video',contentSource:'Match 2',captionTheme:'Stadium energy',platform:'IG / TikTok',posted:false,notes:''},
  {id:26,day:26,postType:'Behind the scenes',contentSource:'Editing process',captionTheme:'Creator insight',platform:'IG',posted:false,notes:''},
  {id:27,day:27,postType:'Player celebration',contentSource:'Match 2',captionTheme:'Emotion',platform:'IG',posted:false,notes:''},
  {id:28,day:28,postType:'Crowd moment',contentSource:'Match 2',captionTheme:'Fans reacting',platform:'IG / X',posted:false,notes:''},
  {id:29,day:29,postType:'Victory+ teaser',contentSource:'Best of sprint',captionTheme:'The Unmetered brand',platform:'IG / X',posted:false,notes:''},
  {id:30,day:30,postType:'30-day recap',contentSource:'Sprint highlights',captionTheme:'The Unmetered story',platform:'IG / X',posted:false,notes:''},
];
const INIT_ARCHIVE = [
  {id:1,photoId:'001',match:'Match 1',subject:'Celebration',category:'Player emotion',licensingPotential:'High',posted:false,mediaUrl:'',notes:''},
  {id:2,photoId:'002',match:'Match 1',subject:'Supporters section',category:'Fan culture',licensingPotential:'High',posted:false,mediaUrl:'',notes:''},
  {id:3,photoId:'003',match:'Match 1',subject:'Stadium wide',category:'Atmosphere',licensingPotential:'Medium',posted:false,mediaUrl:'',notes:''},
];
const INIT_GROWTH = [
  {id:1,week:'Week 1',igFollowers:'',xFollowers:'',totalPosts:'',bestPost:'',notes:''},
  {id:2,week:'Week 2',igFollowers:'',xFollowers:'',totalPosts:'',bestPost:'',notes:''},
  {id:3,week:'Week 3',igFollowers:'',xFollowers:'',totalPosts:'',bestPost:'',notes:''},
  {id:4,week:'Week 4',igFollowers:'',xFollowers:'',totalPosts:'',bestPost:'',notes:''},
];
const INIT_VICTORY = [
  {id:1,task:'Capture Gotham coverage',owner:'Azra',status:'In Progress',notes:''},
  {id:2,task:'Build visual library — select best storytelling photos',owner:'Azra',status:'Not Started',notes:'For pitch deck'},
  {id:3,task:'Build one-page proposal — Sunday Night NWSL concept',owner:'Azra',status:'Not Started',notes:''},
  {id:4,task:'Gather engagement metrics',owner:'Azra',status:'Not Started',notes:'Social proof'},
  {id:5,task:'Identify Victory+ contacts',owner:'Azra',status:'Not Started',notes:'For outreach'},
  {id:6,task:'Send pilot proposal',owner:'Azra',status:'Not Started',notes:'After 30-day experiment'},
];

const INIT_CONTACTS = [
  {id:1,name:'Gotham FC',type:'Team',stage:'Contacted',revenue:3000,revenueType:'Retainer',notes:'Reached out re: season coverage. Follow up after March game.',followUp:'2026-03-15',lastContact:'2026-02-20'},
  {id:2,name:"Just Women's Sports",type:'Media',stage:'Lead',revenue:500,revenueType:'Editorial Licensing',notes:'Great newsletter audience. Pitch photo licensing.',followUp:'2026-03-10',lastContact:''},
  {id:3,name:'Nike Women',type:'Brand',stage:'Lead',revenue:10000,revenueType:'Brand Partnership',notes:'Long shot but huge upside. Need media kit first.',followUp:'2026-04-01',lastContact:''},
];
const INIT_NOTES = [
  {id:1,title:'Media Kit Draft',body:'Need: bio, audience stats, rate card, sample work links, past clients.',date:'2026-02-28',tag:'Strategy'},
  {id:2,title:'Gotham FC Pitch Notes',body:'Emphasize existing portfolio. Offer one complimentary game to show quality.',date:'2026-03-01',tag:'Sales'},
];
const INIT_CONTENT = [
  {id:1,title:'2023 She Believes Cup Gallery',type:'Photo Gallery',status:'Published',platform:'Website',date:'2026-01-10',notes:'Strong portfolio piece. License to Getty?'},
  {id:2,title:'Gotham FC vs Chelsea FC',type:'Photo Gallery',status:'Published',platform:'Website',date:'2026-02-01',notes:'Tag Gotham FC on IG for reshare.'},
  {id:3,title:'Day in the Life - Game Day',type:'TikTok/Reel',status:'Idea',platform:'TikTok',date:'',notes:'Show behind the lens process. Easy win for reach.'},
];
const INIT_GOALS = [
  {id:1,goal:'Land first retainer client',deadline:'2026-06-30',status:'In Progress'},
  {id:2,goal:'Build Instagram to 1,000 followers',deadline:'2026-09-30',status:'Not Started'},
  {id:3,goal:'Complete media kit',deadline:'2026-03-31',status:'In Progress'},
  {id:4,goal:'License 3 photos to editorial outlets',deadline:'2026-06-30',status:'Not Started'},
];

function useLS(key, init) {
  const [val, setVal] = useState(() => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; } });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal];
}

function Badge({label, color}) { return <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${color}`}>{label}</span>; }

function Modal({title, onClose, children, wide}) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-900 border border-gray-800 rounded-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} p-6`}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20}/></button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inp = 'w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-white/30';
const btnP = 'flex-1 py-2 rounded-lg text-sm font-semibold bg-white text-black hover:bg-gray-200';
const btnS = 'flex-1 py-2 rounded-lg text-sm font-semibold border border-gray-700 text-gray-300 hover:bg-gray-800';
const NAV = [{id:'home',label:'Home',Icon:Home},{id:'crm',label:'CRM',Icon:Users},{id:'notes',label:'Notes',Icon:FileText},{id:'content',label:'Content',Icon:Image},{id:'strategy',label:'Strategy',Icon:Target},{id:'gotham',label:'Gotham Plan',Icon:Flag}];

function RowNoteModal({title, note, mediaUrl, onSave, onClose}) {
  const [n, setN] = useState(note||'');
  const [m, setM] = useState(mediaUrl||'');
  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-3">
        <textarea className={inp} rows={4} placeholder="Notes…" value={n} onChange={e=>setN(e.target.value)}/>
        <div>
          <label className="text-xs text-gray-500 block mb-1 flex items-center gap-1"><Link2 size={11}/>Media URL (Google Drive, Dropbox, etc.)</label>
          <input className={inp} placeholder="Paste link to photos/video folder…" value={m} onChange={e=>setM(e.target.value)}/>
        </div>
      </div>
      <div className="flex gap-2 mt-5">
        <button onClick={()=>onSave(n,m)} className={btnP}>Save</button>
        <button onClick={onClose} className={btnS}>Cancel</button>
      </div>
    </Modal>
  );
}

export default function App() {
  const [section, setSection] = useState('home');
  const [contacts, setContacts] = useLS('um2_contacts', INIT_CONTACTS);
  const [notes, setNotes] = useLS('um2_notes', INIT_NOTES);
  const [content, setContent] = useLS('um2_content', INIT_CONTENT);
  const [goals, setGoals] = useLS('um2_goals', INIT_GOALS);
  const [actLog, setActLog] = useLS('um2_activity', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActivity, setShowActivity] = useState(false);

  const [contactModal, setContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactForm, setContactForm] = useState({});
  const [noteModal, setNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({});
  const [contentModal, setContentModal] = useState(false);
  const [contentForm, setContentForm] = useState({});
  const [goalModal, setGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({});
  const [gothamTab, setGothamTab] = useState('overview');
  const [matches, setMatches] = useLS('um2_gotham_matches', INIT_MATCHES);
  const [shots, setShots] = useLS('um2_gotham_shots', INIT_SHOTS);
  const [calItems, setCalItems] = useLS('um2_gotham_calendar', INIT_CALENDAR);
  const [archive, setArchive] = useLS('um2_gotham_archive', INIT_ARCHIVE);
  const [growth, setGrowth] = useLS('um2_gotham_growth', INIT_GROWTH);
  const [victory, setVictory] = useLS('um2_gotham_victory', INIT_VICTORY);
  const [rowNoteModal, setRowNoteModal] = useState(null);
  const [matchEditModal, setMatchEditModal] = useState(null);
  const [archiveModal, setArchiveModal] = useState(false);
  const [archiveForm, setArchiveForm] = useState({});

  const today = new Date().toISOString().split('T')[0];
  const pipeline = contacts.filter(c=>c.stage!=='Closed Lost').reduce((s,c)=>s+Number(c.revenue||0),0);
  const won = contacts.filter(c=>c.stage==='Closed Won').reduce((s,c)=>s+Number(c.revenue||0),0);
  const overdue = contacts.filter(c=>c.followUp&&c.followUp<=today&&!['Closed Won','Closed Lost'].includes(c.stage));

  function log(action) { setActLog(prev=>[{id:Date.now(),action,ts:new Date().toISOString()},...prev].slice(0,50)); }

  const searchResults = useMemo(()=>{
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase(); const r = [];
    contacts.forEach(c=>{ if(c.name.toLowerCase().includes(q)||c.notes?.toLowerCase().includes(q)) r.push({section:'crm',label:c.name,sub:c.stage}); });
    notes.forEach(n=>{ if(n.title.toLowerCase().includes(q)||n.body?.toLowerCase().includes(q)) r.push({section:'notes',label:n.title,sub:n.tag}); });
    content.forEach(c=>{ if(c.title.toLowerCase().includes(q)) r.push({section:'content',label:c.title,sub:c.status}); });
    goals.forEach(g=>{ if(g.goal.toLowerCase().includes(q)) r.push({section:'strategy',label:g.goal,sub:g.status}); });
    return r;
  },[searchQuery,contacts,notes,content,goals]);

  function exportData() {
    const blob = new Blob([JSON.stringify({contacts,notes,content,goals},null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='unmetered-backup.json'; a.click(); URL.revokeObjectURL(url);
  }
  function importData(e) {
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => { try { const d=JSON.parse(ev.target.result); if(d.contacts) setContacts(d.contacts); if(d.notes) setNotes(d.notes); if(d.content) setContent(d.content); if(d.goals) setGoals(d.goals); log('Imported backup'); } catch { alert('Invalid file'); } };
    reader.readAsText(file); e.target.value='';
  }

  const blankC = {name:'',type:'',stage:'Lead',revenue:'',revenueType:'',notes:'',followUp:'',lastContact:''};
  function openNewContact() { setEditingContact(null); setContactForm(blankC); setContactModal(true); }
  function openEditContact(c) { setEditingContact(c); setContactForm({...c}); setContactModal(true); }
  function saveContact() {
    if (!contactForm.name?.trim()) return;
    if (editingContact) { setContacts(contacts.map(c=>c.id===editingContact.id?{...c,...contactForm}:c)); log(`Updated: ${contactForm.name}`); }
    else { setContacts([...contacts,{...contactForm,id:Date.now()}]); log(`Added contact: ${contactForm.name}`); }
    setContactModal(false);
  }

  const blankN = {title:'',body:'',tag:'',date:today};
  function openNewNote() { setEditingNote(null); setNoteForm(blankN); setNoteModal(true); }
  function openEditNote(n) { setEditingNote(n); setNoteForm({...n}); setNoteModal(true); }
  function saveNote() {
    if (!noteForm.title?.trim()) return;
    if (editingNote) { setNotes(notes.map(n=>n.id===editingNote.id?{...n,...noteForm}:n)); log(`Updated note: ${noteForm.title}`); }
    else { setNotes([...notes,{...noteForm,id:Date.now()}]); log(`Added note: ${noteForm.title}`); }
    setNoteModal(false);
  }

  const blankCo = {title:'',type:'',status:'Idea',platform:'',date:'',notes:''};
  function saveContentItem() {
    if (!contentForm.title?.trim()) return;
    setContent([...content,{...contentForm,id:Date.now()}]); log(`Added content: ${contentForm.title}`);
    setContentModal(false); setContentForm(blankCo);
  }

  const blankG = {goal:'',deadline:'',status:'Not Started'};
  function saveGoal() {
    if (!goalForm.goal?.trim()) return;
    setGoals([...goals,{...goalForm,id:Date.now()}]); log(`Added goal: ${goalForm.goal}`);
    setGoalModal(false); setGoalForm(blankG);
  }

  function fmtTime(ts) {
    const diff = Date.now()-new Date(ts); const m=Math.floor(diff/60000),h=Math.floor(diff/3600000),d=Math.floor(diff/86400000);
    if(m<60) return `${m}m ago`; if(h<24) return `${h}h ago`; return `${d}d ago`;
  }

  return (
    <div className="flex h-screen bg-black text-white" style={{fontFamily:'system-ui,sans-serif'}}>
      {/* Sidebar */}
      <div className="w-56 bg-gray-950 border-r border-gray-800 flex flex-col shrink-0">
        <div className="px-5 pt-6 pb-5 border-b border-gray-800">
          <div className="text-xs font-bold tracking-[0.2em] text-gray-500">THE</div>
          <div className="text-xl font-black tracking-widest text-white">UNMETERED</div>
          <div className="text-xs text-gray-700 mt-0.5">Business Hub</div>
        </div>
        <div className="px-4 py-3 border-b border-gray-800 relative">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-2.5 text-gray-600"/>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search…" className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"/>
          </div>
          {searchResults && searchResults.length>0 && (
            <div className="absolute left-4 right-4 top-14 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
              {searchResults.map((r,i)=>(
                <button key={i} onClick={()=>{setSection(r.section);setSearchQuery('');}} className="w-full text-left px-4 py-2.5 hover:bg-gray-800 border-b border-gray-800 last:border-0">
                  <div className="text-sm text-white font-medium truncate">{r.label}</div>
                  <div className="text-xs text-gray-500">{r.sub}</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({id,label,Icon})=>(
            <button key={id} onClick={()=>setSection(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${section===id?'bg-white text-black':'text-gray-500 hover:text-white hover:bg-gray-800/60'}`}>
              <Icon size={17}/>{label}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-5 pt-2 border-t border-gray-800 space-y-0.5">
          <button onClick={()=>setShowActivity(true)} className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-white hover:bg-gray-800/60 rounded-xl text-xs transition-all"><Activity size={15}/>Activity</button>
          <button onClick={exportData} className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-white hover:bg-gray-800/60 rounded-xl text-xs transition-all"><Save size={15}/>Export</button>
          <label className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-white hover:bg-gray-800/60 rounded-xl text-xs transition-all cursor-pointer"><FileText size={15}/>Import<input type="file" accept=".json" className="hidden" onChange={importData}/></label>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-auto bg-[#0a0a0a]">

        {/* HOME */}
        {section==='home' && (
          <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-black text-white mb-1">Good to see you.</h1>
            <p className="text-gray-600 mb-8 text-sm">Here's where The Unmetered stands today.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                {label:'Pipeline',value:`$${pipeline.toLocaleString()}`,Icon:DollarSign,c:'text-white'},
                {label:'Closed Won',value:`$${won.toLocaleString()}`,Icon:TrendingUp,c:'text-green-400'},
                {label:'Contacts',value:contacts.length,Icon:Users,c:'text-white'},
                {label:'Overdue',value:overdue.length,Icon:AlertCircle,c:overdue.length>0?'text-red-400':'text-gray-600'},
              ].map(({label,value,Icon,c})=>(
                <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <Icon size={18} className={`mb-3 ${c}`}/>
                  <div className={`text-2xl font-black mb-1 ${c}`}>{value}</div>
                  <div className="text-xs text-gray-600">{label}</div>
                </div>
              ))}
            </div>
            {overdue.length>0 && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-5 mb-5">
                <div className="flex items-center gap-2 mb-3"><AlertCircle size={15} className="text-red-400"/><span className="text-sm font-semibold text-red-400">Overdue Follow-ups</span></div>
                {overdue.map(c=>(
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-red-900/30 last:border-0">
                    <span className="text-sm text-white">{c.name}</span><span className="text-xs text-red-400">Due {c.followUp}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Pipeline</div>
                {contacts.slice(0,4).map(c=>(
                  <div key={c.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <span className="text-sm text-white truncate flex-1 mr-2">{c.name}</span>
                    <Badge label={c.stage} color={STAGE_COLORS[c.stage]}/>
                  </div>
                ))}
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Goals</div>
                {goals.map(g=>(
                  <div key={g.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                    <span className="text-sm text-white truncate flex-1 mr-2">{g.goal}</span>
                    <Badge label={g.status} color={GOAL_STATUS_COLORS[g.status]}/>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CRM */}
        {section==='crm' && (
          <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-2xl font-black text-white">CRM</h2><p className="text-gray-600 text-sm">Contacts & pipeline</p></div>
              <button onClick={openNewContact} className="flex items-center gap-2 bg-white text-black text-sm px-4 py-2 rounded-xl font-semibold hover:bg-gray-200"><Plus size={15}/>Add Contact</button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-5">
              {DEAL_STAGES.map(stage=>{
                const n=contacts.filter(c=>c.stage===stage).length;
                const v=contacts.filter(c=>c.stage===stage).reduce((s,c)=>s+Number(c.revenue||0),0);
                return (
                  <div key={stage} className="bg-gray-900 border border-gray-800 rounded-xl p-3 text-center">
                    <Badge label={stage} color={STAGE_COLORS[stage]}/>
                    <div className="text-xl font-black text-white mt-1.5">{n}</div>
                    {v>0 && <div className="text-xs text-gray-600">${v.toLocaleString()}</div>}
                  </div>
                );
              })}
            </div>
            <div className="space-y-2">
              {contacts.map(c=>(
                <div key={c.id} className={`bg-gray-900 border rounded-2xl p-4 flex gap-4 items-start ${c.followUp&&c.followUp<=today&&!['Closed Won','Closed Lost'].includes(c.stage)?'border-red-900':'border-gray-800'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-white">{c.name}</span>
                      {c.type && <Badge label={c.type} color="bg-gray-800 text-gray-400"/>}
                      <Badge label={c.stage} color={STAGE_COLORS[c.stage]}/>
                      {c.revenue && <Badge label={`$${Number(c.revenue).toLocaleString()} · ${c.revenueType}`} color="bg-green-950 text-green-400"/>}
                    </div>
                    {c.notes && <p className="text-sm text-gray-500 mb-1">{c.notes}</p>}
                    <div className="flex gap-4 text-xs text-gray-700">
                      {c.lastContact && <span className="flex items-center gap-1"><Clock size={10}/>Last: {c.lastContact}</span>}
                      {c.followUp && <span className={`flex items-center gap-1 ${c.followUp<=today&&!['Closed Won','Closed Lost'].includes(c.stage)?'text-red-400 font-medium':''}`}><Calendar size={10}/>Follow up: {c.followUp}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={()=>openEditContact(c)} className="p-2 text-gray-700 hover:text-white border border-gray-800 rounded-lg"><Edit2 size={13}/></button>
                    <button onClick={()=>{setContacts(contacts.filter(x=>x.id!==c.id));log(`Deleted: ${c.name}`);}} className="p-2 text-gray-700 hover:text-red-400 border border-gray-800 rounded-lg"><Trash2 size={13}/></button>
                  </div>
                </div>
              ))}
            </div>
            {contactModal && (
              <Modal title={editingContact?'Edit Contact':'New Contact'} onClose={()=>setContactModal(false)}>
                <div className="space-y-3">
                  <input className={inp} placeholder="Name / Company *" value={contactForm.name||''} onChange={e=>setContactForm({...contactForm,name:e.target.value})}/>
                  <div className="grid grid-cols-2 gap-3">
                    <input className={inp} placeholder="Type (Team, Brand…)" value={contactForm.type||''} onChange={e=>setContactForm({...contactForm,type:e.target.value})}/>
                    <select className={inp} value={contactForm.stage||'Lead'} onChange={e=>setContactForm({...contactForm,stage:e.target.value})}>
                      {DEAL_STAGES.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input className={inp} type="number" placeholder="Revenue ($)" value={contactForm.revenue||''} onChange={e=>setContactForm({...contactForm,revenue:e.target.value})}/>
                    <select className={inp} value={contactForm.revenueType||''} onChange={e=>setContactForm({...contactForm,revenueType:e.target.value})}>
                      <option value="">Revenue type</option>{REVENUE_TYPES.map(r=><option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-gray-500 block mb-1">Last Contact</label><input type="date" className={inp} value={contactForm.lastContact||''} onChange={e=>setContactForm({...contactForm,lastContact:e.target.value})}/></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Follow-up Date</label><input type="date" className={inp} value={contactForm.followUp||''} onChange={e=>setContactForm({...contactForm,followUp:e.target.value})}/></div>
                  </div>
                  <textarea className={inp} rows={3} placeholder="Notes…" value={contactForm.notes||''} onChange={e=>setContactForm({...contactForm,notes:e.target.value})}/>
                </div>
                <div className="flex gap-2 mt-5"><button onClick={saveContact} className={btnP}>Save</button><button onClick={()=>setContactModal(false)} className={btnS}>Cancel</button></div>
              </Modal>
            )}
          </div>
        )}

        {/* NOTES */}
        {section==='notes' && (
          <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-2xl font-black text-white">Notes & Docs</h2><p className="text-gray-600 text-sm">Ideas, pitches, strategy</p></div>
              <button onClick={openNewNote} className="flex items-center gap-2 bg-white text-black text-sm px-4 py-2 rounded-xl font-semibold hover:bg-gray-200"><Plus size={15}/>New Note</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notes.map(n=>(
                <div key={n.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="font-bold text-white">{n.title}</span>
                        {n.tag && <Badge label={n.tag} color="bg-purple-950 text-purple-300"/>}
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">{n.body}</p>
                      <p className="text-xs text-gray-700 mt-3">{n.date}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={()=>openEditNote(n)} className="p-2 text-gray-700 hover:text-white border border-gray-800 rounded-lg"><Edit2 size={13}/></button>
                      <button onClick={()=>{setNotes(notes.filter(x=>x.id!==n.id));log(`Deleted note: ${n.title}`);}} className="p-2 text-gray-700 hover:text-red-400 border border-gray-800 rounded-lg"><Trash2 size={13}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {noteModal && (
              <Modal title={editingNote?'Edit Note':'New Note'} onClose={()=>setNoteModal(false)}>
                <div className="space-y-3">
                  <input className={inp} placeholder="Title *" value={noteForm.title||''} onChange={e=>setNoteForm({...noteForm,title:e.target.value})}/>
                  <div className="grid grid-cols-2 gap-3">
                    <input className={inp} placeholder="Tag (Strategy, Sales…)" value={noteForm.tag||''} onChange={e=>setNoteForm({...noteForm,tag:e.target.value})}/>
                    <input type="date" className={inp} value={noteForm.date||today} onChange={e=>setNoteForm({...noteForm,date:e.target.value})}/>
                  </div>
                  <textarea className={inp} rows={6} placeholder="Write your note…" value={noteForm.body||''} onChange={e=>setNoteForm({...noteForm,body:e.target.value})}/>
                </div>
                <div className="flex gap-2 mt-5"><button onClick={saveNote} className={btnP}>Save</button><button onClick={()=>setNoteModal(false)} className={btnS}>Cancel</button></div>
              </Modal>
            )}
          </div>
        )}

        {/* CONTENT */}
        {section==='content' && (
          <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-2xl font-black text-white">Content</h2><p className="text-gray-600 text-sm">Track, plan, publish</p></div>
              <button onClick={()=>{setContentForm(blankCo);setContentModal(true);}} className="flex items-center gap-2 bg-white text-black text-sm px-4 py-2 rounded-xl font-semibold hover:bg-gray-200"><Plus size={15}/>Add Content</button>
            </div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {CONTENT_STATUSES.map(s=>(
                <span key={s} className={`text-xs px-3 py-1 rounded-full ${CONTENT_STATUS_COLORS[s]}`}>{s} ({content.filter(c=>c.status===s).length})</span>
              ))}
            </div>
            <div className="space-y-2">
              {content.map(c=>(
                <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex gap-4 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-bold text-white">{c.title}</span>
                      {c.type && <Badge label={c.type} color="bg-gray-800 text-gray-400"/>}
                      <Badge label={c.status} color={CONTENT_STATUS_COLORS[c.status]||'bg-gray-800 text-gray-400'}/>
                      {c.platform && <Badge label={c.platform} color="bg-blue-950 text-blue-400"/>}
                    </div>
                    {c.notes && <p className="text-sm text-gray-500">{c.notes}</p>}
                    {c.date && <p className="text-xs text-gray-700 mt-1">{c.date}</p>}
                  </div>
                  <button onClick={()=>{setContent(content.filter(x=>x.id!==c.id));log(`Deleted: ${c.title}`);}} className="p-2 text-gray-700 hover:text-red-400 border border-gray-800 rounded-lg shrink-0"><Trash2 size={13}/></button>
                </div>
              ))}
            </div>
            {contentModal && (
              <Modal title="Add Content" onClose={()=>setContentModal(false)}>
                <div className="space-y-3">
                  <input className={inp} placeholder="Title *" value={contentForm.title||''} onChange={e=>setContentForm({...contentForm,title:e.target.value})}/>
                  <div className="grid grid-cols-2 gap-3">
                    <input className={inp} placeholder="Type (Photo Gallery, Reel…)" value={contentForm.type||''} onChange={e=>setContentForm({...contentForm,type:e.target.value})}/>
                    <select className={inp} value={contentForm.status||'Idea'} onChange={e=>setContentForm({...contentForm,status:e.target.value})}>
                      {CONTENT_STATUSES.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input className={inp} placeholder="Platform (Instagram, TikTok…)" value={contentForm.platform||''} onChange={e=>setContentForm({...contentForm,platform:e.target.value})}/>
                    <input type="date" className={inp} value={contentForm.date||''} onChange={e=>setContentForm({...contentForm,date:e.target.value})}/>
                  </div>
                  <textarea className={inp} rows={3} placeholder="Notes…" value={contentForm.notes||''} onChange={e=>setContentForm({...contentForm,notes:e.target.value})}/>
                </div>
                <div className="flex gap-2 mt-5"><button onClick={saveContentItem} className={btnP}>Save</button><button onClick={()=>setContentModal(false)} className={btnS}>Cancel</button></div>
              </Modal>
            )}
          </div>
        )}

        {/* STRATEGY */}
        {section==='strategy' && (
          <div className="p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div><h2 className="text-2xl font-black text-white">Strategy</h2><p className="text-gray-600 text-sm">Goals & milestones</p></div>
              <button onClick={()=>{setGoalForm(blankG);setGoalModal(true);}} className="flex items-center gap-2 bg-white text-black text-sm px-4 py-2 rounded-xl font-semibold hover:bg-gray-200"><Plus size={15}/>Add Goal</button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {GOAL_STATUSES.map(status=>(
                <div key={status} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center">
                  <Badge label={status} color={GOAL_STATUS_COLORS[status]}/>
                  <div className="text-3xl font-black text-white mt-2">{goals.filter(g=>g.status===status).length}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {goals.map(g=>(
                <div key={g.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-white">{g.goal}</span>
                      <Badge label={g.status} color={GOAL_STATUS_COLORS[g.status]}/>
                    </div>
                    {g.deadline && <p className="text-xs text-gray-600 mt-1 flex items-center gap-1"><Calendar size={10}/>Deadline: {g.deadline}</p>}
                  </div>
                  <select className="bg-gray-800 border border-gray-700 text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none" value={g.status} onChange={e=>{setGoals(goals.map(x=>x.id===g.id?{...x,status:e.target.value}:x));log(`Updated goal status`);}}>
                    {GOAL_STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
                  <button onClick={()=>{setGoals(goals.filter(x=>x.id!==g.id));log(`Deleted goal`);}} className="p-2 text-gray-700 hover:text-red-400 border border-gray-800 rounded-lg"><Trash2 size={13}/></button>
                </div>
              ))}
            </div>
            {goalModal && (
              <Modal title="Add Goal" onClose={()=>setGoalModal(false)}>
                <div className="space-y-3">
                  <input className={inp} placeholder="Goal description *" value={goalForm.goal||''} onChange={e=>setGoalForm({...goalForm,goal:e.target.value})}/>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs text-gray-500 block mb-1">Deadline</label><input type="date" className={inp} value={goalForm.deadline||''} onChange={e=>setGoalForm({...goalForm,deadline:e.target.value})}/></div>
                    <div><label className="text-xs text-gray-500 block mb-1">Status</label>
                      <select className={inp} value={goalForm.status||'Not Started'} onChange={e=>setGoalForm({...goalForm,status:e.target.value})}>
                        {GOAL_STATUSES.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-5"><button onClick={saveGoal} className={btnP}>Save</button><button onClick={()=>setGoalModal(false)} className={btnS}>Cancel</button></div>
              </Modal>
            )}
          </div>
        )}
        {/* GOTHAM PROJECT PLAN */}
        {section==='gotham' && (
          <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-5">
              <h2 className="text-2xl font-black text-white">Gotham Project</h2>
              <p className="text-gray-600 text-sm">30-Day Sprint · NJ/NY Gotham FC · Red Bull Arena</p>
            </div>

            {/* Sub-tab bar */}
            <div className="flex gap-1 mb-6 bg-gray-900 border border-gray-800 rounded-2xl p-1 flex-wrap">
              {GOTHAM_SUB.map(({id,label})=>(
                <button key={id} onClick={()=>setGothamTab(id)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${gothamTab===id?'bg-white text-black':'text-gray-500 hover:text-white'}`}>{label}</button>
              ))}
            </div>

            {/* OVERVIEW */}
            {gothamTab==='overview' && (
              <div className="space-y-5">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Project Goal</div>
                  <p className="text-sm text-gray-300 leading-relaxed">Build a recognizable visual storytelling brand around Gotham matchday while developing a proof of concept for a Victory+ creator partnership.</p>
                  <p className="text-xs text-gray-600 mt-2">Primary focus: NJ/NY Gotham FC coverage at Red Bull Arena</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {label:'Posts Published',value:`${calItems.filter(c=>c.posted).length} / 30`,color:'text-white'},
                    {label:'Shots Captured',value:`${shots.reduce((s,x)=>s+Number(x.captured||0),0)} / ${shots.reduce((s,x)=>s+Number(x.target||0),0)}`,color:'text-white'},
                    {label:'Archive Photos',value:archive.length,color:'text-white'},
                    {label:'Victory+ Tasks',value:`${victory.filter(v=>v.status==='Done').length} / ${victory.length}`,color:victory.filter(v=>v.status==='Done').length===victory.length?'text-green-400':'text-yellow-400'},
                  ].map(({label,value,color})=>(
                    <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                      <div className={`text-2xl font-black mb-1 ${color}`}>{value}</div>
                      <div className="text-xs text-gray-600">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Shot List Progress</div>
                    {shots.map(s=>{
                      const pct = Math.min(100, Math.round((Number(s.captured)/Number(s.target))*100));
                      return (
                        <div key={s.id} className="mb-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400 truncate mr-2">{s.category}</span>
                            <span className={`shrink-0 font-medium ${Number(s.captured)>=Number(s.target)?'text-green-400':'text-gray-500'}`}>{s.captured}/{s.target}</span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-1">
                            <div className={`h-1 rounded-full transition-all ${Number(s.captured)>=Number(s.target)?'bg-green-500':'bg-white/40'}`} style={{width:`${pct}%`}}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">North Star — 30 Day Outcomes</div>
                    {[
                      '2 fully documented Gotham matches',
                      '20–25 social posts published',
                      'Recognizable Matchday storytelling series',
                      'Visual archive for future licensing',
                      'Proof of concept for Victory+ collaboration',
                    ].map((item,i)=>(
                      <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-800 last:border-0">
                        <CheckSquare size={13} className="text-gray-600 mt-0.5 shrink-0"/>
                        <span className="text-xs text-gray-400">{item}</span>
                      </div>
                    ))}
                    <div className="mt-4 pt-3 border-t border-gray-800">
                      <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weekly Workflow</div>
                      {[['Mon','Edit match content'],['Tue–Thu','Publish posts'],['Fri','Engage with community'],['Weekend','Match coverage + new content']].map(([day,task])=>(
                        <div key={day} className="flex gap-2 text-xs py-1">
                          <span className="text-gray-600 w-16 shrink-0">{day}</span>
                          <span className="text-gray-400">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MATCHES */}
            {gothamTab==='matches' && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600">Notes to capture after each game: fan culture moment · player emotion · celebration moment · crowd reaction</p>
                {matches.map(m=>(
                  <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-white text-lg">{m.label}</span>
                          {m.contentReady && <Badge label="Content Ready" color="bg-green-900 text-green-300"/>}
                        </div>
                        {m.date && <p className="text-xs text-gray-600 mt-0.5">{m.date}{m.opponent ? ` · vs ${m.opponent}` : ''}</p>}
                      </div>
                      <button onClick={()=>setMatchEditModal({...m})} className="p-2 text-gray-700 hover:text-white border border-gray-800 rounded-lg shrink-0"><Edit2 size={13}/></button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                      <div className="bg-gray-800 rounded-xl p-3 text-center">
                        <div className="text-2xl font-black text-white">{m.photosCaptured}</div>
                        <div className="text-xs text-gray-600 mt-0.5">Photos</div>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-3 text-center">
                        <div className="text-2xl font-black text-white">{m.videoClips}</div>
                        <div className="text-xs text-gray-600 mt-0.5">Video Clips</div>
                      </div>
                      <div className="bg-gray-800 rounded-xl p-3 text-center col-span-2">
                        <div className="text-sm font-bold text-white truncate">{m.bestMoment || <span className="text-gray-700">Best moment…</span>}</div>
                        <div className="text-xs text-gray-600 mt-0.5">Best Moment</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                      {[
                        {label:'Fan Culture',key:'fanCultureNote',val:m.fanCultureNote},
                        {label:'Player Emotion',key:'playerEmotionNote',val:m.playerEmotionNote},
                        {label:'Celebration',key:'celebrationNote',val:m.celebrationNote},
                        {label:'Crowd Reaction',key:'crowdReactionNote',val:m.crowdReactionNote},
                      ].map(({label,key,val})=>(
                        <div key={key} className="bg-gray-800 rounded-xl px-3 py-2">
                          <div className="text-xs text-gray-600 mb-0.5">{label}</div>
                          <div className="text-xs text-gray-300">{val || <span className="text-gray-700 italic">Add note…</span>}</div>
                        </div>
                      ))}
                    </div>
                    {m.storylineNotes && <p className="text-xs text-gray-500 mb-3 italic">"{m.storylineNotes}"</p>}
                    {m.mediaUrl && (
                      <a href={m.mediaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 mb-2">
                        <Link2 size={11}/>View media folder
                      </a>
                    )}
                  </div>
                ))}
                {matchEditModal && (
                  <Modal title={`Edit ${matchEditModal.label}`} onClose={()=>setMatchEditModal(null)} wide>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs text-gray-500 block mb-1">Date</label><input type="date" className={inp} value={matchEditModal.date||''} onChange={e=>setMatchEditModal({...matchEditModal,date:e.target.value})}/></div>
                        <div><label className="text-xs text-gray-500 block mb-1">Opponent</label><input className={inp} placeholder="vs. Team" value={matchEditModal.opponent||''} onChange={e=>setMatchEditModal({...matchEditModal,opponent:e.target.value})}/></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs text-gray-500 block mb-1">Photos Captured</label><input type="number" className={inp} value={matchEditModal.photosCaptured||0} onChange={e=>setMatchEditModal({...matchEditModal,photosCaptured:Number(e.target.value)})}/></div>
                        <div><label className="text-xs text-gray-500 block mb-1">Video Clips</label><input type="number" className={inp} value={matchEditModal.videoClips||0} onChange={e=>setMatchEditModal({...matchEditModal,videoClips:Number(e.target.value)})}/></div>
                      </div>
                      <input className={inp} placeholder="Best moment…" value={matchEditModal.bestMoment||''} onChange={e=>setMatchEditModal({...matchEditModal,bestMoment:e.target.value})}/>
                      <textarea className={inp} rows={2} placeholder="Storyline notes…" value={matchEditModal.storylineNotes||''} onChange={e=>setMatchEditModal({...matchEditModal,storylineNotes:e.target.value})}/>
                      <div className="grid grid-cols-2 gap-3">
                        <input className={inp} placeholder="Fan culture moment…" value={matchEditModal.fanCultureNote||''} onChange={e=>setMatchEditModal({...matchEditModal,fanCultureNote:e.target.value})}/>
                        <input className={inp} placeholder="Player emotion…" value={matchEditModal.playerEmotionNote||''} onChange={e=>setMatchEditModal({...matchEditModal,playerEmotionNote:e.target.value})}/>
                        <input className={inp} placeholder="Celebration moment…" value={matchEditModal.celebrationNote||''} onChange={e=>setMatchEditModal({...matchEditModal,celebrationNote:e.target.value})}/>
                        <input className={inp} placeholder="Crowd reaction…" value={matchEditModal.crowdReactionNote||''} onChange={e=>setMatchEditModal({...matchEditModal,crowdReactionNote:e.target.value})}/>
                      </div>
                      <div><label className="text-xs text-gray-500 block mb-1 flex items-center gap-1"><Link2 size={11}/>Media URL</label><input className={inp} placeholder="Link to photos/video folder…" value={matchEditModal.mediaUrl||''} onChange={e=>setMatchEditModal({...matchEditModal,mediaUrl:e.target.value})}/></div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={matchEditModal.contentReady||false} onChange={e=>setMatchEditModal({...matchEditModal,contentReady:e.target.checked})} className="w-4 h-4 rounded"/>
                        <span className="text-sm text-gray-300">Content Ready</span>
                      </label>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button onClick={()=>{setMatches(matches.map(x=>x.id===matchEditModal.id?{...matchEditModal}:x));log(`Updated ${matchEditModal.label}`);setMatchEditModal(null);}} className={btnP}>Save</button>
                      <button onClick={()=>setMatchEditModal(null)} className={btnS}>Cancel</button>
                    </div>
                  </Modal>
                )}
              </div>
            )}

            {/* SHOT LIST */}
            {gothamTab==='shots' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-600">Goal: leave every match with at least 15 strong storytelling photos</p>
                  <span className="text-xs text-gray-500 font-medium">{shots.reduce((s,x)=>s+Number(x.captured||0),0)} / {shots.reduce((s,x)=>s+Number(x.target||0),0)} total captured</span>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-gray-800 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="col-span-4">Category</div>
                    <div className="col-span-2 text-center">Target</div>
                    <div className="col-span-3 text-center">Captured</div>
                    <div className="col-span-3">Notes</div>
                  </div>
                  {shots.map(s=>(
                    <div key={s.id} className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-800 last:border-0 items-center ${Number(s.captured)>=Number(s.target)?'bg-green-950/10':''}`}>
                      <div className="col-span-4 flex items-center gap-2">
                        {Number(s.captured)>=Number(s.target)?<CheckSquare size={13} className="text-green-400 shrink-0"/>:<Square size={13} className="text-gray-700 shrink-0"/>}
                        <span className="text-sm text-white">{s.category}</span>
                      </div>
                      <div className="col-span-2 text-center text-sm text-gray-500">{s.target}</div>
                      <div className="col-span-3 flex items-center justify-center gap-2">
                        <button onClick={()=>setShots(shots.map(x=>x.id===s.id?{...x,captured:Math.max(0,Number(x.captured)-1)}:x))} className="w-6 h-6 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded text-white text-sm font-bold">−</button>
                        <span className={`text-sm font-bold w-6 text-center ${Number(s.captured)>=Number(s.target)?'text-green-400':'text-white'}`}>{s.captured}</span>
                        <button onClick={()=>setShots(shots.map(x=>x.id===s.id?{...x,captured:Number(x.captured)+1}:x))} className="w-6 h-6 flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded text-white text-sm font-bold">+</button>
                      </div>
                      <div className="col-span-3">
                        <button onClick={()=>setRowNoteModal({type:'shot',id:s.id,title:s.category,note:s.notes,mediaUrl:''})} className={`text-xs px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${s.notes?'border-gray-600 text-gray-400 hover:text-white':'border-gray-800 text-gray-700 hover:text-gray-400'}`}>
                          <MessageSquare size={10}/>{s.notes?'Edit note':'Add note'}
                        </button>
                        {s.notes && <p className="text-xs text-gray-600 mt-1 truncate">{s.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONTENT CALENDAR */}
            {gothamTab==='calendar' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-600">Target: 20–25 posts · consistent matchday storytelling format</p>
                  <span className="text-xs text-gray-500 font-medium">{calItems.filter(c=>c.posted).length} posted</span>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-gray-800 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="col-span-1">Day</div>
                    <div className="col-span-3">Post Type</div>
                    <div className="col-span-2">Source</div>
                    <div className="col-span-2">Platform</div>
                    <div className="col-span-2 text-center">Posted</div>
                    <div className="col-span-2">Notes</div>
                  </div>
                  {calItems.map(c=>(
                    <div key={c.id} className={`grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-gray-800 last:border-0 items-center text-sm ${c.posted?'opacity-60':''}`}>
                      <div className="col-span-1 text-gray-600 font-medium">{c.day}</div>
                      <div className="col-span-3">
                        <div className="text-white text-xs font-medium leading-tight">{c.postType}</div>
                        <div className="text-gray-600 text-xs leading-tight">{c.captionTheme}</div>
                      </div>
                      <div className="col-span-2 text-gray-500 text-xs">{c.contentSource}</div>
                      <div className="col-span-2"><Badge label={c.platform} color="bg-blue-950 text-blue-400"/></div>
                      <div className="col-span-2 flex justify-center">
                        <button onClick={()=>setCalItems(calItems.map(x=>x.id===c.id?{...x,posted:!x.posted}:x))} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-all ${c.posted?'border-green-700 text-green-400 bg-green-950/30':'border-gray-700 text-gray-600 hover:text-white'}`}>
                          {c.posted?<CheckSquare size={11}/>:<Square size={11}/>}{c.posted?'Done':'Mark'}
                        </button>
                      </div>
                      <div className="col-span-2">
                        <button onClick={()=>setRowNoteModal({type:'cal',id:c.id,title:`Day ${c.day}: ${c.postType}`,note:c.notes,mediaUrl:''})} className={`text-xs px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${c.notes?'border-gray-600 text-gray-400 hover:text-white':'border-gray-800 text-gray-700 hover:text-gray-400'}`}>
                          <MessageSquare size={10}/>{c.notes?'Edit':'Note'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ARCHIVE */}
            {gothamTab==='archive' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-600">Building The Unmetered archive for future licensing</p>
                  <button onClick={()=>{setArchiveForm({photoId:`00${archive.length+1}`,match:'',subject:'',category:'',licensingPotential:'High',posted:false,mediaUrl:'',notes:''});setArchiveModal(true);}} className="flex items-center gap-2 bg-white text-black text-xs px-3 py-1.5 rounded-xl font-semibold hover:bg-gray-200"><Plus size={13}/>Add Photo</button>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-gray-800 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-2">Match</div>
                    <div className="col-span-2">Subject</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-2">Licensing</div>
                    <div className="col-span-1 text-center">Posted</div>
                    <div className="col-span-2">Notes / Link</div>
                  </div>
                  {archive.map(a=>(
                    <div key={a.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-800 last:border-0 items-center text-sm">
                      <div className="col-span-1 text-gray-600 text-xs font-mono">{a.photoId}</div>
                      <div className="col-span-2 text-gray-400 text-xs">{a.match}</div>
                      <div className="col-span-2 text-white text-xs">{a.subject}</div>
                      <div className="col-span-2 text-gray-400 text-xs">{a.category}</div>
                      <div className="col-span-2">
                        <Badge label={a.licensingPotential} color={a.licensingPotential==='High'?'bg-green-900 text-green-300':a.licensingPotential==='Medium'?'bg-yellow-900 text-yellow-300':'bg-gray-700 text-gray-400'}/>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button onClick={()=>setArchive(archive.map(x=>x.id===a.id?{...x,posted:!x.posted}:x))} className={a.posted?'text-green-400':'text-gray-700 hover:text-gray-400'}>
                          {a.posted?<CheckSquare size={14}/>:<Square size={14}/>}
                        </button>
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <button onClick={()=>setRowNoteModal({type:'archive',id:a.id,title:`Photo ${a.photoId}`,note:a.notes,mediaUrl:a.mediaUrl})} className={`text-xs px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${a.notes||a.mediaUrl?'border-gray-600 text-gray-400 hover:text-white':'border-gray-800 text-gray-700 hover:text-gray-400'}`}>
                          <MessageSquare size={10}/>{a.notes||a.mediaUrl?'Edit':'Add'}
                        </button>
                        {a.mediaUrl && <a href={a.mediaUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300"><Link2 size={11}/></a>}
                        <button onClick={()=>setArchive(archive.filter(x=>x.id!==a.id))} className="text-gray-700 hover:text-red-400 ml-1"><Trash2 size={11}/></button>
                      </div>
                    </div>
                  ))}
                </div>
                {archiveModal && (
                  <Modal title="Add to Archive" onClose={()=>setArchiveModal(false)} wide>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className="text-xs text-gray-500 block mb-1">Photo ID</label><input className={inp} value={archiveForm.photoId||''} onChange={e=>setArchiveForm({...archiveForm,photoId:e.target.value})}/></div>
                        <div><label className="text-xs text-gray-500 block mb-1">Match</label><input className={inp} placeholder="Match 1" value={archiveForm.match||''} onChange={e=>setArchiveForm({...archiveForm,match:e.target.value})}/></div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input className={inp} placeholder="Subject" value={archiveForm.subject||''} onChange={e=>setArchiveForm({...archiveForm,subject:e.target.value})}/>
                        <input className={inp} placeholder="Category" value={archiveForm.category||''} onChange={e=>setArchiveForm({...archiveForm,category:e.target.value})}/>
                      </div>
                      <select className={inp} value={archiveForm.licensingPotential||'High'} onChange={e=>setArchiveForm({...archiveForm,licensingPotential:e.target.value})}>
                        {LICENSING_POTENTIAL.map(l=><option key={l}>{l}</option>)}
                      </select>
                      <div><label className="text-xs text-gray-500 block mb-1 flex items-center gap-1"><Link2 size={11}/>Media URL</label><input className={inp} placeholder="Paste link…" value={archiveForm.mediaUrl||''} onChange={e=>setArchiveForm({...archiveForm,mediaUrl:e.target.value})}/></div>
                      <textarea className={inp} rows={2} placeholder="Notes…" value={archiveForm.notes||''} onChange={e=>setArchiveForm({...archiveForm,notes:e.target.value})}/>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button onClick={()=>{setArchive([...archive,{...archiveForm,id:Date.now()}]);log('Added to archive');setArchiveModal(false);}} className={btnP}>Add</button>
                      <button onClick={()=>setArchiveModal(false)} className={btnS}>Cancel</button>
                    </div>
                  </Modal>
                )}
              </div>
            )}

            {/* GROWTH */}
            {gothamTab==='growth' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs text-gray-600">Target: Instagram +500–1,500 · X +300–800 · first 30 days</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-4">
                  <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-gray-800 text-xs font-bold text-gray-600 uppercase tracking-wider">
                    <div className="col-span-2">Week</div>
                    <div className="col-span-2">IG Followers</div>
                    <div className="col-span-2">X Followers</div>
                    <div className="col-span-1">Posts</div>
                    <div className="col-span-3">Best Post</div>
                    <div className="col-span-2">Notes</div>
                  </div>
                  {growth.map(g=>(
                    <div key={g.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-800 last:border-0 items-center">
                      <div className="col-span-2 text-sm text-gray-400 font-medium">{g.week}</div>
                      <div className="col-span-2"><input type="number" className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30" placeholder="—" value={g.igFollowers} onChange={e=>setGrowth(growth.map(x=>x.id===g.id?{...x,igFollowers:e.target.value}:x))}/></div>
                      <div className="col-span-2"><input type="number" className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30" placeholder="—" value={g.xFollowers} onChange={e=>setGrowth(growth.map(x=>x.id===g.id?{...x,xFollowers:e.target.value}:x))}/></div>
                      <div className="col-span-1"><input type="number" className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30" placeholder="—" value={g.totalPosts} onChange={e=>setGrowth(growth.map(x=>x.id===g.id?{...x,totalPosts:e.target.value}:x))}/></div>
                      <div className="col-span-3"><input className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/30" placeholder="Best performing post…" value={g.bestPost} onChange={e=>setGrowth(growth.map(x=>x.id===g.id?{...x,bestPost:e.target.value}:x))}/></div>
                      <div className="col-span-2">
                        <button onClick={()=>setRowNoteModal({type:'growth',id:g.id,title:g.week,note:g.notes,mediaUrl:''})} className={`text-xs px-2 py-1 rounded-lg border transition-all flex items-center gap-1 ${g.notes?'border-gray-600 text-gray-400 hover:text-white':'border-gray-800 text-gray-700 hover:text-gray-400'}`}>
                          <MessageSquare size={10}/>{g.notes?'Edit':'Note'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Success Indicators</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      {label:'Social Posts',target:'20–25',icon:'📸'},
                      {label:'IG Growth',target:'+500–1,500',icon:'📈'},
                      {label:'X Growth',target:'+300–800',icon:'🐦'},
                      {label:'Matchday Format',target:'Consistent',icon:'🏟️'},
                    ].map(({label,target,icon})=>(
                      <div key={label} className="bg-gray-800 rounded-xl p-3 text-center">
                        <div className="text-lg mb-1">{icon}</div>
                        <div className="text-sm font-bold text-white">{target}</div>
                        <div className="text-xs text-gray-600">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VICTORY+ */}
            {gothamTab==='victory' && (
              <div>
                <div className="mb-4 bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <p className="text-sm text-gray-300 font-medium mb-1">Goal: Pitch a proven storytelling series — not just an idea.</p>
                  <p className="text-xs text-gray-600">Build the proof of concept first. Everything you capture serves both social growth and the partnership pitch.</p>
                </div>
                <div className="space-y-2">
                  {victory.map(v=>(
                    <div key={v.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-medium text-white text-sm">{v.task}</span>
                          <Badge label={v.status} color={VICTORY_STATUS_COLORS[v.status]}/>
                          {v.owner && <span className="text-xs text-gray-600">{v.owner}</span>}
                        </div>
                        {v.notes && <p className="text-xs text-gray-500">{v.notes}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <select className="bg-gray-800 border border-gray-700 text-xs text-white rounded-lg px-2 py-1.5 focus:outline-none" value={v.status} onChange={e=>{setVictory(victory.map(x=>x.id===v.id?{...x,status:e.target.value}:x));log(`Updated Victory+ task`);}}>
                          {VICTORY_STATUSES.map(s=><option key={s}>{s}</option>)}
                        </select>
                        <button onClick={()=>setRowNoteModal({type:'victory',id:v.id,title:v.task,note:v.notes,mediaUrl:''})} className={`p-2 rounded-lg border transition-all ${v.notes?'border-gray-600 text-gray-400 hover:text-white':'border-gray-800 text-gray-700 hover:text-gray-400'}`}>
                          <MessageSquare size={13}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Row Note Modal */}
            {rowNoteModal && (
              <RowNoteModal
                title={rowNoteModal.title}
                note={rowNoteModal.note}
                mediaUrl={rowNoteModal.mediaUrl}
                onClose={()=>setRowNoteModal(null)}
                onSave={(note, mediaUrl)=>{
                  if (rowNoteModal.type==='shot') setShots(shots.map(x=>x.id===rowNoteModal.id?{...x,notes:note}:x));
                  else if (rowNoteModal.type==='cal') setCalItems(calItems.map(x=>x.id===rowNoteModal.id?{...x,notes:note}:x));
                  else if (rowNoteModal.type==='archive') setArchive(archive.map(x=>x.id===rowNoteModal.id?{...x,notes:note,mediaUrl}:x));
                  else if (rowNoteModal.type==='growth') setGrowth(growth.map(x=>x.id===rowNoteModal.id?{...x,notes:note}:x));
                  else if (rowNoteModal.type==='victory') setVictory(victory.map(x=>x.id===rowNoteModal.id?{...x,notes:note}:x));
                  log(`Updated note: ${rowNoteModal.title}`);
                  setRowNoteModal(null);
                }}
              />
            )}
          </div>
        )}

      </div>

      {/* Activity Modal */}
      {showActivity && (
        <Modal title="Activity Log" onClose={()=>setShowActivity(false)} wide>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {actLog.length===0 ? <p className="text-center text-gray-600 py-8 text-sm">No activity yet</p> :
              actLog.map(a=>(
                <div key={a.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-xl">
                  <span className="text-sm text-white">{a.action}</span>
                  <span className="text-xs text-gray-600 shrink-0 ml-4">{fmtTime(a.ts)}</span>
                </div>
              ))
            }
          </div>
        </Modal>
      )}
    </div>
  );
}
