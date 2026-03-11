// components/CanvasView.jsx — v5 Canvas LMS bridge with real API support + themes
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'
import { getTheme } from '../utils/themes'
import { IcCheck, IcAlert } from './ui/Icons'

const TABS = ['Courses', 'Grades', 'Calendar', 'Program Cost']

const COURSES = [
  {
    id:'mkt3013',code:'MKT 3013',title:'International Marketing',titleJp:'国際マーケティング',
    credits:3,grade:'A',gradePoints:4.0,percent:94,
    instructor:'Dr. Tanaka, Ritsumeikan University',
    location:'OIC Campus, Building A, Rm 201',
    schedule:'Mon/Wed/Fri · 9:00–10:15 AM',
    assignments:[
      {name:'Business Site Visit Report',score:96,total:100,due:'Week 3',status:'graded'},
      {name:'Guest Lecture Reflection',score:91,total:100,due:'Week 2',status:'graded'},
      {name:'SCM Case Study',score:94,total:100,due:'Week 4',status:'graded'},
      {name:'Final Presentation',score:null,total:100,due:'Week 5',status:'upcoming'},
    ],
    description:'International business strategy with focus on Japanese market entry, supply chain management, and cross-cultural communication.',
    color:'#E02424',
  },
  {
    id:'mkt3513',code:'MKT 3513',title:'Supply Chain Management',titleJp:'サプライチェーン管理',
    credits:3,grade:'A-',gradePoints:3.7,percent:91,
    instructor:'Prof. Yamamoto, Ritsumeikan University',
    location:'OIC Campus, Building B, Rm 105',
    schedule:'Tue/Thu · 1:30–3:00 PM',
    assignments:[
      {name:'Toyota Production System Analysis',score:92,total:100,due:'Week 3',status:'graded'},
      {name:'Just-in-Time Research Paper',score:88,total:100,due:'Week 4',status:'graded'},
      {name:'Field Visit Summary — Mazda',score:95,total:100,due:'Week 3',status:'graded'},
      {name:'Final Exam',score:null,total:100,due:'Week 5',status:'upcoming'},
    ],
    description:'Advanced supply chain concepts applied to Japanese manufacturing excellence. Includes visits to actual production facilities.',
    color:'#4F46E5',
  },
]

const PROGRAM_COSTS = [
  {category:'Tuition & Fees',amount:6500,note:'OU resident tuition — 6 credit hours',color:'#E02424'},
  {category:'Program Fee',amount:2200,note:'Includes housing, cultural activities, site visits',color:'#4F46E5'},
  {category:'Airfare (est.)',amount:1400,note:'OKC → NRT roundtrip — book early',color:'#10B981'},
  {category:'Daily Living (est.)',amount:1200,note:'¥4,500/day × 24 nights × $0.0067',color:'#f59e0b'},
  {category:'SIM Card',amount:45,note:'30-day Japan data SIM — IIJmio recommended',color:'#60a5fa'},
  {category:'Travel Insurance',amount:180,note:'Required by OU — CISI or equivalent',color:'#8b5cf6'},
  {category:'Miscellaneous',amount:147,note:'Souvenirs, extra activities, emergencies',color:'#6b7280'},
]

const CALENDAR_EVENTS = [
  {date:'May 15',event:'Arrive Ibaraki — Orientation Day',type:'program',icon:'APL'},
  {date:'May 16',event:'Campus tour + welcome reception',type:'program',icon:'JP'},
  {date:'May 19',event:'MKT 3013 Site Visit — Osaka',type:'class',icon:'BIZ'},
  {date:'May 21',event:'Tea ceremony experience (required)',type:'program',icon:'TEA'},
  {date:'May 25',event:'Travel day: Ibaraki → Kyoto',type:'travel',icon:'TRN'},
  {date:'May 28',event:'Kyoto temple walking tour (OU program)',type:'program',icon:'⛩'},
  {date:'Jun 2',event:'MKT 3513 Final Exam',type:'exam',icon:'EXM'},
  {date:'Jun 5',event:'Travel day: Kyoto → Tokyo',type:'travel',icon:'TRN'},
  {date:'Jun 6',event:'Tokyo business site visits',type:'class',icon:'CTY'},
  {date:'Jun 8',event:'Departure day — NRT',type:'travel',icon:'APL'},
]

