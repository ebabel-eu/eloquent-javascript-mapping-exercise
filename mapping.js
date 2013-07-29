/*jslint browser: true */

var mapping = {};

(function () {
    'use strict';

    // Initialise roads.
    mapping.roads = {};

    // Create a road between 2 points, going both ways.
    mapping.makeRoad = function (parameters) {
        var addRoad;

        // parameters and some of its properties are required.
        if (!parameters || !parameters.from || !parameters.to || !parameters.distance) {
            return undefined;
        }

        // twoWays is optional and its default value is true.
        if (parameters.twoWays === null || parameters.twoWays === undefined) {
            parameters.twoWays = true;
        }

        // Add a road to the array of roads
        addRoad = function (from, to, distance) {
            // If the departure point doesn't exist yet, create an empty array for it.
            if (mapping.roads[from] === undefined) {
                mapping.roads[from] = [];
            }

            // Add destination point and distance from the departure point.
            mapping.roads[from].push({ to: to, distance: distance });
        };

        // Add route from A to B.
        addRoad(parameters.from, parameters.to, parameters.distance);

        // Add the return route from B back to A.
        if (parameters.twoWays) {
            addRoad(parameters.to, parameters.from, parameters.distance);
        }

        // Allow chaining.
        return this;
    };

    // Create multiple roads from one point to several other points.
    mapping.makeRoads = function (parameters) {
        var index;

        // Validation.
        if (!parameters || !parameters.from || !parameters.destinations) {
            return undefined;
        }

        // Loop through each destination and create a road between 'from' point and the 'to' point.
        for (index = 0; index < parameters.destinations.length; index = index + 1) {
            mapping.makeRoad({
                from: parameters.from,
                to: parameters.destinations[index].to,
                distance: parameters.destinations[index].distance,
                twoWays: parameters.destinations[index].twoWays
            });
        }

        return this;
    };

    // Return the roads starting from a given place.
    mapping.roadsFrom = function (place) {
        var found = mapping.roads[place];

        if (found === undefined) {
            throw new Error('No place named ' + place + ' can be found.');
        }

        return found;
    };


    // Create all roads data. Distance is in Kilometers.
    mapping.makeRoads({
        from: 'Amsterdam',
        destinations: [
            { to: 'Arnhem', distance: 79.40 },
            { to: 'Baarn', distance: 28.99 },
            { to: 'Hilversum', distance: 22.28 }
        ]
    });

}());