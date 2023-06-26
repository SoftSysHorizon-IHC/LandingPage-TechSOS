/*! @license ScrollReveal v4.0.9

    Copyright 2021 Fisssion LLC.

    Licensed under the GNU General Public License 3.0 for
    compatible open source projects and non-commercial use.

    For commercial sites, themes, projects, and applications,
    keep your source code private/proprietary by purchasing
    a commercial license from https://scrollrevealjs.org/
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.ScrollReveal = factory());
}(this, function () { 'use strict';

    var defaults = {
        delay: 0,
        distance: '0',
        duration: 600,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
        interval: 0,
        opacity: 0,
        origin: 'bottom',
        rotate: {
            x: 0,
            y: 0,
            z: 0
        },
        scale: 1,
        cleanup: false,
        container: document.documentElement,
        desktop: true,
        mobile: true,
        reset: false,
        useDelay: 'always',
        viewFactor: 0.0,
        viewOffset: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        },
        afterReset: function afterReset() {},
        afterReveal: function afterReveal() {},
        beforeReset: function beforeReset() {},
        beforeReveal: function beforeReveal() {}
    };

    function failure() {
        document.documentElement.classList.remove('sr');

        return {
            clean: function clean() {},
            destroy: function destroy() {},
            reveal: function reveal() {},
            sync: function sync() {},
            get noop() {
                return true
            }
        }
    }

    function success() {
        document.documentElement.classList.add('sr');

        if (document.body) {
            document.body.style.height = '100%';
        } else {
            document.addEventListener('DOMContentLoaded', function () {
                document.body.style.height = '100%';
            });
        }
    }

    var mount = { success: success, failure: failure };

    /*! @license is-dom-node v1.0.4

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
    function isDomNode(x) {
        return typeof window.Node === 'object'
            ? x instanceof window.Node
            : x !== null &&
                    typeof x === 'object' &&
                    typeof x.nodeType === 'number' &&
                    typeof x.nodeName === 'string'
    }

    /*! @license is-dom-node-list v1.2.1

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

    function isDomNodeList(x) {
        var prototypeToString = Object.prototype.toString.call(x);
        var regex = /^\[object (HTMLCollection|NodeList|Object)\]$/;

        return typeof window.NodeList === 'object'
            ? x instanceof window.NodeList
            : x !== null &&
                    typeof x === 'object' &&
                    typeof x.length === 'number' &&
                    regex.test(prototypeToString) &&
                    (x.length === 0 || isDomNode(x[0]))
    }

    /*! @license Tealight v0.3.6

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

    function tealight(target, context) {
      if ( context === void 0 ) { context = document; }

      if (target instanceof Array) { return target.filter(isDomNode); }
      if (isDomNode(target)) { return [target]; }
      if (isDomNodeList(target)) { return Array.prototype.slice.call(target); }
      if (typeof target === "string") {
        try {
          var query = context.querySelectorAll(target);
          return Array.prototype.slice.call(query);
        } catch (err) {
          return [];
        }
      }
      return [];
    }

    function isObject(x) {
        return (
            x !== null &&
            x instanceof Object &&
            (x.constructor === Object ||
                Object.prototype.toString.call(x) === '[object Object]')
        )
    }

    function each(collection, callback) {
        if (isObject(collection)) {
            var keys = Object.keys(collection);
            return keys.forEach(function (key) { return callback(collection[key], key, collection); })
        }
        if (collection instanceof Array) {
            return collection.forEach(function (item, i) { return callback(item, i, collection); })
        }
        throw new TypeError('Expected either an array or object literal.')
    }

    function logger(message) {
        var details = [], len = arguments.length - 1;
        while ( len-- > 0 ) details[ len ] = arguments[ len + 1 ];

        if (this.constructor.debug && console) {
            var report = "%cScrollReveal: " + message;
            details.forEach(function (detail) { return (report += "\n — " + detail); });
            console.log(report, 'color: #ea654b;'); // eslint-disable-line no-console
        }
    }

    function rinse() {
        var this$1 = this;

        var struct = function () { return ({
            active: [],
            stale: []
        }); };

        var elementIds = struct();
        var sequenceIds = struct();
        var containerIds = struct();

        /**
         * Take stock of active element IDs.
         */
        try {
            each(tealight('[data-sr-id]'), function (node) {
                var id = parseInt(node.getAttribute('data-sr-id'));
                elementIds.active.push(id);
            });
        } catch (e) {
            throw e
        }
        /**
         * Destroy stale elements.
         */
        each(this.store.elements, function (element) {
            if (elementIds.active.indexOf(element.id) === -1) {
                elementIds.stale.push(element.id);
            }
        });

        each(elementIds.stale, function (staleId) { return delete this$1.store.elements[staleId]; });

        /**
         * Take stock of active container and sequence IDs.
         */
        each(this.store.elements, function (element) {
            if (containerIds.active.indexOf(element.containerId) === -1) {
                containerIds.active.push(element.containerId);
            }
            if (element.hasOwnProperty('sequence')) {
                if (sequenceIds.active.indexOf(element.sequence.id) === -1) {
                    sequenceIds.active.push(element.sequence.id);
                }
            }
        });

        /**
         * Destroy stale containers.
         */
        each(this.store.containers, function (container) {
            if (containerIds.active.indexOf(container.id) === -1) {
                containerIds.stale.push(container.id);
            }
        });

        each(containerIds.stale, function (staleId) {
            var stale = this$1.store.containers[staleId].node;
            stale.removeEventListener('scroll', this$1.delegate);
            stale.removeEventListener('resize', this$1.delegate);
            delete this$1.store.containers[staleId];
        });

        /**
         * Destroy stale sequences.
         */
        each(this.store.sequences, function (sequence) {
            if (sequenceIds.active.indexOf(sequence.id) === -1) {
                sequenceIds.stale.push(sequence.id);
            }
        });

        each(sequenceIds.stale, function (staleId) { return delete this$1.store.sequences[staleId]; });
    }

