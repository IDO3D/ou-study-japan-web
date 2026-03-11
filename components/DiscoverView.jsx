// components/DiscoverView.jsx — v5 Rich food discovery with menus, deals, navi
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../utils/store'
import { getTheme } from '../utils/themes'
import { IcSearch, IcHalal, IcPin, IcStar } from './ui/Icons'
import NaviOverlay from './NaviOverlay'

const CATEGORIES = ['All','Ramen','Sushi','Curry','Tempura','Halal','Vegetarian','Budget','Cafe']

const RESTAURANTS = [
  {
    id:'r1',name:'Ichiran Ramen',nameJp:'一蘭',category:'Ramen',priceJpy:980,priceUsd:6.57,priceRange:'¥',
    rating:4.8,reviewCount:12400,distance:'0.3km',walkTime:4,image:'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=800',
    tags:['Solo booth','No Japanese needed','Open late'],
    description:'Famous solo dining ramen with rich tonkotsu broth. Vending machine ordering — no Japanese required.',
    dealActive:true,deal:'¥100 off with student ID',
    menu:[
      {name:'Tonkotsu Ramen',price:980,note:'Classic — most popular'},
      {name:'Extra noodles (kaedama)',price:160,note:'Request when almost done'},
      {name:'Seasoned egg (aji-tamago)',price:180,note:'Recommended add-on'},
    ],
    hours:'24 hours · 7 days',phone:'+81-6-0000-1111',address:'2-3-1 Umeda, Osaka',
    acceptsSuica:true,isHalal:false,isVegetarian:false,isBudget:true,
    menuUrl:'https://ichiran.com/menu/',
  },
  {
    id:'r2',name:'Naritaya Halal Ramen',nameJp:'なりたや',category:'Ramen',priceJpy:1100,priceUsd:7.37,priceRange:'¥¥',
    rating:4.6,reviewCount:2100,distance:'0.6km',walkTime:8,image:'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800',
    tags:['Halal certified','Japan Halal Assoc.','Muslim-friendly'],
    description:'Japan Halal Association certified ramen. Dedicated halal kitchen. Prayer space nearby.',
    dealActive:false,
    menu:[
      {name:'Chicken Shoyu Ramen',price:1100,note:'Halal certified — signature dish'},
      {name:'Veggie Miso Ramen',price:1000,note:'Vegetarian option'},
      {name:'Gyoza (6pc)',price:500,note:'Pork-free'},
    ],
    hours:'11:00–22:00',phone:'+81-3-0000-2222',address:'1-5-3 Asakusa, Tokyo',
    acceptsSuica:true,isHalal:true,isVegetarian:false,isBudget:false,
    menuUrl:'https://naritaya-halal.jp/',
  },
  {
    id:'r3',name:'Saizeriya',nameJp:'サイゼリヤ',category:'Italian',priceJpy:600,priceUsd:4.02,priceRange:'¥',
    rating:4.1,reviewCount:35000,distance:'0.2km',walkTime:3,image:'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
    tags:['Student budget','Huge portions','Refillable drinks'],
    description:'Legendary cheap Italian chain. Pasta under ¥300. A student institution.',
    dealActive:true,deal:'Drink bar ¥200 — unlimited refills',
    menu:[
      {name:'Margherita Pizza',price:399,note:'Unbeatable value'},
      {name:'Carbonara Pasta',price:499,note:'Creamy, generous portion'},
      {name:'Escargot (6pc)',price:299,note:'Surprisingly delicious'},
      {name:'Wine (glass)',price:199,note:'Cheapest wine in Japan'},
    ],
    hours:'10:00–01:00',phone:'+81-6-0000-3333',address:'3F AEON Mall, Ibaraki',
    acceptsSuica:false,isHalal:false,isVegetarian:true,isBudget:true,
    menuUrl:'https://www.saizeriya.co.jp/menu/',
  },
  {
    id:'r4',name:'Gyukatsu Motomura',nameJp:'牛カツもと村',category:'Beef Cutlet',priceJpy:1600,priceUsd:10.72,priceRange:'¥¥',
    rating:4.9,reviewCount:8800,distance:'1.1km',walkTime:14,image:'https://images.unsplash.com/photo-1607301406259-dfb186e15582?auto=format&fit=crop&q=80&w=800',
    tags:['Must try','OU student fav','Best beef cutlet'],
    description:'Rare beef cutlet — you grill it yourself on a personal stone. Consistently rated #1 in Japan.',
    dealActive:false,
    menu:[
      {name:'Gyukatsu Set (130g)',price:1600,note:'Comes with rice, miso, pickles'},
      {name:'Gyukatsu Set (200g)',price:2200,note:'Large — shareable'},
      {name:'Premium Wagyu Set',price:3200,note:'Special occasion'},
    ],
    hours:'11:00–22:30',phone:'+81-3-0000-4444',address:'1-13-10 Kabukicho, Tokyo',
    acceptsSuica:false,isHalal:false,isVegetarian:false,isBudget:false,
    menuUrl:'https://www.gyukatsu-motomura.com/',
  },
  {
    id:'r5',name:'Magal Korean BBQ Halal',nameJp:'マガル',category:'Korean BBQ',priceJpy:2200,priceUsd:14.74,priceRange:'¥¥¥',
    rating:4.5,reviewCount:1200,distance:'0.9km',walkTime:12,image:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800',
    tags:['Halal certified','Group dining','All-you-can-eat'],
    description:'Japan Islamic Trust certified Korean BBQ. All meats halal. Popular with OU program groups.',
    dealActive:true,deal:'Group discount 10% for 6+ people',
    menu:[
      {name:'All-you-can-eat 60min',price:2200,note:'Halal beef, chicken, lamb'},
      {name:'Premium AYCE 90min',price:3500,note:'Wagyu beef included'},
      {name:'Soft drink bar',price:400,note:'Add-on'},
    ],
    hours:'17:00–23:00 (weekends 12:00)',phone:'+81-3-0000-5555',address:'2-8-12 Shinjuku, Tokyo',
    acceptsSuica:true,isHalal:true,isVegetarian:false,isBudget:false,
    menuUrl:'https://magal-bbq.jp/',
  },
  {
    id:'r6',name:'Yoshinoya',nameJp:'吉野家',category:'Gyudon',priceJpy:500,priceUsd:3.35,priceRange:'¥',
    rating:4.3,reviewCount:44000,distance:'0.1km',walkTime:1,image:'https://images.unsplash.com/photo-1569398034126-476e3a4af72f?auto=format&fit=crop&q=80&w=800',
    tags:['Open 24/7','Fast','Japanese staple'],
    description:'The original beef bowl chain. Budget legend. Open around the clock.',
    dealActive:false,
    menu:[
      {name:'Beef Bowl (regular)',price:468,note:'The classic'},
      {name:'Beef Bowl (large)',price:638,note:'Extra rice and beef'},
      {name:'Set with miso + salad',price:638,note:'Balanced meal'},
    ],
    hours:'24 hours',phone:'+81-6-0000-6666',address:'Near every train station',
    acceptsSuica:true,isHalal:false,isVegetarian:false,isBudget:true,
    menuUrl:'https://www.yoshinoya.com/menu/',
  },
]

