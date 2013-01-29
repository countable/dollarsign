
TESTSTRAP.run(function() {

  var found = 0;

  /* test tagName selector */
  $('div').each(function(index) {
    found += 1;
  });

  this.assertEqual(found,4);
  
  /* test ID selectors */
  this.assertEqual($('#idoexist').length, 1);
  this.assertEqual($('#idontexist').length, 0);

  /* test class selectors */
  var $iexisttoo;
  this.assertEqual(($iexisttoo = $('.iexisttoo')).length, 2);
  this.assertEqual($('.idontexisteither').length, 0);

  /* combo tests. */
  this.assertEqual($('.iexisttoo', $('body')).length, 2);
  this.assertEqual($iexisttoo[0].tagName, 'DIV'); 

});

