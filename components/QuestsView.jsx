// components/QuestsView.jsx — v5 Top 50 quests, nearby, premium UI
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'
import { getTheme } from '../utils/themes'
import { IcTrophy, IcCheck, IcPin, IcStar } from './ui/Icons'
import NaviOverlay from './NaviOverlay'

const TABS = ['Nearby', 'Program', 'Top 50', 'Completed']

const ALL_QUESTS = [
  // Nearby (Ibaraki / OIC area)
  { id:'q1',title:'Senso-ji Temple',titleJp:'浅草寺',desc:'Tokyo\'s oldest temple. Try an omikuji fortune slip and browse the Nakamise shopping street.',category:'Culture',points:500,image:'https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&q=80&w=800',lat:35.7147,lng:139.7966,difficulty:'easy',time:'2-3h',city:'Tokyo',nearby:false,program:false,top50:true,tip:'Arrive before 8am to beat the crowds. The Kaminarimon gate at sunrise is incredible.',},
  { id:'q2',title:'Shibuya Crossing',titleJp:'渋谷スクランブル交差点',desc:'Cross the world\'s busiest pedestrian intersection during peak hour. Best viewed from the Starbucks above.',category:'Urban',points:200,image:'https://images.unsplash.com/photo-1542051812-f4539618b14a?auto=format&fit=crop&q=80&w=800',lat:35.6595,lng:139.7004,difficulty:'easy',time:'30m',city:'Tokyo',nearby:false,program:false,top50:true,tip:'Rush hour 5-7pm is most spectacular. Count people at the crossing (usually 3,000+).',},
  { id:'q3',title:'Ritsumeikan OIC Campus',titleJp:'立命館大学OIC',desc:'Explore your home campus. Find the convenience store, dining hall, and study spaces.',category:'Campus',points:150,image:'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',lat:34.816,lng:135.5692,difficulty:'easy',time:'1h',city:'Ibaraki',nearby:true,program:true,top50:false,tip:'The campus konbini has great onigiri. The rooftop garden is a great study spot.',},
  { id:'q4',title:'AEON Mall Ibaraki',titleJp:'イオンモール茨木',desc:'Japan\'s iconic shopping mall. Practice shopping Japanese, find omiyage (souvenirs) for home.',category:'Shopping',points:100,image:'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=800',lat:34.8082,lng:135.5737,difficulty:'easy',time:'2-3h',city:'Ibaraki',nearby:true,program:false,top50:false,tip:'The food court on B1 is incredible value. Try the gyoza stand.',},
  { id:'q5',title:'Order Entirely in Japanese',titleJp:'日本語で注文する',desc:'Complete a full restaurant order in Japanese without pointing or showing your phone.',category:'Language',points:350,image:'https://images.unsplash.com/photo-1617196034183-421b4040ed20?auto=format&fit=crop&q=80&w=800',lat:34.816,lng:135.5686,difficulty:'medium',time:'30m',city:'Any',nearby:true,program:false,top50:true,tip:'Start with "Sumimasen" to get attention. "Kore wo kudasai" means "I\'ll have this."',},
  { id:'q6',title:'Konbini Gourmet Challenge',titleJp:'コンビニグルメ',desc:'Try 5 different 7-Eleven, FamilyMart, or Lawson hot foods in one day.',category:'Food',points:250,image:'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&q=80&w=800',lat:34.816,lng:135.5686,difficulty:'easy',time:'1 day',city:'Any',nearby:true,program:false,top50:true,tip:'7-Eleven fried chicken (Nanachiki) and Lawson steamed buns are legendary.',},
  { id:'q7',title:'Ibaraki City Shotengai',titleJp:'茨木市商店街',desc:'Walk the traditional shopping street near the station. Buy from a local vendor.',category:'Local',points:120,image:'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800',lat:34.8154,lng:135.5686,difficulty:'easy',time:'1h',city:'Ibaraki',nearby:true,program:false,top50:false,tip:'Try the takoyaki stand near the station entrance — a local favorite.',},
  // Program quests
  { id:'q8',title:'OU Business Site Visit',titleJp:'ビジネス見学',desc:'Attend an official OU program business visit to a Japanese company. Required for MKT 3013.',category:'Program',points:400,image:'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',lat:34.8154,lng:135.5686,difficulty:'easy',time:'3h',city:'Various',nearby:false,program:true,top50:false,tip:'Bring business cards if you have them. Dress formally. Don\'t eat before — there\'s usually a reception.',},
  { id:'q9',title:'Kyoto Temple Walking Tour',titleJp:'京都寺院巡り',desc:'Official OU program walking tour of Kinkaku-ji, Ryoan-ji, and the Philosopher\'s Path.',category:'Program',points:350,image:'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&q=80&w=800',lat:35.0394,lng:135.7292,difficulty:'easy',time:'5h',city:'Kyoto',nearby:false,program:true,top50:false,tip:'Wear comfortable shoes. The Philosopher\'s Path is 2km of canal-side walking.',},
  { id:'q10',title:'Tea Ceremony Experience',titleJp:'茶道体験',desc:'Participate in an authentic Japanese tea ceremony. Learn wabi-sabi philosophy.',category:'Program',points:300,image:'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800',lat:35.0116,lng:135.7681,difficulty:'easy',time:'2h',city:'Kyoto',nearby:false,program:true,top50:true,tip:'Bow when receiving your tea bowl. Turn it clockwise twice before drinking.',},
  { id:'q11',title:'Guest Lecture Reflection',titleJp:'講義レポート',desc:'Attend a guest lecture from a Japanese business leader and submit your reflection paper.',category:'Program',points:200,image:'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=800',lat:34.8154,lng:135.5692,difficulty:'easy',time:'2h',city:'Ibaraki',nearby:false,program:true,top50:false,tip:'Take notes in Japanese if possible — even single words.',},
  { id:'q12',title:'SCM Case Study Presentation',titleJp:'ケーススタディ',desc:'Present your supply chain management case study to the class. Final grade component.',category:'Program',points:500,image:'https://images.unsplash.com/photo-1491975474562-1f4e30bc9468?auto=format&fit=crop&q=80&w=800',lat:34.8154,lng:135.5692,difficulty:'medium',time:'3h',city:'Ibaraki',nearby:false,program:true,top50:false,tip:'Include Japanese market context. Your program faculty loves Japan-specific examples.',},
  // Top 50
  { id:'q13',title:'Mount Takao Hike',titleJp:'高尾山',desc:'Complete the Takao-san trail to the summit. Take Keio Line from Shinjuku.',category:'Adventure',points:800,image:'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=800',lat:35.6257,lng:139.2431,difficulty:'hard',time:'4-6h',city:'Tokyo',nearby:false,program:false,top50:true,tip:'Trail 1 is paved, Trail 6 is most scenic. Beer garden at the top after summit!',},
  { id:'q14',title:'Fushimi Inari 1,000 Gates',titleJp:'伏見稲荷大社',desc:'Hike through the thousands of vermillion torii gates up the sacred mountain.',category:'Culture',points:600,image:'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&q=80&w=800',lat:34.9671,lng:135.7727,difficulty:'medium',time:'2-3h',city:'Kyoto',nearby:false,program:false,top50:true,tip:'Most tourists turn back at the first gate. Keep going — the upper path is magic.',},
  { id:'q15',title:'Arashiyama Bamboo Grove',titleJp:'嵐山竹林',desc:'Walk through the famous bamboo forest at dawn when it\'s completely empty.',category:'Nature',points:300,image:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=800',lat:35.0095,lng:135.6716,difficulty:'easy',time:'2h',city:'Kyoto',nearby:false,program:false,top50:true,tip:'Arrive before 7am. The light through the bamboo in the morning is otherworldly.',},
  { id:'q16',title:'Nishiki Market Tasting',titleJp:'錦市場',desc:'Try 5 different foods from the "Kyoto Kitchen" market. Must include pickles and tofu.',category:'Food',points:280,image:'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=800',lat:35.005,lng:135.765,difficulty:'easy',time:'2h',city:'Kyoto',nearby:false,program:false,top50:true,tip:'The tamagoyaki (egg omelet) stick vendor near the entrance is iconic.',},
  { id:'q17',title:'Dotonbori at Night',titleJp:'道頓堀',desc:'Experience Osaka\'s iconic neon entertainment district at night. Take a photo with Glico Man.',category:'Urban',points:200,image:'https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&q=80&w=800',lat:34.6685,lng:135.5023,difficulty:'easy',time:'2h',city:'Osaka',nearby:false,program:false,top50:true,tip:'Takoyaki Museum is nearby. The canal reflection at night is beautiful.',},
  { id:'q18',title:'Kinkaku-ji Golden Pavilion',titleJp:'金閣寺',desc:'Visit the iconic gold-leaf covered Zen temple reflected in its mirror pond.',category:'Culture',points:350,image:'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&q=80&w=800',lat:35.0394,lng:135.7292,difficulty:'easy',time:'1.5h',city:'Kyoto',nearby:false,program:false,top50:true,tip:'The best view is from the Anmintaku pond. Arrive at opening (9am) to beat tour groups.',},
  { id:'q19',title:'Akihabara Tech Hunt',titleJp:'秋葉原',desc:'Visit the electronics and anime district. Find one item under ¥500 to take home.',category:'Shopping',points:250,image:'https://images.unsplash.com/photo-1542051812-f4539618b14a?auto=format&fit=crop&q=80&w=800',lat:35.7022,lng:139.7741,difficulty:'easy',time:'2-4h',city:'Tokyo',nearby:false,program:false,top50:true,tip:'Multi-floor Yodobashi Camera has everything. Retro Famicom games are in small side shops.',},
  { id:'q20',title:'Tsukiji Outer Market Breakfast',titleJp:'築地場外市場',desc:'Have fresh sushi or seafood at the famous outer market before 9am.',category:'Food',points:300,image:'https://images.unsplash.com/photo-1612550815818-6e0ec9d2ab79?auto=format&fit=crop&q=80&w=800',lat:35.6654,lng:139.7706,difficulty:'easy',time:'2h',city:'Tokyo',nearby:false,program:false,top50:true,tip:'Arrive at 7am. Try the tamagoyaki, the fatty tuna, and the sea urchin sushi.',},
]

const DIFFICULTY_COLORS = { easy:'#22c55e', medium:'#f59e0b', hard:'#ef4444' }

function QuestCard({ quest, isCompleted, onComplete, onNavigate, theme }) {
  const t = getTheme(theme)
  const [expanded, setExpanded] = useState(false)
  const diffColor = DIFFICULTY_COLORS[quest.difficulty]

  return (
    <motion.div layout initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
      className="rounded-3xl overflow-hidden mb-3"
      style={{background:isCompleted?`${t.surface}`:`${t.surface}`,border:`1px solid ${isCompleted?t.success+'44':t.border}`,opacity:isCompleted?0.7:1}}>
      {/* Image strip */}
      <div className="relative" style={{height:130}}>
        <img src={quest.image} alt={quest.title} className="w-full h-full object-cover"
          onError={e=>{e.target.src='https://images.unsplash.com/photo-1542931287-023b922fa89b?auto=format&fit=crop&q=80&w=800'}}/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 55%)'}}/>
        {isCompleted&&(
          <div className="absolute inset-0 flex items-center justify-center"
            style={{background:'rgba(34,197,94,0.25)'}}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{background:'rgba(34,197,94,0.9)'}}>
              <IcCheck size={22} color="white" strokeWidth={2.5}/>
            </div>
          </div>
        )}
        {/* Difficulty + City */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-display font-bold text-white capitalize"
            style={{background:diffColor+'cc'}}>{quest.difficulty}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-display font-bold text-white"
            style={{background:'rgba(0,0,0,0.6)'}}>{quest.city}</span>
        </div>
        {/* Points */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full"
          style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(8px)'}}>
          <IcStar size={9} color="#FFB800"/>
          <span className="text-[10px] font-mono font-bold" style={{color:'#FFB800'}}>{quest.points}</span>
        </div>
        {/* Title */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-display font-black text-base text-white leading-tight">{quest.title}</p>
          <p className="font-jp text-xs text-white/60 mt-0.5">{quest.titleJp}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-display font-bold px-2 py-0.5 rounded-full"
            style={{background:t.brandBg,color:t.brand}}>{quest.category}</span>
          <span className="text-xs" style={{color:t.textMuted}}>⏱ {quest.time}</span>
        </div>

        <p className="text-xs leading-relaxed mb-3" style={{color:t.textMuted}}>{quest.desc}</p>

        <AnimatePresence>
          {expanded&&(
            <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}}
              className="overflow-hidden mb-3">
              <div className="p-3 rounded-2xl" style={{background:'rgba(255,255,255,0.04)',border:`1px solid ${t.border}`}}>
                <p className="text-xs font-display font-bold mb-1" style={{color:t.brand}}>💡 Pro Tip</p>
                <p className="text-xs leading-relaxed" style={{color:t.text}}>{quest.tip}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <button onClick={()=>setExpanded(!expanded)}
            className="px-3 py-2 rounded-xl font-display font-bold text-xs"
            style={{background:t.surface,border:`1px solid ${t.border}`,color:t.textMuted}}>
            {expanded?'Less':'Tip'}
          </button>
          <button onClick={()=>onNavigate({name:quest.title,address:`${quest.city}, Japan`})}
            className="px-3 py-2 rounded-xl font-display font-bold text-xs"
            style={{background:t.brandBg,border:`1px solid ${t.brand}44`,color:t.brand}}>
            Navigate
          </button>
          {!isCompleted&&(
            <button onClick={()=>onComplete(quest.id,quest.points)}
              className="flex-1 py-2 rounded-xl font-display font-bold text-xs text-white"
              style={{background:`linear-gradient(135deg,${t.brand},${t.accent})`}}>
              Mark Complete
            </button>
          )}
          {isCompleted&&(
            <div className="flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5"
              style={{background:'rgba(34,197,94,0.12)',border:'1px solid rgba(34,197,94,0.3)'}}>
              <IcCheck size={12} color="#22c55e" strokeWidth={2.5}/>
              <span className="font-display font-bold text-xs" style={{color:'#22c55e'}}>Completed</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function QuestsView() {
  const { theme, quests: storeQuests, completedQuests, completeQuest, user, setNaviMode, naviMode, naviTarget } = useStore()
  const t = getTheme(theme)
  const [activeTab, setActiveTab] = useState('Nearby')

  const allQuests = storeQuests.length > 0 ? storeQuests : ALL_QUESTS

  const visibleQuests = allQuests.filter(q => {
    if (activeTab === 'Nearby') return q.nearby
    if (activeTab === 'Program') return q.program
    if (activeTab === 'Top 50') return q.top50
    if (activeTab === 'Completed') return completedQuests.has(q.id)
    return true
  })

  const totalPossible = allQuests.reduce((s,q)=>s+q.points,0)
  const earnedPoints = [...completedQuests].reduce((sum,id)=>{
    const q = allQuests.find(q=>q.id===id)
    return sum + (q?.points||0)
  },0)
  const completedCount = completedQuests.size
  const progressPct = Math.min(100,(earnedPoints/Math.max(totalPossible,1))*100)

  return (
    <div className="flex flex-col h-full relative">
      <AnimatePresence>
        {naviMode&&<NaviOverlay target={naviTarget} onClose={()=>setNaviMode(false)}/>}
      </AnimatePresence>

      {/* Progress card */}
      <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
        className="mx-4 mb-4 p-4 rounded-3xl"
        style={{background:t.surface,border:`1px solid ${t.border}`}}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-display font-black text-sm" style={{color:t.text}}>Quest Progress</p>
            <p className="text-xs mt-0.5" style={{color:t.textMuted}}>{completedCount} of {allQuests.length} completed</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{background:t.brandBg,border:`1px solid ${t.brand}44`}}>
            <IcTrophy size={12} color={t.brand}/>
            <span className="font-display font-black text-sm" style={{color:t.brand}}>
              {earnedPoints.toLocaleString()} pts
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-2.5 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.08)'}}>
          <motion.div className="h-full rounded-full"
            style={{background:`linear-gradient(90deg,${t.brand},${t.accent})`}}
            initial={{width:0}} animate={{width:`${progressPct}%`}}
            transition={{duration:1,ease:[0.22,1,0.36,1]}}/>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] font-mono" style={{color:t.textFaint}}>0 pts</span>
          <span className="text-[10px] font-mono" style={{color:t.textFaint}}>{totalPossible.toLocaleString()} pts total</span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 mx-4 mb-4 p-1 rounded-2xl" style={{background:t.surface,border:`1px solid ${t.border}`}}>
        {TABS.map(tab=>{
          const active=activeTab===tab
          const count = tab==='Completed'?completedCount:allQuests.filter(q=>tab==='Nearby'?q.nearby:tab==='Program'?q.program:tab==='Top 50'?q.top50:false).length
          return(
            <button key={tab} onClick={()=>setActiveTab(tab)}
              className="flex-1 py-2 rounded-xl flex flex-col items-center gap-0.5 transition-all"
              style={{background:active?t.brandBg:'transparent',border:active?`1px solid ${t.brand}44`:'1px solid transparent'}}>
              <span className="font-display font-black" style={{fontSize:10,color:active?t.brand:t.textMuted}}>{tab}</span>
              <span className="font-mono text-[9px]" style={{color:active?t.brand:t.textFaint}}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Quest list */}
      <div className="flex-1 overflow-y-auto hide-scroll px-4 pb-2">
        {visibleQuests.length===0&&(
          <div className="text-center py-12">
            <IcTrophy size={32} color={t.textFaint}/>
            <p className="font-display font-bold text-sm mt-3" style={{color:t.textMuted}}>
              {activeTab==='Completed'?'No completed quests yet':'No quests in this category'}
            </p>
            <p className="text-xs mt-1" style={{color:t.textFaint}}>
              {activeTab==='Completed'?'Start exploring to earn points!':'Switch to another tab to find quests'}
            </p>
          </div>
        )}
        {visibleQuests.map((quest,i)=>(
          <QuestCard key={quest.id} quest={quest} theme={theme}
            isCompleted={completedQuests.has(quest.id)}
            onComplete={completeQuest}
            onNavigate={(target)=>setNaviMode(true,target)}/>
        ))}
      </div>
    </div>
  )
}