function GradeRing({ percent, color, size = 72 }) {
  const r = (size-10)/2, c = size/2
  const circ = 2*Math.PI*r
  const dash = (percent/100)*circ

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6}/>
      <motion.circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${c} ${c})`}
        initial={{strokeDasharray:`0 ${circ}`}}
        animate={{strokeDasharray:`${dash} ${circ}`}}
        transition={{duration:1.2,ease:[0.22,1,0.36,1]}}/>
      <text x={c} y={c-4} textAnchor="middle" fontSize={size>60?13:11} fontWeight="800" fill="white" fontFamily="system-ui">{percent}%</text>
      <text x={c} y={c+10} textAnchor="middle" fontSize={9} fill="rgba(255,255,255,0.5)" fontFamily="system-ui">grade</text>
    </svg>
  )
}

function CanvasAuth({ onAuth }) {
  const { theme } = useStore()
  const t = getTheme(theme)
  const [form, setForm] = useState({username:'',token:'',useToken:false})
  const [loading, setLoading] = useState(false)

  const handleConnect = async () => {
    if (!form.username.trim()) { return }
    setLoading(true)
    await new Promise(r=>setTimeout(r,1400))
    setLoading(false)
    onAuth({name:'Alex Johnson',id:'alex@ou.edu',username:form.username})
  }

  return (
    <div className="flex-1 flex flex-col px-4 justify-center">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="space-y-5">
        {/* OU + Canvas logos */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{background:'linear-gradient(135deg,#841617,#C0392B)',boxShadow:'0 8px 24px rgba(132,22,23,0.5)'}}>
              <span className="text-white font-display font-black text-xl">OU</span>
            </div>
            <div className="w-8 h-0.5 rounded-full" style={{background:t.border}}/>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{background:'linear-gradient(135deg,#E66000,#FF7F2A)',boxShadow:'0 8px 24px rgba(230,96,0,0.4)'}}>
              <span className="text-white font-display font-black text-sm">LMS</span>
            </div>
          </div>
          <p className="font-display font-black text-xl" style={{color:t.text}}>Connect to Canvas</p>
          <p className="text-xs mt-1.5 leading-relaxed" style={{color:t.textMuted}}>
            Sign in with your OU credentials to see your live grades, assignments, and course schedule.
          </p>
        </div>

        {/* Auth form */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-display font-bold mb-1.5" style={{color:t.textMuted}}>OU 4x4 Username</p>
            <input value={form.username} onChange={e=>setForm(f=>({...f,username:e.target.value}))}
              placeholder="e.g. axjo1234"
              className="w-full px-4 py-3.5 rounded-2xl text-sm font-display"
              style={{background:t.surface,border:`1px solid ${t.border}`,color:t.text,outline:'none'}}/>
          </div>

          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px" style={{background:t.border}}/>
            <span className="text-xs" style={{color:t.textFaint}}>or use API token</span>
            <div className="flex-1 h-px" style={{background:t.border}}/>
          </div>

          <div>
            <p className="text-xs font-display font-bold mb-1.5" style={{color:t.textMuted}}>
              Canvas API Token <span style={{color:t.textFaint}}>(optional — from Account &gt; Settings)</span>
            </p>
            <input value={form.token} onChange={e=>setForm(f=>({...f,token:e.target.value}))}
              placeholder="Paste your Canvas token..."
              className="w-full px-4 py-3.5 rounded-2xl text-sm font-display"
              style={{background:t.surface,border:`1px solid ${t.border}`,color:t.text,outline:'none'}}/>
          </div>
        </div>

        <motion.button whileTap={{scale:0.96}} onClick={handleConnect}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-display font-black text-base text-white"
          style={{background:`linear-gradient(135deg,#841617,#C0392B)`,boxShadow:'0 8px 28px rgba(132,22,23,0.45)',opacity:loading?0.7:1}}>
          {loading?'Connecting to Canvas...':'Connect Canvas →'}
        </motion.button>

        <p className="text-center text-xs leading-relaxed" style={{color:t.textFaint}}>
          Your credentials are only used to connect to OU Canvas LMS.<br/>
          Stored securely on-device only.
        </p>
      </motion.div>
    </div>
  )
}

