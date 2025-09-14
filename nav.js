var SERVER_IP = "http://127.0.0.1:8000"
var line1 = document.getElementById("server_line_1");
var line2 = document.getElementById("server_line_2");
var line3 = document.getElementById("server_line_3");
var add_chat_button = document.getElementById("add_a_chat");
var add_chat_menu = document.getElementById("add_chat_menu");
var add_chat_input = document.getElementById("add_chat_input");
var add_chat_add_button = document.getElementById("add_chat_add_button");

var create_chat_button = document.getElementById("create_a_chat");
var create_chat_menu = document.getElementById("create_chat_menu");
var create_chat_input = document.getElementById("create_chat_input");
var create_chat_add_button = document.getElementById("create_chat_create_button");

var login_page = document.getElementById("login_page");
var login_ul = document.getElementById("login_ul");
var nav_login = document.getElementById("nav_login");
var login_user_input = document.getElementById("login_user_input").firstElementChild;
var login_pass_input = document.getElementById("login_pass_input").firstElementChild;
var login_button = document.getElementById("login_button");
var nav_pannel = document.getElementById("serverstuff");

var create_page = document.getElementById("create_page");
var create_ul = document.getElementById("create_ul");
var nav_create = document.getElementById("nav_create");
var create_user_input = document.getElementById("create_user_input").firstElementChild;
var create_email_input = document.getElementById("create_email_input").firstElementChild;
var create_pass_input = document.getElementById("create_pass_input").firstElementChild;
var create_button = document.getElementById("create_button");

var login_account_button = document.getElementById("login_account_button");
var create_account_button = document.getElementById("create_account_button");

login_account_button.addEventListener("click",show_login);
create_account_button.addEventListener("click",show_create);

create_pass_input.addEventListener("focus",function(){
    create_pass_input.parentElement.style.borderColor = "#729dff"
    if (create_pass_input.value=="Password"){
        create_pass_input.value=""
        create_pass_input.style.webkitTextSecurity = "disc";
        

    }
})

create_user_input.addEventListener("focus",function(){
    create_user_input.parentElement.style.borderColor = "#729dff"
    if (create_user_input.value=="Username"){
        create_user_input.value=""
        

    }
})

create_email_input.addEventListener("focus",function(){
    create_email_input.parentElement.style.borderColor = "#729dff"
    if (create_email_input.value=="Email"){
        create_email_input.value=""
        

    }
})

create_pass_input.addEventListener("blur",function(){
    create_pass_input.parentElement.style.borderColor = "#2a2f36"
    if (create_pass_input.value==""){
        create_pass_input.value="Password"
        create_pass_input.style.webkitTextSecurity = "";
        

    }
})

create_user_input.addEventListener("blur",function(){
    create_user_input.parentElement.style.borderColor = "#2a2f36"
    if (create_user_input.value==""){
        create_user_input.value="Username"
        

    }
})

create_email_input.addEventListener("blur",function(){
    create_email_input.parentElement.style.borderColor = "#2a2f36"
    if (create_email_input.value==""){
        create_email_input.value="Email"
        

    }
})
////
login_pass_input.addEventListener("focus",function(){
    login_pass_input.parentElement.style.borderColor = "#729dff"
    if (login_pass_input.value=="Password"){
        login_pass_input.value=""
        login_pass_input.style.webkitTextSecurity = "disc";
        

    }
})

login_user_input.addEventListener("focus",function(){
    login_user_input.parentElement.style.borderColor = "#729dff"
    if (login_user_input.value=="Username"){
        login_user_input.value=""
        

    }
})

login_pass_input.addEventListener("blur",function(){
    login_pass_input.parentElement.style.borderColor = "#2a2f36"
    if (login_pass_input.value==""){
        login_pass_input.value="Password"
        login_pass_input.style.webkitTextSecurity = "";
        

    }
})

login_user_input.addEventListener("blur",function(){
    login_user_input.parentElement.style.borderColor = "#2a2f36"
    if (login_user_input.value==""){
        login_user_input.value="Username"
        

    }
})
////

