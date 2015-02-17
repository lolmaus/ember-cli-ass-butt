import Ember from 'ember';
var dbg = Ember.Logger.debug;

export default Ember.Component.extend({

  // Arguments
  action: null,

  defaultClass:   'default',
  fulfilledClass: 'fulfilled',
  rejectedClass:  'rejected',
  pendingClass:   'pending',

  defaultText:    undefined,


  status: 'default',
  _statuses: ['default', 'fulfilled', 'rejected', 'pending'],
  classNames: ['assButt'],
  classNameBindings: ['statusClass'],
  tagName: 'button',

  click: function() {
    this.sendAction('action', this.promiseResolver.bind(this));
  },

  promiseResolver: function(promise) {
    if (!(promise instanceof Ember.RSVP.Promise)) {
      this.set('status', 'fulfilled');
      return;
    }

    if (promise._state === 1) {
      this.set('status', 'fulfilled');
    } else if (promise._state === 2) {
      this.set('status', 'rejected');
    } else {
      this.set('status', 'pending');
      promise
        .then( function() {
          this.set('status', 'fulfilled');
        }.bind(this))
        .catch( function() {
          this.set('status', 'rejected');
        }.bind(this));
    }

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
  }
});
