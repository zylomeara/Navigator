type ValidClassNamesTypes = string | null | undefined | boolean;

export function classNames(...args: ValidClassNamesTypes[]): string {
    let result = args.reduce((acc, val) => {
        if (typeof val === 'string') {
            return `${acc} ${val}`;
        }

        if (typeof val === 'object' && val !== null) {
            let serializedObjVal = Object.entries(val)
                .reduce((acc, [key, val]) => {
                    if (val === true) {
                        return `${acc} ${key}`;
                    }

                    return acc;
                }, '')
                .trim();

            return `${acc} ${serializedObjVal}`;
        }

        return acc;
    }, '');

    return typeof result === 'string' ? result.trim() : '';
}

export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

export function setCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}


// export function deleteCookie(name) {
//     console.log(1);
//     setCookie(name, "", {
//         expires: -1
//     })
// }

export function deleteCookie( name ) {
  document.cookie = name + '=, expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


export function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}