var chat_input = document.getElementById('chat_input');
var scrollchat = document.getElementById('ScrollChat');
var inner_bar = document.getElementById('inner_bar');
var Formater = document.getElementById("Formater");
var chat_name_display = document.getElementById("chat_name");
var image_button = document.getElementById("imagebutton");
var youtube_button = document.getElementById("youtubebutton");
var FirstTime  = true
var modifiers = 'none'
var websocket_object = null;
var previous_message_state = null
var image_activated = false;
var youtube_activated= false;
var recipient_public_key = null;
var chat_type
//var SERVER_IP = "https://api.gimcodes.com"
chat_input.addEventListener('focus',input_focus);
chat_input.addEventListener('keypress',input_send);
chat_input.addEventListener('blur',input_blur);


image_button.addEventListener("click",function(){
    var color
    if (image_activated){
        color = "";
    }else{
        color = "#729dff"
    }
    image_button.style.backgroundColor = color;
    image_activated =  !image_activated;
    youtube_activated = false;
    youtube_button.style.backgroundColor = "";
});

youtube_button.addEventListener("click",function(){
    var color
    if (youtube_activated){
        color = "";
    }else{
        color = "#729dff"
    }
    youtube_button.style.backgroundColor = color;
    youtube_activated =  !youtube_activated;
    image_activated = false;
    image_button.style.backgroundColor = "";
});

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

function command_parser(message){
    var local_commands = ["/image","/video"]
    var server_commands = ["/delete",]

    if (message[0] != "/"){
        return [message,"TEXT"];
    }
    command = message.split(" ")
    var command_name = command[0]
    console.log(command_name)
    if(local_commands.includes(command_name)){
        if(command_name=="/image"){
            var src = command[1]
            if(command[1].slice(0,4) == "<img"){
                var parser = new DOMParser();
                var doc = parser.parseFromString(command[1], 'text/html');
                var img = doc.querySelector('img');
                src = img.getAttribute('src');
            }
            return [src,"URL-IMAGE"]
        }
        if(command_name=="/video"){
            var video_id = command[1]
            if(command[1].includes("youtube.com/watch")){
                var url_attempt = new URL(command[1]).searchParams;
                video_id = url_attempt.get("v");
            }
            
            return [video_id,"URL-VIDEO"]
        }
    }
    return [message,"TEXT"]
    

}

async function sendMessage(message){
    var account_uuid = localStorage.getItem("account_uuid");
    var token = localStorage.getItem("token");
    var chat_url = new URL(window.location.toLocaleString()).searchParams;
    var chat_uuid = chat_url.get("u");
    var media_type;
    if(image_activated){
        media_type="URL-IMAGE";
        if(message.slice(0,4) == "<img"){
                var parser = new DOMParser();
                var doc = parser.parseFromString(message, 'text/html');
                var img = doc.querySelector('img');
                message = img.getAttribute('src');
            }
    }
    else if(youtube_activated){
        media_type="URL-VIDEO"
        if(message.includes("youtube.com/watch")){
            var url_attempt = new URL(message).searchParams;
            var video_id = url_attempt.get("v");
            message = video_id
        }
    }else{

        data = command_parser(message);
        message = data[0];
        media_type = data[1];
    }

    if(chat_type=="PRIVATE-DM"){
        var data = await encrypt_message(message,recipient_public_key,localStorage.getItem("public_key"));
        message= data[0]
        recipient_key = data[1]
        sender_key = data[2]
        iv = data[3]
        message_type = "PRIVATE-DM"
    }else{
        recipient_key = null
        sender_key = null
        iv =null
        message_type = "PUBLIC-CHAT"
    }

    var message_command = {"command":"send_message","account_uuid":account_uuid,"token":token,"chat_uuid":chat_uuid,"message_content":message,"message_type":message_type,"media_type":media_type,"iv":iv,"recipient_key":recipient_key,"sender_key":sender_key};
    console.log(message_command);
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
    chat_type = chat_url.get("t");
    var recipient = chat_url.get("r");
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
        if(chat_type=="PRIVATE-DM"){
            socket.send(JSON.stringify({"command":"get_public_key","account_uuid":recipient}))
        }
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
        if (data["command"]=="get_public_key"){
            recipient_public_key = data["key"]
        }
    }
}

//////////////////////////

async function set_message_block(messages){
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
        var media_type = messages[i][4];
        var enc_aes
        if(messages[i][5]=="PRIVATE-DM"){
            if(messages[i][1]==localStorage.getItem("account_uuid")){
                enc_aes = messages[i][8]
            }else{
                enc_aes = messages[i][7]
            }
            message_text = await decrypt_message(message_text,enc_aes,localStorage.getItem("private_key"),messages[i][6]);
        }

        ////
        var main_li = document.createElement("li");
        main_li.id = uuid;

        var main_ul = document.createElement("ul");
        var pfp_img = document.createElement("img");
        pfp_img.src=temp_pfp
        pfp_img.className = "imgpfp";
        let temp = "/profile/?u="+messages[i][1]
        pfp_img.addEventListener("click",function(){location.href=temp})

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
        if (media_type=="URL-IMAGE"){
            var message_image = document.createElement("img");
            message_image.src = message_text;
            message_image.onerror = function(){this.src="/assets/brokenicon.png"}
            message_li.appendChild(message_image);
        }else if(media_type=="URL-VIDEO"){
            var message_video = document.createElement("iframe");
            message_video.src = "https://www.youtube.com/embed/" + message_text;
            message_li.appendChild(message_video)
        }else{
            message_li.innerText = message_text;
        }
        

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





chat_websocket();
setInterval(updateTimes,1)