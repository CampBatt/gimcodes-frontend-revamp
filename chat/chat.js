var chat_input = document.getElementById('chat_input');
var scrollchat = document.getElementById('ScrollChat');
var inner_bar = document.getElementById('inner_bar');
var Formater = document.getElementById("Formater");
var chat_name_display = document.getElementById("chat_name");
var FirstTime  = true
var modifiers = 'none'
var websocket_object = null;
var previous_message_state = null
var SERVER_IP = "https://api.gimcodes.com"
chat_input.addEventListener('focus',input_focus);
chat_input.addEventListener('keypress',input_send);
chat_input.addEventListener('blur',input_blur);


function input_blur(){
    if (this.value == ''){
        this.value = 'Send Message'
    }
}


function input_focus(){
    if (this.value == 'Send Message'){
        this.value = ''
    }
}

function input_send(event){
    if(event.which == 13){
        var chat_message = this.value
        this.value = 'Send Message'
        if (localStorage.getItem('username') == null){
            show_login()
        }
        this.blur();
        sendMessage(chat_message);
    }
    
}

async function sendMessage(message){
    var account_uuid = localStorage.getItem("account_uuid");
    var token = localStorage.getItem("token");
    var chat_url = new URL(window.location.toLocaleString()).searchParams;
    var chat_uuid = chat_url.get("u");
    var message_command = {"command":"send_message","account_uuid":account_uuid,"token":token,"chat_uuid":chat_uuid,"message_content":message,"message_type":"PUBLIC-CHAT"};
    websocket_object.send(JSON.stringify(message_command))
}

//////////////////////////









async function test_websockets(account_uuid,token,chat_uuid,message){
    var socket = new WebSocket(SERVER_IP+"/chat");
    var initial_update = {"command":"update_client_state","uuid":account_uuid,"current_chat":chat_uuid}
    var initial_update = {"command":"init_messages","account_uuid":account_uuid,"chat_uuid":chat_uuid,"token":token}
    var first_message= {"command":"send_message","account_uuid":account_uuid,"token":token,"chat_uuid":chat_uuid,"message_content":message,"message_type":"PUBLIC-CHAT"}
    
    socket.onopen = function(){
        socket.send(JSON.stringify(initial_update));
        socket.send(JSON.stringify(first_message))
    }
    socket.onmessage = async (message)=>{
        data = JSON.parse(message.data)
        if (data["command"]=="log"){
            console.log(data["message"])
        }
        if (data["command"]=="init_messages"){
            set_message_block(data["data"])
        }
    }
}

async function chat_websocket(){
    var account_uuid = localStorage.getItem("account_uuid");
    var token = localStorage.getItem("token");
    var chat_url = new URL(window.location.toLocaleString()).searchParams;
    var chat_uuid = chat_url.get("u");
    var chat_name = chat_url.get("n");
    if (chat_uuid ==null){
        chat_uuid = "91972446-6f6f-482a-8e59-2fabd379d770"
        chat_name = "General"
        location.href = "?u=" + chat_uuid + "&n=" + chat_name
    }
    chat_name_display.innerText = chat_name;
    var socket = new WebSocket(SERVER_IP+"/chat");
    var initial_update1 = {"command":"update_client_state","uuid":account_uuid,"current_chat":chat_uuid,"token":token}
    var initial_update2 = {"command":"init_messages","account_uuid":account_uuid,"chat_uuid":chat_uuid,"token":token}  
    socket.onopen = function(){
        socket.send(JSON.stringify(initial_update1));
        socket.send(JSON.stringify(initial_update2));
        websocket_object = socket;
    }
    socket.onmessage = async (message)=>{
        data = JSON.parse(message.data)
        if (data["command"]=="log"){
            console.log(data["message"])
            if(data["message"]=="not authenticated"){
                show_login();
            }
        }
        if (data["command"]=="init_messages"){
            set_message_block(data["data"])
        }
        if (data["command"]=="add_messages"){
            set_message_block(data["messages"])
        }
    }
}

//////////////////////////

