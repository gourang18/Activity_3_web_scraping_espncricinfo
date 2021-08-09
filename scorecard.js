let request=require("request");
let cheerio=require("cheerio");
let path=require("path");
let fs=require("fs");
const { Console } = require("console");
function processingUrl(url){
    request(url,cb);
}

//let url='https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard';
//request(url,cb);
function cb(error,response,html){
    if(error){
        console.log("error");
    }
        else if(response.statusCode==404){
            console.log("Page Not Found");
        }
        else{
            
            dataExtracter(html);
    
        }
    
}

function dataExtracter(html){
    let searchTool=cheerio.load(html);
    let bothInningArr=searchTool(".Collapsible");
    
    let scorecard="";
    for(let i=0;i<bothInningArr.length;i++){
        //scorecard=searchTool(bothInningArr[i]).find("h5");
       let teamNameElem=searchTool(bothInningArr[i]).find("h5");
       let teamName=teamNameElem.text();
       //console.log(teamName);
       teamName=teamName.split("INNINGS")[0];
    //    console.log(teamName);
       teamName.trim();
       
       let teamPath=path.join("C:\\Users\\GOURANG\\Desktop\\PP_12_21\\module2\\basic html\\poc\\activity",teamName);
       if(!fs.existsSync(teamPath)){
       fs.mkdirSync(teamPath);
       }
       console.log(teamName);
       let batsmanAllBodyRows=searchTool(bothInningArr[i]).find(".table.batsman tbody tr");
       console.log(batsmanAllBodyRows.length);
       
       for(let j=0;j<batsmanAllBodyRows.length;j++){
           let allTds=searchTool(batsmanAllBodyRows[j]).find("td");
           if(allTds.length==8){
               let playerName=searchTool(allTds[0]).text();
               let runs=searchTool(allTds[2]).text().trim();
               let balls=searchTool(allTds[3]).text().trim();
               let fours=searchTool(allTds[5]).text().trim();
               let sixes=searchTool(allTds[6]).text().trim();
               let sr=searchTool(allTds[7]).text().trim();

               //let arr=[playerName,runs,balls,fours,sixes,sr];
               let obj={
                   "PlayerName":playerName,
                   "Runs":runs,
                   "balls":balls,
                   "fours":fours,
                   "sixes":sixes,
                   "Strike Rate":sr
               }
               let arr=[obj];
               let mod=JSON.stringify(arr);
               let playerPath=path.join(teamPath,playerName+".json");
               if(!fs.existsSync(playerPath)){
                   
                   fs.writeFileSync(playerPath,mod);
               }
               else{
                   let content=fs.readFileSync(playerPath);
                   let jsonData=JSON.parse(content);
                   jsonData.push({
                    "PlayerName":playerName,
                    "Runs":runs,
                    "balls":balls,
                    "fours":fours,
                    "sixes":sixes,
                    "Strike Rate":sr
                });
                   let jsonWrite=JSON.stringify(jsonData);
                   fs.writeFileSync(playerPath,jsonWrite);
               }

               console.log(playerName);
               console.table(obj);


           }
       }
       console.log("``````````````````````````````````````````````````````````");
    }

    //fs.writeFileSync("match.html",scorecard);


}
module.exports={
    processingUrl
}
