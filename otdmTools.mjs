import { PythonShell } from 'python-shell';
import os from 'os';
import fsH  from "./fsHelp.js";
import readline from 'readline';


if( 0 ){
    //cl("argv:");cl(process.argv);
    let av = process.argv;
    if( av.length > 2 ){
        let nav = av.slice(2, av.length);
        cl("Running with args from cli ....");
        //cl("more args in start found");
        //cl("nav: ");cl(nav);
        runArgs( nav, function(data){ cl("Got Results: ----");cl(String(data)); } );
    }

}


class otdmTools{
    constructor(wss, ws){
        this.wss = wss;
        this.ws = ws;
        this.tasks = {};
        this.cNo = 0;

        let opts = {
            scriptPath: '/data/data/com.termux/files/usr/bin',
            args: ['-promptMe', '1'],
            parser: this.onMessage,
            //stdout:'text'
        };
        this.ott = new PythonShell('otdmTools.py', opts);
        this.sendQ('ver');
        this.ott.on('message', this.onMessage );
        /*this.ott.end((err,code,signal) => {
            //if (err) throw err;
            this.cl('The exit code was: ' + code);
            this.cl('The exit signal was: ' + signal);
            this.cl('finished');
        });*/
    }

    cl( m ){
        console.log('ott ',m);
    }

    onMessage=( msg )=>{

        this.cl(`onMes:     ${msg}`);
        let res = '';
        let msgS = String(msg);
        let msgNo = parseInt( msgS.substring(8, msgS.indexOf(' ')) );
        //this.cl(`msgNo: ${msgNo}`);
        if( msgS.startsWith('##result') == true && 
            msgS.endsWith('##endResult') == true    
        ){
            res = msgS.substring( 
                msgS.indexOf(' ')+1,
                msgS.lastIndexOf(' ')
            );


            if( Object.keys(this.tasks).length > 0 && this.tasks[msgNo] != undefined ){
                //this.cl(`\nDebug: -----\n\nq:${this.tasks[msgNo]['q']}-\n---------\n[${res}]\n-----------`);
                this.tasks[msgNo]['res'](res);
                clearTimeout(this.tasks[msgNo]['to']);
                delete this.tasks[msgNo];
            }else{
                this.cl(`\nResult: not solvd ----------\n[${res}]\n-----------`);
            }

        }else{
            //this.cl(`NaN msg    ${msgS}`);
        }

    }

    sendQ( q ){
        this.cNo ++;
        this.cl(`send       ${q}`);
        this.ott.send( `${q}` );
    }

    doTask(q){
        let tN = Date.now();
        let tr = { 'tN': tN,'q': q, 'cNo': this.cNo };
        let taskI = `${this.cNo}`;
        this.tasks[taskI] = tr;

        tr['p'] = new Promise( (res,rej)=>{
            tr['res'] = res;
            tr['rej'] = rej;
            //this.cl(`send doTask      ${q}`);
            //this.cl(q);
            this.sendQ(q);
        });
        
        let tIdTO = `${taskI}`;
        tr['to'] = setTimeout(()=>{
            console.error(`task time out ....id: ${tIdTO}`,
                this.tasks[tIdTO]['q']
            );
            
            //this.tasks[ tIdTO ]['rej']('time out');
            delete this.tasks[ tIdTO ];
            
        },5000);
        
        return tr['p'];
    }

}

export {otdmTools};

if( 0 ){

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let o = new otdmTools(1,1);

    rl.question('What is your name? ', (answer) => {
        console.log(`Hello, ${answer}!`);
        rl.close(); // Close the interface after getting the input
    });

    setTimeout(()=>{
        console.log('will now send prompt for sum.....');
        o.sendQ('sum/1/4');
    },1000);
    setTimeout(()=>{
        console.log('will now send prompt for sum.....');



        o.sendQ('sum/7/4');
        o.sendQ('otdmTools/-dfs . -act GET');
    },1000);

    o.doTask('sum/10/5').then((res)=>{
        console.log('Sum res from doTask is: '+res);
    });

}


function runArgs( args, cbOnDone ){
    let tdir = fsH.getTempFilePath();

    //cl(`test dir [${tdir}]`);
    let opts = {
        mode: 'text',
        scriptPath: '/data/data/com.termux/files/usr/bin',
        args: [ '-oFile', tdir ].concat( args )
    };
    PythonShell.run('otdmTools.py', opts).then( msg=>{
        console.log('python done\n\n',msg);
        cbOnDone( fsH.fileRead(tdir) );

    });

}
if( 0 ){
    PythonShell.run('my_script.py',null).then(msg=>{
        console.log('python done',msg);
    });

}

function cl(str){
    console.log(str);
}

if( 0 ){
    runArgs( ['-v', '1'], (m)=>{cl(`runArgs result ${m}`);} );
}




