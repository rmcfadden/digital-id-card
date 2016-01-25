QUnit.test( "construct", function( assert ) {
  var obj = $("#id-card").digitalIdCard({includeRoot: '../include/'});
  assert.notEqual(undefined, obj);
  
});

QUnit.test( "construct with card content", function( assert ) {
  expect(0);
});