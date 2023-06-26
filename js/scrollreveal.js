function Sequence(interval) {
    var i = Math.abs(interval);
    if (!isNaN(i)) {
        this.id = nextUniqueId();
        this.interval = Math.max(i, 16);
        this.members = [];
        this.models = {};
        this.blocked = {
            head: false,
            foot: false
        };
    } else {
        throw new RangeError('Invalid sequence interval.')
    }
}

function SequenceModel(seq, prop, store) {
    var this$1 = this;

    this.head = [];
    this.body = [];
    this.foot = [];

    each(seq.members, function (id, index) {
        var element = store.elements[id];
        if (element && element[prop]) {
            this$1.body.push(index);
        }
    });

    if (this.body.length) {
        each(seq.members, function (id, index) {
            var element = store.elements[id];
            if (element && !element[prop]) {
                if (index < this$1.body[0]) {
                    this$1.head.push(index);
                } else {
                    this$1.foot.push(index);
                }
            }
        });
    }
}

function cue(seq, i, direction, pristine) {
    var this$1 = this;

    var blocked = ['head', null, 'foot'][1 + direction];
    var nextId = seq.members[i + direction];
    var nextElement = this.store.elements[nextId];

    seq.blocked[blocked] = true;

    setTimeout(function () {
        seq.blocked[blocked] = false;
        if (nextElement) {
            sequence.call(this$1, nextElement, pristine);
        }
    }, seq.interval);
}

function reveal(target, options, syncing) {
    var this$1 = this;
    if ( options === void 0 ) options = {};
    if ( syncing === void 0 ) syncing = false;

    var containerBuffer = [];
    var sequence$$1;
    var interval = options.interval || defaults.interval;

    try {
        if (interval) {
            sequence$$1 = new Sequence(interval);
        }

        var nodes = tealight(target);
        if (!nodes.length) {
            throw new Error('Invalid reveal target.')
        }

        var elements = nodes.reduce(function (elementBuffer, elementNode) {
            var element = {};
            var existingId = elementNode.getAttribute('data-sr-id');

            if (existingId) {
                deepAssign(element, this$1.store.elements[existingId]);

                /**
                 * In order to prevent previously generated styles
                 * from throwing off the new styles, the style tag
                 * has to be reverted to its pre-reveal state.
                 */
                applyStyle(element.node, element.styles.inline.computed);
            } else {
                element.id = nextUniqueId();
                element.node = elementNode;
                element.seen = false;
                element.revealed = false;
                element.visible = false;
            }

            var config = deepAssign({}, element.config || this$1.defaults, options);

            if ((!config.mobile && isMobile()) || (!config.desktop && !isMobile())) {
                if (existingId) {
                    clean.call(this$1, element);
                }
                return elementBuffer // skip elements that are disabled
            }

            var containerNode = tealight(config.container)[0];
            if (!containerNode) {
                throw new Error('Invalid container.')
            }
            if (!containerNode.contains(elementNode)) {
                return elementBuffer // skip elements found outside the container
            }

            var containerId;
            {
                containerId = getContainerId(
                    containerNode,
                    containerBuffer,
                    this$1.store.containers
                );
                if (containerId === null) {
                    containerId = nextUniqueId();
                    containerBuffer.push({ id: containerId, node: containerNode });
                }
            }

            element.config = config;
            element.containerId = containerId;
            element.styles = style(element);

            if (sequence$$1) {
                element.sequence = {
                    id: sequence$$1.id,
                    index: sequence$$1.members.length
                };
                sequence$$1.members.push(element.id);
            }

            elementBuffer.push(element);
            return elementBuffer
        }, []);

        /**
         * Modifying the DOM via setAttribute needs to be handled
         * separately from reading computed styles in the map above
         * for the browser to batch DOM changes (limiting reflows)
         */
        each(elements, function (element) {
            this$1.store.elements[element.id] = element;
            element.node.setAttribute('data-sr-id', element.id);
        });
    } catch (e) {
        return logger.call(this, 'Reveal failed.', e.message)
    }

    /**
     * Now that element set-up is complete...
     * Let’s commit any container and sequence data we have to the store.
     */
    each(containerBuffer, function (container) {
        this$1.store.containers[container.id] = {
            id: container.id,
            node: container.node
        };
    });
    if (sequence$$1) {
        this.store.sequences[sequence$$1.id] = sequence$$1;
    }

    /**
     * If reveal wasn't invoked by sync, we want to
     * make sure to add this call to the history.
     */
    if (syncing !== true) {
        this.store.history.push({ target: target, options: options });

        /**
         * Push initialization to the event queue, giving
         * multiple reveal calls time to be interpreted.
         */
        if (this.initTimeout) {
            window.clearTimeout(this.initTimeout);
        }
        this.initTimeout = window.setTimeout(initialize.bind(this), 0);
    }
}

