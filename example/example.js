(function() {
'use strict';
require: TwoDistances .exists;

var nodes = {};

var graph = new TwoDistances(0.75, [
    nodes.a = new TwoDistances.Node(0.3, 0.4),
    nodes.b = new TwoDistances.Node(0.4, 0.2, nodes.a),
    nodes.c = new TwoDistances.Node(0.6, 0.3, nodes.a),
    nodes.d = new TwoDistances.Node(0.7, 0.1, nodes.c)
]);

document.body.appendChild(graph.canvas);
graph.canvas.style.border = '1px solid black';

window.graph = graph;

}());
