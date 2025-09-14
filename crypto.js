
function bytesToBase64(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBytes(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

async function create_derived_key(password,salt){
    var encoder = new TextEncoder();
    var key_material = await window.crypto.subtle.importKey("raw",encoder.encode(password),{ name: "PBKDF2" },false,["deriveBits","deriveKey"]);
    var derived_key = await window.crypto.subtle.deriveKey({name:"PBKDF2",salt:salt,iterations:100_000,hash:"SHA-256"},key_material,{ name: "AES-GCM", length: 256 },true,["encrypt","decrypt"]);
    return derived_key
}


async function keyToBase64(key,format="raw") {
    var key_buff = await window.crypto.subtle.exportKey(format,key);
    var key_plain = new Uint8Array(key_buff)
    var key_b64 = bytesToBase64(key_plain)
    return key_b64
    
}

async function create_new_keys(password) {
    var salt = crypto.getRandomValues(new Uint8Array(32));
    var derived_key = await create_derived_key(password,salt)
    var RSA_key_pair = await window.crypto.subtle.generateKey({name:"RSA-OAEP",modulusLength:2048,publicExponent:new Uint8Array([1, 0, 1]),hash:"SHA-256"},true,["encrypt","decrypt"])

    var private_key_b64 = await keyToBase64(RSA_key_pair.privateKey,format="pkcs8");
    var public_key_b64 = await keyToBase64(RSA_key_pair.publicKey,format="spki");
    var derived_key_b64 = await keyToBase64(derived_key);

    var private_key = await crypto.subtle.exportKey("pkcs8",RSA_key_pair.privateKey);
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var encrypted_private_key = await crypto.subtle.encrypt({name:"AES-GCM",iv},derived_key,private_key);
    
    var salt_b64 = bytesToBase64(salt)
    var iv_b64 = bytesToBase64(iv)
    var encrypted_private_key_b64 = bytesToBase64(encrypted_private_key)
    var key_objs = [RSA_key_pair,derived_key];
    var key_strs = [private_key_b64,public_key_b64,derived_key_b64,salt_b64,encrypted_private_key_b64,iv_b64];
    return [key_objs,key_strs]
}

async function encrypt_message(message,Rpublic_key_b64,Spublic_key_b64){
    var encoder = new TextEncoder();
    var Rpublic_key = await window.crypto.subtle.importKey("spki",base64ToBytes(Rpublic_key_b64),{name:"RSA-OAEP",hash:"SHA-256"},true,["encrypt"]);
    var Spublic_key = await window.crypto.subtle.importKey("spki",base64ToBytes(Spublic_key_b64),{name:"RSA-OAEP",hash:"SHA-256"},true,["encrypt"]);
    var random_aes = await window.crypto.subtle.generateKey({name:"AES-GCM",length:256},true,["encrypt","decrypt"]);
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var cipher_text = await crypto.subtle.encrypt({name:"AES-GCM",iv},random_aes,encoder.encode(message));
    var raw_aes = await crypto.subtle.exportKey("raw",random_aes)
    var Rencrypted_key = await crypto.subtle.encrypt({name:"RSA-OAEP"},Rpublic_key,raw_aes)
    var Sencrypted_key = await crypto.subtle.encrypt({name:"RSA-OAEP"},Spublic_key,raw_aes)


    return [bytesToBase64(cipher_text),bytesToBase64(Rencrypted_key),bytesToBase64(Sencrypted_key),bytesToBase64(iv)];
}

async function decrypt_message(cipher_text_b64,encrypted_aes_b64,private_key_b64,iv_b64){
    var cipher_text = base64ToBytes(cipher_text_b64);
    var encrypted_aes = base64ToBytes(encrypted_aes_b64);
    var iv = base64ToBytes(iv_b64)
    var decoder = new TextDecoder();
    var private_key = await window.crypto.subtle.importKey("pkcs8",base64ToBytes(private_key_b64),{name:"RSA-OAEP",hash:"SHA-256"},true,["decrypt"]);
    var decrypted_aes = await window.crypto.subtle.decrypt({name:"RSA-OAEP"},private_key,encrypted_aes);
    var aes_key = await window.crypto.subtle.importKey("raw",decrypted_aes,{name:"AES-GCM"},false,["decrypt"]);
    var message = await window.crypto.subtle.decrypt({name:"AES-GCM",iv},aes_key,cipher_text);
    var message_plaintext = decoder.decode(message);
    return message_plaintext    
}


async function test1(password,message) {
    var starting_keys = await create_new_keys(password);
    console.log(starting_keys)
    var encrypted_data = await encrypt_message(message,starting_keys[1][1],starting_keys[1][1]);
    console.log(encrypted_data);
    var decrypted_message = await decrypt_message(encrypted_data[0],encrypted_data[1],starting_keys[1][0],encrypted_data[3]);
    console.log(decrypted_message);
}

async function test2(password,message) {
    var starting_keys = await create_new_keys(password);
    console.log(starting_keys[1][0].length)
    console.log(starting_keys[1][1].length)
    console.log(starting_keys[1][2].length)
    console.log(starting_keys[1][3].length)
    console.log(starting_keys[1][4].length)
    console.log(starting_keys[1][5].length)

    var encrypted_data = await encrypt_message(message,starting_keys[1][1],starting_keys[1][1]);
    var iv = base64ToBytes(starting_keys[1][5])

    var private_key = await crypto.subtle.decrypt({name:"AES-GCM",iv},starting_keys[0][1],base64ToBytes(starting_keys[1][4]))
    var decrypted_message = await decrypt_message(encrypted_data[0],encrypted_data[1],starting_keys[1][0],encrypted_data[3]);
    console.log(decrypted_message);
    
}






