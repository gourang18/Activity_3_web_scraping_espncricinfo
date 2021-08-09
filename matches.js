let request=require("request");
let cheerio=require("cheerio");
let fs=require("fs");
let scoreCardObj=require('./scorecard');

let url='https://www.espncricinfo.com/series/ipl-2020-21-1210595';

request(url,cb);
function cb(error,response,html){
    if(error){
        console.log("error");
    }
    else if(response.statusCode==404){
        console.log("Page Not Found");
    }
    else{
        //  console.log(html);
        // console.log("html");
        dataExtracter(html);

    }

}

function dataExtracter(html){
    let searchTool=cheerio.load(html);
    let anchorrep=searchTool('a[data-hover="View All Results"]');
    // console.log(anchorrep);
    let link=anchorrep.attr("href");
    // console.log(link);
    let fullAllMatchLink=`https://www.espncricinfo.com${link}`;
   // console.log(fullAllMatchLink);
    request(fullAllMatchLink,allMatchLink);

}
function allMatchLink(error,response,html){
    if(error){
        console.log(error);

    }
    else if(response.statusCode==404){
        // console.log("abcd");
        console.log("page not found");
    }
    else{
        getAllScoreCardLink(html);
    }
}
function getAllScoreCardLink(html){
    let searchTool=cheerio.load(html);
    let fullscore=searchTool('a[data-hover="Scorecard"]');
    console.log(fullscore.length);
    for(let i=0;i<fullscore.length;i++){
        let link=searchTool(fullscore[i]).attr("href");
        let AllScoreCard=`https://www.espncricinfo.com/${link}`;
       // console.log(AllScoreCard);
        scoreCardObj.processingUrl(AllScoreCard);
    }
}

    