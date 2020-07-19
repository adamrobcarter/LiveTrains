window.addEventListener("load", function() {
    console.log("load")
    $("#crs-input").on('input', input)
    $("#crs-input").focus();
});

window.onerror = function(message, source, lineno, colno, error) {
    console.error(error)
};

var staIndex = -1
var lastSearch
const maxSearchResults = 10

window.addEventListener('keypress', function(e){
    console.log(e.key)
    switch(e.key){
        case 'ArrowDown':
            if(staIndex == -1){
                // select first
            }
            $("#results p").eq(staIndex).removeClass('selected')
            staIndex++
            $("#results p").eq(staIndex).addClass('selected')
            break

        case 'ArrowUp':
            $("#results p").eq(staIndex).removeClass('selected')
            staIndex--
            $("#results p").eq(staIndex).addClass('selected')
            break

        case 'Enter':
            if(staIndex != -1){
                window.location.href = 'trains.html?crs=' + $("#results p").eq(staIndex).attr('crs')
            }
            break

        default:
            $("#crs-input").focus();
            window.scroll({y: 0})
            staIndex = -1
    }
})

function input(e){
    const term = e.currentTarget.value
    if(term != lastSearch){
        $("#results").empty()
        if(term){
            for(sta of search(term)){
                $("<p />").text(sta.name).appendTo("#results").attr('crs', sta.crs)
            }
        }
        lastSearch = term
    }
}

function search(chars){
    console.log("searching for", chars)
    const codes = []
    const starts = []
    const contains = []
    let i=0
    for(name in CRSs){
        if(i > maxSearchResults){
            break
        }
        if(CRSs[name] == chars.toUpperCase()){
            codes.push({
                name: name,
                crs: CRSs[name]
            })
            i++
        }
    }
    for(name in CRSs){
        if(i > maxSearchResults){
            break
        }
        const index = name.toUpperCase().indexOf(chars.toUpperCase())
        if(index == 0 && CRSs[name] != chars.toUpperCase()){
            starts.push({
                name: name,
                crs: CRSs[name]
            })
            i++
        }
    }
    for(name in CRSs){
        if(i > maxSearchResults){
            break
        }
        const index = name.toUpperCase().indexOf(chars.toUpperCase())
        if(index > 0 && CRSs[name] != chars.toUpperCase()){
            contains.push({
                name: name,
                crs: CRSs[name]
            })
            i++
        }
    }
    console.log("codes", codes, "starts", starts, "contains", contains)
    return codes.concat(starts).concat(contains)
}