function StarRating({ rating }) {
  const t = useStore(s => s.theme)
  const theme = getTheme(t)
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i=>(
        <svg key={i} width="10" height="10" viewBox="0 0 24 24"
          fill={i<=Math.round(rating)?'#FFB800':'none'} stroke="#FFB800" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      <span className="text-xs font-mono font-bold" style={{color:'#FFB800'}}>{rating}</span>
    </div>
  )
}

function RestaurantCard({ r, onNavigate, onOpen }) {
  const { theme, exchangeRate, setNaviMode } = useStore()
  const t = getTheme(theme)

  return (
    <motion.div layout initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
      className="rounded-3xl overflow-hidden mb-4"
      style={{background:t.surface,border:`1px solid ${t.border}`}}>
      {/* Image */}
      <div className="relative" style={{height:160}}>
        <img src={r.image} alt={r.name} className="w-full h-full object-cover"
          onError={e=>{e.target.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'}}/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)'}}/>
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {r.isHalal&&(
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-display font-bold"
              style={{background:'rgba(34,197,94,0.9)',color:'white'}}>
              <IcHalal size={10} color="white"/> Halal
            </span>
          )}
          {r.dealActive&&(
            <span className="px-2 py-0.5 rounded-full text-[10px] font-display font-bold"
              style={{background:'rgba(251,146,60,0.9)',color:'white'}}>🎟 Deal</span>
          )}
          {r.isBudget&&(
            <span className="px-2 py-0.5 rounded-full text-[10px] font-display font-bold"
              style={{background:'rgba(99,102,241,0.9)',color:'white'}}>Budget Pick</span>
          )}
        </div>
        {/* Price + rating bottom left */}
        <div className="absolute bottom-3 left-3">
          <p className="font-display font-black text-lg text-white leading-none">
            ¥{r.priceJpy.toLocaleString()}
          </p>
          <p className="text-xs text-white/70">≈ ${r.priceUsd} · {r.priceRange}</p>
        </div>
        {/* Distance bottom right */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-full text-xs font-display font-bold"
          style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(8px)',color:'white'}}>
          {r.distance} · {r.walkTime}m walk
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-base leading-tight truncate" style={{color:t.text}}>{r.name}</p>
            <p className="font-jp text-xs mt-0.5" style={{color:t.textMuted}}>{r.nameJp} · {r.category}</p>
          </div>
          <div className="flex flex-col items-end gap-1 ml-2">
            <StarRating rating={r.rating}/>
            <span className="text-[10px] font-mono" style={{color:t.textFaint}}>{r.reviewCount.toLocaleString()} reviews</span>
          </div>
        </div>

        <p className="text-xs leading-relaxed mb-3" style={{color:t.textMuted}}>{r.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {r.tags.map(tag=>(
            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-display font-medium"
              style={{background:t.brandBg,color:t.brand,border:`1px solid ${t.brand}33`}}>{tag}</span>
          ))}
        </div>

        {/* Deal banner */}
        {r.dealActive&&(
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
            style={{background:'rgba(251,146,60,0.12)',border:'1px solid rgba(251,146,60,0.3)'}}>
            <span className="text-base">🎟</span>
            <p className="text-xs font-display font-bold" style={{color:'#fb923c'}}>{r.deal}</p>
          </div>
        )}

        {/* Menu preview */}
        <div className="mb-3">
          <p className="text-xs font-display font-bold mb-2" style={{color:t.textMuted}}>POPULAR ITEMS</p>
          <div className="space-y-1.5">
            {r.menu.slice(0,2).map((item,i)=>(
              <div key={i} className="flex items-center justify-between px-3 py-1.5 rounded-xl"
                style={{background:'rgba(255,255,255,0.04)'}}>
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-xs font-display font-semibold truncate" style={{color:t.text}}>{item.name}</p>
                  <p className="text-[10px] truncate" style={{color:t.textFaint}}>{item.note}</p>
                </div>
                <span className="text-xs font-mono font-bold flex-shrink-0" style={{color:t.brand}}>¥{item.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hours + Suica */}
        <div className="flex items-center gap-3 mb-3 text-[10px] font-display" style={{color:t.textMuted}}>
          <span style={{opacity:0.8}}>⏱ {r.hours}</span>
          {r.acceptsSuica&&<span style={{color:'#60a5fa',fontWeight:700}}>IC OK</span>}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button onClick={()=>onOpen(r)} className="flex-1 py-2.5 rounded-xl font-display font-bold text-xs"
            style={{background:t.brandBg,border:`1px solid ${t.brand}44`,color:t.brand}}>
            Full Menu
          </button>
          <button onClick={()=>setNaviMode(true,{name:r.name,address:r.address})}
            className="flex-1 py-2.5 rounded-xl font-display font-bold text-xs text-white"
            style={{background:`linear-gradient(135deg,${t.brand},${t.accent})`}}>
            Navigate
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function RestaurantModal({ r, onClose }) {
  const { theme } = useStore()
  const t = getTheme(theme)

  return (
    <motion.div className="absolute inset-0 z-50 flex flex-col" style={{background:t.bg}}
      initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}}
      transition={{type:'spring',stiffness:320,damping:38}}>
      {/* Header image */}
      <div className="relative" style={{height:200,flexShrink:0}}>
        <img src={r.image} alt={r.name} className="w-full h-full object-cover"
          onError={e=>{e.target.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800'}}/>
        <div className="absolute inset-0" style={{background:'linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 60%)'}}/>
        <button onClick={onClose} className="absolute top-12 left-4 w-9 h-9 rounded-full flex items-center justify-center"
          style={{background:'rgba(0,0,0,0.6)',backdropFilter:'blur(8px)'}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="absolute bottom-3 left-4">
          <p className="font-display font-black text-xl text-white">{r.name}</p>
          <p className="font-jp text-xs text-white/70">{r.nameJp}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scroll p-4 space-y-4">
        {/* Rating + stats */}
        <div className="flex gap-3">
          {[
            {label:'Rating',value:`${r.rating} ★`,sub:`${r.reviewCount.toLocaleString()} reviews`},
            {label:'Distance',value:r.distance,sub:`${r.walkTime} min walk`},
            {label:'Price',value:`¥${r.priceJpy}`,sub:`≈ $${r.priceUsd}`},
          ].map(stat=>(
            <div key={stat.label} className="flex-1 p-3 rounded-2xl text-center"
              style={{background:t.surface,border:`1px solid ${t.border}`}}>
              <p className="font-display font-black text-sm" style={{color:t.text}}>{stat.value}</p>
              <p className="text-[10px] mt-0.5" style={{color:t.textMuted}}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Full menu */}
        <div>
          <p className="font-display font-black text-sm mb-3" style={{color:t.text}}>Full Menu</p>
          {r.menu.map((item,i)=>(
            <div key={i} className="flex items-center justify-between py-3 border-b"
              style={{borderColor:t.border}}>
              <div className="flex-1 mr-3">
                <p className="font-display font-semibold text-sm" style={{color:t.text}}>{item.name}</p>
                <p className="text-xs mt-0.5" style={{color:t.textMuted}}>{item.note}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-sm" style={{color:t.brand}}>¥{item.price}</p>
                <p className="text-[10px]" style={{color:t.textFaint}}>≈ ${(item.price*0.0067).toFixed(2)}</p>
              </div>
            </div>
          ))}
          {r.menuUrl&&(
            <a href={r.menuUrl} target="_blank" rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-1.5 py-2.5 rounded-xl w-full font-display font-bold text-sm"
              style={{background:t.brandBg,color:t.brand,border:`1px solid ${t.brand}44`}}>
              View Full Menu Online ↗
            </a>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2">
          {[
            {icon:'CLK',label:'Hours',val:r.hours},
            {icon:'PIN',label:'Address',val:r.address},
            {icon:'PHN',label:'Phone',val:r.phone},
            {icon:'IC',label:'Suica/IC',val:r.acceptsSuica?'Accepted':'Cash only'},
          ].map(({icon,label,val})=>(
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl"
              style={{background:t.surface,border:`1px solid ${t.border}`}}>
              <span className="text-base">{icon}</span>
              <div>
                <p className="text-[10px] font-display font-bold mb-0.5" style={{color:t.textMuted}}>{label.toUpperCase()}</p>
                <p className="text-xs" style={{color:t.text}}>{val}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function DiscoverView() {
  const { theme, naviMode, naviTarget, setNaviMode } = useStore()
  const t = getTheme(theme)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [halalOnly, setHalalOnly] = useState(false)
  const [openRest, setOpenRest] = useState(null)

  const filtered = RESTAURANTS.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.nameJp.includes(search) || r.category.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'All' || r.category.toLowerCase().includes(activeCategory.toLowerCase()) || (activeCategory==='Halal'&&r.isHalal) || (activeCategory==='Vegetarian'&&r.isVegetarian) || (activeCategory==='Budget'&&r.isBudget)
    const matchHalal = !halalOnly || r.isHalal
    return matchSearch && matchCategory && matchHalal
  })

  const halalCount = RESTAURANTS.filter(r=>r.isHalal).length
  const dealCount = RESTAURANTS.filter(r=>r.dealActive).length

  return (
    <div className="flex flex-col h-full relative">
      {/* Navi overlay */}
      <AnimatePresence>
        {naviMode&&<NaviOverlay target={naviTarget} onClose={()=>setNaviMode(false)}/>}
      </AnimatePresence>

      {/* Restaurant detail modal */}
      <AnimatePresence>
        {openRest&&<RestaurantModal r={openRest} onClose={()=>setOpenRest(null)}/>}
      </AnimatePresence>

      {/* Stats row */}
      <div className="flex gap-2 px-4 mb-3">
        {[
          {label:`${RESTAURANTS.length} Places`,sub:'Nearby',color:t.brand},
          {label:`${halalCount} Halal`,sub:'Certified',color:'#22c55e'},
          {label:`${dealCount} Deals`,sub:'Active now',color:'#fb923c'},
        ].map(s=>(
          <div key={s.label} className="flex-1 py-2 px-3 rounded-2xl text-center"
            style={{background:t.surface,border:`1px solid ${t.border}`}}>
            <p className="font-display font-black text-sm" style={{color:s.color}}>{s.label}</p>
            <p className="text-[10px]" style={{color:t.textMuted}}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 px-4 py-3 mx-4 mb-3 rounded-2xl"
        style={{background:t.surface,border:`1px solid ${t.border}`}}>
        <IcSearch size={16} color={t.textMuted}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search food, cuisine, restaurant..."
          className="flex-1 bg-transparent text-sm font-display outline-none"
          style={{color:t.text,'::placeholder':{color:t.textMuted}}}/>
        <button onClick={()=>setHalalOnly(!halalOnly)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all"
          style={{background:halalOnly?'rgba(34,197,94,0.15)':'transparent',border:halalOnly?'1px solid rgba(34,197,94,0.4)':'1px solid transparent'}}>
          <IcHalal size={14} color={halalOnly?'#22c55e':t.textMuted}/>
          <span className="text-[10px] font-display font-bold" style={{color:halalOnly?'#22c55e':t.textMuted}}>Halal</span>
        </button>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto hide-scroll">
        {CATEGORIES.map(cat=>{
          const active=activeCategory===cat
          return(
            <button key={cat} onClick={()=>setActiveCategory(cat)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full font-display font-bold transition-all"
              style={{
                fontSize:11,
                background:active?t.brand:'transparent',
                color:active?'white':t.textMuted,
                border:`1.5px solid ${active?t.brand:t.border}`,
              }}>
              {cat}
            </button>
          )
        })}
      </div>

      {/* Restaurant list */}
      <div className="flex-1 overflow-y-auto hide-scroll px-4 pb-2">
        {filtered.length===0&&(
          <div className="text-center py-12">
            <p className="font-display font-bold text-sm" style={{color:t.textMuted}}>No results</p>
            <p className="text-xs mt-1" style={{color:t.textFaint}}>Try adjusting your search or filters</p>
          </div>
        )}
        {filtered.map(r=>(
          <RestaurantCard key={r.id} r={r} onNavigate={setNaviMode} onOpen={setOpenRest}/>
        ))}
      </div>
    </div>
  )
}
