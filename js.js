let API_URL = "https://neteasecloudmusicapi.treexhd.repl.co/"
let searchback = []
let playlist = []
let byID = null
let lyric = []
let sallist = []
let myplaylist = []
let myAllplaylist = []
let playlist_detail = []
let mkList = []
let getSongIds = []
let ap = null
let acid = ""
let posterPic = ""
let lyric_DL = ""
let c = 0
let str2 = ""
let str = ""

$(document).ready(function(){
    load();
})

//renderLast()
$("#toLogin").click(function() {
    event.preventDefault()
    $("#exampleModalCenter").modal("show")
})
$(".login").click(function() {
    getUserID()
})
$("#clearPlay").click(function() {
    localStorage.removeItem("mymusic")
    Storage.removeItem("mymusic")
    sallist = []
    loadaa()
})
$("#resetAll").click(function() {
    localStorage.clear()
    Storage.clear()
    loadaa()
})
$("#getAllList").click(function() {
        event.preventDefault()
        if (acid === "") {
            alert("請先點擊登入")
        } else {
            getAllList()
        }

    })
    //ListenEnterForSearch
function runScript(e) {
    //See notes about 'which' and 'key'
    if (e.keyCode == 13) {
        $("#send").click()
    }
}

$.when()
$("#send").click(function() {
    event.preventDefault()
    $("#list").show()
    if (ap !== null) {


    }
    if (playlist.length > 0) {
        playlist = []
    }
    if (searchback.length > 0) {
        searchback = []
    }
    let toSearch = $("#what").val()
    search(toSearch)
})
$("#reGen").click(function() {
    console.log("已重新載入音樂連結")
    refreshSongurl()
})

function search(what) {
    $('.loading').css({
        'opacity':'1',
        'z-index':'10'
    })
    $.ajax({
        type: "GET",
        url: API_URL + "search",
        dataType: "json",
        data: {
            keywords: what,
            limit: 20
        },
        success: function(response) {
            searchback = response["result"]["songs"]
            aa()

        },
        error: function(thrownError) {
            console.log(thrownError);
        }
    })

}


function aa() {
    searchback.forEach(function(item, index) {
        $.ajax({
            type: "GET",
            url: API_URL + "song/url",
            dataType: "json",
            data: {
                id: item["id"]
            },
            success: function(res) {
                byID = res["data"][0]["url"]
                level = res["data"][0]["level"]
                crPlaylist()


            }
        })

        function crPlaylist() {
            let togo = ""
            let replaceById = byID.replaceAll('http', 'https')
                // let replaceById2 = replaceById.replace(/m(\d+)?.music.126.net/g, 'm7.music.126.net')
            if (replaceById.search("m8.music") === 8) {
                togo = replaceById.replace('m8.music.126.net', 'm7.music.126.net')
            } else if (replaceById.search("m801.music") === 8) {
                togo = replaceById.replace('m801.music.126.net', 'm701.music.126.net')
            } else {
                togo = replaceById
            }
            let tplaylist = {
                "sid": searchback[index]["id"],
                "name": searchback[index]["name"],
                "src": togo,
                "artist": searchback[index]["artists"][0]["name"],
                "album_id": searchback[index]["album"]["id"],
                "level": level
            }
            playlist.push(tplaylist)
                // sallist.push(tplaylist)
                // loadaa()

        }

    })


    setTimeout(function() {
        renderPlaylist()
    }, 1500)
}
let toPoster = ""

function lyrics() {
    playlist.forEach(function(item, index) {
        $.ajax({
            type: "GET",
            url: API_URL + "lyric",
            // url: "http://168.138.207.96:3000/lyric",
            dataType: "json",
            data: {
                id: item["sid"]
            },
            success: function(res) {
                playlist[index].lyric = res["lrc"]["lyric"]
                playlist[index].sublyric = res["tlyric"]["lyric"]

            }
        })
    })
}

function apic() {
    playlist.forEach(function(item, index) {
        $.ajax({
            type: "GET",
            url: API_URL + "album",
            // url: "http://168.138.207.96:3000/album",
            dataType: "json",
            data: {
                id: item["album_id"]
            },
            success: function(res) {
                playlist[index].poster = res["album"]["picUrl"]

            }
        })
    })
}

function loadaa(Autoplay) {
    if(sallist.length!=0){ //Check Playlist is not empty
        ap = new cplayer({
            element: document.getElementById('app'),
            playlist: sallist,
            width: "100%",
            volume: "0.1",
            // point: rr,
            dark: !0,
            big: !0,
        })
    }
        // }, 500);
}

function renderPlaylist() {
    lyrics()
    apic()
    let str = ""
    let whatLevel = ""
    playlist.forEach(function(item, index) {
        if(item["level"]===null){
            whatLevel="試聽版"
        }
        // console.log(item)
        str += `
        <li class="list-group-item d-flex justify-content-between align-items-center toPlay" data-toPlay="${index}" onclick="addtoPlay(${index})">
        <span>${item["name"]}-<span class="artist">${item["artist"]}</span></span>
        <div><span class="badge badge-pill badge-warning">${whatLevel}</span>
        <a class="badge badge-primary badge-pill" href="${item["src"]}"><i class="fas fa-download"></i></a></div>
        </li>
        `
    })
    $("#list").html(str)
    $('.loading').css({
        'opacity':'0',
        'z-index':'-1'
    })
}
// loadaa()

