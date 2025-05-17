const atomicSDK = require('@brobridge/atomic-sdk');

module.exports = function(RED) {

  function TestSourceNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    let messages = parseInt(config.messages) || 1;

    // Register the node as a Atomic Component
    atomicSDK.registerAtomicComponent(node);
    atomicSDK.enableSessionManager(node);

    let sm = node.atomic.getModule('SessionManager');

    this.on('input', function(msg, send, done) {

      let session = sm.createSession();

      session.on('resume', function() {

        let m = {
          payload: `Message ${session.resumeCounter}`,
          complete: (session.resumeCounter >= messages) ? true : false
        };

        session.bindMessage(m);
        send(m);

        if (session.resumeCounter >= messages) {
          session.close();
        }
      });

      session.on('close', function() {
        done();
      });

      session.resume();

    });

  }

  RED.nodes.registerType('Test Source', TestSourceNode);
}
