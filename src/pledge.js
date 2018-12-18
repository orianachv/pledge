'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// TU CÓDIGO AQUÍ:

var $Promise = function(executor) {
  if (typeof executor != 'function') {
    throw TypeError('executor it is not a function');
  }
  this._state = 'pending';
  this._value;
  this._handlerGroups = [];

  executor(this._internalResolve.bind(this), this._internalReject.bind(this));
};

$Promise.prototype._internalResolve = function(data) {
  if (this._state == 'pending') {
    this._value = data;
    this._state = 'fulfilled';
  }
  this._callHandlers(this._state);
};

$Promise.prototype._internalReject = function(dataError) {
  if (this._state == 'pending') {
    this._value = dataError;
    this._state = 'rejected';
  }
  this._callHandlers(this._state);
};

$Promise.prototype.then = function(successCb, errorCb) {
  var newPromise = new $Promise(() => {});
  this._handlerGroups.push({
    successCb: typeof successCb == 'function' ? successCb : false,
    errorCb: typeof errorCb == 'function' ? errorCb : false,
    downstreamPromise: newPromise,
  });
  this._callHandlers(this._state);
  return this._handlerGroups.downstreamPromise;
};

$Promise.prototype._callHandlers = function(string) {
  if (string === 'fulfilled') {
    for (var i = 0; i < this._handlerGroups.length; i++) {
      this._handlerGroups[i].successCb(this._value);
    }
    this._handlerGroups = [];
  }

  if (string === 'rejected') {
    for (var i = 0; i < this._handlerGroups.length; i++) {
      if (typeof this._handlerGroups[i].errorCb == 'function') {
        this._handlerGroups[i].errorCb(this._value);
      }
    }
    this._handlerGroups = [];
  }
};

$Promise.prototype.catch = function(Err) {
  this.then(null, Err);
};
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