function load() {
    if (localStorage.getItem("mymusic")) {
        sallist = JSON.parse(localStorage.getItem("mymusic"))
    }
    if (localStorage.getItem("myid")) {
        acid = JSON.parse(localStorage.getItem("myid"))
    }
    str2 = `
    <li class="list-group-item d-flex justify-content-center align-items-center" >
    <span>上次BO放</span>
    </li>
    `
    refreshSongurl()
}

function renderLast() {
    sallist.forEach(function(item, index) {
        // console.log(item)

        str += `
            <li class="list-group-item d-flex justify-content-between align-items-center toPlay" data-toPlay="${index}">
            <span>${sallist[index]["name"]}-<span class="artist">${sallist[index]["artist"]}</span></span>
            <a class="badge badge-primary badge-pill" href="${sallist[index]["src"]}" download="${sallist[index]["name"]}.mp3"><i class="fas fa-download"></i></a>
            </li>
            `
    })
    $("#list").html(str2 + str)
    loadaa("no")
}

function addtoPlay(toPlay) {
    if (sallist.length == 0) {
        sallist.push(playlist[toPlay])
        loadaa()
    } else {
        sallist.push(playlist[toPlay])
        ap.add(playlist[toPlay])
    }

    localStorage.setItem("mymusic", JSON.stringify(sallist))

}
let apto = "no"
function refreshSongurl() {
    let nowplaypoint = 0
        if(ap){
            ap.pause()
            // ap.destroy()
            nowplaypoint = ap.nowplaypoint
            // apto = ap.nowplaypoint
        }
        if(sallist.length!==0){
            pl_lyrics()
            pl_tlyrics()
        }
        let g = 0
        sallist.forEach(function(item, index) {
            $.ajax({
                type: "GET",
                url: API_URL + "song/url",
                dataType: "json",
                data: {
                    id: item["sid"]
                },
                success: function(res) {
                    let urlByID = res["data"][0]["url"]
                    let replaceById = urlByID.replaceAll('http', 'https')
                    let togo = ""
                        // let replaceById2 = replaceById.replace(/m(\d+)?.music.126.net/g, 'm7.music.126.net')
                    if (replaceById.search("m8.music") === 8) {
                        togo = replaceById.replace('m8.music.126.net', 'm7.music.126.net')
                    } else if (replaceById.search("m801.music") === 8) {
                        togo = replaceById.replace('m801.music.126.net', 'm701.music.126.net')
                    } else {
                        togo = replaceById
                    }
                    sallist[index]["src"] = togo
                    localStorage.setItem("mymusic", JSON.stringify(sallist))
    
                }
            })
        
            g++
            
        })
        renderLast()
}

function getUserID() {
    let email = $("#exampleInputEmail1").val()
    let password = $("#exampleInputPassword1").val()

    $.ajax({
        type: "POST",
        url: API_URL + "login",
        dataType: "json",
        data: {
            email: email,
            password: password
        },
        success: function(res) {
            if (res["code"] === 200) {
                acid = res["account"]["id"]
                localStorage.setItem("myid", acid)
                localStorage.setItem("myaccount", email)
                localStorage.setItem("mypassword", password)
                alert("登入成功")
                $("#exampleModalCenter").modal("hide")
            } else {
                alert("帳密不對，或其他問題")
            }
        },


    })
}

function getUserID2() {
    let id_url = $("#uid_url").val()
    let id_url_num = id_url.replace(/\D/g, "")
    let id = id_url_num.replace("163", "")
        // let  = 
    acid = id
    localStorage.setItem("myid", acid)
    console.log(id)
    $("#exampleModalCenter").modal("hide")

}

//取得全部播放清單
function getAllList() {
    $.ajax({
        type: "GET",
        url: API_URL + "user/playlist",
        dataType: "json",
        data: {
            uid: acid,
        },
        success: function(res) {
            if (res["code"] === 200) {
                myAllplaylist = res["playlist"]
                localStorage.setItem("mylist", JSON.stringify(myAllplaylist))
            }
        },

    }).done(function() {
        procList()
    })

}

function procList() {
    myAllplaylist.forEach(function(item, index) {
        let tplaylist = {
            poster: item["coverImgUrl"],
            plid: item["id"],
            name: item["name"],
            desc: item["description"]
        }
        myplaylist.push(tplaylist)

    })

    setTimeout(() => {
        rendermyPlaylist()
    }, 1000);
}

