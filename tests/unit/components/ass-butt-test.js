import {
  moduleForComponent,
  test
} from 'ember-qunit';
import startApp from '../../helpers/start-app';
import Ember from 'ember';

var App;
var sinon = window.sinon;
var dbg = Ember.Logger.debug;

moduleForComponent('ass-butt', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
  setup: function() {
    App = startApp();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('it renders', function(assert) {
  assert.expect(2);

  // creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});


test('it has button tag by default', function(assert) {
  var component = this.subject();
  var $component = this.render();

  assert.equal($component.prop("tagName").toLowerCase(), 'button');
});


test('it has configurable tag', function(assert) {
  var component = this.subject({ tagName: 'a'});
  var $component = this.render();

  assert.equal($component.prop("tagName").toLowerCase(), 'a');
});


test('it has assButt class', function(assert) {
  var component = this.subject();
  var $component = this.render();

  assert.ok($component.hasClass("assButt"));
});


test('it initially has default class', function(assert) {
  var component = this.subject();
  var $component = this.render();

  assert.ok($component.hasClass("default"));
});


test('setting defaultClass should set its class to that', function(assert) {
  var testClass = 'zomg';
  var component = this.subject({ defaultClass: testClass});
  var $component = this.render();

  assert.ok($component.hasClass(testClass));
});


test('setting defaultClass should work with more than one class', function(assert) {
  var component = this.subject({ defaultClass: 'foo bar baz'});
  var $component = this.render();

  assert.ok($component.hasClass('foo'));
  assert.ok($component.hasClass('bar'));
  assert.ok($component.hasClass('baz'));
});


test('it initially does not have non-default status classes', function(assert) {
  var component = this.subject();
  var $component = this.render();

  assert.ok(!$component.hasClass("fulfilled"));
  assert.ok(!$component.hasClass("rejected"));
  assert.ok(!$component.hasClass("pending"));
});


test('it initially does not have non-default custom classes', function(assert) {
  var testClass = 'zomg';
  var component = this.subject({
    fulfilledClass: testClass,
    rejectedClass: testClass,
    pending: testClass
  });
  var $component = this.render();

  assert.ok(!$component.hasClass(testClass));
});


test('clicking it should run the action', function(assert) {
  var spy = sinon.spy();
  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );

  assert.ok(spy.calledOnce);
});



test('clicking it should set the status to fulfilled if ' +
      'action is not passed a promise', function(assert) {
  var spy = sinon.spy(function(promiseResolver) {
    promiseResolver(); // no promise for promiseResolver
  });
  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );

  assert.ok(!$component.hasClass('default'));
  assert.ok($component.hasClass('fulfilled'));
});




test( 'it should initially have default status', function(assert) {
  var component = this.subject();

  assert.equal( component.get('status'), 'default');
});



test( 'setting status to fulfilled sets the class to fulfilled', function(assert) {
  var component = this.subject();
  var $component = this.render();

  Ember.run( function() {
    component.set('status', 'fulfilled');
  });

  assert.ok(!$component.hasClass("default"), 'it should no longer have the default class');
  assert.ok($component.hasClass("fulfilled"), 'it should have the fulfilled class');
});

test( 'setting status to fulfilled sets the class to custom fulfilled', function(assert) {
  var testClass = 'zomg';
  var component = this.subject({ fulfilledClass: testClass});
  var $component = this.render();

  Ember.run( function() {
    component.set('status', 'fulfilled');
  });

  assert.ok($component.hasClass(testClass), 'it should have the custom fulfilled class');
});




test( 'setting status to rejected sets the class to rejected', function(assert) {
  var component = this.subject();
  var $component = this.render();

  Ember.run( function() {
    component.set('status', 'rejected');
  });

  assert.ok(!$component.hasClass("default"), 'it should no longer have the default class');
  assert.ok($component.hasClass("rejected"), 'it should have the rejected class');
});

test( 'setting status to rejected sets the class to custom rejected', function(assert) {
  var testClass = 'zomg';
  var component = this.subject({ rejectedClass: testClass});
  var $component = this.render();

  Ember.run( function() {
    component.set('status', 'rejected');
  });

  assert.ok($component.hasClass(testClass), 'it should have the custom rejected class');
});




test( 'setting status to pending sets the class to pending', function(assert) {
  var component = this.subject();
  var $component = this.render();

  Ember.run( function() {
    component.set('status', 'pending');
  });

  assert.ok(!$component.hasClass("default"), 'it should no longer have the default class');
  assert.ok($component.hasClass("pending"), 'it should have the pending class');
});

test( 'setting status to pending sets the class to custom pending', function(assert) {
  var testClass = 'zomg';
  var component = this.subject({ pendingClass: testClass});
  var $component = this.render();

  Ember.run( function() {
    component.set('status', 'pending');
  });

  assert.ok($component.hasClass(testClass), 'it should have the custom fulfilled class');
});


test( 'when action returns a promise and that promise resolves immediately, ' +
      'it should change class to fullfilled', function(assert)
{
  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( Ember.RSVP.resolve() );
  });
  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );

  assert.ok( $component.hasClass('fulfilled') );
});