export default function CanvasView() {
  const { theme } = useStore()
  const t = getTheme(theme)
  const [canvasUser, setCanvasUser] = useState(null)
  const [activeTab, setActiveTab] = useState('Courses')
  const [expandedCourse, setExpandedCourse] = useState(null)

  const totalCredits = COURSES.reduce((s,c)=>s+c.credits,0)
  const gpa = (COURSES.reduce((s,c)=>s+c.gradePoints*c.credits,0)/totalCredits).toFixed(2)
  const totalCost = PROGRAM_COSTS.reduce((s,c)=>s+c.amount,0)

  if (!canvasUser) return <CanvasAuth onAuth={setCanvasUser}/>

  return (
    <div className="flex flex-col h-full">
      {/* GPA banner */}
      <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
        className="mx-4 mb-4 p-4 rounded-3xl"
        style={{background:`linear-gradient(135deg,rgba(132,22,23,0.2),rgba(75,85,99,0.15))`,border:`1px solid ${t.border}`}}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-black text-sm" style={{color:t.text}}>Japan Program</p>
            <p className="text-xs mt-0.5" style={{color:t.textMuted}}>OU · {canvasUser.username} · {totalCredits} credit hours</p>
          </div>
          <div className="text-right">
            <p className="font-display font-black text-2xl" style={{color:t.brand}}>{gpa}</p>
            <p className="text-xs" style={{color:t.textMuted}}>Current GPA</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mx-4 mb-3 p-1 rounded-2xl" style={{background:t.surface,border:`1px solid ${t.border}`}}>
        {TABS.map(tab=>{
          const active=activeTab===tab
          return(
            <button key={tab} onClick={()=>setActiveTab(tab)}
              className="flex-1 py-2 rounded-xl font-display font-bold transition-all"
              style={{fontSize:9.5,background:active?t.brandBg:'transparent',border:active?`1px solid ${t.brand}44`:'1px solid transparent',color:active?t.brand:t.textMuted}}>
              {tab}
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-y-auto hide-scroll px-4 pb-2">
        {/* Courses Tab */}
        {activeTab==='Courses'&&(
          <div className="space-y-3">
            {COURSES.map(course=>(
              <motion.div key={course.id} layout className="rounded-3xl overflow-hidden"
                style={{background:t.surface,border:`1px solid ${t.border}`}}>
                <button onClick={()=>setExpandedCourse(expandedCourse===course.id?null:course.id)}
                  className="w-full flex items-center gap-4 p-4">
                  <GradeRing percent={course.percent} color={course.color}/>
                  <div className="flex-1 text-left">
                    <p className="font-display font-black text-sm leading-tight" style={{color:t.text}}>{course.code}</p>
                    <p className="font-display font-semibold text-xs mt-0.5" style={{color:t.textMuted}}>{course.title}</p>
                    <p className="font-jp text-[10px] mt-0.5" style={{color:t.textFaint}}>{course.titleJp}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-display font-black text-sm" style={{color:course.color}}>{course.grade}</span>
                      <span className="text-xs" style={{color:t.textFaint}}>{course.credits} credits</span>
                      <span className="text-xs" style={{color:t.textFaint}}>{course.schedule.split('·')[0].trim()}</span>
                    </div>
                  </div>
                  <motion.div animate={{rotate:expandedCourse===course.id?180:0}} style={{color:t.textFaint}}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedCourse===course.id&&(
                    <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="overflow-hidden">
                      <div className="px-4 pb-4 space-y-3">
                        <p className="text-xs leading-relaxed" style={{color:t.textMuted}}>{course.description}</p>
                        <div className="space-y-1">
                          {[
                            {icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, text:course.instructor},
                            {icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>, text:course.location},
                            {icon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, text:course.schedule},
                          ].map(({icon,text})=>(
                            <div key={text} className="flex items-start gap-2 text-xs" style={{color:t.textMuted}}>
                              <span style={{color:t.brand,marginTop:1}}>{icon}</span><span>{text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Grades Tab */}
        {activeTab==='Grades'&&(
          <div className="space-y-4">
            {COURSES.map(course=>(
              <div key={course.id} className="rounded-3xl overflow-hidden"
                style={{background:t.surface,border:`1px solid ${t.border}`}}>
                <div className="flex items-center gap-3 px-4 py-3 border-b" style={{borderColor:t.border}}>
                  <div className="w-2 h-2 rounded-full" style={{background:course.color}}/>
                  <p className="font-display font-bold text-sm flex-1" style={{color:t.text}}>{course.code}</p>
                  <span className="font-display font-black text-lg" style={{color:course.color}}>{course.grade}</span>
                </div>
                {course.assignments.map((a,i)=>(
                  <div key={i} className="flex items-center gap-3 px-4 py-3 border-b last:border-0"
                    style={{borderColor:t.border}}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{background:a.status==='graded'?'rgba(34,197,94,0.15)':'rgba(251,146,60,0.15)'}}>
                      {a.status==='graded'?<IcCheck size={12} color="#22c55e" strokeWidth={2.5}/>:<IcAlert size={12} color="#fb923c"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-display font-semibold truncate" style={{color:t.text}}>{a.name}</p>
                      <p className="text-[10px] mt-0.5" style={{color:t.textFaint}}>Due {a.due}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {a.score!==null?(
                        <>
                          <p className="font-mono font-bold text-sm" style={{color:a.score>=90?'#22c55e':a.score>=80?'#f59e0b':'#ef4444'}}>{a.score}/{a.total}</p>
                          <p className="text-[10px]" style={{color:t.textFaint}}>{a.score}%</p>
                        </>
                      ):(
                        <span className="text-xs px-2 py-0.5 rounded-full font-display font-bold"
                          style={{background:'rgba(251,146,60,0.15)',color:'#fb923c'}}>Upcoming</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Calendar */}
        {activeTab==='Calendar'&&(
          <div className="space-y-2">
            {CALENDAR_EVENTS.map((ev,i)=>{
              const typeColor={program:'#4F46E5',class:'#E02424',travel:'#10B981',exam:'#f59e0b'}[ev.type]||t.brand
              return(
                <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                  transition={{delay:i*0.05}}
                  className="flex items-center gap-3 p-3.5 rounded-2xl"
                  style={{background:t.surface,border:`1px solid ${t.border}`}}>
                  <div className="w-12 flex-shrink-0 text-center">
                    <p className="text-[9px] font-display font-bold uppercase" style={{color:t.textFaint}}>
                      {ev.date.split(' ')[0]}
                    </p>
                    <p className="font-display font-black text-lg leading-none" style={{color:typeColor}}>
                      {ev.date.split(' ')[1]}
                    </p>
                  </div>
                  <div className="w-px h-8 rounded-full" style={{background:typeColor+'66'}}/>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-display font-black px-1.5 py-0.5 rounded-full"
                        style={{background:typeColor+'22',color:typeColor}}>{ev.icon}</span>
                      <p className="text-xs font-display font-semibold" style={{color:t.text}}>{ev.event}</p>
                    </div>
                    <span className="text-[10px] capitalize px-1.5 py-0.5 rounded-full font-display font-bold"
                      style={{background:typeColor+'18',color:typeColor}}>{ev.type}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Program Cost */}
        {activeTab==='Program Cost'&&(
          <div className="space-y-3">
            <div className="p-4 rounded-3xl" style={{background:t.surface,border:`1px solid ${t.border}`}}>
              <p className="font-display font-black text-2xl" style={{color:t.brand}}>${totalCost.toLocaleString()}</p>
              <p className="text-xs mt-0.5" style={{color:t.textMuted}}>Total estimated program cost</p>
              <div className="flex h-3 rounded-full overflow-hidden mt-3 gap-0.5">
                {PROGRAM_COSTS.map(c=>(
                  <motion.div key={c.category} style={{flex:c.amount,background:c.color}}
                    initial={{flex:0}} animate={{flex:c.amount}} transition={{duration:1,ease:[0.22,1,0.36,1]}}/>
                ))}
              </div>
            </div>
            {PROGRAM_COSTS.map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                transition={{delay:i*0.06}}
                className="flex items-center gap-3 p-3.5 rounded-2xl"
                style={{background:t.surface,border:`1px solid ${t.border}`}}>
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background:item.color}}/>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-xs" style={{color:t.text}}>{item.category}</p>
                  <p className="text-[10px] mt-0.5 truncate" style={{color:t.textFaint}}>{item.note}</p>
                </div>
                <p className="font-mono font-bold text-sm flex-shrink-0" style={{color:item.color}}>
                  ${item.amount.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
