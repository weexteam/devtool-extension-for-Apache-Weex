/**
 * Created by godsong on 16/6/29.
 */
function EventContext(host) {
    this.host = host;
    this._propagable = true;
    this._preventDefault = false;
}
EventContext.prototype = {
    constructor: EventContext,
    stopPropagation: function () {
        this._propagable = false;
    },
    preventDefault: function () {
        this._preventDefault = true;
    }

};
function _mergeConfig(defaultConfig, userConfig) {
    var config = {};
    for (var k in defaultConfig) {
        if (defaultConfig.hasOwnProperty(k)) {
            config[k] = userConfig && userConfig[k] !== undefined ? userConfig[k] : defaultConfig[k];
        }
    }
    return config;
}
function EventEmitter(config) {
    this._handlers = {};
    this.config = _mergeConfig({
        cache: false
    }, config);
    this._emitCaches = [];
}
EventEmitter.prototype = {
    constructor: EventEmitter,
    off: function (method, handler) {
        if (handler) {
            for (var i = 0; i < this._handlers[method].length; i++) {
                if (this._handlers[method][i] === handler) {
                    spliceOne(this._handlers[method], i);
                    break;
                }
            }
        }
        else if (method) {
            this._handlers[method] = [];
        }
        else {
            this._handlers = {};
        }
    },
    once: function (method, handler) {
        var self = this;
        var fired = false;

        function g() {
            self.off(method, g);
            if (!fired) {
                fired = true;
                _fastApply(handler, this, Array.prototype.slice.call(arguments))
            }
        }

        this.on(method, g);
    },
    on: function (method, handler, index) {
        if (this._handlers[method]) {
            if (isFinite(index)) {
                this._handlers.splice(index, 0, handler);
            }
            else {
                this._handlers[method].push(handler);
            }
        }
        else {
            this._handlers[method] = [handler];
        }
        if (this._emitCaches[method] && this._emitCaches[method].length > 0) {
            var self = this;
            setTimeout(function () {
                let emitValue;
                while (emitValue = self._emitCaches[method].shift()) {
                    self._emit(method, emitValue, new EventContext(self));
                }
            });
        }
    },
    _emit: function (method, args, context) {
        var handlers = this._handlers[method];
        if (handlers && handlers.length > 0) {
            var copiedHandlers = handlers.concat();
            copiedHandlers.forEach(function (handler) {
                _fastApply(handler, context, args)
            });
            return true;
        }
        else {
            return false;
        }
    },
    _emitNamespace: function (ns, mode, args, context) {
        if (ns.length > 1) {
            if (!this._emit(ns.join('.') + '.' + mode, args, context)) {
                return this._emitNamespace(ns.slice(0, -1), mode, args, context);
            }
            else {
                return true;
            }
        }
        else {
            return this._emit(mode, args, context);
        }
    },
    emit: function (method) {
        var context = new EventContext(this);
        var args = Array.prototype.slice.call(arguments, 1);
        var ns = method.split('.');
        var notEmpty = false;
        if (!this._emit(method, args, context)) {
            notEmpty = this._emitNamespace(ns, '*', args, context)
        }
        notEmpty = this._emitNamespace(ns, '+', args, context);
        if (!notEmpty && this.config.cache) {
            (this._emitCaches[method] || (this._emitCaches[method] = [])).push(args);
        }
        return context;
    }
};

function _fastApply(func, that, args) {
    args = args || [];
    switch (args.length) {
        case 0:
            return func.call(that);
        case 1:
            return func.call(that, args[0]);
        case 2:
            return func.call(that, args[0], args[1]);
        case 3:
            return func.call(that, args[0], args[1], args[2]);
        case 4:
            return func.call(that, args[0], args[1], args[2], args[3])
        default:
            return func.apply(that, args);
    }
}
// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
    for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
        list[i] = list[k];
    list.pop();
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventEmitter;
}