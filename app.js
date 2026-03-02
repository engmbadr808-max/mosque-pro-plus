const settings = Storage.load();

document.getElementById("mosqueName").innerText =
settings.mosqueName;

const timeEl=document.getElementById("time");
const dateEl=document.getElementById("date");
const hijriEl=document.getElementById("hijri");
const prayersEl=document.getElementById("prayers");
const zekrEl=document.getElementById("zekr");
const countdownEl=document.getElementById("countdown");
const adhan=document.getElementById("adhan");

adhan.src=settings.adhanAudio;

let prayerTimes={};
let currentPrayer=null;

/* CLOCK */

function updateClock(){
const now=new Date();

timeEl.innerText=
now.toLocaleTimeString("ar-SA",{hour:'2-digit',minute:'2-digit'});

dateEl.innerText=
now.toLocaleDateString("ar-SA",{weekday:'long',day:'numeric',month:'long',year:'numeric'});

hijriEl.innerText=
new Intl.DateTimeFormat('ar-TN-u-ca-islamic',{
day:'numeric',month:'long',year:'numeric'
}).format(now);
}

setInterval(updateClock,1000);
updateClock();

/* AZKAR */

let zekrIndex=0;
function rotateZekr(){
zekrEl.innerText=settings.azkar[zekrIndex];
zekrIndex=(zekrIndex+1)%settings.azkar.length;
}
setInterval(rotateZekr,10000);
rotateZekr();

/* LOAD PRAYERS */

async function loadPrayerTimes(){

const res=await fetch(
`https://api.aladhan.com/v1/timingsByCity?city=${settings.city}&country=${settings.country}&method=4`
);

const data=await res.json();
prayerTimes=data.data.timings;

renderPrayers();
}

function renderPrayers(){

prayersEl.innerHTML="";

Object.entries(settings.iqamaDelay).forEach(([name])=>{

const div=document.createElement("div");
div.className="prayer";
div.id=name;

div.innerHTML=`
<div>${translate(name)}</div>
<strong>${prayerTimes[name]}</strong>
`;

prayersEl.appendChild(div);

});
}

/* CURRENT PRAYER + COUNTDOWN */

function checkPrayer(){

const now=new Date();

for(const [name,time] of Object.entries(prayerTimes)){

if(!settings.iqamaDelay[name]) continue;

const [h,m]=time.split(":");
const prayerDate=new Date();
prayerDate.setHours(h,m,0);

const diff=(prayerDate-now)/1000;

if(diff<=settings.beforeAdhanAlert*60 && diff>0){
startCountdown(Math.floor(diff));
}

if(Math.abs(diff)<2){
adhan.play().catch(()=>{});
}

if(now>=prayerDate){
currentPrayer=name;
}
}

document.querySelectorAll(".prayer")
.forEach(p=>p.classList.remove("active"));

if(currentPrayer)
document.getElementById(currentPrayer)?.classList.add("active");

}

setInterval(checkPrayer,1000);

function startCountdown(sec){

countdownEl.classList.remove("hidden");

const timer=setInterval(()=>{

countdownEl.innerText=sec;
sec--;

if(sec<0){
clearInterval(timer);
countdownEl.classList.add("hidden");
}

},1000);
}

/* HELPERS */

function translate(n){
return{
Fajr:"الفجر",
Dhuhr:"الظهر",
Asr:"العصر",
Maghrib:"المغرب",
Isha:"العشاء"
}[n];
}

loadPrayerTimes();
