var tape = require("tape"),
    isobands = require("../");

tape("Basic isobands must behave as expected", function(test) {
    var data = [[0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]];

    test.deepEqual(isobands.isoband(data, 0.5, 1.0), 
                   [[[1, 0.5],[0.5,1],[1,1.5],[1.5,1],[1,0.5]]],
                   "The basic band must be correct");

    data = [[5, 5, 5, 5, 5, 5, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 5, 18, 5, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 5, 5, 5, 5, 5, 5]];

    var band = isobands.isoband(data, 9, 4);
    test.equal(band.length, 4, "This data should give a four rings polygon");

    test.deepEqual(band[0], 
    [[1, 0.5714285714285714], [0.5714285714285714, 1], [0.5714285714285714, 2], [0.5714285714285714, 3], [0.5714285714285714, 4], [0.5714285714285714, 5], [1, 5.428571428571429], [2, 5.428571428571429], [3, 5.428571428571429], [4, 5.428571428571429], [5, 5.428571428571429], [5.428571428571429, 5], [5.428571428571429, 4], [5.428571428571429, 3], [5.428571428571429, 2], [5.428571428571429, 1], [5, 0.5714285714285714], [4, 0.5714285714285714], [3, 0.5714285714285714], [2, 0.5714285714285714], [1, 0.5714285714285714]],
    "First ring must be this one");



    test.end();
});

tape("Isobands with projected coordinates", function(test) {    
    var data = [[0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]];

    test.throws(function() {isobands.projectedIsoband(data, "hola", 0.5, 1.0);},
        Error("GeoTransform must be a 6 elements array"),
        "Correct error when GeoTransform is wrong"); 

    test.throws(function() {isobands.projectedIsoband(data, [34], 0.5, 1.0);},
        Error("GeoTransform must be a 6 elements array"),
        "Correct error when GeoTransform is wrong"); 
     
    test.deepEqual(isobands.projectedIsoband(data, [10, 1, 0, 10, 0, -1], 0.5, 1.0),
        [[[11,9.5],[10.5,9],[11,8.5],[11.5,9],[11,9.5]]], "The simple isoband must be correct");

    test.deepEqual(isobands.projectedIsoband(data, [20, 1, 0, 10, 0, -1], 0.5, 1.0),
        [[[21,9.5],[20.5,9],[21,8.5],[21.5,9],[21,9.5]]], "Correct isoband with another GeoTransform");


    test.end();
});

tape("Isobands multiple breaks and GeoJSON output", function(test) {    
    var data = [[5, 5, 5, 5, 5, 5, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 5, 18, 5, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 5, 5, 5, 5, 5, 5]];

    var intervals = [6, 10, 14];
    var geoTransform = [10, 1, 0, 10, 0, -1];
    var bands = isobands.isobands(data, geoTransform, intervals);
    
    test.equal(bands.features.length, 2, "The function must generate two bands");

    test.deepEqual(bands.features[0].properties,
        [{ lowerValue: 6, upperValue: 10 }], "Intervals must be set as properties");
    test.deepEqual(bands.features[1].properties,
        [{ lowerValue: 10, upperValue: 14 }], "Intervals must be set as properties");

    test.equal(bands.features[1].geometry.coordinates.length, 
        4, "Coordinates must have four elements");


    test.end();
});