function show_login(){
    nav_pannel.nextElementSibling.style.filter="blur(5px)";
    login_page.style.zIndex = "1001";
    login_pass_input.value="Password"
    login_user_input.value="Username"
    create_page.style.zIndex = "0";

}

function show_create(){
    nav_pannel.nextElementSibling.style.filter="blur(5px)";
    create_page.style.zIndex = "1001";
    create_pass_input.value="Password"
    create_email_input.value="Email"
    create_user_input.value="Username"
    login_page.style.zIndex = "0";

}

nav_login.addEventListener("click",show_login)

nav_create.addEventListener("click",show_create)

login_page.addEventListener("click",function(e){
    if(!login_ul.contains(e.target)){
        nav_pannel.nextElementSibling.style.filter="blur(0px)";
        login_page.style.zIndex = "0";
        
    }
})

create_page.addEventListener("click",function(e){
    if(!create_ul.contains(e.target)){
        nav_pannel.nextElementSibling.style.filter="blur(0px)";
        create_page.style.zIndex = "0";
        
    }
})

login_button.addEventListener("click",function(){
    login_account(login_user_input.value,login_pass_input.value);
})

create_button.addEventListener("click",function(){
    create_account(create_user_input.value,create_email_input.value,create_pass_input.value);
})

document.body.addEventListener("click",function(e){
    if(!add_chat_menu.contains(e.target) && !add_chat_button.contains(e.target) && !create_chat_button.contains(e.target) && !create_chat_menu.contains(e.target)){
        add_chat_menu.className="hidden";
        create_chat_menu.className="hidden";
    }
    
},false)

//add_chat_menu.addEventListener("click",function(e){
    //e.stopPropagation();

//},true);

add_chat_button.addEventListener("click",function(){
    add_chat_menu.style.marginTop = add_chat_button.getBoundingClientRect()["top"] + "px"
    add_chat_input.value= "Chat Name"
    add_chat_menu.className=""
})

add_chat_input.addEventListener("focus",function(){
    if(this.value=="Chat Name"){
        this.value=""
    }
})

add_chat_input.addEventListener("blur",function(){
    if(this.value==""){
        this.value="Chat Name"
    }
})

add_chat_add_button.addEventListener("click",function(e){
    add_public_chat(add_chat_input.value);
})

create_chat_button.addEventListener("click",function(){
    create_chat_menu.style.marginTop = create_chat_button.getBoundingClientRect()["top"] + "px"
    create_chat_input.value= "Chat Name"
    create_chat_menu.className=""
    console.log("showng")
})

create_chat_input.addEventListener("focus",function(){
    if(this.value=="Chat Name"){
        this.value=""
    }
})

create_chat_input.addEventListener("blur",function(){
    if(this.value==""){
        this.value="Chat Name"
    }
})

create_chat_add_button.addEventListener("click",function(){
    create_public_chat(create_chat_input.value);
})

async function login_account(username,password){
    var hashBuffer = await crypto.subtle.digest("SHA-256",new TextEncoder().encode(password))
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    var pass_hash = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')

    var res = await fetch(SERVER_IP+"/login",{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
            username:username,
            password:pass_hash,
        })
    })
    var data = await res.json();
    if (data["success"]){
        var account_data = data["data"]
        console.log(account_data)
        nav_pannel.nextElementSibling.style.filter="blur(0px)";
        login_page.style.zIndex = "0";
        localStorage.setItem("username",account_data[1])
        localStorage.setItem("account_uuid",account_data[0])
        localStorage.setItem("token",account_data[16])
        localStorage.setItem("pfp_uuid",account_data[15])
        var derived_key = await create_derived_key(password,base64ToBytes(account_data[3]))
        var iv = base64ToBytes(account_data[7])
        var private_key = await crypto.subtle.decrypt({name:"AES-GCM",iv},derived_key,base64ToBytes(account_data[6]))
        var private_key = bytesToBase64(private_key)
        localStorage.setItem("public_key",account_data[5])
        localStorage.setItem("private_key",private_key);
        location.reload();
    }else{
        alert(data["error"])
    }
    
    


}

