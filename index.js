const objToHtml = {
    toNode: (obj) => {
        let el = document.createElement(obj.tag);
        for (let k in obj) {
            let v = obj[k];
            if (k === 'tag')
                continue;
            else if (k === 'children')
                for (let j = 0; j < v.length; j++)
                    el.appendChild(objToHtml.toNode(v[j]))
            else if (k === 'text')
                el.textContent = v;
            else if (k === 'on')
                for (let e in v)
                    el.addEventListener(e, ...v[e]);
            else
                el.setAttribute((k.substring(0, 1) === '_') ? k.substring(1, k.length) : k, v);
        }
        return el;
    }
};