function rendermyPlaylist() {
    let rr = ""
    myplaylist.forEach(function(item, index) {
        rr += `
        <div class="col-6 col-md-3">
                    <div class="card" style="border:none;" onclick="expandList(${item["plid"]})">
                        <img src="${item["poster"]}" class="card-img-top">
                        <div class="card-body d-flex flex-column justify-content-center">
                            <h5 class="card-title">${item["name"]}</h5>
                            <!--p class="card-text">喜欢歌单的可以点个关注哟</p-->
                            <!--a href="#" class="btn btn-primary">Go somewhere</a-->
                        </div>
                    </div>
                </div>
    `
    })
    $("#list").hide()
    $("#allalbum").html(rr)

}

function expandList(plistid) {
    $.ajax({
        type: "GET",
        url: API_URL + "playlist/detail",
        dataType: "json",
        data: {
            id: plistid,
        },
        success: function(res) {
            if (res["code"] === 200) {
                playlist_detail = res["playlist"]["trackIds"]

            }
        },

    }).done(function() {
        // makePlaylist()
        getSongDetail()
    })
    setTimeout(() => {
        // makePlaylist()

    }, 500);
}

function getSongDetail() {
    playlist_detail.forEach(function(item, index) {
        $.ajax({
            type: "GET",
            url: API_URL + "song/detail",
            dataType: "json",
            data: {
                ids: item["id"],
            },
            success: function(res) {
                if (res["code"] === 200) {
                    let arr = res["songs"]["0"]
                    getSongIds.push(arr)
                }
            },

        })
    })
    let timer = setInterval(() => {
        if (getSongIds.length === playlist_detail.length) {
            makePlaylist()
            clearInterval(timer)
        }
    }, 1000);
}


function makePlaylist() {
    
    getSongIds.forEach(function(item, index) {
        $.ajax({
            type: "GET",
            url: API_URL + "song/url",
            dataType: "json",
            data: {
                id: item["id"]
            },
            success: function(res) {
                mkList = res["data"][0]["url"]
                crPlaylist()

            }
        })



        function crPlaylist() {
            let replaceById = mkList.replaceAll('http', 'https')
            let togo = ""
                // let replaceById2 = replaceById.replace(/m(\d+)?.music.126.net/g, 'm7.music.126.net')
            if (replaceById.search("m8.music") === 8) {
                togo = replaceById.replace('m8.music.126.net', 'm7.music.126.net')
            } else if (replaceById.search("m801.music") === 8) {
                togo = replaceById.replace('m801.music.126.net', 'm701.music.126.net')
            } else {
                togo = replaceById
            }
            let tplaylist = {
                "sid": getSongIds[index]["id"],
                "name": getSongIds[index]["name"],
                "name": getSongIds[index]["name"],
                "src": togo,
                "artist": getSongIds[index]["ar"][0]["name"],
                "album_id": getSongIds[index]["al"]["id"],
                "poster": item["al"]["picUrl"],
                "lyric": lyric_DL

            }

            sallist.push(tplaylist)
            if(ap){
                ap.add(tplaylist)
            }
            localStorage.setItem("mymusic", JSON.stringify(sallist))


        }
        c++
        // console.log(c)
    })
    pl_lyrics()
    pl_apic()
    var timer = setInterval(function(){
        if (getSongIds.length == c) {
            pl_lyrics()
            pl_tlyrics()
            clearInterval(timer)
            console.log("mkPlayList")
        }
    }, 500);
    setTimeout(() => {


        // loadaa()
    }, 3000);


}

function updateTitle() {
   if(ap){
        document.title = ap.nowplay["name"] + "-" + ap.nowplay["artist"]
   }
}
setInterval(() => {

    if (sallist.length > 0) {
        updateTitle()
    }

}, 100)

function pl_lyrics() {
    let s = 0
    sallist.forEach(function(item, index) {
        $.ajax({
            type: "GET",
            url: API_URL + "lyric",
            dataType: "json",
            data: {
                id: item["sid"]
            },
            success: function(res) {
                sallist[index].lyric = res["lrc"]["lyric"]

            }
        })
        
        s++
    })

    let timer = setInterval(() => {
        if (sallist.length == s) {
            
            localStorage.setItem("mymusic", JSON.stringify(sallist))
            clearInterval(timer)
            if(ap){
                
            }else{
                setTimeout(()=>{
                    // if(apto==="no"){
                        
                    // }
                loadaa()
                },1000)
            }
            
        }
    }, 500);
}
function pl_tlyrics() {
    sallist.forEach(function(item, index) {
        $.ajax({
            type: "GET",
            url: API_URL + "lyric",
            dataType: "json",
            data: {
                id: item["sid"]
            },
            success: function(res) {
                sallist[index].sublyric = res["tlyric"]["lyric"]

            }
        })
        
    })
}
function pl_apic() {
    sallist.forEach(function(item, index) {
        $.ajax({
            type: "GET",
            url: API_URL + "album",
            // url: "http://168.138.207.96:3000/album",
            dataType: "json",
            data: {
                id: item["album_id"]
            },
            success: function(res) {
                sallist[index].poster = res["album"]["picUrl"]

            }
        })
        localStorage.setItem("mymusic", JSON.stringify(sallist))
    })

}