test( 'when action returns a promise and that promise rejects immediately, ' +
      'it should change class to fullfilled', function(assert)
{
  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( Ember.RSVP.reject() );
  });
  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );

  assert.ok( $component.hasClass('rejected') );
});


test( 'when action returns a promise and that promise does not resolve/reject immediately, ' +
      'it should not change class to fullfilled', function(assert)
{
  var resolver;
  var promise = new Ember.RSVP.Promise( function(resolve) {
    resolver = resolve;
  });

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( promise );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );

  assert.ok( $component.hasClass('pending'), 'should have pending class' );
  assert.ok( !$component.hasClass('fulfilled'), 'should not have fulfilled class' );
  assert.ok( !$component.hasClass('rejected'), 'should not have rejected class' );
});


test( 'when action returns a promise and that promise resolves later, ' +
'it should change class to fullfilled', function(assert)
{
  assert.expect(1);

  var resolver;
  var promise = new Ember.RSVP.Promise( function(resolve) {
    resolver = resolve;
  });

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( promise );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );


  Ember.run.later(resolver);

  andThen( function() {
    assert.ok( $component.hasClass('fulfilled'), 'should not have fulfilled class' );
  });
});



test( 'when action returns a promise and that promise rejects later, ' +
'it should change class to rejected', function(assert)
{
  assert.expect(1);

  var rejector;
  var promise = new Ember.RSVP.Promise( function(resolve, reject) {
    rejector = reject;
  });

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( promise );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );


  Ember.run.later(rejector);

  andThen( function() {
    assert.ok( $component.hasClass('rejected'), 'should not have rejected class' );
  });
});


test( '_statusText should retrieve <status>Text', function(assert) {
  var expected = 'foo';
  var result = this.subject()._statusText({
    status: 'default',
    defaultText: expected
  });

  assert.equal(result, expected);
});


test( 'it should render defaultText by default', function(assert) {
  var expected = 'foo';
  var component = this.subject({
    defaultText: expected
  });
  var $component = this.render();

  assert.equal($component.text().trim(), expected);
});


test( 'it should render fulfilledText in fulfilled status', function(assert) {
  var expected = 'foo';
  var component = this.subject({
    defaultText:   'bar',
    fulfilledText: expected,
    status:        'fulfilled'
  });
  var $component = this.render();

  assert.equal($component.text().trim(), expected);
});


test( 'it should render defaultText in fulfilled status if fulfilledText is not provided', function(assert) {
  var expected = 'foo';
  var component = this.subject({
    defaultText:   expected,
    status:        'fulfilled'
  });
  var $component = this.render();

  assert.equal($component.text().trim(), expected);
});


test( 'it should render rejectedText in rejected status', function(assert) {
  var expected = 'foo';
  var component = this.subject({
    defaultText:   'bar',
    rejectedText:  expected,
    status:        'rejected'
  });
  var $component = this.render();

  assert.equal($component.text().trim(), expected);
});


test( 'it should render defaultText in rejected status if rejectedText is not provided', function(assert) {
  var expected = 'foo';
  var component = this.subject({
    defaultText:   expected,
    status:        'rejected'
  });
  var $component = this.render();

  assert.equal($component.text().trim(), expected);
});



test( 'it should render pendingText in pending status', function(assert) {
  var expected = 'foo';
  var component = this.subject({
    defaultText:   'bar',
    pendingText:  expected,
    status:        'pending'
  });
  var $component = this.render();

  assert.equal($component.text().trim(), expected);
});


