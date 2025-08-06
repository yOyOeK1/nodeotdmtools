
import {otdmTools} from './otdmTools.js'
let l = new otdmTools(1,1);



l.sendQ('sum/4/1')

l.doTask('sum/1/3/.json').then((r)=>{
    let j = JSON.parse(String(r));
    console.log(j.msg);
});