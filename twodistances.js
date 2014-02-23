(function() {
'use strict';
require: document.createElement('canvas').getContext .exists;

window.TwoDistances = TwoDistances;
TwoDistances.Node = Node;

function Coordinates(x, y) {
    this.x = x;
    this.y = y;
}

Coordinates.prototype.toString = function() {
    return "Coordinates(" + x + ", " + y + ")";
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
    this.twoDistances = null;
}

Node.prototype.setTwoDistances = function(twoDistances) {
    this.twoDistances = twoDistances;

    // it is an error if the distances sum to less than the direct origin distances
    if (this.distanceA + this.distanceB < this.twoDistances.originDistances) {
        console.error("Distances are impossibly small.", this.distanceA, this.distanceB);
        throw new Error("Distances are impossibly small.", this);
    }

    // or if difference between the distances is larger than the direct origin distances
    if (Math.abs(this.distanceA - this.distanceB) > this.twoDistances.originDistances) {
        console.error("Distances are impossibly far apart.", this.distanceA, this.distanceB);
        throw new Error("Distances are impossibly far apart.", this);
    }
}

Node.prototype.coordinates = function() {
    if (typeof this._coordinates === 'undefined') {
        var bottomLeftAngle = triangle.angleFromSides(
            this.distanceB, this.distanceA, this.twoDistances.originDistances);
        var y = triangle.side(bottomLeftAngle, this.distanceA, 0.5 * Math.PI);
        var x = (
            this.twoDistances.originA.coordinates().x +
            rightTriangle.side(this.distanceA, y));

        this._coordinates = new Coordinates(x, y);
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

    for (var i = 0; i < this.nodes.length; i++) {
        this.nodes[i].setTwoDistances(this);
    }

    this.width = (2.0 - originDistances);
    this.height = Math.pow(1 - Math.pow(originDistances / 2, 2), 1/2);

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.scale * (this.width + 2.0 * this.padding);
    this.canvas.height = this.scale * (this.height + 2.0 * this.padding);

    this.graphics = this.canvas.getContext('2d');

    this.draw();
}

TwoDistances.prototype.scale = 256;
TwoDistances.prototype.padding = 1/16;
TwoDistances.prototype.scaleX = function(x) {
    return this.scale * (this.padding + x);
};
TwoDistances.prototype.scaleY = function(y) {
    return this.scale * (this.padding + this.height - y)
};

TwoDistances.prototype.draw = function() {
    this.graphics.clearRect(0, 0, this.width, this.height);

    for (var i = 0; i < this.nodes.length; i++) {
        var node = this.nodes[i];
        var coordinates = node.coordinates();

        this.graphics.strokeStyle = node.color || 'rgba(128, 128, 128, 1.0)';
        this.graphics.fillStyle = this.graphics.strokeStyle;
        this.graphics.lineWidth = this.scale / 64;

        if (node.source) {
            var sourceCoordinates = node.source.coordinates();

            this.graphics.beginPath();
            this.graphics.moveTo(
                this.scaleX(coordinates.x),
                this.scaleY(coordinates.y));
            this.graphics.lineTo(
                this.scaleX(sourceCoordinates.x),
                this.scaleY(sourceCoordinates.y));
            this.graphics.stroke();
            this.graphics.closePath();
        }

        this.graphics.beginPath();
        this.graphics.arc(
            this.scaleX(coordinates.x),
            this.scaleY(coordinates.y),
            this.scale / 32,
            0.0,
            2.0 * Math.PI,
            true);

        this.graphics.fill();
        this.graphics.stroke();
        this.graphics.closePath();

        // XXX(JB): for testing, draw lines to origins
        this.graphics.beginPath();
        this.graphics.lineWidth = 1;
        this.graphics.strokeStyle = this.originA.color;
        this.graphics.moveTo(
            this.scaleX(coordinates.x),
            this.scaleY(coordinates.y));
        this.graphics.lineTo(
            this.scaleX(this.originA.coordinates().x),
            this.scaleY(this.originA.coordinates().y));
        this.graphics.stroke();
        this.graphics.closePath();

        this.graphics.beginPath();
        this.graphics.lineWidth = 1;
        this.graphics.strokeStyle = this.originB.color;
        this.graphics.moveTo(
            this.scaleX(coordinates.x),
            this.scaleY(coordinates.y));
        this.graphics.lineTo(
            this.scaleX(this.originB.coordinates().x),
            this.scaleY(this.originB.coordinates().y));
        this.graphics.stroke();
        this.graphics.closePath();
    }
};

// Basic trig utilities
var triangle = {
    angleFromSides: function(opposite, adjacent1, adjacent2) {
        // cosine law
        return Math.acos(
            (Math.pow(adjacent1, 2) + Math.pow(adjacent2, 2) - Math.pow(opposite, 2)
            ) / (2 * adjacent1 * adjacent2));
    },
    side: function(oppositeAngle, other, otherOppositeAngle) {
        // sine law
        return (other / Math.sin(otherOppositeAngle)) * Math.sin(oppositeAngle);
    }
};
var rightTriangle = {
    hypotenuse: function(a, b) {
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    },
    side: function(hypotenuse, opposite) {
        return Math.sqrt(Math.pow(hypotenuse, 2) - Math.pow(opposite, 2));
    },
};

}());
