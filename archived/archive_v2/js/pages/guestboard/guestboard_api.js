// const API_URL = "http://127.0.0.1:8000"
const API_URL = "https://increasing-reeba-cat-inc-da51b8cb.koyeb.app";
export function post_guestboard(json, on_ok, on_error) {
    fetch(`${API_URL}/sign`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: json
    })
        .catch(on_error)
        .then(function (response) {
        if (response.status != 200) {
            return response.text().then(on_error);
        }
        else {
            on_ok();
        }
    }).then(function (error) {
        if (error) {
            on_error(error);
        }
    });
}
export function get_guestboard(on_ok, on_error) {
    fetch(`${API_URL}`).then(function (response) {
        if (response.status != 200) {
            response.text().then(on_error);
        }
        return response.json();
    })
        .then(function (json) {
        json.forEach(function (value) {
            value.bold = value.bold == "true";
            value.italic = value.italic == "true";
        });
        on_ok(json);
    })
        .catch(on_error);
}
