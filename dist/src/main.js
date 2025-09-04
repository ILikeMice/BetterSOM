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
    if (window.location.pathname.includes("/projects/")) {
        getships()
        getdevlogs()
        projectstats()
    } else if (window.location.pathname.includes("/shop")) {
        getitems()
    }
}

function loaddata() {
    let bsomdata = null
    bsomdata = JSON.parse(window.localStorage.getItem("BSOM_data"))
    if (bsomdata == null) {
        bsomdata = {}
        window.localStorage.setItem("BSOM_data", JSON.stringify(bsomdata))
    }
    return bsomdata;
}

function loadothers() {
    let otherdata = null
    otherdata = JSON.parse(window.localStorage.getItem("BSOM_otherdata"))
    if (otherdata == null) {
        otherdata = {}
        window.localStorage.setItem("BSOM_otherdata", JSON.stringify(otherdata))
    }
    return otherdata;
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
    let btndiv = document.querySelector("div.flex.items-center.space-x-3.md\\:space-x-4.md\\:ml-4")
    
    if (document.getElementById("BSOM_export") == null) {        
        let exportbtn = `<button class="som-button-primary" id="BSOM_export">
            <div class="flex items-center justify-center gap-2">
            <img src="https://icons.hackclub.com/api/icons/black/share" width="32" height="32" viewBox="0 0 24 24" class="w-6 h-6"></img>
            <span class="flex items-center gap-1">Export</span>
        </div>
    </button>`
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
    
    let readmores = document.querySelectorAll(".text-nice-blue.hover\\:text-dark-blue.font-medium.transition-colors.duration-200.cursor-pointer.hover\\:underline")

    readmores.forEach(async (readmore)=>{ // removes read more thingis bc that fucks up my devlogging rahhhh
        readmore.click()
    })

    devlogs.forEach(async (item, index)=>{
        console.log(item.id)
        const selector = "." + CSS.escape("text-som-detail")
        const element = item.querySelector(selector);

        console.log(item)
        console.log(element)

        let timeago = element.querySelectorAll("span")[2].querySelector("a").innerText
        let timespent = element.querySelectorAll("span")[0].innerText
        //console.log(timespent)
        console.log(timeago.toString())

        if (timeago.includes("hour")) {
            timeago = timeago.split("h")[0] * 3600000
            console.log(timeago + " hours")
        } else if (timeago.includes("minute")) {
            timeago = timeago.split("m")[0] * 60000
            console.log(timeago + " minutes")
        } else if(timeago.includes("day")) {
            timeago = timeago.split("d")[0] * 86400000
            console.log(timeago + " days")
        } else if (timeago.includes("month")) {
            timeago = Number(timeago.split(" ")[1]) * 2628000000 
            console.log(timeago + " months")
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
        logtext += description.innerText + "<br>\n"
        logtext += "**Time spent: " + timespent.trim() + "** <br><br>\n"


        markdowncontent += logtext
    })
    const zip = new JSZip();
    zip.file("SOM.md", markdowncontent)

    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, "Export.zip")
    })
   console.log(markdowncontent)
}

function getships() {
    let shippayouts = document.querySelectorAll("div.flex.flex-col.mb-6.space-y-1")
    
    if (checkowner()) {
        data = loaddata()
    } else {
        data = loadothers()
    }
    let projid = window.location.pathname.split("/")[window.location.pathname.split("/").length -1]
    console.log(data)

    if (data[projid] == undefined) {
        data[projid] = {"ships": {}}
    } else {
        data[projid]["ships"] = {}
    }
    
    shippayouts.forEach((payout, index) => {
        payoutamnt = Number(payout.innerText.split(" ")[payout.innerText.split(" ").length - 2])
        //console.log(payout.innerText.split(" "), "payout: ", payoutamnt)
        let time = payout.parentNode.querySelector("div.flex.items-center").querySelector("div").querySelectorAll(".text-som-detail.text-xs.sm\\:text-sm")[2].innerText.split("and")[1].trim().split(" ")
        let hrcount = time[0].split("")
        let mincount = time[1].split("")

        hrcount.pop();mincount.pop();hrcount = Number(hrcount.join(""));mincount = Number(mincount.join(""))

        hoursamnt = hrcount + mincount/60

        //console.log(hoursamnt)
        sph = (payoutamnt/hoursamnt)

        data[projid]["ships"][index.toString()] = {"shells": payoutamnt, "time": hoursamnt, "sph": sph}
        payout.innerText += ` (${sph.toFixed(2)} shells per hour)`
    })
    
    if (checkowner()) {
        window.localStorage.setItem("BSOM_data", JSON.stringify(data))
    } else {
        window.localStorage.setItem("BSOM_otherdata", JSON.stringify(data))
    }
}

