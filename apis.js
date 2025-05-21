const atomicSDK = require('@brobridge/atomic-sdk');

module.exports = {
    init: init 
};

function init(RED) {
    var prefix = '/nodes/@brobridge/atomic-flowcontrol/apis';

  RED.httpAdmin.get(prefix + '/controllableNodes', RED.auth.needsPermission('flows.write'), function(req, res) {
    const nodes = atomicSDK.getContext().getNodesByModule('SessionManager');
    res.json(nodes.map(node => node.id));
  });
}
