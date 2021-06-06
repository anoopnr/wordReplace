const start = Date.now();
const fs=require('fs');
var dictionary=fs.readFileSync(__dirname+'/data/french_dictionary.csv','utf8');
var mainDoc=fs.readFileSync(__dirname+'/data/t8.shakespeare.txt','utf8');
var frenchWords=[];
var fequenceyData="";
var regex;
getFrechWords();
findwords();
formatResults();

function getFrechWords(){
    try{
        var dictionaryObjects=dictionary.split("\n");
        var splitedData;
        var upperCaseEng;
        var upperCaseFrech;
        var englishWord;
        var frenchWord;
        dictionaryObjects.forEach((f)=>{//since the 1000 words in find_word exists in csv not matching with find_words
            if(f!=""){
                
                splitedData=f.split(',');
                englishWord=splitedData[0];
                frenchWord=splitedData[1];
                upperCaseEng=englishWord.substring(0,1).toUpperCase()+englishWord.substring(1);
                upperCaseFrech=frenchWord.substring(0,1).toUpperCase()+frenchWord.substring(1);
                frenchWords.push({
                    word:englishWord,
                    french:frenchWord,
                    wordU:upperCaseEng,
                    frechU:upperCaseFrech
                });
                
            splitedData=null;
            englishWord=null;
            frenchWord=null;
            upperCaseEng=null;
            upperCaseFrech=null;
            }
        });
    }
    catch(ex){
        console.log("Error in getFrechWords "+ex);
    }
}

function findwords(){
    try{
        var count=0;
        var typeArray=[" ",",",";","\n","!"];//.? need to use more regex
        frenchWords.forEach((f)=>{
            count=0;
            
            typeArray.forEach((t)=>{
                var str=" "+f.word+t;
                var strF=" "+f.french+t;
                var sCount=mainDoc.split(str).length-1;
                count=count+sCount;
                changeWord(str,strF);
            });
            typeArray.forEach((t)=>{
                var str=" "+f.wordU+t;
                var strF=" "+f.frechU+t;
                var uCount=mainDoc.split(str).length-1;
                count=count+uCount;
                changeWord(str,strF);
            });
            typeArray.forEach((t)=>{
                var str=f.word+t;
                var strF=f.french+t;
                var sCount=mainDoc.split(str).length-1;
                count=count+sCount;
                changeWord(str,strF);
            });
            typeArray.forEach((t)=>{
                var str=f.wordU+t;
                var strF=f.frechU+t;
                var uCount=mainDoc.split(str).length-1;
                count=count+uCount;
                changeWord(str,strF);
            });

            fequenceyData+=f.word+","+f.french+","+count+"\n";
        });
    }
    catch(ex){
        console.log("Error in findwords "+ex);
    }
}


function changeWord(str,frech){
    try{
        regex=  new RegExp(str,'g');
        mainDoc= mainDoc.replace(regex,frech);
    }
    catch(ex){
        console.log(ex);
    }
}

function formatResults(){
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    var s=Date.now() - start;
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var ttp="Time to Process "+mins+" minutes "+secs+" seconds";
    var memory="Memory used "+Math.round(used * 100) / 100+" MB";
    var content=ttp+"\n"+memory;


    fs.writeFileSync(__dirname+'/output/performance.txt',content);
    fs.writeFileSync(__dirname+'/output/frequency.csv',fequenceyData);
    fs.writeFileSync(__dirname+'/output/t8.shakespeare.translated.txt',mainDoc);
}