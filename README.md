# objtohtml


### What
An ultra simple, super fast, Json object to Html node script.

### Why
I needed somthing more concise than `document.createElement('div')`, `element.setAttribute('id', 'divEl')` but didn't want a whole library.

### Performance
This script adds around 10% execution time in some test I ran compared to using document methods. It generates dom slightly faster than [lighterhtml](https://github.com/WebReflection/lighterhtml), obivously without xml support and a *much* smaller feature set.


### The code (it's *super* small, 20 lines)

```
const objToHtml = {
    toNode: (obj) => {
        let el = document.createElement(obj.tag);
        for (let k in obj) {
            let v = obj[k];
            if (k === 'tag') continue;
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
```


### Examples

JS
```
document.body.appendChild(
    objToHtml.toNode({
        tag: 'div',
        class: 'css-class',
        children: [
            {
                tag: 'h1',
                text: 'Heading'
            },
            {
                tag: 'p',
                text: 'This is an example using objToHtml.'
            }
        ]
    }
);
```

HTML output
```
<div class="css-class">
    <h1>Heading</h1>
    <p>This is an example using objToHtml</p>
</div>
```

JS
```
document.body.appendChild(
    objToHtml.toNode({
        tag: 'button',
        text: 'Click Me',
        on: {
            click: [() => { alert('You clicked the button'); }]
        }
    }
);
```

HTML output
```
<button>Click Me</button>
```
This button has an onclick event listener attached to it.


### Spefics

Given an object, every property in that object is added as a attribute. They should all be strings (`class: 'css-class'` becomes `<p class="css-class"></p>`, `id: 'input'` becomes `<input id="input" />`, etc).

**Except**

 - `tag` (string): This is used for the tag name, it *must* be present. Example: `p`, `div`, `table`
 - `children` (array): This is an array of more objects that follow the same pattern that are added as children.
 - `on` (object): Any property within this object will get added as an event listener. Every property must be an array that will get passed to the addEventListner method. Example: `click: [(e) => { alert('Click') }, {once: true}]` becomes `element.addEventListener('click', (e) => { alert('Click') }, {once: true});`

To escape this, (why??) use an `_`. Example `_tag: 'value'` becomes `<element tag="value">`. Escape a `_` with another `_`.
