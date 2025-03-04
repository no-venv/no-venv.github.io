// const API_URL = "http://127.0.0.1:8000"
const API_URL = "https://increasing-reeba-cat-inc-da51b8cb.koyeb.app"

type GuestboardGetResponse = {
    id : number;
    text : string;
    color1 : string;
    color2 : string;
    bold : boolean;
    italic : boolean;
}
export function post_guestboard(json : string,on_ok :() => any, on_error : (error_str : string) => any){
    fetch(`${API_URL}/sign`,
        {
            method : "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : json
        }
    )
    .catch(on_error)
    .then(function(response){
        if (response.status != 200){
            return response.text().then(on_error)
        } else{
            on_ok()
        }
    }).then(function(error){
        if (error){
            on_error(error)
        }
    })
    
}

export function get_guestboard(on_ok : (response : Array<GuestboardGetResponse>) => any, on_error : (error_str : string) => any ){

    fetch(`${API_URL}`).then(function(response){
        if (response.status != 200){
            response.text().then(on_error)
        }
        return response.json()
    })
    .then(function(json : Array<GuestboardGetResponse>){
        json.forEach(function(value){
            value.bold = (value.bold as unknown) == "true"
            value.italic = (value.italic as unknown) == "true"
        })

        on_ok(json)
    })
    .catch(on_error)
    
    
}