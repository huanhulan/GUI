/**
 * Compile the templates to real DOM,
 * and bind the view and the model automatically.
 */
import directives from '../directives'
import throttle from '../../util/throttle'

const compiler = (mvvm, nodeStr) => {
    let binder = Binder.getInstance();
    binder.mvvm = mvvm;
    // initialize the DOM
    binder.dom = binder.parseHTML(nodeStr);
    // do the real compiling
    binder.walk(binder.dom, binder.mvvm);
    return binder.dom;
};

export default compiler;


class Binder {
    /**
     * because there is only one Binder instance compiling all the components,
     * so we need more fine grit control over the binder instance.
     */
    constructor() {
        this.mvvm = null;
        this.dom = null;
    }

    static getInstance() {
        if (!Binder.binder) Binder.binder = new Binder();
        return Binder.binder;
    }

    parseHTML(nodeStr) {
        let container, docfrag, output, root, special, tags;

        /**
         * Elements that require special handling when
         * not encapsulated in their standard containers:
         */
        const specials = {
            td: {
                container: 'table',
                html: '<tbody><tr class="x_root"></tr></tbody>'
            },
            tr: {
                container: 'table',
                html: '<tbody class="x_root"></tbody>'
            },
            thead: {
                container: 'table',
                html: '<tbody class="x_root"></tbody>'
            },
            caption: {
                container: 'table',
                html: '<tbody class="x_root"></tbody>'
            },
            li: {
                container: 'ul',
            },
            dd: {
                container: 'dl',
            },
            dt: {
                container: 'dl',
            },
            optgroup: {
                container: 'select',
            },
            option: {
                container: 'select',
            }
        };

        // Use native templating where available:
        container = document.createElement('TEMPLATE');

        if (container.content) {
            container.innerHTML = nodeStr;
            output = container.content;
        }
        /**
         * Fallback for Internet Explorer, early editions of Edge,
         * and Android < 4.4:
         */
        else {
            /**
             * See if the template string starts with a "<tag",
             * and check if that tag is one of our specials:
             */
            tags = nodeStr.match(/^\s*<([^>\s]+)/);

            if (tags) {
                special = specials[tags[1].toLowerCase()];

                if (special) {
                    /**
                     * We have a match! Inject the template into an appropriate
                     * container, encapsulated in additional markup if necessary:
                     */
                    container = document.createElement(special.container);

                    if (special.html) {
                        container.innerHTML = special.html;
                        root = container.querySelector('.x_root');
                        root.innerHTML = nodeStr;
                    } else {
                        container.innerHTML = nodeStr;
                        root = container;
                    }
                }
            }

            /**
             * Templates that don't require special handling just
             * get injected into a <DIV>
             */
            if (!root) {
                container = document.createElement('DIV');
                container.innerHTML = nodeStr;
                root = container;
            }

            /**
             * The "root" is the element that contains the DOM
             * represented by the original template string. The "root"
             * element may not be the same as the outer "container".
             * Iterate through the root's child elements, moving them
             * to an empty DocumentFragment instance:
             */
            docfrag = document.createDocumentFragment();
            while (root.firstChild) {
                docfrag.appendChild(root.firstChild);
            }
            output = docfrag;
        }

        return output;
    }

    // compile the HTML with depth-first traversal
    walk(dom, mvvm) {
        let childNodes = dom.childNodes;

        if (childNodes && (childNodes.length !== undefined)) {
            Array.prototype.slice.call(dom.childNodes).forEach((child) => {

                // if node's type is text, then find the double quote and do the binding.
                if (child.nodeType === 3 &&
                    child.textContent &&
                    (~child.textContent.indexOf('{{') &&
                    ~child.textContent.indexOf('}}'))) {
                    let bindName = child.textContent
                        .substring(child.textContent.indexOf('{{') + 2,
                            child.textContent.indexOf('}}'));

                    directives.doubleQuoteVM(bindName, child, mvvm);
                    return child.textContent = mvvm.data[bindName];
                }

                if (child.attributes && child.attributes.length) {
                    Array.prototype.slice.call(child.attributes).forEach((attr) => {
                        // attributes begin with `@` indicate the event binding.
                        if (attr.nodeName.indexOf('@') === 0) {
                            let eventName = String(attr.nodeName).substr(1);
                            return this.addListener(child, eventName,
                                mvvm.options.methods[attr.nodeValue]);
                        }
                        // attributes begin with `:` indicate the attributes' value binding.
                        else if (attr.nodeName.indexOf(':') === 0) {
                            let propName = String(attr.nodeName).substr(1);
                            return directives.propertyVM(attr.nodeValue, child, mvvm, propName);
                        }
                        // `m-model` indicates the two way binding.
                        else if (attr.nodeName === 'm-model') {
                            directives.modelVM(attr.nodeValue, child, mvvm, child.type);
                            // also, we need the the keyUp Event
                            return this.addListener(child, 'input', (e) => {
                                mvvm.data[attr.nodeValue] = e.target.value;
                            });
                        }
                    });
                }

                if (child.childNodes && childNodes.length) {
                    return this.walk(child, mvvm);
                }
            });
        } else {
            throw new Error('parse error!');
        }
    }

    addListener(node, eventName, fn) {
        return node.addEventListener(eventName, throttle(fn.bind(this.mvvm), 200));
    }
}
Binder.binder = null;
