let doneBtn = document.querySelector(".btnList .done");
let notDoneBtn = document.querySelector(".btnList .notDone");
let doneList = document.querySelector(".screen .doneList");
let runningList = document.querySelector(".screen .runningList");

console.log(doneBtn, notDoneBtn, doneList, runningList);

doneBtn.addEventListener("click", ()=>{
    doneList.style.display = 'flex';

    doneBtn.style.backgroundColor = '#0061FF'
    doneBtn.style.color = 'white';

    notDoneBtn.style.backgroundColor = 'white'
    notDoneBtn.style.color = 'black';

    runningList.style.display = 'none';
});

notDoneBtn.addEventListener("click", ()=>{
    runningList.style.display = 'flex';

    notDoneBtn.style.backgroundColor = 'black'
    notDoneBtn.style.color = 'white';

    doneBtn.style.backgroundColor = 'white'
    doneBtn.style.color = '#0061FF';

    doneList.style.display = 'none';
});
