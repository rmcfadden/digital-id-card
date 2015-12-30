"use strict";

var crypto = function (args) {
  
  this.args = args;

  this.hash = function(input){      
    var hashBytes = sjcl.hash.sha256.hash(input);
    return sjcl.codec.hex.fromBits(hashBytes);
  }
};