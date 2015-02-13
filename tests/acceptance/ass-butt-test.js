import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var application;

module('Acceptance: AssButt', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('visiting /', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentPath(), 'index');
  });
});


test('page has an ass-butt', function(assert) {
  visit('/');

  andThen( function() {
    assert.ok( find('.assButt').length > 0, 'there should be at least one ass-butt on the page');
  });
});
