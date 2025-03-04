"use strict";
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // js/view.js
  async function load(views) {
    let fetching_progress = /* @__PURE__ */ new Map();
    views.forEach(function(v) {
      fetching_progress.set(v.name, fetch(`views/${v.name}.html`));
    });
    for (let [k, v] of fetching_progress) {
      let resolved = await v;
      if (!resolved.ok) {
        return false;
      }
      let htm = await resolved.text();
      let div_container = document.createElement("div");
      div_container.id = k;
      div_container.innerHTML = htm;
      let scripts = div_container.querySelectorAll(`script`);
      scripts.forEach(function(v2) {
        let script_elm = document.createElement("script");
        script_elm.src = v2.src;
        v2.parentElement?.appendChild(script_elm);
      });
      HIDDEN_VIEWS.appendChild(div_container);
    }
    views.forEach(function(v) {
      v.on_loaded();
    });
    return true;
  }
  function show_view(view_id) {
    let view_html_elm = document.getElementById(view_id);
    if (!view_html_elm) {
      return;
    }
    if (current_view) {
      HIDDEN_VIEWS.appendChild(current_view);
    }
    APP_VIEWPORT.appendChild(view_html_elm);
    current_view = view_html_elm;
  }
  var HIDDEN_VIEWS, APP_VIEWPORT, current_view, View;
  var init_view = __esm({
    "js/view.js"() {
      "use strict";
      HIDDEN_VIEWS = document.getElementById("hidden_views");
      APP_VIEWPORT = document.getElementById("app-viewport");
      View = class {
        name = "";
        on_loaded = function() {
          return;
        };
        constructor(name, on_loaded) {
          this.name = name;
          this.on_loaded = on_loaded;
        }
      };
    }
  });

  // js/pages/about.js
  var about_app;
  var init_about = __esm({
    "js/pages/about.js"() {
      "use strict";
      init_view();
      about_app = new View("about", function() {
        console.log("hello!");
        const ABOUT_ME_CLOCK = document.getElementById("clock-time");
        function clock() {
          let current_date = /* @__PURE__ */ new Date();
          ABOUT_ME_CLOCK.innerHTML = current_date.toLocaleTimeString([], { timeZone: "America/Edmonton" });
        }
        clock();
        setInterval(clock, 1e3);
      });
    }
  });

  // js/pages/home.js
  function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }
  var home_app;
  var init_home = __esm({
    "js/pages/home.js"() {
      "use strict";
      init_view();
      home_app = new View("home", function() {
        let images = document.querySelectorAll("#app-home img");
        let index = 1;
        images.forEach(function(element) {
          let mult = 1;
          if (index % 2 == 0) {
            mult = -1;
          }
          element.style.rotate = `${mult * getRandomInt(5, 45)}deg`;
          index++;
        });
        console.log("hello!");
      });
    }
  });

  // js/pages/photos.js
  var FLICKR_EMBED, photos_app;
  var init_photos = __esm({
    "js/pages/photos.js"() {
      "use strict";
      init_view();
      FLICKR_EMBED = "https://embedr.flickr.com/photostreams/201447169@N04?width=640&height=480&secret=7a1d29c242&header=true&footer=true";
      photos_app = new View("photos", function() {
        console.log("hello!");
        let app_photos = document.getElementById("app-photos");
        fetch(FLICKR_EMBED).then(function(response) {
          return response.text();
        }).then(function(text) {
          app_photos.innerHTML = text;
          let scripts = app_photos.querySelectorAll(`script`);
          scripts.forEach(function(v) {
            let script_elm = document.createElement("script");
            if (v.textContent?.match("addview")) {
              return;
            }
            script_elm.textContent = v.textContent;
            v.parentElement?.appendChild(script_elm);
          });
        });
      });
    }
  });

  // js/topbar.js
  function highlight_toggle(element) {
    if (selected_elm) {
      selected_elm.classList.remove("topbar-selected");
    }
    element.classList.add("topbar-selected");
    selected_elm = element;
  }
  function init_topbar2() {
    let topbar_hyperlink = document.querySelectorAll("a");
    topbar_hyperlink.forEach(function(elm) {
      elm.onclick = function(evt) {
        evt.preventDefault();
        highlight_toggle(elm);
        show_view(elm.getAttribute("href"));
      };
    });
  }
  var selected_elm;
  var init_topbar = __esm({
    "js/topbar.js"() {
      "use strict";
      init_view();
      selected_elm = null;
    }
  });

  // ../../../node_modules/@tweenjs/tween.js/dist/tween.esm.js
  var Easing, now, Group, Interpolation, Sequence, mainGroup, Tween, nextId, TWEEN, getAll, removeAll, add, remove, update;
  var init_tween_esm = __esm({
    "../../../node_modules/@tweenjs/tween.js/dist/tween.esm.js"() {
      Easing = Object.freeze({
        Linear: Object.freeze({
          None: function(amount) {
            return amount;
          },
          In: function(amount) {
            return amount;
          },
          Out: function(amount) {
            return amount;
          },
          InOut: function(amount) {
            return amount;
          }
        }),
        Quadratic: Object.freeze({
          In: function(amount) {
            return amount * amount;
          },
          Out: function(amount) {
            return amount * (2 - amount);
          },
          InOut: function(amount) {
            if ((amount *= 2) < 1) {
              return 0.5 * amount * amount;
            }
            return -0.5 * (--amount * (amount - 2) - 1);
          }
        }),
        Cubic: Object.freeze({
          In: function(amount) {
            return amount * amount * amount;
          },
          Out: function(amount) {
            return --amount * amount * amount + 1;
          },
          InOut: function(amount) {
            if ((amount *= 2) < 1) {
              return 0.5 * amount * amount * amount;
            }
            return 0.5 * ((amount -= 2) * amount * amount + 2);
          }
        }),
        Quartic: Object.freeze({
          In: function(amount) {
            return amount * amount * amount * amount;
          },
          Out: function(amount) {
            return 1 - --amount * amount * amount * amount;
          },
          InOut: function(amount) {
            if ((amount *= 2) < 1) {
              return 0.5 * amount * amount * amount * amount;
            }
            return -0.5 * ((amount -= 2) * amount * amount * amount - 2);
          }
        }),
        Quintic: Object.freeze({
          In: function(amount) {
            return amount * amount * amount * amount * amount;
          },
          Out: function(amount) {
            return --amount * amount * amount * amount * amount + 1;
          },
          InOut: function(amount) {
            if ((amount *= 2) < 1) {
              return 0.5 * amount * amount * amount * amount * amount;
            }
            return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2);
          }
        }),
        Sinusoidal: Object.freeze({
          In: function(amount) {
            return 1 - Math.sin((1 - amount) * Math.PI / 2);
          },
          Out: function(amount) {
            return Math.sin(amount * Math.PI / 2);
          },
          InOut: function(amount) {
            return 0.5 * (1 - Math.sin(Math.PI * (0.5 - amount)));
          }
        }),
        Exponential: Object.freeze({
          In: function(amount) {
            return amount === 0 ? 0 : Math.pow(1024, amount - 1);
          },
          Out: function(amount) {
            return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount);
          },
          InOut: function(amount) {
            if (amount === 0) {
              return 0;
            }
            if (amount === 1) {
              return 1;
            }
            if ((amount *= 2) < 1) {
              return 0.5 * Math.pow(1024, amount - 1);
            }
            return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2);
          }
        }),
        Circular: Object.freeze({
          In: function(amount) {
            return 1 - Math.sqrt(1 - amount * amount);
          },
          Out: function(amount) {
            return Math.sqrt(1 - --amount * amount);
          },
          InOut: function(amount) {
            if ((amount *= 2) < 1) {
              return -0.5 * (Math.sqrt(1 - amount * amount) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1);
          }
        }),
        Elastic: Object.freeze({
          In: function(amount) {
            if (amount === 0) {
              return 0;
            }
            if (amount === 1) {
              return 1;
            }
            return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
          },
          Out: function(amount) {
            if (amount === 0) {
              return 0;
            }
            if (amount === 1) {
              return 1;
            }
            return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1;
          },
          InOut: function(amount) {
            if (amount === 0) {
              return 0;
            }
            if (amount === 1) {
              return 1;
            }
            amount *= 2;
            if (amount < 1) {
              return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI);
            }
            return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1;
          }
        }),
        Back: Object.freeze({
          In: function(amount) {
            var s = 1.70158;
            return amount === 1 ? 1 : amount * amount * ((s + 1) * amount - s);
          },
          Out: function(amount) {
            var s = 1.70158;
            return amount === 0 ? 0 : --amount * amount * ((s + 1) * amount + s) + 1;
          },
          InOut: function(amount) {
            var s = 1.70158 * 1.525;
            if ((amount *= 2) < 1) {
              return 0.5 * (amount * amount * ((s + 1) * amount - s));
            }
            return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2);
          }
        }),
        Bounce: Object.freeze({
          In: function(amount) {
            return 1 - Easing.Bounce.Out(1 - amount);
          },
          Out: function(amount) {
            if (amount < 1 / 2.75) {
              return 7.5625 * amount * amount;
            } else if (amount < 2 / 2.75) {
              return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75;
            } else if (amount < 2.5 / 2.75) {
              return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375;
            } else {
              return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375;
            }
          },
          InOut: function(amount) {
            if (amount < 0.5) {
              return Easing.Bounce.In(amount * 2) * 0.5;
            }
            return Easing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5;
          }
        }),
        generatePow: function(power) {
          if (power === void 0) {
            power = 4;
          }
          power = power < Number.EPSILON ? Number.EPSILON : power;
          power = power > 1e4 ? 1e4 : power;
          return {
            In: function(amount) {
              return Math.pow(amount, power);
            },
            Out: function(amount) {
              return 1 - Math.pow(1 - amount, power);
            },
            InOut: function(amount) {
              if (amount < 0.5) {
                return Math.pow(amount * 2, power) / 2;
              }
              return (1 - Math.pow(2 - amount * 2, power)) / 2 + 0.5;
            }
          };
        }
      });
      now = function() {
        return performance.now();
      };
      Group = /** @class */
      function() {
        function Group2() {
          var tweens = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            tweens[_i] = arguments[_i];
          }
          this._tweens = {};
          this._tweensAddedDuringUpdate = {};
          this.add.apply(this, tweens);
        }
        Group2.prototype.getAll = function() {
          var _this = this;
          return Object.keys(this._tweens).map(function(tweenId) {
            return _this._tweens[tweenId];
          });
        };
        Group2.prototype.removeAll = function() {
          this._tweens = {};
        };
        Group2.prototype.add = function() {
          var _a;
          var tweens = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            tweens[_i] = arguments[_i];
          }
          for (var _b = 0, tweens_1 = tweens; _b < tweens_1.length; _b++) {
            var tween = tweens_1[_b];
            (_a = tween._group) === null || _a === void 0 ? void 0 : _a.remove(tween);
            tween._group = this;
            this._tweens[tween.getId()] = tween;
            this._tweensAddedDuringUpdate[tween.getId()] = tween;
          }
        };
        Group2.prototype.remove = function() {
          var tweens = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            tweens[_i] = arguments[_i];
          }
          for (var _a = 0, tweens_2 = tweens; _a < tweens_2.length; _a++) {
            var tween = tweens_2[_a];
            tween._group = void 0;
            delete this._tweens[tween.getId()];
            delete this._tweensAddedDuringUpdate[tween.getId()];
          }
        };
        Group2.prototype.allStopped = function() {
          return this.getAll().every(function(tween) {
            return !tween.isPlaying();
          });
        };
        Group2.prototype.update = function(time, preserve) {
          if (time === void 0) {
            time = now();
          }
          if (preserve === void 0) {
            preserve = true;
          }
          var tweenIds = Object.keys(this._tweens);
          if (tweenIds.length === 0)
            return;
          while (tweenIds.length > 0) {
            this._tweensAddedDuringUpdate = {};
            for (var i = 0; i < tweenIds.length; i++) {
              var tween = this._tweens[tweenIds[i]];
              var autoStart = !preserve;
              if (tween && tween.update(time, autoStart) === false && !preserve)
                this.remove(tween);
            }
            tweenIds = Object.keys(this._tweensAddedDuringUpdate);
          }
        };
        return Group2;
      }();
      Interpolation = {
        Linear: function(v, k) {
          var m = v.length - 1;
          var f = m * k;
          var i = Math.floor(f);
          var fn = Interpolation.Utils.Linear;
          if (k < 0) {
            return fn(v[0], v[1], f);
          }
          if (k > 1) {
            return fn(v[m], v[m - 1], m - f);
          }
          return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
        },
        Bezier: function(v, k) {
          var b = 0;
          var n = v.length - 1;
          var pw = Math.pow;
          var bn = Interpolation.Utils.Bernstein;
          for (var i = 0; i <= n; i++) {
            b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
          }
          return b;
        },
        CatmullRom: function(v, k) {
          var m = v.length - 1;
          var f = m * k;
          var i = Math.floor(f);
          var fn = Interpolation.Utils.CatmullRom;
          if (v[0] === v[m]) {
            if (k < 0) {
              i = Math.floor(f = m * (1 + k));
            }
            return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);
          } else {
            if (k < 0) {
              return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
            }
            if (k > 1) {
              return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
            }
            return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);
          }
        },
        Utils: {
          Linear: function(p0, p1, t) {
            return (p1 - p0) * t + p0;
          },
          Bernstein: function(n, i) {
            var fc = Interpolation.Utils.Factorial;
            return fc(n) / fc(i) / fc(n - i);
          },
          Factorial: /* @__PURE__ */ function() {
            var a = [1];
            return function(n) {
              var s = 1;
              if (a[n]) {
                return a[n];
              }
              for (var i = n; i > 1; i--) {
                s *= i;
              }
              a[n] = s;
              return s;
            };
          }(),
          CatmullRom: function(p0, p1, p2, p3, t) {
            var v0 = (p2 - p0) * 0.5;
            var v1 = (p3 - p1) * 0.5;
            var t2 = t * t;
            var t3 = t * t2;
            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
          }
        }
      };
      Sequence = /** @class */
      function() {
        function Sequence2() {
        }
        Sequence2.nextId = function() {
          return Sequence2._nextId++;
        };
        Sequence2._nextId = 0;
        return Sequence2;
      }();
      mainGroup = new Group();
      Tween = /** @class */
      function() {
        function Tween2(object, group) {
          this._isPaused = false;
          this._pauseStart = 0;
          this._valuesStart = {};
          this._valuesEnd = {};
          this._valuesStartRepeat = {};
          this._duration = 1e3;
          this._isDynamic = false;
          this._initialRepeat = 0;
          this._repeat = 0;
          this._yoyo = false;
          this._isPlaying = false;
          this._reversed = false;
          this._delayTime = 0;
          this._startTime = 0;
          this._easingFunction = Easing.Linear.None;
          this._interpolationFunction = Interpolation.Linear;
          this._chainedTweens = [];
          this._onStartCallbackFired = false;
          this._onEveryStartCallbackFired = false;
          this._id = Sequence.nextId();
          this._isChainStopped = false;
          this._propertiesAreSetUp = false;
          this._goToEnd = false;
          this._object = object;
          if (typeof group === "object") {
            this._group = group;
            group.add(this);
          } else if (group === true) {
            this._group = mainGroup;
            mainGroup.add(this);
          }
        }
        Tween2.prototype.getId = function() {
          return this._id;
        };
        Tween2.prototype.isPlaying = function() {
          return this._isPlaying;
        };
        Tween2.prototype.isPaused = function() {
          return this._isPaused;
        };
        Tween2.prototype.getDuration = function() {
          return this._duration;
        };
        Tween2.prototype.to = function(target, duration) {
          if (duration === void 0) {
            duration = 1e3;
          }
          if (this._isPlaying)
            throw new Error("Can not call Tween.to() while Tween is already started or paused. Stop the Tween first.");
          this._valuesEnd = target;
          this._propertiesAreSetUp = false;
          this._duration = duration < 0 ? 0 : duration;
          return this;
        };
        Tween2.prototype.duration = function(duration) {
          if (duration === void 0) {
            duration = 1e3;
          }
          this._duration = duration < 0 ? 0 : duration;
          return this;
        };
        Tween2.prototype.dynamic = function(dynamic) {
          if (dynamic === void 0) {
            dynamic = false;
          }
          this._isDynamic = dynamic;
          return this;
        };
        Tween2.prototype.start = function(time, overrideStartingValues) {
          if (time === void 0) {
            time = now();
          }
          if (overrideStartingValues === void 0) {
            overrideStartingValues = false;
          }
          if (this._isPlaying) {
            return this;
          }
          this._repeat = this._initialRepeat;
          if (this._reversed) {
            this._reversed = false;
            for (var property in this._valuesStartRepeat) {
              this._swapEndStartRepeatValues(property);
              this._valuesStart[property] = this._valuesStartRepeat[property];
            }
          }
          this._isPlaying = true;
          this._isPaused = false;
          this._onStartCallbackFired = false;
          this._onEveryStartCallbackFired = false;
          this._isChainStopped = false;
          this._startTime = time;
          this._startTime += this._delayTime;
          if (!this._propertiesAreSetUp || overrideStartingValues) {
            this._propertiesAreSetUp = true;
            if (!this._isDynamic) {
              var tmp = {};
              for (var prop in this._valuesEnd)
                tmp[prop] = this._valuesEnd[prop];
              this._valuesEnd = tmp;
            }
            this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat, overrideStartingValues);
          }
          return this;
        };
        Tween2.prototype.startFromCurrentValues = function(time) {
          return this.start(time, true);
        };
        Tween2.prototype._setupProperties = function(_object, _valuesStart, _valuesEnd, _valuesStartRepeat, overrideStartingValues) {
          for (var property in _valuesEnd) {
            var startValue = _object[property];
            var startValueIsArray = Array.isArray(startValue);
            var propType = startValueIsArray ? "array" : typeof startValue;
            var isInterpolationList = !startValueIsArray && Array.isArray(_valuesEnd[property]);
            if (propType === "undefined" || propType === "function") {
              continue;
            }
            if (isInterpolationList) {
              var endValues = _valuesEnd[property];
              if (endValues.length === 0) {
                continue;
              }
              var temp = [startValue];
              for (var i = 0, l = endValues.length; i < l; i += 1) {
                var value = this._handleRelativeValue(startValue, endValues[i]);
                if (isNaN(value)) {
                  isInterpolationList = false;
                  console.warn("Found invalid interpolation list. Skipping.");
                  break;
                }
                temp.push(value);
              }
              if (isInterpolationList) {
                _valuesEnd[property] = temp;
              }
            }
            if ((propType === "object" || startValueIsArray) && startValue && !isInterpolationList) {
              _valuesStart[property] = startValueIsArray ? [] : {};
              var nestedObject = startValue;
              for (var prop in nestedObject) {
                _valuesStart[property][prop] = nestedObject[prop];
              }
              _valuesStartRepeat[property] = startValueIsArray ? [] : {};
              var endValues = _valuesEnd[property];
              if (!this._isDynamic) {
                var tmp = {};
                for (var prop in endValues)
                  tmp[prop] = endValues[prop];
                _valuesEnd[property] = endValues = tmp;
              }
              this._setupProperties(nestedObject, _valuesStart[property], endValues, _valuesStartRepeat[property], overrideStartingValues);
            } else {
              if (typeof _valuesStart[property] === "undefined" || overrideStartingValues) {
                _valuesStart[property] = startValue;
              }
              if (!startValueIsArray) {
                _valuesStart[property] *= 1;
              }
              if (isInterpolationList) {
                _valuesStartRepeat[property] = _valuesEnd[property].slice().reverse();
              } else {
                _valuesStartRepeat[property] = _valuesStart[property] || 0;
              }
            }
          }
        };
        Tween2.prototype.stop = function() {
          if (!this._isChainStopped) {
            this._isChainStopped = true;
            this.stopChainedTweens();
          }
          if (!this._isPlaying) {
            return this;
          }
          this._isPlaying = false;
          this._isPaused = false;
          if (this._onStopCallback) {
            this._onStopCallback(this._object);
          }
          return this;
        };
        Tween2.prototype.end = function() {
          this._goToEnd = true;
          this.update(this._startTime + this._duration);
          return this;
        };
        Tween2.prototype.pause = function(time) {
          if (time === void 0) {
            time = now();
          }
          if (this._isPaused || !this._isPlaying) {
            return this;
          }
          this._isPaused = true;
          this._pauseStart = time;
          return this;
        };
        Tween2.prototype.resume = function(time) {
          if (time === void 0) {
            time = now();
          }
          if (!this._isPaused || !this._isPlaying) {
            return this;
          }
          this._isPaused = false;
          this._startTime += time - this._pauseStart;
          this._pauseStart = 0;
          return this;
        };
        Tween2.prototype.stopChainedTweens = function() {
          for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
            this._chainedTweens[i].stop();
          }
          return this;
        };
        Tween2.prototype.group = function(group) {
          if (!group) {
            console.warn("tween.group() without args has been removed, use group.add(tween) instead.");
            return this;
          }
          group.add(this);
          return this;
        };
        Tween2.prototype.remove = function() {
          var _a;
          (_a = this._group) === null || _a === void 0 ? void 0 : _a.remove(this);
          return this;
        };
        Tween2.prototype.delay = function(amount) {
          if (amount === void 0) {
            amount = 0;
          }
          this._delayTime = amount;
          return this;
        };
        Tween2.prototype.repeat = function(times) {
          if (times === void 0) {
            times = 0;
          }
          this._initialRepeat = times;
          this._repeat = times;
          return this;
        };
        Tween2.prototype.repeatDelay = function(amount) {
          this._repeatDelayTime = amount;
          return this;
        };
        Tween2.prototype.yoyo = function(yoyo) {
          if (yoyo === void 0) {
            yoyo = false;
          }
          this._yoyo = yoyo;
          return this;
        };
        Tween2.prototype.easing = function(easingFunction) {
          if (easingFunction === void 0) {
            easingFunction = Easing.Linear.None;
          }
          this._easingFunction = easingFunction;
          return this;
        };
        Tween2.prototype.interpolation = function(interpolationFunction) {
          if (interpolationFunction === void 0) {
            interpolationFunction = Interpolation.Linear;
          }
          this._interpolationFunction = interpolationFunction;
          return this;
        };
        Tween2.prototype.chain = function() {
          var tweens = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            tweens[_i] = arguments[_i];
          }
          this._chainedTweens = tweens;
          return this;
        };
        Tween2.prototype.onStart = function(callback) {
          this._onStartCallback = callback;
          return this;
        };
        Tween2.prototype.onEveryStart = function(callback) {
          this._onEveryStartCallback = callback;
          return this;
        };
        Tween2.prototype.onUpdate = function(callback) {
          this._onUpdateCallback = callback;
          return this;
        };
        Tween2.prototype.onRepeat = function(callback) {
          this._onRepeatCallback = callback;
          return this;
        };
        Tween2.prototype.onComplete = function(callback) {
          this._onCompleteCallback = callback;
          return this;
        };
        Tween2.prototype.onStop = function(callback) {
          this._onStopCallback = callback;
          return this;
        };
        Tween2.prototype.update = function(time, autoStart) {
          var _this = this;
          var _a;
          if (time === void 0) {
            time = now();
          }
          if (autoStart === void 0) {
            autoStart = Tween2.autoStartOnUpdate;
          }
          if (this._isPaused)
            return true;
          var property;
          if (!this._goToEnd && !this._isPlaying) {
            if (autoStart)
              this.start(time, true);
            else
              return false;
          }
          this._goToEnd = false;
          if (time < this._startTime) {
            return true;
          }
          if (this._onStartCallbackFired === false) {
            if (this._onStartCallback) {
              this._onStartCallback(this._object);
            }
            this._onStartCallbackFired = true;
          }
          if (this._onEveryStartCallbackFired === false) {
            if (this._onEveryStartCallback) {
              this._onEveryStartCallback(this._object);
            }
            this._onEveryStartCallbackFired = true;
          }
          var elapsedTime = time - this._startTime;
          var durationAndDelay = this._duration + ((_a = this._repeatDelayTime) !== null && _a !== void 0 ? _a : this._delayTime);
          var totalTime = this._duration + this._repeat * durationAndDelay;
          var calculateElapsedPortion = function() {
            if (_this._duration === 0)
              return 1;
            if (elapsedTime > totalTime) {
              return 1;
            }
            var timesRepeated = Math.trunc(elapsedTime / durationAndDelay);
            var timeIntoCurrentRepeat = elapsedTime - timesRepeated * durationAndDelay;
            var portion = Math.min(timeIntoCurrentRepeat / _this._duration, 1);
            if (portion === 0 && elapsedTime === _this._duration) {
              return 1;
            }
            return portion;
          };
          var elapsed = calculateElapsedPortion();
          var value = this._easingFunction(elapsed);
          this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value);
          if (this._onUpdateCallback) {
            this._onUpdateCallback(this._object, elapsed);
          }
          if (this._duration === 0 || elapsedTime >= this._duration) {
            if (this._repeat > 0) {
              var completeCount = Math.min(Math.trunc((elapsedTime - this._duration) / durationAndDelay) + 1, this._repeat);
              if (isFinite(this._repeat)) {
                this._repeat -= completeCount;
              }
              for (property in this._valuesStartRepeat) {
                if (!this._yoyo && typeof this._valuesEnd[property] === "string") {
                  this._valuesStartRepeat[property] = // eslint-disable-next-line
                  // @ts-ignore FIXME?
                  this._valuesStartRepeat[property] + parseFloat(this._valuesEnd[property]);
                }
                if (this._yoyo) {
                  this._swapEndStartRepeatValues(property);
                }
                this._valuesStart[property] = this._valuesStartRepeat[property];
              }
              if (this._yoyo) {
                this._reversed = !this._reversed;
              }
              this._startTime += durationAndDelay * completeCount;
              if (this._onRepeatCallback) {
                this._onRepeatCallback(this._object);
              }
              this._onEveryStartCallbackFired = false;
              return true;
            } else {
              if (this._onCompleteCallback) {
                this._onCompleteCallback(this._object);
              }
              for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
                this._chainedTweens[i].start(this._startTime + this._duration, false);
              }
              this._isPlaying = false;
              return false;
            }
          }
          return true;
        };
        Tween2.prototype._updateProperties = function(_object, _valuesStart, _valuesEnd, value) {
          for (var property in _valuesEnd) {
            if (_valuesStart[property] === void 0) {
              continue;
            }
            var start = _valuesStart[property] || 0;
            var end = _valuesEnd[property];
            var startIsArray = Array.isArray(_object[property]);
            var endIsArray = Array.isArray(end);
            var isInterpolationList = !startIsArray && endIsArray;
            if (isInterpolationList) {
              _object[property] = this._interpolationFunction(end, value);
            } else if (typeof end === "object" && end) {
              this._updateProperties(_object[property], start, end, value);
            } else {
              end = this._handleRelativeValue(start, end);
              if (typeof end === "number") {
                _object[property] = start + (end - start) * value;
              }
            }
          }
        };
        Tween2.prototype._handleRelativeValue = function(start, end) {
          if (typeof end !== "string") {
            return end;
          }
          if (end.charAt(0) === "+" || end.charAt(0) === "-") {
            return start + parseFloat(end);
          }
          return parseFloat(end);
        };
        Tween2.prototype._swapEndStartRepeatValues = function(property) {
          var tmp = this._valuesStartRepeat[property];
          var endValue = this._valuesEnd[property];
          if (typeof endValue === "string") {
            this._valuesStartRepeat[property] = this._valuesStartRepeat[property] + parseFloat(endValue);
          } else {
            this._valuesStartRepeat[property] = this._valuesEnd[property];
          }
          this._valuesEnd[property] = tmp;
        };
        Tween2.autoStartOnUpdate = false;
        return Tween2;
      }();
      nextId = Sequence.nextId;
      TWEEN = mainGroup;
      getAll = TWEEN.getAll.bind(TWEEN);
      removeAll = TWEEN.removeAll.bind(TWEEN);
      add = TWEEN.add.bind(TWEEN);
      remove = TWEEN.remove.bind(TWEEN);
      update = TWEEN.update.bind(TWEEN);
    }
  });

  // js/CursorTrail.js
  function build_tween(from, to, sec) {
    let tween;
    function animate(time) {
      if (!tween.update(time)) {
        return;
      }
      requestAnimationFrame(animate);
    }
    tween = new Tween(from).to(to, sec * 1e3).onStart(function() {
      requestAnimationFrame(animate);
    });
    return tween;
  }
  function init_cursor_trail(img, debounce) {
    cursor_img = img;
    debounce_time = debounce;
  }
  function new_trail() {
    const trail = document.createElement("img");
    trail.src = cursor_img;
    trail.style.imageRendering = "crisp-edges";
    trail.style.width = "32px";
    trail.style.height = "29px";
    trail.style.zIndex = "900";
    trail.style.pointerEvents = "none";
    trail.style.position = "absolute";
    return trail;
  }
  var TRANSITION_EASING, confetti_number, cursor_img, debounce_time, debounce_timestamp;
  var init_CursorTrail = __esm({
    "js/CursorTrail.js"() {
      "use strict";
      init_tween_esm();
      TRANSITION_EASING = Easing.Quartic.InOut;
      confetti_number = 12;
      debounce_time = 0;
      debounce_timestamp = 0;
      document.onmousemove = function(ev) {
        if (!cursor_img) {
          return;
        }
        if (!(Date.now() / 1e3 - debounce_timestamp >= debounce_time)) {
          return;
        }
        let trail = new_trail();
        trail.style.left = `${ev.pageX}px`;
        trail.style.top = `${ev.pageY}px`;
        let rotate_tween = build_tween({ rotate: 0 }, { rotate: 359 }, 1).easing(Easing.Linear.InOut).onUpdate(function(upd) {
          trail.style.transform = `rotate(${upd.rotate}deg)`;
        }).repeat(Infinity);
        rotate_tween.start().update();
        build_tween({ opacity: 0 }, { opacity: 1 }, 0.2).onUpdate(function(upd) {
          trail.style.opacity = `${upd.opacity}`;
        }).onComplete(function() {
          rotate_tween.stop();
          trail.remove();
        }).repeat(1).repeatDelay(100).yoyo(true).start().update();
        document.body.appendChild(trail);
        debounce_timestamp = Date.now() / 1e3;
      };
      document.onmousedown = function(ev) {
        for (let i = 0; i <= confetti_number; i++) {
          let r = 50 * Math.sqrt(Math.random());
          let theta = Math.random() * 2 * Math.PI;
          let x = ev.pageX + r * Math.cos(theta);
          let y = ev.pageY + r * Math.sin(theta);
          let trail = new_trail();
          trail.style.width = "24px";
          trail.style.height = "24px";
          build_tween({ left: ev.pageX, top: ev.pageY }, { left: x, top: y }, 0.5).onUpdate(function(upd) {
            trail.style.left = `${upd.left}px`;
            trail.style.top = `${upd.top}px`;
          }).easing(Easing.Quadratic.InOut).start().update();
          let rotate_tween = build_tween({ rotate: 0 }, { rotate: 359 }, 1).easing(Easing.Linear.InOut).onUpdate(function(upd) {
            trail.style.transform = `rotate(${upd.rotate}deg)`;
          }).repeat(Infinity);
          rotate_tween.start().update();
          build_tween({ opacity: 0 }, { opacity: 1 }, 0.2).onUpdate(function(upd) {
            trail.style.opacity = `${upd.opacity}`;
          }).onComplete(function() {
            rotate_tween.stop();
            trail.remove();
          }).repeat(1).repeatDelay(100).yoyo(true).start().update();
          document.body.appendChild(trail);
        }
      };
    }
  });

  // js/pages/cool_websites.js
  var cool_websites_app;
  var init_cool_websites = __esm({
    "js/pages/cool_websites.js"() {
      "use strict";
      init_view();
      cool_websites_app = new View("cool_websites", function() {
      });
    }
  });

  // js/index.js
  var require_js = __commonJS({
    "js/index.js"() {
      init_about();
      init_home();
      init_photos();
      init_topbar();
      init_view();
      init_CursorTrail();
      init_cool_websites();
      var DEFAULT_VIEW = document.querySelector("viewport-begin");
      init_topbar2();
      load([home_app, about_app, cool_websites_app, photos_app]).then(function() {
        show_view(DEFAULT_VIEW?.textContent);
      });
      init_cursor_trail("/images/cursor/cursor2.png", 1 / 8);
    }
  });
  require_js();
})();