function getContainerId(node) {
    var collections = [], len = arguments.length - 1;
    while ( len-- > 0 ) collections[ len ] = arguments[ len + 1 ];

    var id = null;
    each(collections, function (collection) {
        each(collection, function (container) {
            if (id === null && container.node === node) {
                id = container.id;
            }
        });
    });
    return id
}

/**
 * Re-runs the reveal method for each record stored in history,
 * for capturing new content asynchronously loaded into the DOM.
 */
function sync() {
    var this$1 = this;

    each(this.store.history, function (record) {
        reveal.call(this$1, record.target, record.options, true);
    });

    initialize.call(this);
}

var polyfill = function (x) { return (x > 0) - (x < 0) || +x; };
var mathSign = Math.sign || polyfill;

/*! @license miniraf v1.0.1

  Copyright 2018 Fisssion LLC.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

*/
var polyfill$1 = (function () {
    var clock = Date.now();

    return function (callback) {
        var currentTime = Date.now();
        if (currentTime - clock > 16) {
            clock = currentTime;
            callback(currentTime);
        } else {
            setTimeout(function () { return polyfill$1(callback); }, 0);
        }
    }
})();

var miniraf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    polyfill$1;

function getGeometry(target, isContainer) {
    /**
     * We want to ignore padding and scrollbars for container elements.
     * More information here: https://goo.gl/vOZpbz
     */
    var height = isContainer ? target.node.clientHeight : target.node.offsetHeight;
    var width = isContainer ? target.node.clientWidth : target.node.offsetWidth;

    var offsetTop = 0;
    var offsetLeft = 0;
    var node = target.node;

    do {
        if (!isNaN(node.offsetTop)) {
            offsetTop += node.offsetTop;
        }
        if (!isNaN(node.offsetLeft)) {
            offsetLeft += node.offsetLeft;
        }
        node = node.offsetParent;
    } while (node)

    return {
        bounds: {
            top: offsetTop,
            right: offsetLeft + width,
            bottom: offsetTop + height,
            left: offsetLeft
        },
        height: height,
        width: width
    }
}

function getScrolled(container) {
    var top, left;
    if (container.node === document.documentElement) {
        top = window.pageYOffset;
        left = window.pageXOffset;
    } else {
        top = container.node.scrollTop;
        left = container.node.scrollLeft;
    }
    return { top: top, left: left }
}

function isElementVisible(element) {
    if ( element === void 0 ) element = {};

    var container = this.store.containers[element.containerId];
    if (!container) { return }

    var viewFactor = Math.max(0, Math.min(1, element.config.viewFactor));
    var viewOffset = element.config.viewOffset;

    var elementBounds = {
        top: element.geometry.bounds.top + element.geometry.height * viewFactor,
        right: element.geometry.bounds.right - element.geometry.width * viewFactor,
        bottom: element.geometry.bounds.bottom - element.geometry.height * viewFactor,
        left: element.geometry.bounds.left + element.geometry.width * viewFactor
    };

    var containerBounds = {
        top: container.geometry.bounds.top + container.scroll.top + viewOffset.top,
        right: container.geometry.bounds.right + container.scroll.left - viewOffset.right,
        bottom:
            container.geometry.bounds.bottom + container.scroll.top - viewOffset.bottom,
        left: container.geometry.bounds.left + container.scroll.left + viewOffset.left
    };

    return (
        (elementBounds.top < containerBounds.bottom &&
            elementBounds.right > containerBounds.left &&
            elementBounds.bottom > containerBounds.top &&
            elementBounds.left < containerBounds.right) ||
        element.styles.position === 'fixed'
    )
}

