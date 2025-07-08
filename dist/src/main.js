function waitForElementToExist(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
  
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
  
      observer.observe(document.body, {
        subtree: true,
        childList: true,
      });
    });
}


currpage = ""

function load() {
    console.log("SUMMERRRR!!!!")
}

function check() {
    if (window.location.pathname.includes("/projects/")) {
            currpage = "projects";
            projects()
    } else {
        
        currpage = ""
        console.log("reset")
    
    }

}

function projects() {
    let btndiv = document.querySelector("div.ml-4.flex.flex-wrap.items-center.gap-6")
    
    if (document.getElementById("BSOM_export") == null) {
        let exportbtn = `<div class="cursor-pointer h-min"> <button id="BSOM_export" type="button" class="relative inline-block group py-2 cursor-pointer "> <span class="relative z-10 flex items-center space-x-2"> <img src="https://icons.hackclub.com/api/icons/black/share" width="32" height="32" viewBox="0 0 24 24" class="w-6 h-6"></img> <span class="text-nowrap tracking-tight"> Export! </span></span> <div class="absolute transition-all duration-150 bottom-1 w-full pr-3 box-content bg-[#C7A077] rounded-full z-0 group-hover:opacity-100 h-4 -right-[6px] opacity-0" data-kind="underline"></div> </button> </div>`
        btndiv.insertAdjacentHTML("afterbegin", exportbtn)
        console.log(btndiv)
        document.getElementById("BSOM_export").onclick = () => {
            exportlog()
        }
    }
}

function exportlog() {
    
    let markdowncontent = ""
    let devlogsdiv = document.getElementById("devlogs")

    let devlogs = devlogsdiv.querySelectorAll(".ml-4.relative")
    let lastdate = ""
    
    devlogs.forEach(async (item)=>{
        console.log(item.id)
        const selector = "." + CSS.escape("text-[#B89576]")
        const element = item.querySelector(selector);

        console.log(item)
        console.log(element)
        
        let time = element.querySelectorAll("span")
        let timespent = time[0].innerText
        let timeago = time[2].innerText.split(" ")[0]
        //console.log(timespent)
        console.log(timeago.toString())

        if (timeago.includes("h")) {
            timeago = timeago.split("h")[0] * 3600000
            console.log(timeago + " hours")
        } else if (timeago.includes("m")) {
            timeago = timeago.split("m")[0] * 60000
            console.log(timeago + " minutes")
        } else if(timeago.includes("d")) {
            timeago = timeago.split("d")[0] * 86400000
            console.log(timeago + " days")
        }
        console.log(timeago)
        let dateago = new Date(Date.now() - timeago)
        
        let monthNames = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "December"]

        let monthago = monthNames[dateago.getMonth()]
        let dayago = dateago.getDate()
        
        console.log(monthago, dayago, "|", dateago)
        if (dayago % 10 == 1) {
            dayago += "st"
        } else if (dayago % 10 == 2) {
            dayago += "nd"
        } else if (dayago % 10 == 3) {
            dayago += "rd"
        } else {
            dayago += "th"
        }

        
        
        description = item.querySelector('div[data-devlog-card-target="content"]');
        console.log(description)


        let logdate = monthago + " " + dayago
        console.log(description.innerText)  

        
        let imageurl = item.querySelector("img.w-full.object-contain.cursor-pointer.hover\\:opacity-90.transition-opacity.rounded-lg.max-h-96").src
        
        

        let logtext = ""
        if (lastdate != logdate) {
            logtext += "# " + logdate + "<br>\n"
            lastdate = logdate
        }
        
        logtext += "![image](" + imageurl + ")" + "<br>\n"
        logtext += description.innerText + "<br><br>\n"


        markdowncontent += logtext
    })
    const zip = new JSZip();
    zip.file("SOM.md", markdowncontent)

    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, "Export.zip")
    })
   console.log(markdowncontent)
}

window.onload = () => {
    load();
    setInterval(() => {
        check();
    }, 1000);
}