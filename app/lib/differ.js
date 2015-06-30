import _ from "npm:lodash";
// From:    https://github.com/Starcounter-Jack/JSON-Patch/blob/master/src/json-patch-duplex.js
// Fetched: June 30, 2015

export default function(mirror, obj){
  var patches = {"$set": {}, "$unset": {}, "$push": {}}
  generate(mirror, obj, patches, '')
  if (_.isEmpty(patches["$set"])) delete patches["$set"];
  if (_.isEmpty(patches["$unset"])) delete patches["$unset"];
  if (_.isEmpty(patches["$push"])) delete patches["$push"];
  return patches
}

function generate(mirror, obj, patches, path) {
  var newKeys = _objectKeys(obj);
  var oldKeys = _objectKeys(mirror);
  var changed = false;
  var deleted = false;

  for (var t = oldKeys.length - 1; t >= 0; t--) {
    var key = oldKeys[t];
    var oldVal = mirror[key];
    if (obj.hasOwnProperty(key)) {
      var newVal = obj[key];
      if (typeof oldVal == "object" && oldVal != null && typeof newVal == "object" && newVal != null) {
        generate(oldVal, newVal, patches, path + "." + escapePathComponent(key));
      } else {
        if (oldVal != newVal) {
          changed = true;
          patches["$set"][(path + "." + escapePathComponent(key)).replace(/^\./, '')] = deepClone(newVal);
        }
      }
    } else {
      if (!_.isArray(obj)){
        //   Because MongoDB can't do multiple push/pull, we can't do this.
        //   patches["$pullAll"][(path).replace(/^\./, '')] = patches["$pullAll"][(path).replace(/^\./, '')] || []
        //   patches["$pullAll"][(path).replace(/^\./, '')].push(deepClone(oldVal))
        // } else {
        patches["$unset"][(path + "." + escapePathComponent(key)).replace(/^\./, '')] = true;
        deleted = true; // property has been deleted
      }
    }
  }

  if (!deleted && newKeys.length == oldKeys.length) {
    return;
  }

  // if hash
  if (_.isArray(obj)){
    if (_objectKeys(mirror) !== oldKeys) {
      patches["$set"][path.replace(/^\./, '')] = deepClone(obj)
    }
  } else {
    for (var u = 0; u < newKeys.length; u++) {
      var newKey = newKeys[u];
      if (!mirror.hasOwnProperty(newKey)) {
        patches["$set"][(path + "." + escapePathComponent(newKey)).replace(/^\./, '')] =  deepClone(obj[newKey])
      }
    }
  }
}

function escapePathComponent(str) {
  if (str.indexOf('/') === -1 && str.indexOf('~') === -1)
  return str;
  return str.replace(/~/g, '~0').replace(/\//g, '~1');
}


function deepClone(obj) {
  if (typeof obj === "object") {
    return JSON.parse(JSON.stringify(obj));
  } else {
    return obj;
  }
}


var _objectKeys = (function () {
  if (Object.keys)
  return Object.keys;

  return function (o) {
    var keys = [];
    for (var i in o) {
      if (o.hasOwnProperty(i)) {
        keys.push(i);
      }
    }
    return keys;
  };
})();
