/**
 * module event 事件处理
 */

define('event', ['$node'], function(doly) {
    'use strict';
	
	var
	isW3C = !!doly.HEAD.addEventListener,
	support = doly.support,
	rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/
	special, facade,
	Event = doly.Event = function(src, props) {
	    if (!(this instanceof doly.Event)) {
		    return new Event(src, props);
		}
		
		if (src && src.type) {
		    this.originalEvent = src;
		    this.type = src.type;
			this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
                src.getPreventDefault && src.getPreventDefault()) ? true : false;    
		} else {
		    this.type = src;
		}
		if (props) {
            doly.mix(this, props);
        }
        this.timeStamp = new Date() - 0;
	};
	Event.prototype = {
	    constructor: Event,
		
		preventDefault: function() {
		    var e = this.originalEvent;
			this.isDefaultPrevented = true;
			if (!e) {
				return this;
			}
			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			return this;
		},
		
		stopPropagation: function() {
			this.isPropagationStopped = true;
			var e = this.originalEvent;
			if (!e) {
				return this;
			}
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			e.cancelBubble = true;
			return this;
		},
		
		stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = true;
            this.stopPropagation();
			return this;
        }
	};
	
	facade = doly.event = {
	    
		add: function() {
		    
		},
		
		global: {},
		
		remove: function() {
		    
		},
		
		special: {
		    
		}
		
	};
	special = facade.special;
	doly.bind = isW3C ?
	    function(elem, type, handle) {
		    if (elem.addEventListener) {
			    elem.addEventListener(type, handle || doly.noop, false);
			}
		} :
		function(elem, type, handle) {
			if (elem.attachEvent) {
				elem.attachEvent(name, handle || doly.noop);
			}
		};
	doly.unbind = isW3C ?
	    function(elem, type, handle) {
		    if (elem.removeEventListener) {
			    elem.removeEventListener(type, handle || doly.noop, false);
			}
		} :
		function(elem, type, handle) {
		    var name = 'on' + type;
			if (elem.detachEvent) {
				if (typeof elem[name] === 'undefined') {
					elem[name] = null;
				}
				elem.detachEvent(name, handle || doly.noop);
			}
		};
	
	// IE submit delegation
	if (!support.submitBubbles) {
		special.submit = {
			setup: function() {
				// Only need this for delegated form submit events
				if (this.tagName === 'FORM') {
					return false;
				}

				// Lazy-add a submit handler when a descendant form may potentially be submitted
				facade.add(this, 'click._submit keypress._submit', function(e) {
					// Node name check avoids a VML-related crash in IE (#9807)
					var elem = e.target,
						form = (elem.tagName === 'INPUT') || (elem.tagName === 'BUTTON') ? elem.form : undefined;
					if (form && !doly._data(form, '_submit_attached')) {
						facade.add(form, 'submit._submit', function(event) {
							event._submit_bubble = true;
						});
						doly._data(form, '_submit_attached', true);
					}
				});
				// return undefined since we don't need an event listener
			},

			postDispatch: function(event) {
				// If form was submitted by the user, bubble the event up the tree
				if (event._submit_bubble) {
					delete event._submit_bubble;
					if (this.parentNode && !event.isTrigger) {
						facade.simulate('submit', this.parentNode, event, true);
					}
				}
			},

			teardown: function() {
				// Only need this for delegated form submit events
				if (this.tagName === 'FORM') {
					return false;
				}

				// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
				facade.remove(this, '._submit');
			}
		};
	}

	// IE change delegation and checkbox/radio fix
	if (!support.changeBubbles) {

		special.change = {

			setup: function() {

				if (rformElems.test(this.nodeName)) {
					// IE doesn't fire change on a check/radio until blur; trigger it on click
					// after a propertychange. Eat the blur-change in special.change.handle.
					// This still fires onchange a second time for check/radio after blur.
					if (this.type === 'checkbox' || this.type === 'radio') {
						facade.add(this, 'propertychange._change', function(event) {
							if (event.originalEvent.propertyName === 'checked') {
								this._just_changed = true;
							}
						});
						facade.add(this, 'click._change', function(event) {
							if (this._just_changed && !event.isTrigger) {
								this._just_changed = false;
							}
							// Allow triggered, simulated change events (#11500)
							facade.simulate('change', this, event, true);
						});
					}
					return false;
				}
				// Delegated event; lazy-add a change handler on descendant inputs
				facade.add(this, 'beforeactivate._change', function(e) {
					var elem = e.target;

					if (rformElems.test(elem.nodeName) && !doly._data(elem, '_change_attached')) {
						facade.add(elem, 'change._change', function(event) {
							if (this.parentNode && !event.isSimulated && !event.isTrigger) {
								facade.simulate('change', this.parentNode, event, true);
							}
						});
						doly._data(elem, '_change_attached', true);
					}
				});
			},

			handle: function(event) {
				var elem = event.target;

				// Swallow native change events from checkbox/radio, we already triggered them above
				if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== 'radio' && elem.type !== 'checkbox')) {
					return event.handleObj.handler.apply(this, arguments);
				}
			},

			teardown: function() {
				facade.remove(this, '._change');

				return !rformElems.test(this.nodeName);
			}
		};
	}

	// Create 'bubbling' focus and blur events
	if (!support.focusinBubbles) {
		doly.each({focus: 'focusin', blur: 'focusout'}, function(orig, fix) {

			// Attach a single capturing handler while someone wants focusin/focusout
			var attaches = 0,
				handler = function(event) {
					facade.simulate(fix, event.target, doly.event.fix(event), true);
				};

			special[fix] = {
				setup: function() {
					if (attaches++ === 0) {
						document.addEventListener(orig, handler, true);
					}
				},
				teardown: function() {
					if (--attaches === 0) {
						document.removeEventListener(orig, handler, true);
					}
				}
			};
		});
	}
	
	return doly;
});