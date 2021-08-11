const {app,BrowserWindow,Menu}=require('electron');
const path=require('path');
const url=require('url');



let win=null;

function createWindow(){  
  
    win=new BrowserWindow({width:800,height:600,icon:__dirname+'/img/image1.jpeg',
    webPreferences: {nodeIntegration:true,contextIsolation:false}
});


    win.loadURL(url.format({
        pathname:path.join(__dirname,'index.html'),
        protocol:'file:',
        slashes:true
    }));


   
 win.webContents.openDevTools();


    win.on('closed',()=>{
        win=null;
    });
}

app.on('ready',createWindow);


app.on('window-all-closed',()=>{
    if(process.platform!=='darwin'){
        app.quit();
    }
});