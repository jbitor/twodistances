(function() {
'use strict';
require: TwoDistances .exists;

[0.0, 0.3, 0.6, 0.95].forEach(function(distance) {
    var nodes = {};

    var graph = new TwoDistances(distance, [
        nodes.a = new TwoDistances.Node(0.3, 0.8),
        nodes.b = new TwoDistances.Node(0.4, 0.7, nodes.a),
        nodes.c = new TwoDistances.Node(0.6, 0.5, nodes.a),
        nodes.d = new TwoDistances.Node(0.8, 0.4, nodes.b),
        nodes.e = new TwoDistances.Node(0.7, 0.3, nodes.c),
        nodes.f = new TwoDistances.Node(0.8, 0.2, nodes.b),
    ]);

    document.body.appendChild(graph.canvas);
    // document.body.appendChild(document.createElement('br'));
    graph.canvas.style.border = '1px solid black';
});

}());