test( 'it should render defaultText in pending status if pendingText is not provided', function(assert) {
  var expected = 'foo';
  var component = this.subject({
    defaultText:   expected,
    status:        'pending'
  });
  var $component = this.render();

  assert.equal($component.text().trim(), expected);
});




test( 'the action should not be run more than once while the promise is not fulfilled', function(assert)
{
  assert.expect(1);

  var resolver;
  var promise = new Ember.RSVP.Promise( function(resolve) {
    resolver = resolve;
  });

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( promise );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click($component);
  click($component);

  andThen( function() {
    resolver();
    assert.equal(spy.callCount, 1, 'action should run once');
  });
});


test( 'the action should run more than once while the promise is not fulfilled if disable is false', function(assert)
{
  assert.expect(1);

  var resolver;
  var promise = new Ember.RSVP.Promise( function(resolve) {
    resolver = resolve;
  });

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( promise );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction',
    disable: false
  });

  var $component = this.render();

  click($component);
  click($component);

  andThen( function() {
    resolver();
    assert.equal(spy.callCount, 2, 'action should run once');
  });
});




test( 'the button should be disabled while pending', function(assert)
{
  assert.expect(3);

  var resolver;
  var promise = new Ember.RSVP.Promise( function(resolve) {
    resolver = resolve;
  });

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( promise );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  assert.ok( !$component.attr('disabled'), 'initially the button should not be disabled' );

  click( $component );

  assert.ok( $component.attr('disabled'), 'the button should become disabled after click' );

  Ember.run.later(resolver);

  andThen( function() {
    assert.ok( !$component.attr('disabled'), 'the button should become non-disabled after action has been resolved' );
  });
});


test( 'the button not should be disabled while pending if disable is set to false', function(assert)
{
  var resolver;
  var promise = new Ember.RSVP.Promise( function(resolve) {
    resolver = resolve;
  });

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( promise );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction',
    disable: false
  });

  var $component = this.render();

  assert.ok( !$component.attr('disabled'), 'initially the button should not be disabled' );

  click( $component );

  assert.ok( !$component.attr('disabled'), 'the button should not become disabled after click' );

});



test( "the button should return to default state after revertMs if it's set", function(assert)
{
  assert.expect(1);

  var resolver;

  var promise = new Ember.RSVP.Promise( function(resolve) {
    resolver = resolve;
  });

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( promise );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction',
    revertMs: 200
  });

  var $component = this.render();

  click( $component );

  resolver();

  andThen( function() {
    assert.equal( component.get('status'), 'default', 'it should revert to the default status after revertMs' );
  }.bind(this));
});



test( "the button should not return to default state after revertMs if it's set", function(assert)
{
  assert.expect(1);

  var resolver;

  var promise = new Ember.RSVP.Promise( function(resolve) {
    resolver = resolve;
  });

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( promise );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );

  resolver();

  andThen( function() {
    assert.equal( component.get('status'), 'fulfilled', 'it should not revert to the default status after revertMs' );
  }.bind(this));
});



test( "the component should not crash if promise is fulfilled after the component is destroyed", function(assert)
{
  assert.expect(0);

  var resolver;

  var promise = new Ember.RSVP.Promise( function(resolve) {
    resolver = resolve;
  });

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( promise );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );

  Ember.run( function() {
    component.destroy();
  });

  resolver();
});



test( "the component should not crash if promise is rejeceted after the component is destroyed", function(assert)
{
  assert.expect(0);

  var rejector;

  var promise = new Ember.RSVP.Promise( function(resolve, reject) {
    rejector = reject;
  });

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( promise );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );

  Ember.run( function() {
    component.destroy();
  });

  rejector();
});


test( "the component should not crash if promise is initially resolved and the component is destroyed", function(assert)
{
  assert.expect(0);

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( Ember.RSVP.resolve() );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );

  Ember.run( function() {
    component.destroy();
  });
});


