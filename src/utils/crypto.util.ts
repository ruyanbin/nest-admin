import CryptoJS from "crypto-js";
import * as crypto from "node:crypto";

const key = CryptoJS.enc.Utf8.parse('ruyanbn12345678')
const iv =CryptoJS.enc.Utf8.parse('12345678ruyanbin')

//加密
export function aesEncrypt(data) {
    if(!data) return data
    const enc = CryptoJS.AES.encrypt(data,key,{
        iv,mode:CryptoJS.mode.CBC,
        padding:CryptoJS.pad.Pkcs7
    })
return enc.toString()
}
// 解密
export function aesDecrypt(data){
    if(!data) return data
    const dec = CryptoJS.AES.decrypt(data,key,{
        iv,mode:CryptoJS.mode.CBC,
        padding:CryptoJS.pad.Pkcs7
    })
    return dec.toString(CryptoJS.enc.Utf8)
}