function set_message_block(messages){
    var temp_pfp = "/assets/dpfp1.jpg"

    //<li id="60e76b79-80c0-43ab-920a-8f738dfabb1c">
    //  <ul>
    //      <img src="/assets/dpfp1.jpg" class="imgpfp">
    //      <ul>
    //          <li>
    //              <ul>
    //                  <li>
    //                      <strong>Aiden</strong>
    //                  </li>
    //                  <li class="time">3 days ago</li>
    //                  <li class="hidden_time">1757017209.977497</li>
    //              </ul>
    //          </li>
    //          <li class="messagething">Testing sending messages in other chats</li>
    //      </ul>
    //  </ul>
    // </li>
    var should_scroll = scrollchat.scrollHeight - scrollchat.clientHeight <= scrollchat.scrollTop + 1 || scrollchat.scrollHeight - scrollchat.clientHeight <= scrollchat.scrollTop - 1 
    var oldscrollHeight = scrollchat.scrollHeight
    var oldclientHeight = scrollchat.clientHeight
    var oldscrollTop = scrollchat.scrollTop
    for (var i=0;i<messages.length;i++){
        var time_string = TimeCalc(messages[i][9])
        var uuid = messages[i][0]
        var username = messages[i][11]
        var message_text = messages[i][3]
        ////
        var main_li = document.createElement("li");
        main_li.id = uuid;

        var main_ul = document.createElement("ul");
        var pfp_img = document.createElement("img");
        pfp_img.src=temp_pfp
        pfp_img.className = "imgpfp";

        var main_text_ul = document.createElement("ul");
        var message_info_li = document.createElement("li");
        var message_info_ul = document.createElement("ul");
        var name_li = document.createElement("li");
        var strong_name = document.createElement("strong");
        strong_name.innerText = username;

        var time_li = document.createElement("li")
        time_li.className = "time";
        time_li.innerText = time_string;

        var hidden_time_li = document.createElement("li");
        hidden_time_li.className="hidden_time";
        hidden_time_li.innerText = messages[i][9];

        var message_li = document.createElement("li");
        message_li.className="messagething";
        message_li.innerText = message_text;

        main_li.appendChild(main_ul);
        main_ul.appendChild(pfp_img);
        main_ul.appendChild(main_text_ul);
        main_text_ul.appendChild(message_info_li);
        message_info_li.appendChild(message_info_ul);
        message_info_ul.appendChild(name_li);
        name_li.appendChild(strong_name);
        message_info_ul.appendChild(time_li);
        message_info_ul.appendChild(hidden_time_li);
        main_text_ul.appendChild(message_li);


        scrollchat.appendChild(main_li);

    }
    if(should_scroll){
        
        scrollchat.scrollTop = scrollchat.scrollHeight - scrollchat.clientHeight;
        requestAnimationFrame(() => {
    scrollchat.scrollTop = scrollchat.scrollHeight - scrollchat.clientHeight;
  });
        setTimeout(()=>{scrollchat.scrollTop = scrollchat.scrollHeight- scrollchat.clientHeight}, 100);
    }
}

//<li id="first_message"><ul><img src=" PFP LINK
//"></img><ul><li><ul><li><strong> NAME
//</strong></li><li class="time"> TIME
//</li></ul></li><li class="messagething"> CONTENT
//</li></ul></ul></li>

function updateTimes(){
    times = document.getElementsByClassName("time");
    hidden_times = document.getElementsByClassName("hidden_time");
    for(var i=0;i<times.length;i++){
        times[i].innerText = TimeCalc(hidden_times[i].innerText);
    }
}

function TimeCalc(input_time){
    var current_time = Math.round(Date.now()/1000);
    input_time = Math.round(input_time)
    var time_ago = current_time - input_time
    input_time = parseInt(input_time);
    if (time_ago <60){
        return time_ago.toString() + ' seconds ago'
    };


    if (time_ago >= 60 && time_ago < 3600){
        var units = Math.round(time_ago/60)
        if (units == 1){
            return '1 minute ago'
        };
        return units.toString() + ' minutes ago'
    };


    if (time_ago >= 3600 && time_ago < 86400){
        var units = Math.round(time_ago/3600)
        if (units == 1){
            return '1 hour ago'
        };
        return units.toString() + ' hours ago'
    };


    if (time_ago >= 86400){
        var units = Math.round(time_ago/86400)
        if (units == 1){
            return '1 day ago'
        };
        return units.toString() + ' days ago'
    };


};



chat_websocket();
setInterval(updateTimes,1)