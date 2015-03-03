import Ember from 'ember';
var dbg = Ember.Logger.debug;

export default Ember.Component.extend({

  // Arguments
  action: null,

  defaultClass:   'default',
  fulfilledClass: 'fulfilled',
  rejectedClass:  'rejected',
  pendingClass:   'pending',

  iconClass:          undefined,
  iconDefaultClass:   undefined,
  iconFulfilledClass: undefined,
  iconPendingClass:   undefined,
  iconRejectedClass:  undefined,

  defaultText:    undefined,
  fulfilledText:  undefined,
  pendingText:    undefined,
  rejectedText:   undefined,

  disable:        true,
  revertMs:       null,

  status: 'default',
  _statuses: ['default', 'fulfilled', 'rejected', 'pending'],
  classNames: ['assButt'],
  classNameBindings: ['statusClass'],
  attributeBindings: ['disabled'],
  tagName: 'button',

  disabled: Ember.computed( 'status', 'disable', function() {
    if (!this.get('disable')) { return false; }
    return this.get('status') === 'pending';
  }),

  click: function() {
    if (this.get('disabled')) { return; }
    this.sendAction('action', this.promiseResolver.bind(this));
  },

  promiseResolver: function(promise) {
    if ( !(promise instanceof Ember.RSVP.Promise) || promise._state === 1 ) {
      this.set('status', 'fulfilled');
      return;
    }

    if (promise._state === 2) {
      this.set('status', 'rejected');
      return;
    }

    this.set('status', 'pending');

    promise
      .then( function() {
        if (this.get('isDestroyed')) { return; }
        this.set('status', 'fulfilled');
      }.bind(this))
      .catch( function() {
        if (this.get('isDestroyed')) { return; }
        this.set('status', 'rejected');
      }.bind(this));

  },

  statusClass: Ember.computed(
    'status',
    '_statuses',
    'defaultClass',
    'fulfilledClass',
    function() {
      var status = this.get('status');
      var statuses = this.get('_statuses');

      if( statuses.indexOf(status) === -1 ) {
        throw new Error("Attempt to set ass-butt into a disallowed status:", status, "Allowed statuses: ", statuses);
      }

      var classPropertyName = status + 'Class';
      return this.get(classPropertyName);
    }
  ),

  statusText: Ember.computed(
    'status',
    'defaultText',
    function() {
      return this._statusText();
    }
  ),

  _statusText: function(opts) {
    opts = opts || {};
    var status = opts.status !== undefined ? opts.status : this.get('status');
    var textPropertyName = status + "Text";
    var text = opts[textPropertyName] !== undefined ? opts[textPropertyName] : this.get(textPropertyName);

    if (!text) {
      text = this.get('defaultText');
    }

    return text;
  },

  revertStatus: Ember.observer( 'status', 'revertMs', function() {
    var revertMs = this.get('revertMs');

    Ember.Logger.debug('revertStatus revertMs', revertMs);
    Ember.Logger.debug("revertStatus this.get('status')", this.get('status'));

    if (typeof revertMs !== "number") { return; }

    if (this.get('status') === 'fulfilled') {
      Ember.run.later( function() {
        this.set('status', 'default');
      }.bind(this), revertMs);
    }
  }),

  iconClassFinal: Ember.computed( 'iconClass', function() {
    if ((typeof this.get('iconClass')) === 'string') { return this.get('iconClass'); }
    else { return ''; }
  }),

  iconDefaultClassFinal: Ember.computed( 'status', 'iconDefaultClass', function() {
    if (this.get('status') === 'default') { return this.get('iconDefaultClass'); }
    else { return ''; }
  }),

  iconPendingClassFinal: Ember.computed( 'status', 'iconPendingClass', function() {
    if (this.get('status') === 'pending') { return this.get('iconPendingClass'); }
    else { return ''; }
  }),

  iconFulfilledClassFinal: Ember.computed( 'status', 'iconFulfilledClass', function() {
    if (this.get('status') === 'fulfilled') { return this.get('iconFulfilledClass'); }
    else { return ''; }
  }),

  iconRejectedClassFinal: Ember.computed( 'status', 'iconRejectedClass', function() {
    if (this.get('status') === 'rejected') { return this.get('iconRejectedClass'); }
    else { return ''; }
  })
});