function projectstats() {
    let statdiv = document.getElementsByClassName("flex gap-3 flex-wrap items-center space-x-2 mb-1 ml-2 text-sm md:text-base 2xl:text-lg text-som-dark")[0]
    if (checkowner()) {
        projdata = JSON.parse(window.localStorage.getItem("BSOM_data"))
    } else {
        projdata = JSON.parse(window.localStorage.getItem("BSOM_otherdata"))
    }
    console.log(projdata)
    let projid = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1]

    let totalshells = 0
    let totalsph = 0
    let totalshiptime = 0
    let totaldevlogtime = 0
    console.log(projdata, Object.keys(projdata[projid]["ships"]).length)
    for (let i = 0; i < Object.keys(projdata[projid]["ships"]).length; i++) {
        totalshells += projdata[projid]["ships"][i.toString()]["shells"]
        totalsph += projdata[projid]["ships"][i.toString()]["sph"]
        totalshiptime += projdata[projid]["ships"][i.toString()]["time"]
        console.log(i, totalshells, totalsph)
    }

    for (let i = 0; i < Object.keys(projdata[projid]["devlogs"]).length; i++) {
        totaldevlogtime += projdata[projid]["devlogs"][i.toString()]["time"]
    }    

    let shipamnt = Object.keys(projdata[projid]["ships"]).length
    let avgsph = totalsph / shipamnt

    let shellstat = `<div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
  <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
</svg>
        <span class="text-som-dark">${totalshells} (avg. ${avgsph.toFixed(1)}/h)</span>
      </div>`
    statdiv.insertAdjacentHTML("afterbegin", shellstat)

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

    if (checkowner()) {
        try {
            loggedtime = document.querySelector("div.md\\:text-lg:nth-child(1) > div:nth-child(1)").innerText.split(":")[1].split(" ")
            loggedtime.pop();loggedtime = loggedtime.join(" ").trim();loggedtime = timetonumber(loggedtime)
        } catch (e) {    
            loggedtime = totaldevlogtime
        }
    } else {
        loggedtime = totaldevlogtime
    }
    let oldtimestat = document.querySelector("div.gap-2:nth-child(4) > span:nth-child(2)")
    oldtimestat.innerText += ` (${numbertotime(loggedtime - totalshiptime)} / ${(avgsph * (loggedtime - totalshiptime)).toFixed(0)} shells unshipped)`

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    let devlogamnt = document.querySelector("div.flex-wrap:nth-child(2) > div:nth-child(3) > span:nth-child(2)").innerText
    let amount = Number(devlogamnt.split(" ")[0])
    let timeperdevlog = totaldevlogtime / amount

    document.querySelector("div.gap-3:nth-child(2) > div:nth-child(3)").innerText += ` (~${numbertotime(timeperdevlog)} per devlog)`
}



function getdevlogs() {
    let projid = window.location.pathname.split("/").pop()
    let devlogsdiv = document.getElementById("devlogs")

    if (checkowner()) {
        data = JSON.parse(window.localStorage.getItem("BSOM_data"))
    } else {
        data = JSON.parse(window.localStorage.getItem("BSOM_otherdata"))
    }


    if (data[projid] == undefined) {
        data[projid] = {
            "devlogs": {}
        }
    } else {
        data[projid]["devlogs"] = {}
    }

    console.log(data)

    let devlogs = devlogsdiv.querySelectorAll(".ml-4.relative[id*='devlog']")
    devlogs.forEach((devlog, index) => {
        try {
            let element = devlog.querySelector("div.text-som-detail") 
            let timespent = element.querySelectorAll("span")[0].innerText
            console.log("1:", timespent)
            timespent = timetonumber(timespent)
            console.log("2:", timespent)
            data[projid]["devlogs"][index.toString()] = {
                "time": timespent
            }
        } catch (e) {}
        
    })

    if (checkowner()) {
        window.localStorage.setItem("BSOM_data", JSON.stringify(data))
    } else {
        window.localStorage.setItem("BSOM_otherdata", JSON.stringify(data))
    }
}

function checkowner() {
    let ownername = document.querySelector("div.text-xl > a:nth-child(1) > span:nth-child(1) > span:nth-child(1)").innerText
    let projectname = document.querySelector("span.font-extrabold:nth-child(1) > a:nth-child(1) > span:nth-child(1) > span:nth-child(1)").innerText

    if (ownername != projectname) {
        return false
    } else {
        return true
    }
}

