"use script";
function crypto(args) {  
  this.args = {
      hashAlgo: 'sha256',
      publicKeyAlgo : 'ecc',
      publicKeySubAlgo : 'k256'
  };

  if(args){
    this.args = args;      
  }

  this.hash = function(input){      
    // only 256 supported now
    var hashBytes = sjcl.hash.sha256.hash(input);
    return sjcl.codec.hex.fromBits(hashBytes);
  }

  this.generateKeyPair = function(){
    // only ecc/k256 currently supported
    var curve = sjcl.ecc.curves.k256;
    var keys = sjcl.ecc.ecdsa.generateKeys(curve,6);

    var returnKey = {
        algo : this.args.publicKeyAlgo,
        subAlgo : this.args.publicKeySubAlgo,
        encoding : 'hex'
    };

    var publicKeyEncoded = sjcl.codec.hex.fromBits(keys.pub.get().x) + sjcl.codec.hex.fromBits(keys.pub.get().y);
    var secretKeyEncoded = sjcl.codec.hex.fromBits(keys.sec.get());

    returnKey.publicKey = publicKeyEncoded;
    returnKey.secretKey = secretKeyEncoded;

    return returnKey;
  }
};

// examples
// http://blog.peramid.es/blog/2014/09/09/short-introduction-to-sjcl/