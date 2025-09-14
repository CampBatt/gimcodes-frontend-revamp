var latest = document.getElementById("latest-code");
var prio = document.getElementById("manual-code");
var find = document.getElementById("find_code");
var load = document.getElementById("load");
var code_desc = document.getElementById("code_desc");
var the_one_looking = false


let codeAPI = "https://gimcodes-q1jkv5tvn-campbatt.vercel.app"

function copy_to_clip(){
    navigator.clipboard.writeText(this.innerText)
    .then(()=>{
        alert("Code Copied To Clipboard")
    })
};


//https://gimcodes-q1jkv5tvn-campbatt.vercel.app/


//


function find_code(){
fetch(codeAPI+"/test")
.then(res => {
    return res.json()
})
.then (data => {if (data['can_continue']){
    the_one_looking = true
    var dots = 0
    find.innerText = "Finding Code"
    if (typeof(loading_animation) != "undefined"){
        clearInterval(loading_animation)
    }
    loading_animation = setInterval(() => {
        dots = (dots + 1) % 4; // Cycles through 0, 1, 2, 3
        find.innerText = 'Finding Code' + '.'.repeat(dots);
      }, 500);
    send_untill_find();
}else{
    find.innerText = "Finding Code"
    var dots = 0
    if (typeof(loading_animation) != "undefined"){
        clearInterval(loading_animation)
    }
    loading_animation = setInterval(() => {
        dots = (dots + 1) % 4; // Cycles through 0, 1, 2, 3
        find.innerText = 'Finding Code' + '.'.repeat(dots);
      }, 500);
}
});


};




    async function send_untill_find(){
        keep_looking = true
        while (keep_looking == 1){
            //console.log('started')
       let response = await fetch(codeAPI);
       console.log(response);
       let APIresponse = response.json();
       APIresponse.then(res => {
        keep_looking = res['keep_looking']
        code = res['code']
       })
    }

    clearInterval(loading_animation);
    find.innerText = "Find New Code"
    latest.style.backgroundColor = "white"
    setTimeout(()=>{
        latest.style.backgroundColor = ""
    },700)
    latest.innerText = code

    fetch(socialAPI+'/increment',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            username:localStorage.getItem('user'),
            token:localStorage.getItem('token'),
            jump:1,
            value:'CODES_FOUND'
    })})
    };




console.log(latest);
console.log(prio);
console.log(find);


prio.addEventListener("click", copy_to_clip);
latest.addEventListener("click", copy_to_clip);
find.addEventListener("click", find_code);