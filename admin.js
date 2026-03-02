let settings=Storage.load();

document.getElementById("mosque").value=settings.mosqueName;
document.getElementById("dhuhr").value=settings.iqamaDelay.Dhuhr;

function save(){

settings.mosqueName=
document.getElementById("mosque").value;

settings.iqamaDelay.Dhuhr=
Number(document.getElementById("dhuhr").value);

Storage.save(settings);

alert("تم حفظ الإعدادات ✅");
}
