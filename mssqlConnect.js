var result;
var sql = require('mssql');
const { Script } = require('vm');

function zDataCon(){
var fs=require('fs');
var dataCon=fs.readFileSync('./dataConnect.json','utf-8');
var realdata=JSON.parse(dataCon);
return realdata;
console.log("Here is it "+realdata);
}

//SQL database configuration
var g=zDataCon();
var config = {
    user: g.username,
    password: g.password,
    server:g.server, //LAPTOP1-PC  You can use 'localhost\\instance' to connect to named instance
    database: g.database,
    options: {
        instanceName: g.instance,
        encrypt: false,
        multipleStatements:true
    }
};


//get the rest menu from database and write it into 'restmenu.json'
function menu_list() {
    const sql = require('mssql');
    sql.connect(config, function (err) {
        if (err) {
            console.log('Conection Error happened' + err);
        } else {

            console.log("connection successfull:restmenu");
            var request = new sql.Request();
            request.query("select menuname,menuid from restmenumaster", function (err, result) {
               var tempMenu=result.recordset;
               const fs=require('fs');
               const menudata=(data,path)=>{
                   try {
                       fs.writeFileSync("./restmenu.json",JSON.stringify(data));   
                       console.log("Exactly what i am looking for;") 
                   } catch (error) {
                       console.log(error);    
                   }
               }
               menudata(tempMenu);
            })
        }
    })   
}

//read menu data from 'restmenu.json'
function readmenu(){
    const fs=require('fs');
    const read_menu_from_json=fs.readFileSync('./restmenu.json','utf-8');
    var final_read_menu_from_json=JSON.parse(read_menu_from_json);
    console.log(final_read_menu_from_json);
    var restmenu = final_read_menu_from_json;
    for (var i = 0; i < restmenu.length; i++) {
      var menu_options = $('<option value="'+restmenu[i].menuid+'"></option>').text(restmenu[i]['menuname']);
      $('select').append(menu_options);
    }
}

//Location List
function menu_list() {
    const sql = require('mssql');
    sql.connect(config, function (err) {
        if (err) {
            console.log('Conection Error happened' + err);
        } else {

            console.log("connection successfull:restmenu");
            var request = new sql.Request();
            request.query("select locationname,locationcode from locationmaster", function (err, result) {
               var temp_loc=result.recordset;
               const fs=require('fs');
               const locationdata1=(data,path)=>{
                   try {
                       fs.writeFileSync("./locationdata.json",JSON.stringify(data));  
                   } catch (error) {
                       console.log(error);    
                   }
               }
               locationdata1(temp_loc);
            })
        }
    })   
}

//read menu data from 'locationdata.json'
function asasas(){
    const fs=require('fs');
    const read_loc_from_json=fs.readFileSync('./locationdata.json','utf-8');
    var final_loc_data=JSON.parse(read_loc_from_json);
    console.log(final_read_menu_from_json);
    var loc2 = final_loc_data;
    for (var i = 0; i < loc2.length; i++) {
      var menu_options = $('<option value="'+restmenu[i].menuid+'"></option>').text(restmenu[i]['menuname']);
      $('select').append(menu_options);
    }
}




//OPTION GROUPS

function myOptionGroups(ID) {

    sql.connect(config, function (err) {
        if (err) {
            console.log('Conection Error- opt_grp: ' + err);
        } else {
            var request = new sql.Request();
            let zMenuID=document.getElementById("menuselected").value;
            request.query("IF OBJECT_ID('tempdb..#tempF') IS NOT NULL DROP TABLE #tempF;select rc.productid,rc.ForcedQuestionID into #tempF from RestMenuChild rc where MenuID='"+zMenuID+"' and rc.ForcedQuestionID<>'';IF OBJECT_ID('tempdb..#tempQ') IS NOT NULL DROP TABLE #tempQ;select F.productid,F.FQ, nfqm.ForcedQuestionName,nfqm.NoOfChoice into #tempQ from (SELECT A.productid, Split.A.value('.', 'VARCHAR(150)') AS FQ FROM (SELECT [productid], CAST ('<M>' + REPLACE([ForcedQuestionID], ',', '</M><M>') + '</M>' AS XML) AS String FROM  #tempF) AS A CROSS APPLY String.nodes ('/M') AS Split(A)) AS F inner join forcedquestionmaster nfqm on F.FQ=nfqm.ForcedQuestionID;select t2.FQ as ref_id,t2.ForcedQuestionName as title,t2.NoOfChoice as max_selectable, item_ref_ids=STUFF((SELECT ','+ t1.productid from #tempQ t1 WHERE t1.FQ=t2.FQ FOR XML PATH ('')),1,1,'') FROM #tempQ t2 GROUP BY t2.FQ,t2.ForcedQuestionName,t2.NoOfChoice;IF OBJECT_ID('tempdb..#tempQ') IS NOT NULL DROP TABLE #tempQ;IF OBJECT_ID('tempdb..#tempF') IS NOT NULL DROP TABLE #tempF;", function (err, result) {
                if (err) {
                    console.log('Error retiving opt_group' + err);
                }
                else {

                    var optiongroups_r1 = JSON.stringify(result.recordset);
                    var optiongroups_r2 = JSON.parse(optiongroups_r1);
                    optiongroups_r2.map(function (x) {
                        x.min_selectable =1;
                        x.clear_item_ref_ids= false;
                        x.display_inline= false;
                        x.active=true;
                    })
                    var countKey = Object.keys(optiongroups_r2).length;
                    var data1=optiongroups_r2;
                    const fs = require('fs');
                    const forcedQuestions = (data, path) => {
                        try {
                            fs.writeFileSync("./optiongroups.json", JSON.stringify(data))
                        } catch (err) {
                            console.error(err)
                        }
                    }
                    forcedQuestions(data1);

                }

            });

        }
    })
}
module.exports = { myOptionGroups };


//options:
function myOptions(ID) {

    sql.connect(config, function (err) {
        if (err) {
            console.log('Conection Error, options: ' + err);
        } else {
            var request = new sql.Request();
            let zMenuID=document.getElementById("menuselected").value;
            request.query("select DISTINCT pm.ProductName as title ,fqc.ProductID as ref_id,fqc.Rate as price,fqc.ForcedQuestionID as opt_grp_ref_ids from ForcedQuestionChild fqc inner join ForcedQuestionMaster fqm on fqc.ForcedQuestionID=fqm.ForcedQuestionID inner join productmaster pm on fqc.productid=pm.ProductID inner join RestMenuChild restMC on  ',' + restMC.ForcedQuestionID + ',' like '%,' + cast(fqc.ForcedQuestionID as nvarchar(20)) + ',%' WHERE MenuID='"+zMenuID+"'", function (err, result) {
                if (err) {
                    console.log('Error -retriving options: ' + err);
                }
                else {
                    var options_r1 = JSON.stringify(result.recordset);
                    var options_r2 = JSON.parse(options_r1);
                    options_r2.map(function (x) {
                        x.sold_at_store=true;
                        x.available=true;
                    })
                    var countKey = Object.keys(options_r2).length;
                    var data1=options_r2;
                    const fs = require('fs');
                    const forcedQuestions = (data, path) => {
                        try {
                            fs.writeFileSync("./options.json", JSON.stringify(data))
                        } catch (err) {
                            console.error(err)
                        }
                    }
                    forcedQuestions(data1);

                }

            });

        }
    })
}
module.exports = { myOptions };