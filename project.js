//---------------------------------- VARIABLES --------------------------------------------

var currentProject=localStorage.getItem("currentProject");
var currentFiles=[];
var fileNames=[];
var currentFile="";
var currentContents="";
var counter=0;

//---------------------------------- UTILITY FUNCTIONS -----------------------------------------

function uploadStr(i){ //Returns string used to access file just uploaded in database.
    return currentProject+"$"+fileNames[i];
}

function getUpload(i){ //Returns contents of file just uploaded.
    return localStorage.getItem(uploadStr(i));
}

function setUpload(value,i){ //Sets contents of file just uploaded.
    localStorage.setItem(uploadStr(i),value);
}

function updateUpload(value,i){ //Updates the file just uploaded to the new version.
    var result=getUpload(i).split("α");
    var oldVersion=parseFloat(result[result.length-2]);
    var newVersion=Math.round((oldVersion+0.1)*10)/10;
    setUpload(getUpload(i)+"α"+newVersion+"α"+value,i)
}

function getFileName(name){ //Returns name of file given its raw database string.
    return name.split("$")[1];
}

function getFileContents(name){ //Returns contents of file given its raw database string.
    return localStorage.getItem(name).split("α")
}

function getFileVersion(name){ //Returns latest version of file given its raw database string.
    return parseFloat(getFileContents(name)[getFileContents(name).length-2]);
}

function clear(className){ //Clears all HTML objects from screen with a given class name.
    var old=document.getElementsByClassName(className);
    var l=old.length;
    for(var i=0;i<l;i++){
        old[0].remove();
    }
}

function create(type,className){ //Creates a new HTML object with a given type and a given class name.
    var object=document.createElement(type);
    object.classList.add(className);
    return object;
}

//------------------------------------ ACTUAL FUNCTIONS ------------------------------------------

function upload(e){ //Called when user uploads files.
    fileNames=[];
    counter=0;
    var files=e.target.files;
    iterUpload(files,0);
    document.getElementById("upload").value="";
}

function iterUpload(files,i){ //Iteratively uploads each file one by one, with a 500ms delay between.
    var clone={...files}
    var file=files[i];
    fileNames.push(file.name);
    var reader=new FileReader();
    reader.readAsText(file);
    reader.onload=onUpload;
    setTimeout(() => {
        iter(clone,i+1);
      }, "500");
}

function onUpload(e){ //Called when upload is finished.
    var fileContents=e.target.result;
    if(getUpload(counter)==null){
        setUpload("1.0α"+fileContents,counter);
    }else{
        updateUpload(fileContents,counter);
    }
    counter++;
    render(true);
}

function render(updating){ //Renders the list of files in the current project.
    if(updating){
        var date=new Date();
        var currentDate=(date.getMonth()+1)+"/"+date.getDate();
        localStorage.setItem(currentProject+"@update",currentDate);
    }
    currentFiles=[];
    var files=Object.getOwnPropertyNames({...localStorage});
    for(var i=0;i<files.length;i++){
        if(files[i].split("$")[0]==currentProject){
            currentFiles.push(files[i]);
        }
    }
    localStorage.setItem(currentProject+"@numfiles",currentFiles.length);
    renderDetails();
    currentFiles.sort(alphabetical);
    clear("file");
    for(var i=0;i<currentFiles.length;i++){   
        var file=create("button","file")
        file.style.top=(7+10*i)+"%";
        file.setAttribute("onclick","openViewContainer('"+getFileName(currentFiles[i])+"')");
        var name=create("div","fileName");
        name.innerHTML=getFileName(currentFiles[i]);
        var version=create("div","fileVersion");
        version.innerHTML=getFileVersion(currentFiles[i]);
        file.appendChild(name);
        file.appendChild(version);
        document.getElementById("fileContainer").appendChild(file);
    }
}

function renderDetails(){ //Updates project description visual.
    document.getElementById("name").innerHTML=currentProject;
    var desc=localStorage.getItem(currentProject+"@desc");
    var numFiles=localStorage.getItem(currentProject+"@numfiles");
    var update=localStorage.getItem(currentProject+"@update");
    document.getElementById("desc").innerHTML=desc+"<br><br>⏰ Last Updated: "+update+"<br><br>#️⃣ Number of Files: "+numFiles+"<br><br><button id='deleteProject' onclick='deleteProject()'>Delete Project</button>";
}

function alphabetical(a,b){ //Sorts the list of files alphabetically.
    return getFileName(a).charCodeAt(0)-getFileName(b).charCodeAt(0);
}

function openViewContainer(file,version){ //Renders the file viewer.
    document.getElementById("viewContainer").style.display="block";
    for(var i=0;i<currentFiles.length;i++){
        if(getFileName(currentFiles[i])==file){
            document.getElementById("code").innerHTML="";
            document.getElementById("codeHeader").innerHTML=getFileName(currentFiles[i]);
            currentFile=currentFiles[i];
            var currentVersion = version==null ? getFileVersion(currentFiles[i]) : version;
            clear("version");
            var counter=0;
            for(var k=1.0;k<=getFileVersion(currentFiles[i])+0.05;k+=0.1){
                k=(Math.round(k*10)/10);
                var ver=create("button","version");
                ver.style.top=(15+80*(k-1))+"%";
                ver.innerHTML=k;
                ver.setAttribute("onclick","openViewContainer('"+file+"',"+k+")");
                if(k==currentVersion){
                    ver.style.backgroundColor="rgb(31, 135, 232)";
                    ver.style.color="white";
                    ver.style.fontWeight="700";
                    var text=document.createTextNode(getFileContents(currentFiles[i])[counter+1]);
                    currentContents=getFileContents(currentFiles[i])[counter+1];
                    document.getElementById("code").appendChild(text);
                    document.getElementById("code").innerHTML+="<br> ";
                }
                document.getElementById("versionContainer").appendChild(ver);
                counter+=2;
            }  
            return;
        }
    }
}

function closeViewContainer(){ //Closes the file viewer.
    document.getElementById("viewContainer").style.display="none";
}

function deleteFile(){ //Deletes the file in the file viewer.
    localStorage.removeItem(currentFile);
    closeViewContainer();
    render();
}

function copyFile(){ //Copies the file in the file viewer to clipboard.
    navigator.clipboard.writeText(currentContents);
    document.getElementById("copyButton").style.filter="brightness(80%)";
    setTimeout(() => {
        document.getElementById("copyButton").style.filter="brightness(100%)";
    }, "500");
}

function deleteProject(){ //Deletes the current project.
    var files=Object.getOwnPropertyNames({...localStorage});
    for(var i=0;i<files.length;i++){
        if(files[i].split("$")[0]==currentProject || files[i].split("@")[0]==currentProject){
            localStorage.removeItem(files[i]);
        }
    }
    window.location.href="dashboard.html";
}

//------------------------------------- RUN ON START ------------------------------------------

document.title=currentProject;
document.getElementById('upload').addEventListener('change',upload);
render();