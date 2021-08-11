function readConnection_from_file() {       
    const fs = require('fs');
    const path = require('path');
    let rawdata = fs.readFileSync(path.resolve(__dirname, 'dataConnect.json'));
    let data = JSON.parse(rawdata);
    //console.log(data);
    console.log("exec started::dataConnect");
    document.getElementById('server1').innerHTML +=data[server1];

    }