/*! @license Rematrix v0.3.0

        Copyright 2018 Julian Lloyd.

        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in
        all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        THE SOFTWARE.
    */
    /**
     * @module Rematrix
     */

    /**
     * Transformation matrices in the browser come in two flavors:
     *
     *  - `matrix` using 6 values (short)
     *  - `matrix3d` using 16 values (long)
     *
     * This utility follows this [conversion guide](https://goo.gl/EJlUQ1)
     * to expand short form matrices to their equivalent long form.
     *
     * @param  {array} source - Accepts both short and long form matrices.
     * @return {array}
     */
    function format(source) {
        if (source.constructor !== Array) {
            throw new TypeError('Expected array.')
        }
        if (source.length === 16) {
            return source
        }
        if (source.length === 6) {
            var matrix = identity();
            matrix[0] = source[0];
            matrix[1] = source[1];
            matrix[4] = source[2];
            matrix[5] = source[3];
            matrix[12] = source[4];
            matrix[13] = source[5];
            return matrix
        }
        throw new RangeError('Expected array with either 6 or 16 values.')
    }

    /**
     * Returns a matrix representing no transformation. The product of any matrix
     * multiplied by the identity matrix will be the original matrix.
     *
     * > **Tip:** Similar to how `5 * 1 === 5`, where `1` is the identity.
     *
     * @return {array}
     */
    function identity() {
        var matrix = [];
        for (var i = 0; i < 16; i++) {
            i % 5 == 0 ? matrix.push(1) : matrix.push(0);
        }
        return matrix
    }

    /**
     * Returns a 4x4 matrix describing the combined transformations
     * of both arguments.
     *
     * > **Note:** Order is very important. For example, rotating 45°
     * along the Z-axis, followed by translating 500 pixels along the
     * Y-axis... is not the same as translating 500 pixels along the
     * Y-axis, followed by rotating 45° along on the Z-axis.
     *
     * @param  {array} m - Accepts both short and long form matrices.
     * @param  {array} x - Accepts both short and long form matrices.
     * @return {array}
     */
    function multiply(m, x) {
        var fm = format(m);
        var fx = format(x);
        var product = [];

        for (var i = 0; i < 4; i++) {
            var row = [fm[i], fm[i + 4], fm[i + 8], fm[i + 12]];
            for (var j = 0; j < 4; j++) {
                var k = j * 4;
                var col = [fx[k], fx[k + 1], fx[k + 2], fx[k + 3]];
                var result =
                    row[0] * col[0] + row[1] * col[1] + row[2] * col[2] + row[3] * col[3];

                product[i + k] = result;
            }
        }

        return product
    }

    /**
     * Attempts to return a 4x4 matrix describing the CSS transform
     * matrix passed in, but will return the identity matrix as a
     * fallback.
     *
     * > **Tip:** This method is used to convert a CSS matrix (retrieved as a
     * `string` from computed styles) to its equivalent array format.
     *
     * @param  {string} source - `matrix` or `matrix3d` CSS Transform value.
     * @return {array}
     */
    function parse(source) {
        if (typeof source === 'string') {
            var match = source.match(/matrix(3d)?\(([^)]+)\)/);
            if (match) {
                var raw = match[2].split(', ').map(parseFloat);
                return format(raw)
            }
        }
        return identity()
    }

    /**
     * Returns a 4x4 matrix describing X-axis rotation.
     *
     * @param  {number} angle - Measured in degrees.
     * @return {array}
     */
    function rotateX(angle) {
        var theta = Math.PI / 180 * angle;
        var matrix = identity();

        matrix[5] = matrix[10] = Math.cos(theta);
        matrix[6] = matrix[9] = Math.sin(theta);
        matrix[9] *= -1;

        return matrix
    }

    /**
     * Returns a 4x4 matrix describing Y-axis rotation.
     *
     * @param  {number} angle - Measured in degrees.
     * @return {array}
     */
    function rotateY(angle) {
        var theta = Math.PI / 180 * angle;
        var matrix = identity();

        matrix[0] = matrix[10] = Math.cos(theta);
        matrix[2] = matrix[8] = Math.sin(theta);
        matrix[2] *= -1;

        return matrix
    }

    /**
     * Returns a 4x4 matrix describing Z-axis rotation.
     *
     * @param  {number} angle - Measured in degrees.
     * @return {array}
     */
    function rotateZ(angle) {
        var theta = Math.PI / 180 * angle;
        var matrix = identity();

        matrix[0] = matrix[5] = Math.cos(theta);
        matrix[1] = matrix[4] = Math.sin(theta);
        matrix[4] *= -1;

        return matrix
    }

    /**
     * Returns a 4x4 matrix describing 2D scaling. The first argument
     * is used for both X and Y-axis scaling, unless an optional
     * second argument is provided to explicitly define Y-axis scaling.
     *
     * @param  {number} scalar    - Decimal multiplier.
     * @param  {number} [scalarY] - Decimal multiplier.
     * @return {array}
     */
    function scale(scalar, scalarY) {
        var matrix = identity();

        matrix[0] = scalar;
        matrix[5] = typeof scalarY === 'number' ? scalarY : scalar;

        return matrix
    }

    /**
     * Returns a 4x4 matrix describing X-axis translation.
     *
     * @param  {number} distance - Measured in pixels.
     * @return {array}
     */
    function translateX(distance) {
        var matrix = identity();
        matrix[12] = distance;
        return matrix
    }

                     