function delegate(
    event,
    elements
) {
    var this$1 = this;
    if ( event === void 0 ) event = { type: 'init' };
    if ( elements === void 0 ) elements = this.store.elements;

    miniraf(function () {
        var stale = event.type === 'init' || event.type === 'resize';

        each(this$1.store.containers, function (container) {
            if (stale) {
                container.geometry = getGeometry.call(this$1, container, true);
            }
            var scroll = getScrolled.call(this$1, container);
            if (container.scroll) {
                container.direction = {
                    x: mathSign(scroll.left - container.scroll.left),
                    y: mathSign(scroll.top - container.scroll.top)
                };
            }
            container.scroll = scroll;
        });

        /**
         * Due to how the sequencer is implemented, it’s
         * important that we update the state of all
         * elements, before any animation logic is
         * evaluated (in the second loop below).
         */
        each(elements, function (element) {
            if (stale || element.geometry === undefined) {
                element.geometry = getGeometry.call(this$1, element);
            }
            element.visible = isElementVisible.call(this$1, element);
        });

        each(elements, function (element) {
            if (element.sequence) {
                sequence.call(this$1, element);
            } else {
                animate.call(this$1, element);
            }
        });

        this$1.pristine = false;
    });
}

function isTransformSupported() {
    var style = document.documentElement.style;
    return 'transform' in style || 'WebkitTransform' in style
}

function isTransitionSupported() {
    var style = document.documentElement.style;
    return 'transition' in style || 'WebkitTransition' in style
}

var version = "4.0.9";

var boundDelegate;
var boundDestroy;
var boundReveal;
var boundClean;
var boundSync;
var config;
var debug;
var instance;

function ScrollReveal(options) {
    if ( options === void 0 ) options = {};

    var invokedWithoutNew =
        typeof this === 'undefined' ||
        Object.getPrototypeOf(this) !== ScrollReveal.prototype;

    if (invokedWithoutNew) {
        return new ScrollReveal(options)
    }

    if (!ScrollReveal.isSupported()) {
        logger.call(this, 'Instantiation failed.', 'This browser is not supported.');
        return mount.failure()
    }

    var buffer;
    try {
        buffer = config
            ? deepAssign({}, config, options)
            : deepAssign({}, defaults, options);
    } catch (e) {
        logger.call(this, 'Invalid configuration.', e.message);
        return mount.failure()
    }

    try {
        var container = tealight(buffer.container)[0];
        if (!container) {
            throw new Error('Invalid container.')
        }
    } catch (e) {
        logger.call(this, e.message);
        return mount.failure()
    }

    config = buffer;

    if ((!config.mobile && isMobile()) || (!config.desktop && !isMobile())) {
        logger.call(
            this,
            'This device is disabled.',
            ("desktop: " + (config.desktop)),
            ("mobile: " + (config.mobile))
        );
        return mount.failure()
    }

    mount.success();

    this.store = {
        containers: {},
        elements: {},
        history: [],
        sequences: {}
    };

    this.pristine = true;

    boundDelegate = boundDelegate || delegate.bind(this);
    boundDestroy = boundDestroy || destroy.bind(this);
    boundReveal = boundReveal || reveal.bind(this);
    boundClean = boundClean || clean.bind(this);
    boundSync = boundSync || sync.bind(this);

    Object.defineProperty(this, 'delegate', { get: function () { return boundDelegate; } });
    Object.defineProperty(this, 'destroy', { get: function () { return boundDestroy; } });
    Object.defineProperty(this, 'reveal', { get: function () { return boundReveal; } });
    Object.defineProperty(this, 'clean', { get: function () { return boundClean; } });
    Object.defineProperty(this, 'sync', { get: function () { return boundSync; } });

    Object.defineProperty(this, 'defaults', { get: function () { return config; } });
    Object.defineProperty(this, 'version', { get: function () { return version; } });
    Object.defineProperty(this, 'noop', { get: function () { return false; } });

    return instance ? instance : (instance = this)
}

ScrollReveal.isSupported = function () { return isTransformSupported() && isTransitionSupported(); };

Object.defineProperty(ScrollReveal, 'debug', {
    get: function () { return debug || false; },
    set: function (value) { return (debug = typeof value === 'boolean' ? value : debug); }
});

ScrollReveal();

return ScrollReveal;

}));