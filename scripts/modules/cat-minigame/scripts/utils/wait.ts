export function sleep(seconds : number){
    return new Promise(function(resolve){
        window.setTimeout(resolve,seconds * 1000)
    })
}