function timetonumber(ts) { // fuck this im making a func for ts (ts stands for timestring)
    let totalhours = 0

    if (ts.includes("h")) {
        let hours = parseInt(ts.split("h")[0])
        totalhours+= hours
    }

    if (ts.includes("m")) {
        let minutespart = ts.includes("h") ? ts.split("h")[1].trim() : ts
        let minutes = parseInt(minutespart.split("m")[0])
        totalhours += minutes / 60
    }

    return totalhours
}

function numbertotime(number) {
    let hours = Math.floor(number)
    let mins = ((number - hours) * 60).toFixed(0)
    return `${hours}h ${mins}m`
}

// Shop section because multiple files doesnt wanna work ----------------------------------------------------------------------

function loaditems() {
    let itemdata = null
    itemdata = JSON.parse(window.localStorage.getItem("BSOM_itemdata"))
    if (itemdata == null) {
        itemdata = {}
        window.localStorage.setItem("BSOM_itemdata", JSON.stringify(itemdata))
    }
    return itemdata;
}

function getitems() {
    let itemdata = loaditems()
    let data = loaddata()
    let items = document.querySelectorAll("div.card-with-gradient.h-full")

    console.log("proc")
    let totalsph = 0
    let count = 0
    let usershells = Number(document.querySelector("div.items-center:nth-child(2) > span:nth-child(2)").innerText)

    Object.keys(data).forEach((id) => {
        Object.keys(data[id]["ships"]).forEach((shipkey) => {
            totalsph += data[id]["ships"][shipkey]["sph"]
            count++
        })
    })

    let sph = totalsph / count
    console.log(sph)

    items.forEach((item) => {
        let itemname = item.querySelector("h3.text-xl.font-bold.mb-2").innerText
        let itemdesc = item.querySelector("p.text-gray-700").innerText
        let itemprice = Number(item.querySelector("div.absolute.top-2.right-2.text-lg.font-bold.whitespace-nowrap.flex.items-center").innerText)
        
        item.id = itemname

        if (!itemdata[itemname]) {
            itemdata[itemname] = {}
        }
        itemdata[itemname]["price"] = itemprice
        itemdata[itemname]["description"] = itemdesc

        if (itemdata[itemname]["pinned"] == null || itemdata[itemname]["pinned"] == undefined) {
            itemdata[itemname]["pinned"] = false
        }

        item.querySelector(".text-xs.text-gray-500.text-center").innerText = "≈ " + (itemprice / sph).toFixed(1) + "h with your average sph"
    
        if (usershells < itemprice) {
            item.querySelector(".text-xs.text-gray-500.text-center").innerText = "≈ " + ((itemprice - usershells) / sph).toFixed(1) + "h to go with your average sph"
        }

        let pinbtn = `<button style="width: 24px; height: 24px;" onmouseover="this.style.cursor='pointer'" data-item=${itemname.replaceAll(" ", "ю")}><img src="https://icons.hackclub.com/api/icons/black/pin"></button>`

        if (itemdata[itemname]["pinned"]) {
            let itemssection = document.querySelector("div.mb-12:nth-child(1) > div:nth-child(2)")

            item.remove()
            pinbtn = `<button style="width: 24px; height: 24px;" onmouseover="this.style.cursor='pointer'" data-item=${itemname.replaceAll(" ", "ю")}><img src="https://icons.hackclub.com/api/icons/black/pin-fill"></button>`

            itemssection.insertAdjacentElement("afterbegin", item)
        }

        item.insertAdjacentHTML("afterbegin", pinbtn)
    }) 

    window.localStorage.setItem("BSOM_itemdata", JSON.stringify(itemdata))

    document.querySelectorAll("button[data-item]").forEach(button => {
        console.log("one")
        button.onclick = () => {
            console.log("clinker")
            let itemname = button.getAttribute("data-item").replaceAll("ю", " ")
            let itemdata = loaditems()

            let pinned = itemdata[itemname]["pinned"]
            let itemobj = document.getElementById(itemname)
            let itemssection = document.querySelector("div.mb-12:nth-child(1) > div:nth-child(2)")

            if (!pinned) {
                itemobj.remove()
                button.querySelector("img").src = "https://icons.hackclub.com/api/icons/black/pin-fill"
                itemssection.insertAdjacentElement("afterbegin", itemobj)
                itemdata[itemname]["pinned"] = true
            } else {
                button.querySelector("img").src = "https://icons.hackclub.com/api/icons/black/pin"
                itemdata[itemname]["pinned"] = false
                window.location.reload()
            }            
            window.localStorage.setItem("BSOM_itemdata", JSON.stringify(itemdata))
        }
    })
}




function init() {
    load();
    setInterval(() => {
        check();
    }, 1000)
}

init()