//---------------------------------- UTILITY FUNCTIONS -----------------------------------------

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

function render(){ //Renders list of projects.
    var projects=[];
    var files=Object.getOwnPropertyNames({...localStorage});
    for(var i=0;i<files.length;i++){
        var project=files[i].split("$")[0];
        if(files[i].split("$").length==1){
            project=files[i].split("@")[0];
        }
        if((files[i].split("$").length>1 || files[i].split("@").length>1) && !projects.includes(project)){
            projects.push(project);
        }
    }
    projects.sort(alphabetical);
    clear("dProject");
    var finalY=0;
    for(var i=0;i<projects.length;i++){
        var project=create("button","dProject");
        project.style.left=(15+(i%3)*25)+"%";
        project.style.top=(40+parseInt(i/3)*25)+"%";
        if(i==projects.length-1) finalY=(40+parseInt(i/3)*25);
        project.setAttribute("onclick","enter('"+projects[i]+"')");
        var projectName=create("div","dProjectName");
        projectName.innerHTML=projects[i];
        var projectUpdate=create("div","dProjectUpdate");
        projectUpdate.innerHTML="⏰ "+localStorage.getItem(projects[i]+"@update");
        var projectNumFiles=create("div","dProjectNumFiles");
        projectNumFiles.innerHTML=localStorage.getItem(projects[i]+"@numfiles")+" #️⃣";
        project.appendChild(projectName);
        project.appendChild(projectUpdate);
        project.appendChild(projectNumFiles);
        document.getElementById("dProjectContainer").appendChild(project);
    }
    if(finalY<75) document.getElementById("dFooter").style.top=(95)+"%";
    document.getElementById("dFooter").style.top=(finalY+30)+"%";
}

function alphabetical(a,b){ //Sorts the list of projects alphabetically.
    return a.toUpperCase().charCodeAt(0)-b.toUpperCase().charCodeAt(0);
}

function enter(name){ //Opens a project that you clicked on.
    localStorage.setItem("currentProject",name);
    window.location.href="project.html";
}

function openCreate(){ //Opens create project interface.
    document.getElementById("dCreatePanel").style.display="block";
}

function closeCreate(){ //Closes create project interface.
    document.getElementById("dCreatePanel").style.display="none";
}

function createProject(){ //Creates a new project.
    var name=document.getElementById("dCreateName").value;
    var desc=document.getElementById("dCreateDescription").value;
    localStorage.setItem(name+"@desc",desc);
    var date=new Date();
    var currentDate=(date.getMonth()+1)+"/"+date.getDate();
    localStorage.setItem(name+"@update",currentDate);
    localStorage.setItem(name+"@numfiles",0);
    document.getElementById("dCreateName").value="";
    document.getElementById("dCreateDescription").value="";
    closeCreate();
    render();
}

//------------------------------------- RUN ON START ------------------------------------------

render();