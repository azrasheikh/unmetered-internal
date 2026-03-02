import React, { useState, useEffect, useMemo } from 'react';
import { Home, Users, FileText, Image, Target, Search, Plus, X, Edit2, Save, Activity, AlertCircle, Clock, DollarSign, TrendingUp, Calendar, Trash2 } from 'lucide-react';

const DEAL_STAGES = ['Lead','Contacted','Proposal Sent','Negotiating','Closed Won','Closed Lost'];
const REVENUE_TYPES = ['Editorial Licensing','Assignment','Retainer','Brand Partnership','Athlete Direct','Other'];
const CONTENT_STATUSES = ['Idea','Draft','Scheduled','Published'];
const GOAL_STATUSES = ['Not Started','In Progress','Done'];
const STAGE_COLORS = {'Lead':'bg-gray-700 text-gray-300','Contacted':'bg-blue-900 text-blue-300','Proposal Sent':'bg-purple-900 text-purple-300','Negotiating':'bg-yellow-900 text-yellow-300','Closed Won':'bg-green-900 text-green-300','Closed Lost':'bg-red-900 text-red-400'};
const CONTENT_STATUS_COLORS = {'Idea':'bg-purple-900 text-purple-300','Draft':'bg-blue-900 text-blue-300','Scheduled':'bg-yellow-900 text-yellow-300','Published':'bg-green-900 text-green-300'};
const GOAL_STATUS_COLORS = {'Not Started':'bg-gray-700 text-gray-400','In Progress':'bg-yellow-900 text-yellow-300','Done':'bg-green-900 text-green-300'};

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
const NAV = [{id:'home',label:'Home',Icon:Home},{id:'crm',label:'CRM',Icon:Users},{id:'notes',label:'Notes',Icon:FileText},{id:'content',label:'Content',Icon:Image},{id:'strategy',label:'Strategy',Icon:Target}];

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
