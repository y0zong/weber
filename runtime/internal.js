export const z = n => n
export const a = n => document.createElement(n)                // create element
export const b = n => document.createTextNode(n)               // create text element
export const d = n => document.getElementById(n)

export const h = (n, m) => n.appendChild(m)                    // append child
export const i = (n, m, l) => n.insertBefore(m, l || null)     // insert before
export const j = (n, m, l) => n.insertAdjacentHTML(m, l)       // insert html with position beforebegin/afterbegin/beforeend/afterend

export function o(n, m, l, k) {
    n.addEventListener(m, l, k);
    return () => n.removeEventListener(m, l, k);
}

export function UrlIntercept(global, options) {
    let reaction = z
    options = {
        exclude: [['key', 'value']],
        ...options
    }

    function statewatch(event) {
        event.preventDefault();
        const location = global.location.pathname + global.location.search + global.location.hash
        reaction({ state: event.state, location })
        return false
    }

    function intercept(event) {
        // we lookup if `a` link exist in `path` stack and DON'T filter double `a`(it's meanningless)
        let target = event.composedPath().find((elm) => elm.nodeName == 'A')

        if (!target) return
        if (target.target === '__blank' || options.exclude.some(o => target[o[0]] == o[1])) return
        event.preventDefault();
        const location = target.pathname + target.search + target.hash

        if (global.location.href.replace(global.location.origin, '') === location) return
        let fn = event.target.replace ? 'replaceState' : 'pushState'
        global.history[fn](event.target.state, null, location)
        reaction({ state: event.target.state, location })
    }

    function handler(event) {
        let fn = event.detail.replace ? 'replaceState' : 'pushState'
        global.history[fn](event.detail.state, null, event.detail.url)
        reaction({ state: event.detail.state, location: event.detail.url })
    }

    o(global, 'route', handler)
    o(global, 'click', intercept)
    o(global, 'popstate', statewatch)

    return {
        listen(cb) { reaction = cb }
    }
}

export function Router(rules, path) {

    let active_route = undefined, pre_route = undefined
    let active_target_stack = []

    function activate(path) {
        if (!path) return

        pre_route = active_route

        for (let i = 0, len = rules.length; i < len; i++) {
            let rule = rules[i]
            if (path.match(rule.regex)) {
                active_route = rule
                break;
            } else if (len - i == 1) {
                active_route = null
            }
        }
    }

    function merge(stack, root) {
        let target = active_route?.target
        let pre_route_target = pre_route?.target || []

        if (!target) return
        for (let i = 0, len = target.length; i < len; i++) {
            let target_index = target[i]
            let pre_route_target_index = pre_route_target[i]
            if (target_index == pre_route_target_index) {
                let len_target = active_target_stack[len]
                if (len - i == 1 && len_target) {
                    len_target.unmount(node => { node.parentNode.removeChild(node) })
                    active_target_stack.splice(len)
                }
                continue
            }

            let target_compt = stack[target_index]
            let pre_route_target_compt = stack[pre_route_target_index]

            // pre -> [1, 2] | [1]       | [1, 2] | [1, 2, 3] | [1]    | [1] | [1, 2]
            // now -> [1, 3] | [1, 2, 3] | [3]    | [1, 4]    | [2, 3] | [2] | [1]
            let compt = new target_compt()
            if (pre_route_target_compt) {
                let parent = (i == 0 || active_target_stack.length < 2) ? root : active_target_stack.slice(-2)[0].node
                active_target_stack[i].unmount(node => { parent.removeChild(node) })
                active_target_stack.splice(i)
                compt.mount(node => { parent.appendChild(node) })
            } else {
                let parent = active_target_stack[i - 1]?.node || root
                compt.mount(node => { parent.appendChild(node) })
            }
            active_target_stack.push(compt)
        }
    }

    activate(path)

    return { activate, merge }
}

export function create(doms) {
    let index = 0
    let result = { list: {}, tree: [] }
    let item = doms[index]
    while (item) {
        let id = `e_${item[0]}`
        if (item[2]) {
            result.list[id] = a(item[2])
        } else {
            result.list[id] = b(item[4])
        }
        if (item[1] === 0) {
            result.tree.push(result.list[id])
        } else {
            h(result.list[`e_${item[1]}`], result.list[id])
        }

        index++
    }

    index = null
    item = null
    doms = null

    return result
}

export function component(doms, target, init, ready, willdrop) {
    init()
    h(target, elms)
    ready()
}