test( "the component should not crash if promise is initially rejected and the component is destroyed", function(assert)
{
  assert.expect(0);

  var spy = sinon.spy( function(promiseResolver) {
    promiseResolver( Ember.RSVP.reject() );
  });

  var targetObject = {externalAction: spy};

  var component = this.subject({
    targetObject: targetObject,
    action: 'externalAction'
  });

  var $component = this.render();

  click( $component );

  Ember.run( function() {
    component.destroy();
  });
});


test( "button should not have icon by default", function(assert)
{
  this.subject();
  var $component = this.render();
  var $icon = $component.find('.assButt-icon');

  assert.equal( $icon.length, 0, 'amount of icons in button should be 0' );
});



test( "button should have icon if iconClass is provided", function(assert)
{
  this.subject({iconClass: 'foo'});
  var $component = this.render();
  var $icon = $component.find('.assButt-icon');

  assert.equal( $icon.length, 1, 'amount of icons in button should be 1' );
  assert.ok( $icon.hasClass('foo'), 'icon should have the iconClass class' );
});


test( 'icon should have defaultClass in default status', function(assert) {
  var component = this.subject({
    iconClass:          true,
    iconDefaultClass:   'foo',
    iconPendingClass:   'bar',
    iconFulfilledClass: 'baz',
    iconRejectedClass:  'quux',
    status:            'default'
  });
  var $component = this.render();
  var $icon = $component.find('.assButt-icon');

  dbg($component[0]);

  assert.ok( $icon.hasClass('foo'), 'icon should have the iconDefaultClass class during defuault status' );
  assert.ok( !$icon.hasClass('bar'), 'icon should not have the iconPendingClass class during defuault status' );
  assert.ok( !$icon.hasClass('baz'), 'icon should not have the iconFulfilledClass class during defuault status' );
  assert.ok( !$icon.hasClass('quux'), 'icon should not have the iconRejectedClass class during defuault status' );
});


test( 'icon should have pendingClass in pending status', function(assert) {
  var component = this.subject({
    iconClass:         true,
    iconDefaultClass:   'foo',
    iconPendingClass:   'bar',
    iconFulfilledClass: 'baz',
    iconRejectedClass:  'quux',
    status:            'pending'
  });
  var $component = this.render();
  var $icon = $component.find('.assButt-icon');

  assert.ok( $icon.hasClass('bar'), 'icon should have the iconPendingClass class during pending status' );
  assert.ok( !$icon.hasClass('foo'), 'icon should not have the iconDefaultClass class during pending status' );
  assert.ok( !$icon.hasClass('baz'), 'icon should not have the iconFulfilledClass class during pending status' );
  assert.ok( !$icon.hasClass('quux'), 'icon should not have the iconRejectedClass class during pending status' );
});


test( 'icon should have iconFulfilledClass in rejected status', function(assert) {
  var component = this.subject({
    iconClass:         true,
    iconDefaultClass:   'foo',
    iconPendingClass:   'bar',
    iconFulfilledClass: 'baz',
    iconRejectedClass:  'quux',
    status:             'fulfilled'
  });
  var $component = this.render();
  var $icon = $component.find('.assButt-icon');

  assert.ok( $icon.hasClass('baz'), 'icon should have the iconFulfilledClass class during rejected status' );
  assert.ok( !$icon.hasClass('foo'), 'icon should not have the iconDefaultClass class during rejected status' );
  assert.ok( !$icon.hasClass('bar'), 'icon should not have the iconPendingClass class during rejected status' );
  assert.ok( !$icon.hasClass('quux'), 'icon should not have the iconRejectedClass class during rejected status' );
});


test( 'icon should have iconRejectedClass in rejected status', function(assert) {
  var component = this.subject({
    iconClass:         true,
    iconDefaultClass:   'foo',
    iconPendingClass:   'bar',
    iconFulfilledClass: 'baz',
    iconRejectedClass:  'quux',
    status:            'rejected'
  });
  var $component = this.render();
  var $icon = $component.find('.assButt-icon');

  assert.ok( $icon.hasClass('quux'), 'icon should have the iconRejectedClass class during rejected status' );
  assert.ok( !$icon.hasClass('foo'), 'icon should not have the iconDefaultClass class during rejected status' );
  assert.ok( !$icon.hasClass('bar'), 'icon should not have the iconPendingClass class during rejected status' );
  assert.ok( !$icon.hasClass('baz'), 'icon should not have the iconFulfilledClass class during rejected status' );
});