async function create_public_chat(chat_name){
    var account_uuid = localStorage.getItem("account_uuid");
    var token = localStorage.getItem("token");
    var res = await fetch(SERVER_IP+"/create_public_chat",{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
            name:chat_name,
            account_uuid:account_uuid,
            token:token
        })
    })
    var data = await res.json();
    if(data["success"]){
        location.href = "/chat/?u=" + data["data"][0] +"&n=" + data["data"][8]
    }else{
        show_login()
        add_chat_menu.className="hidden";
        create_chat_menu.className="hidden";
        //if (data["error"]=="not authenticated"){
            //show_login()
            //add_chat_menu.className="hidden";
            //create_chat_menu.className="hidden";
        //}
    }
}

async function add_public_chat(chat_name){
    var account_uuid = localStorage.getItem("account_uuid");
    var token = localStorage.getItem("token");
    var res = await fetch(SERVER_IP+"/add_public_chat",{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
            chat_name:chat_name,
            account_uuid:account_uuid,
            token:token
        })
    })
    data = await res.json()
    if (data["success"]){
        console.log(data)
        console.log(data["data"])
        location.href = "/chat/?u=" + data["data"][1] +"&n=" + data["data"][3]
    }else{
        show_login()
        add_chat_menu.className="hidden";
        create_chat_menu.className="hidden";
        //if (data["error"]=="not authenticated"){ error if not account_uuid is passed can happen and that messes with stuff, for now any error open the login
            //show_login()
            //add_chat_menu.className="hidden";
            //create_chat_menu.className="hidden";
        //}
    }
}

async function get_accociated_chats(){
    var account_uuid = localStorage.getItem("account_uuid");
    var token = localStorage.getItem("token");
    var res = await fetch(SERVER_IP+"/get_accociated_chats",{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
            account_uuid:account_uuid,
            token:token
        })
    })
    data = await res.json()
    //<li class="channle_item"><ul><li><img src="/assets/dpfp2.jpg"></li><li class="server_text"><a href="/chat/?u=91972446-6f6f-482a-8e59-2fabd379d770">General Chat</a></li></ul></li>
    if (data["success"]){
        data = data["data"]
        var sp1 = '<ul><li><img src="'
        var sp2 = '"></li><li class="server_text"><a href="/chat/?u='
        var sp3 = '">'
        var sp4 = '</a></li></ul>'
        for(var i=0;i<data.length;i++){
            if(data[i][10]==null){
                var pfp_link = "/assets/dpfp2.jpg"
            }
            var server_list_item = sp1+pfp_link+sp2+data[i][1]+"&n="+data[i][11]+sp3+data[i][11]+sp4;
            if(data[i][4]!="DM"){
                var temp_line = line2
                

            }else{
                var temp_line = line3;
            }
            var temp_element = document.createElement("li");
            temp_element.className = "channle_item";
            temp_element.innerHTML = server_list_item;
            temp_line.after(temp_element);

        }
        
    }
}

async function create_account(username,email,password){
    if(password.length<8){
        alert("password must be at least 8 characters long")
    }else{
        var keys = await create_new_keys(password)
        var hashBuffer = await crypto.subtle.digest("SHA-256",new TextEncoder().encode(password))
        var hashArray = Array.from(new Uint8Array(hashBuffer));
        var pass_hash = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('')

        var res = await fetch(SERVER_IP+"/create_account",{
            method:'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({
                username:username,
                password_hash:pass_hash,
                salt:keys[1][3],
                email:email,
                private_key:keys[1][4],
                iv: keys[1][5],
                public_key: keys[1][1]
            })
        })
        var data = await res.json()
        if (data["success"]){
            var account_data = data["data"]
            localStorage.setItem("account_uuid",account_data[0])
            localStorage.setItem("username",account_data[1])
            localStorage.setItem("token",account_data[16])
            localStorage.setItem("pfp_uuid",account_data[15])

            localStorage.setItem("public_key",keys[1][1])
            localStorage.setItem("private_key",keys[1][0])
            add_public_chat("General");
        }else{
            alert(data["error"])
        }
    }
}

get_accociated_chats()