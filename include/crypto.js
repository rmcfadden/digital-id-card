"use script";
function crypto(args) {  
  this.args = {
      hasher: 'sha256'
  };

  if(args){
    this.args = args;      
  }

  this.hash = function(input){      
    // only 256 supported now
    var hashBytes = sjcl.hash.sha256.hash(input);
    return sjcl.codec.hex.fromBits(hashBytes);
  }

};