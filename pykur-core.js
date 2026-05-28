(function(){
  const STORE_KEY="pykur_clean_v1";
  const PP_MAX=90;
  const RUN_LIMITS={morose:640,tynril:48};
  const mobs={
    chiendent:{name:"Chiendent",img:"chiendent.png",ppNeed:80},
    nerbe:{name:"Nerbe",img:"nerbe.png",ppNeed:80},
    fecorce:{name:"Fécorce",img:"fecorce.png",ppNeed:60},
    abrakleur:{name:"Abrakleur Sombre",img:"abrakleur.png",ppNeed:40},
    bitouf:{name:"Bitouf Sombre",img:"bitouf.png",ppNeed:40},
    floribonde:{name:"Floribonde",img:"floribonde.png",ppNeed:40},
    brouture:{name:"Brouture",img:"Brouture.png",ppNeed:60},
    tynrilAhuri:{name:"Tynril Ahuri",img:"tynril-ahuri.png",ppNeed:3},
    tynrilPerfide:{name:"Tynril Perfide",img:"tynril-perfide.png",ppNeed:3},
    tynrilDeconcerte:{name:"Tynril Déconcerté",img:"tynril-deconcerte.png",ppNeed:3},
    tynrilConsterne:{name:"Tynril Consterné",img:"tynril-consterne.png",ppNeed:3}
  };
  const gains={
    morose:{chiendent:1,nerbe:1,fecorce:1,abrakleur:1,bitouf:1,floribonde:2},
    tynril:{tynrilConsterne:1,tynrilDeconcerte:1,tynrilPerfide:1,tynrilAhuri:1,fecorce:2,abrakleur:3,brouture:3,chiendent:5,nerbe:6,floribonde:6,bitouf:10}
  };

  function clone(value){return JSON.parse(JSON.stringify(value))}

  function defaultKeybinds(){
    return {
      addRun:"+",
      removeRun:"-",
      switchDungeon:"Tab",
      chronoToggle:"S",
      chronoReset:"R",
      openHistory:"H",
      openOptions:"O",
      openProjection:"P",
      openMonsters:"B",
      toggleSound:"Ctrl+M",
      toggleNight:"Ctrl+D",
      openHelp:"F1"
    };
  }

  function defaultData(){
    return {
      runs:{morose:0,tynril:0},
      mobs:{morose:{},tynril:{},zone:{}},
      settings:{
        night:false,animations:true,tooltips:true,notifications:true,sound:true,autoMarkOnPlus:false,hudMode:false,
        visualIntensity:"standard",uiOpacity:"medium",dashboardMode:"tryhard",
        chronoStyle:"technical",showMilliseconds:false,autoDungeonEstimate:false,notificationSize:"normal",notificationDuration:3200,
        notificationsPersistent:false,disableMinorNotifications:false,highContrast:false,reducedSaturation:false,largeFont:false,
        shortcutsEnabled:true,keybinds:defaultKeybinds()
      },
      stats:{avgMorose:125,avgTynril:600,milestones:{},days:{}},
      chrono:{seconds:0,running:false,startedAt:null,lastMarkSeconds:0,marks:[]},
      session:{active:false,startedAt:null,totalSeconds:0,runs:{morose:0,tynril:0},ppStart:0,ppGain:0,lastSummary:null},
      ui:{farm:"morose",tab:"morose",monsterSort:"total",monsterView:"comfortable",monsterSearch:"",monsterFavs:[],activityDensity:"compact",collapsedActivityDays:[],capyMode:false},
      hud:{windows:{},z:10050},
      activity:[],
      undo:[]
    };
  }

  function makeStore(){
    const id=`p_${Date.now()}`;
    return {active:id,profiles:{[id]:{name:"Pykur principal",data:defaultData()}}};
  }

  function formatChrono(sec){
    sec=Math.max(0,Math.floor(sec||0));
    const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  }

  function formatDuration(sec){
    sec=Math.max(0,Math.round(sec||0));
    const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
    if(h>0)return `${h}h ${String(m).padStart(2,"0")}min`;
    if(m>0)return `${m}min ${String(s).padStart(2,"0")}s`;
    return `${s}s`;
  }

  function totalMobs(data){
    const totals={};
    Object.keys(mobs).forEach(id=>{
      totals[id]=(data.mobs?.morose?.[id]||0)+(data.mobs?.tynril?.[id]||0)+(data.mobs?.zone?.[id]||0);
    });
    return totals;
  }

  function ppFrom(source){
    let pp=0;
    Object.keys(mobs).forEach(id=>pp+=Math.floor((source[id]||0)/mobs[id].ppNeed));
    return Math.min(pp,PP_MAX);
  }

  function currentPP(data){return ppFrom(totalMobs(data))}

  window.PykurCore={STORE_KEY,PP_MAX,RUN_LIMITS,mobs,gains,clone,defaultKeybinds,defaultData,makeStore,formatChrono,formatDuration,totalMobs,ppFrom,currentPP};
})();
