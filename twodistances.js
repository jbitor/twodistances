(function() {
'use strict';
require: document.createElement('canvas').getContext .exists;

window.TwoDistances = TwoDistances;
TwoDistances.Node = Node;

function Coordinates(x, y) {
    this.x = x;
    this.y = y;
}

function Node(distanceA, distanceB, source, color) {
    if (!(distanceA >=0 && distanceA <= 1)) {
        throw new Error("distanceA=" + distanceA, distanceA);
    }
    if (!(distanceB >=0 && distanceB <= 1)) {
        throw new Error("distanceB=" + distanceB, distanceB);
    }
    if (source == null) {
        source = null;
    } else if (!(source instanceof Node)) {
        throw new Error("source=" + source, source);
    }
    if (color == null) {
        color = null;
    } else if (!(typeof color === 'string')) {
        throw new Error("color=" + color);
    }

    this.distanceA = distanceA;
    this.distanceB = distanceB;
    this.source = source;
    this.color = color;
}

Node.prototype.coordinates = function(twoDistances) {
    if (typeof this._coordinates === 'undefined') {
        this._coordinates = new Coordinates(
            // TODO: everything interesting
            Math.random(),
            Math.random() / 2
        );
    }

    return this._coordinates;
};

// All distances must be between 0.0 and 1.0.
function TwoDistances(originDistances, nodes) {
    if (!(originDistances >= 0.0 && originDistances < 1.0)) {
        throw new Error("originDistances=" + originDistances);
    }

    this.originDistances = originDistances;

    this.originA = new Node(0.0, originDistances, null, 'rgba(255, 0, 0, 0.75)');
    this.originA._coordinates = new Coordinates(1.0 - originDistances, 0);

    this.originB = new Node(originDistances, 0.0, null, 'rgba(0, 0, 255, 0.75)')
    this.originB._coordinates = new Coordinates(1.0, 0);

    this.nodes = [this.originA, this.originB];

    for (var i = 0; i < nodes.length; i++) {
        this.nodes.push(nodes[i]);
    }

    this.width = (2.0 - originDistances);
    this.height = (Math.pow(1 - Math.pow(originDistances / 2, 2), 1/2));

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.scale * (this.width + 2.0 * this.padding);
    this.canvas.height = this.scale * (this.height + 2.0 * this.padding);

    this.graphics = this.canvas.getContext('2d');

    this.draw();
}

TwoDistances.prototype.scale = 256;
TwoDistances.prototype.padding = 1/64;

TwoDistances.prototype.draw = function() {
    this.graphics.clearRect(0, 0, this.width, this.height);

    for (var i = 0; i < this.nodes.length; i++) {
        var node = this.nodes[i];
        var coordinates = node.coordinates(this);

        this.graphics.strokeStyle = node.color || 'rgba(128, 128, 128, 1.0)';
        this.graphics.fillStyle = this.graphics.strokeStyle;
        this.graphics.lineWidth = this.scale / 128;

        if (node.source) {
            var sourceCoordinates = node.source.coordinates();

            this.graphics.beginPath();
            this.graphics.moveTo(
                this.scale * (this.padding + coordinates.x),
                this.scale * (this.padding + this.height - coordinates.y));
            this.graphics.lineTo(
                this.scale * (this.padding + sourceCoordinates.x),
                this.scale * (this.padding + this.height - sourceCoordinates.y));
            this.graphics.stroke();
            this.graphics.closePath();
        }

        this.graphics.beginPath();
        this.graphics.arc(
            this.scale * (this.padding + coordinates.x),
            this.scale * (this.padding + this.height - coordinates.y),
            this.scale / 64,
            0.0,
            2.0 * Math.PI,
            true);

        this.graphics.fill();
        this.graphics.closePath();
    }
};

}());
