
const fs = require('fs');
const os = require('os');
const lpath = require('path');


function cl(str){
    console.log('fsHe',str);
}

function getTempFilePath( ext = 'tmp' ){
    let rand = String(Math.random()).substring(2)+Date.now();
    return lpath.join( os.tmpdir() , `tmp${rand}.${ext}` );
}

function dirList( path ){
    let tr = [];
    try{
        files = fs.readdirSync( path );
        return files;
    }catch(e){
        cl(`[e] No target directory [${path}]`);
        return undefined;
    }
}


function fileReadToStr( path ){
    let t = fileRead( path );
    if( t == undefined ) return undefined;
    return t.slice(0,t.length);
}

function fileRead( path ){
    try{
        fc = fs.readFileSync(path);
        return fc.slice(0,fc.length);
    }catch(e){
        cl("[e] Reading file error no file: "+e);
    }
    return undefined;
}

function fileToJson( path ){
    try{
        tr = JSON.parse( fs.readFileSync( path ).toString() );
        //cl(`so for ${path}`);cl(tr);
        return tr;
    }catch(e){

    }
    return undefined;
}

module.exports = { dirList, fileToJson,fileRead,fileReadToStr, getTempFilePath };