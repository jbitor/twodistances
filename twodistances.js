(function() {
'use strict';
require: document.createElement('canvas').getContext .exists;

window.TwoDistances = TwoDistances;
TwoDistances.Node = Node;

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
        this._coordinates = {
            // TODO: everything interesting
            x: twoDistances.width * Math.random(),
            y: twoDistances.height * Math.random()
        }
    }

    return this._coordinates;
};

// All distances must be between 0.0 and 1.0.
function TwoDistances(originDistances, nodes) {
    this.nodes = [
        new Node(0.0, originDistances, null, 'rgba(255, 0, 0, 0.75)'),
        new Node(originDistances, 0.0, null, 'rgba(0, 0, 255, 0.75)')
    ];

    for (var i = 0; i < nodes.length; i++) {
        this.nodes.push(nodes[i]);
    }

    this.width = this.scale * (2.0 - originDistances);
    this.height = this.scale * (Math.pow(1 - Math.pow(originDistances / 2, 2), 1/2));

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width + this.padding * 2.0;
    this.canvas.height = this.height + this.padding * 2.0;

    this.graphics = this.canvas.getContext('2d');

    this.draw();
}

TwoDistances.prototype.scale = 512;
TwoDistances.prototype.padding = TwoDistances.prototype.scale / 64;

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
                this.padding + coordinates.x,
                this.padding + coordinates.y);
            this.graphics.lineTo(
                this.padding + sourceCoordinates.x,
                this.padding + sourceCoordinates.y);
            this.graphics.stroke();
            this.graphics.closePath();
        }

        this.graphics.beginPath();
        this.graphics.arc(
            this.padding + coordinates.x,
            this.padding + coordinates.y,
            this.scale / 64,
            0.0,
            2.0 * Math.PI,
            true);

        this.graphics.fill();
        this.graphics.closePath();
    }
};

}());
