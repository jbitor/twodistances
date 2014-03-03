(function() {
'use strict';
require: TwoDistances .exists;

(function() {
    var nodes = {};
    var graph = new TwoDistances(0.1, [
        nodes.a = new TwoDistances.Node(0.1, 0.05),
        nodes.b = new TwoDistances.Node(0.04, 0.06, nodes.a),
        nodes.c = new TwoDistances.Node(0.06, 0.05, nodes.a),
        nodes.d = new TwoDistances.Node(0.52, 0.59, nodes.b),
        nodes.e = new TwoDistances.Node(0.33, 0.30, nodes.c),
        nodes.f = new TwoDistances.Node(0.09, 0.04, nodes.b),
        nodes.f = new TwoDistances.Node(0.70, 0.65, nodes.b),
        nodes.g = new TwoDistances.Node(0.10, 0.03, nodes.c),
        nodes.i = new TwoDistances.Node(0.36, 0.45, nodes.g),
        nodes.i = new TwoDistances.Node(0.9, 0.9, nodes.g),
        nodes.j = new TwoDistances.Node(0.07, 0.07, nodes.g),
    ]);

    var wrapper = document.createElement('div');
    wrapper.appendChild(graph.canvas);
    document.body.appendChild(wrapper);
}());

(function() {
    var nodes = {};
    var graph = new TwoDistances(0.9, [
        nodes.a = new TwoDistances.Node(0.35, 0.8),
        nodes.b = new TwoDistances.Node(0.41, 0.7, nodes.a),
        nodes.c = new TwoDistances.Node(0.63, 0.5, nodes.a),
        nodes.d = new TwoDistances.Node(0.87, 0.4, nodes.b),
        nodes.e = new TwoDistances.Node(0.73, 0.3, nodes.c),
        nodes.f = new TwoDistances.Node(0.81, 0.2, nodes.b),
    ]);

    var wrapper = document.createElement('div');
    wrapper.appendChild(graph.canvas);
    document.body.appendChild(wrapper);
}());

}());
