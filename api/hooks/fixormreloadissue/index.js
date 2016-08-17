/**
 * Sequalize + sails-hook-autoreload = no hook:orm:reloaded issue
 */
module.exports = function (sails) {
  return {
    configure: function() {
      sails.on('hook:orm:reload', function() {
        sails.emit('hook:orm:reloaded');
      });
    }
  };
};
