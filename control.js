module.exports = function(RED) {

  function ControlNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.action = config.action || 'continue';

    // Target MS-SQL Execute Node ID
    node.selectMode = config.selectMode || 'auto';
    node.selectedNodes = config.selectedNodes || [];

    node.on('input', function(msg, send, done) {

      if (!(msg.sessions instanceof Array)) {
        if (done)
          done();

        return;
      }

      // Handling multiple sessions
      let selectedNodes = (msg.selectMode == 'auto') ? [] : node.selectedNodes;
      msg.sessions.forEach(sessionId => {
        handleSession(selectedNodes, node.action, sessionId);
      });

      if (done) {
        done();
      }
    });

    function handleSession(allowedNodes, action, sessionId) {

      // get first part of the sessionId as target node id
      let index = sessionId.indexOf('-');
      if (index === -1) {
        return null;
      }

      let targetNodeId = sessionId.substring(0, index);

      // Check if the target node is in the allowed nodes list
      if (allowedNodes.length > 0 && allowedNodes.indexOf(targetNodeId) === -1) {
        // disallowed
        return null;
      }

      // Getting the target node by id
      let targetNode = RED.nodes.getNode(targetNodeId);
      if (!targetNode) {
        return null;
      }

      // Check if the target node is a controllable node
      if (!targetNode.atomic) {
        node.error('target node is not controllable');
        return null;
      }

      let sm = targetNode.atomic.getModule('SessionManager');
      if (!sm) {
        node.error('target node is not controllable');
        return null;
      }

      // Perform action based on the node's action property
      let err = null;
      switch(action) {
      case 'continue':
        sm.resumeSession(sessionId);
        if (err) {
          break;
        }

        break;
      case 'break':
        sm.closeSession(sessionId);
        break;
      default:
        node.error(`Unknown action ${node.action}`, msg);
      }
    }
  }

  // Admin APIs
  const api = require('./apis');
  api.init(RED);

  RED.nodes.registerType('Flow Control', ControlNode);
}
