/* Deterministic teaching models. Units are explicit; no display-only clipping of identities.
   Sources and model limits are registered in lab-lessons.js. */
(function(root){
  'use strict';
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function saturation(po2){const p=Math.max(0,po2);return (p*p*p+150*p)/(p*p*p+150*p+23400);}
  function oxygenContent(hb,sat,po2=100){return 1.34*Math.max(0,hb)*clamp(sat,0,1)+.003*Math.max(0,po2);}
  function venousContent(hb,content){if(content<=0)return {sat:0,po2:0};let lo=0,hi=1000;for(let i=0;i<55;i++){const p=(lo+hi)/2;if(oxygenContent(hb,saturation(p),p)>content)hi=p;else lo=p;}const po2=(lo+hi)/2;return {sat:saturation(po2),po2:po2};}
  function oxygen(o){
    const flow=Math.max(0,o.flow),hb=Math.max(0,o.hb),sat=o.sat==null?saturation(o.po2==null?100:o.po2):clamp(o.sat,0,1),po2=o.po2==null?100:Math.max(0,o.po2);
    const content=oxygenContent(hb,sat,po2),delivery=flow*content*10,demand=Math.max(0,o.demand==null?115:o.demand),consumption=Math.min(demand,delivery),cv=flow?content-consumption/(flow*10):0,venous=venousContent(hb,Math.max(0,cv));
    return {content,delivery,demand,consumption,extraction:delivery?demand/delivery:Infinity,svo2:venous.sat*100,pvo2:venous.po2,supplyLimited:demand>delivery,deficit:Math.max(0,demand-delivery),sat,po2};
  }
  function meanPressure(flow,svr,cvp=0){return cvp+Math.max(0,flow)*Math.max(0,svr)/80;}
  function metabolicDemand(temp,percent=100){return 115*(percent/100)*Math.pow(1.07,temp-37);}
  function pv(o){
    const edv=Math.max(0,o.preload),hr=Math.max(0,o.hr),reg=clamp((o.regurg||0)/100,0,.95),v0=10,ees=2.5*Math.max(.1,o.contractility/100),comp=Math.max(.1,o.compliance/100),afterload=Math.max(1,o.afterload);
    const passive=v=>.45*Math.expm1(Math.min(15,.028*Math.max(0,v-v0)/comp));
    const edp=passive(edv),esp=1.05*afterload,esv=clamp(o.lesion==='mr'?(v0+esp/ees-edv*reg*.12)/(1-reg*.12):v0+esp/ees,0,edv),sv=edv-esv,forward=sv*(1-reg),pmax=Math.max(esp,1.25*afterload),opening=.75*afterload;
    const valid=edp<opening&&sv>0;
    const lesion=o.lesion||'normal';
    const values={edv,esv,sv,forward,ef:edv?100*sv/edv:0,co:hr*forward/1000,hr,ees,v0,edp,esp,pmax,opening,reg,lesion,valid,passive};
    if(!valid){values.esv=edv;values.sv=values.forward=values.ef=values.co=0;}
    values.events=[{phase:0,label:'MVC',v:edv-(lesion==='ar'?values.sv*reg*.12:0),p:passive(edv-(lesion==='ar'?values.sv*reg*.12:0))},{phase:.13,label:'AVO',v:edv-(lesion==='mr'?values.sv*reg*.22:0),p:opening},{phase:.48,label:'AVC',v:values.esv+(lesion==='mr'?values.sv*reg*.12:0),p:esp},{phase:.60,label:'MVO',v:values.esv+(lesion==='ar'?values.sv*reg*.24:0),p:passive(values.esv+(lesion==='ar'?values.sv*reg*.24:0))}];
    values.points=Array.from({length:201},(_,i)=>pvSample(values,i/200));
    values.work=values.points.slice(1).reduce((work,p,i)=>work+(values.points[i][1]+p[1])*.5*(values.points[i][0]-p[0]),0)*.000133322;
    return values;
  }
  function pvSample(s,phase){
    const t=clamp(phase,0,1),e=s.events;
    if(!s.valid)return [s.edv,s.edp];
    if(t<.13){const u=t/.13;return [e[0].v+(e[1].v-e[0].v)*u,e[0].p+(e[1].p-e[0].p)*u];}
    if(t<.48){const u=(t-.13)/.35;return [e[1].v+(e[2].v-e[1].v)*u,e[1].p+(s.esp-e[1].p)*u+Math.sin(Math.PI*u)*(s.pmax-(e[1].p+s.esp)/2)];}
    if(t<.60){const u=(t-.48)/.12;return [e[2].v+(e[3].v-e[2].v)*u,e[2].p+(e[3].p-e[2].p)*u];}
    const u=(t-.60)/.40,v=e[3].v+(e[0].v-e[3].v)*u;return [v,s.passive(v)];
  }
  function valve(o){
    const csa=Math.PI*(o.diameter/2)**2,sv=csa*o.lvotVti,area=sv/o.valveVti,dvi=o.lvotVti/o.valveVti,peak=4*o.vmax**2,svi=sv/o.bsa,indexed=area/o.bsa;
    const invalid=o.mean>peak||![area,sv,svi,indexed].every(Number.isFinite)||o.mean<0;
    let classification,explanation;
    if(invalid){classification='Inconsistent measurements';explanation='Mean gradient cannot exceed the peak instantaneous gradient from the same envelope. Check units, acquisition and inputs.';}
    else if(o.mode==='mitral'){classification=o.hr>100?'Rate-dependent transmitral gradient':'Mitral inflow: integrate gradient and morphology';explanation='Interpret at the recorded heart rate and flow. Continuity MVA assumes equal forward aortic and mitral stroke volumes; significant MR, AR or a shunt invalidates this assumption. Reassess leaflet motion and loading.';}
    else if(o.mode==='prosthetic'){classification='Prosthetic valve: compare with its reference';explanation='EOA and DVI require prosthesis type, size, baseline Doppler and leaflet motion. Indexed EOA can suggest mismatch, but native aortic stenosis cutoffs do not diagnose prosthetic obstruction.';}
    else if(o.vmax>=4&&o.mean>=40&&area<=1){classification='Concordant severe-range aortic stenosis';explanation='Velocity, mean gradient and calculated area agree; confirm acquisition and valve morphology.';}
    else if(o.vmax>=4&&area>1){classification='High gradient with discordant valve area';explanation='Increased flow may elevate velocity and gradient. Integrate stroke volume, DVI, morphology and measurement quality before calling severe obstruction.';}
    else if(area<=1&&svi<35){classification='Low-flow, small-area discordance';explanation='Low flow can blunt the gradient. Integrate ventricular function, acquisition, stress testing or CT calcium as appropriate.';}
    else {classification=area<=1?'Small area: verify flow and measurement':'No concordant severe AS pattern';explanation='Integrate all Doppler measurements with morphology and the clinical context.';}
    return {csa,sv,area,dvi,peak,svi,indexed,invalid,classification,explanation,mode:o.mode||'aortic'};
  }
  function shock(o){const co=o.hr*o.sv/1000,map=meanPressure(co,o.svr,o.cvp),oxygenation=oxygen({flow:co,hb:o.hb,sat:o.sat,po2:100,demand:250});let phenotype='supported';
    if(o.cvp>16&&o.pcwp<12&&o.pap>30&&co<4)phenotype=o.svr<600?'mixed':'rv';
    else if(o.cvp>17&&Math.abs(o.cvp-o.pcwp)<4&&co<4)phenotype='obstructive';
    else if(o.pcwp>18&&co<4)phenotype='lv';else if(o.svr<600&&co>4)phenotype='vasoplegia';else if(o.cvp<6&&o.pcwp<8&&co<4)phenotype='hypovolemia';else if(co<4)phenotype='low-output';
    const labels={supported:'Supported profile',mixed:'Mixed RV failure and vasoplegia',rv:'RV-pulmonary failure pattern',obstructive:'Possible pericardial constraint / tamponade pattern',lv:'LV or biventricular pump failure pattern',vasoplegia:'Vasoplegic high-flow pattern',hypovolemia:'Underfilled / hypovolemic pattern','low-output':'Low-output undifferentiated profile'};
    return {co,map,oxygen:oxygenation,phenotype,label:labels[phenotype]};
  }
  // Event times in seconds. Demand channels reset on sensed/captured events.
  // Teaching limits: fixed 160 ms native AV conduction, 250 ms ventricular
  // refractory interval, 130 bpm upper tracking rate; no device-specific algorithms.
  function pacing(c,s) {
    const aSense=s.aSense<=c.aAmp,vSense=s.vSense<=c.vAmp,oversenseA=c.noise>=s.aSense,oversenseV=c.noise>=s.vSense;
    const aCapture=!!c.wireA&&s.aOut>=c.aThreshold,vCapture=!!c.wireV&&s.vOut>=c.vThreshold;
    const async=s.mode==='DOO',ac=['AAI','DDD','DOO'].includes(s.mode),vc=['VVI','DDD','DOO'].includes(s.mode),interval=60/s.rate;
    const events=[],duration=24;let nextA=0,nextIntrinsicA=0,nextV=interval+(async?s.av/1000:0),nextEscape=0,pendingConduct=Infinity,lastV=-10,lastAS=-10;
    function add(t,type){events.push({t:Math.round(t*1000)/1000,type});}
    function vent(t,type){if(t-lastV<.25)return false;lastV=t;add(t,type);add(t+.12,'pulse');nextEscape=t+(c.intrinsicV?60/c.intrinsicV:Infinity);if(!async&&vSense){nextV=t+interval; }return true;}
    function atrium(t,type){add(t,type);if(c.avIntact)pendingConduct=t+.16;if(!async&&aSense){nextA=t+interval;lastAS=t;if(s.mode==='DDD'&&!oversenseA)nextV=Math.max(t+s.av/1000,lastV+60/130);} }
    for(let i=0;i<=duration*1000;i++){
      const t=i/1000;
      if(c.intrinsicA&&!c.af&&t>=nextIntrinsicA){atrium(t,'AS');nextIntrinsicA=t+60/c.intrinsicA;}
      if(ac&&t>=nextA){nextA=t+interval;if(async||!oversenseA){add(t,'AP');if(aCapture){atrium(t,'AC');nextIntrinsicA=t+(c.intrinsicA?60/c.intrinsicA:Infinity);if(s.mode==='DDD')nextV=Math.max(t+s.av/1000,lastV+60/130);}}}
      if(t>=pendingConduct){vent(t,'VS');pendingConduct=Infinity;}
      if(c.intrinsicV&&t>=nextEscape)vent(t,'VS');
      if(vc&&t>=nextV){nextV=t+interval;if(async||!oversenseV){add(t,'VP');if(vCapture)vent(t,'VC');if(async)nextV=t+interval;}}
    }
    const stable=events.filter(e=>e.t>=8),vs=stable.filter(e=>e.type==='VS'||e.type==='VC'),aps=stable.some(e=>e.type==='AP'),vps=stable.some(e=>e.type==='VP');
    const rate=vs.length>1?60*(vs.length-1)/(vs[vs.length-1].t-vs[0].t):0;
    let status='Demand standby',tone='ok';
    if(vps&&!vCapture){status='Ventricular noncapture';tone='danger';}
    else if((ac&&oversenseA||vc&&oversenseV)&&!async){status='Oversensing / inhibition';tone='danger';}
    else if((ac&&!aSense&&c.intrinsicA>=s.rate||vc&&!vSense&&c.intrinsicV>=s.rate)||async&&c.intrinsicV>s.rate){status='Competing stimuli · assess sensing';tone='warn';}
    else if(s.mode==='AAI'&&!c.avIntact){status='Atrial pacing cannot bridge AV block';tone='danger';}
    else if(aps||vps)status='Pacing with '+((!aps||aCapture)&&(!vps||vCapture)?'capture':'incomplete capture');
    return {aSense,vSense,oversenseA,oversenseV,aCapture,vCapture,aPaced:aps,vPaced:vps,trackedV:s.mode==='DDD'&&lastAS>0,status,tone,rate,events,duration};
  }
  // Synthetic calibrated pressure trace. Every displayed delta is sampled
  // from this waveform, including deflation carried across the next beat.
  function iabp(o){
    const hr=o.hr||74,rr=60/hr,n=Number(String(o.ratio||'1:1').split(':')[1]),irregular=!!o.irregular;
    const starts=[-2*rr];for(let j=0;j<9;j++)starts.push(starts[starts.length-1]+rr*(irregular?[1,.76,1.24][j%3]:1));
    const g=(x,m,w)=>Math.exp(-(((x-m)/w)**2)),windows=[];
    for(let b=0;b<starts.length-1;b++){const len=starts[b+1]-starts[b];if(b%n===0){const jitter=irregular&&o.trigger==='ecg'?(b%2?.09:-.06):0;windows.push({start:starts[b]+(o.inflation/100+jitter)*len,end:starts[b]+(o.deflation/100+jitter)*len,beat:b,len});}}
    const sample=t=>{let b=0;while(b<starts.length-2&&starts[b+1]<=t)b++;const len=starts[b+1]-starts[b],phase=(t-starts[b])/len,native=72+44*g(phase,.18,.12)+8*g(phase,.4,.025)+6*g(phase,.52,.2);let p=native,balloon=false;
      windows.forEach(w=>{const ph=(t-starts[w.beat])/w.len,inf=(w.start-starts[w.beat])/w.len,def=(w.end-starts[w.beat])/w.len;
        if(t>=w.start&&t<=w.end){balloon=true;p+=42*g(ph,Math.max(.55,inf+.12),.24);if(ph<.4)p+=20*g(ph,.3,.09);if(ph>1)p+=22*g(ph,1.06,.08);}
        if(def>.83&&def<1.01){const fit=Math.max(0,1-Math.abs(def-.93)/.1);p-=11*fit*g(ph,.985,.05);p-=9*fit*g(ph,1.18,.12);}
      });return {t,pressure:p,native,balloon,phase};};
    const end=starts[5],begin=starts[2],points=Array.from({length:841},(_,i)=>sample(begin+(end-begin)*i/840));
    const diastolic=points.filter(p=>p.phase>=.4&&p.phase<.9),systolic=points.filter(p=>p.phase>=0&&p.phase<.39),augmentation=Math.max(...diastolic.map(p=>p.pressure-p.native)),systolicDelta=systolic.reduce((best,p)=>Math.abs(p.pressure-p.native)>Math.abs(best)?p.pressure-p.native:best,0);
    return {points,sample,windows,starts,begin,end,augmentation,systolicDelta,hr};
  }
  // Synthetic assay envelope: full width 2 mm at R/CT, 20 mm at R+K,
  // maximum at a finite time, LY30 exactly 30 minutes after maximum.
  // Alpha uses a documented 2 mm/min paper time scale and half-width.
  function teg(o){
    const r=Math.max(.1,o.r),k=Math.max(.1,o.k),ma=Math.max(2,o.ma),ly=clamp(o.ly,0,100),lowStrength=ma<20;
    const t20=r+k,tma=lowStrength?r+5:t20+Math.max(.001,(ma-20)*k/18),end=tma+30;
    const amp=t=>{if(t<0)return 0;if(t<=r)return 2*(t/r)**3;if(lowStrength&&t<tma)return 2+(ma-2)*(t-r)/(tma-r);if(!lowStrength&&t<=t20)return 2+18*(t-r)/k;if(t<tma)return 20+(ma-20)*(t-t20)/(tma-t20);if(t<=end)return ma*(1-ly/100*(t-tma)/30);return ma*(1-ly/100);};
    return {r,k:lowStrength?null:k,ma,ly,tma,end,amplitude:amp,points:Array.from({length:601},(_,i)=>{const t=i*end/600;return [t,amp(t)];}),assay:o.assay||'Kaolin TEG',alphaDerived:lowStrength?null:Math.atan(4.5/k)*180/Math.PI};
  }
  function cardioplegia(o){
    let lv='Expected',septum='Expected',rv='Expected';const warnings=[];
    if(o.route==='retrograde'){rv='At risk';warnings.push('Retrograde distribution may inadequately protect the RV.');}
    if(o.route==='antegrade'&&['cabg-cto','left-main','aortic-regurg'].includes(o.scenario)){lv=septum='At risk';if(o.scenario!=='left-main')rv='At risk';warnings.push('The lesion can impede effective antegrade delivery.');}
    if(o.route!=='retrograde'&&o.pressure<40){lv=septum=rv='At risk';warnings.push('Low root pressure: confirm effective delivery.');}
    if(o.route!=='retrograde'&&o.pressure>85)warnings.push('High antegrade pressure: reassess delivery and tissue injury risk.');
    if(['retrograde','combined'].includes(o.route)&&(o.csPressure<20||o.csPressure>40)){lv=septum='Limited';warnings.push('Coronary sinus pressure is outside this teaching range.');}
    return {lv,septum,rv,warnings};
  }
  function cannulation(o){return {arterial:o.arterial,venous:o.venous,flowDirection:o.arterial==='femoral'?'Retrograde aortic return':'Antegrade aortic return',cavalIsolation:o.venous==='bicaval',vent:o.vent,protection:o.protection};}
  const api={clamp,saturation,oxygenContent,venousContent,oxygen,meanPressure,metabolicDemand,pv,pvSample,valve,shock,pacing,iabp,teg,cardioplegia,cannulation};
  root.CSModels=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
