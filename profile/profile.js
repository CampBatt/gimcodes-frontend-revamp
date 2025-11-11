var user_display = document.getElementById("profile_username");
var pfp_display = document.getElementById("profile_pfp");
var last_online = document.getElementById("last_online");
var join_date = document.getElementById("join_date");
var num_messages = document.getElementById("num_messages");
var num_images = document.getElementById("num_images");
var num_videos = document.getElementById("num_videos");
var profile_uuid = document.getElementById("profile_uuid");
var pm_button = document.getElementById("pm_button");
var current_name = null
var current_recipient = null;


async function set_profile_values(){
    var p_url = new URL(window.location.toLocaleString()).searchParams;
    var account_uuid = p_url.get("u");
    if (account_uuid==null){
        account_uuid=localStorage.getItem("account_uuid")
    }
    var request = await fetch(SERVER_IP+"/profile",{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
            account_uuid:account_uuid
        })
    })
    data = await request.json()
    if(data["success"]){
        p_data = data["row"]
        console.log(data["row"]);
        var date = new Date(p_data[2]*1000)
        join_date.innerText = "Join Date: " + date.toLocaleDateString();
        last_online.innerText = "Last Online: " + TimeCalc(p_data[3])
        profile_uuid.innerText = "UUID: "+ p_data[0]
        current_recipient = p_data[0]
        user_display.innerText = p_data[1]
        current_name = p_data[1]
        num_messages.innerText = "Messages Sent: " + p_data[5];
        num_images.innerText = "Images Sent: " + p_data[6];
        num_videos.innerText = "Videos Sent: " + p_data[7];
    }
}


async function start_private_message(){
    var response = await fetch(SERVER_IP+"/create_private_dm",{
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify({
            account_uuid:localStorage.getItem("account_uuid"),
			token:localStorage.getItem("token"),
			recipient_uuid:current_recipient
        })
    })
    data = await response.json()
    if(data["success"]){
        console.log("opening PM...")
        var chat_uuid = data["data"][0]
        location.href = "/chat/?u="+chat_uuid+"&n="+current_name+"&t=PRIVATE-DM&r="+current_recipient
    }else if(data["error"] == "DM already exists"){
        var all_chats = await get_accociated_chats(false);
        var all_chats = all_chats["data"]
        for(var i=0;i<all_chats.length;i++){
            if (all_chats[i][3] == current_recipient){
                var chat_uuid = all_chats[i][1];
                location.href = "/chat/?u="+chat_uuid+"&n="+current_name+"&t=PRIVATE-DM&r="+current_recipient;
            }
        }

    }
}

set_profile_values();
pm_button.addEventListener("click",start_private_message)
