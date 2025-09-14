var latest = document.getElementById("latest-code");
var prio = document.getElementById("manual-code");
var statuss = document.getElementById("status");
var find = document.getElementById("find_code");
var first_time_running = true
//let codeAPI = "http://127.0.0.1:8000"
function start(){
fetch(codeAPI + "/setup")
.then (res => {
    return res.json()
})
.then (data =>{
    prio.innerText = data["prio_code"]
    
    if (latest.innerText != data["code"]){
        latest.innerText = data["code"]
        if (! first_time_running){
            latest.style.backgroundColor = "white"
            setTimeout(()=>{
                latest.style.backgroundColor = ""
            },700)
        }
        else{
            first_time_running = false
        }
        
    }
    
    if (data["not_looking"]){
        //alert(loading_animation)
        if (typeof(loading_animation) != "undefined"){
            clearInterval(loading_animation)
        }
        find.innerText = "Find New Code"
    }else{
        var dots = 0
        if (typeof(loading_animation) != "undefined"){
            clearInterval(loading_animation)
        }
        loading_animation = setInterval(() => {
            dots = (dots + 1) % 4; // Cycles through 0, 1, 2, 3
            find.innerText = 'Finding Code' + '.'.repeat(dots);
          }, 500);
        
    }
    


})


};


start();
setInterval(start,30000);