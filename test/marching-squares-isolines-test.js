var tape = require("tape"),
    isolines = require("../");

tape("Basic lines must behave as expected", function(test) {
    var data = [[0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]];

    var isolinesData = isolines.isoline(data, 0.5);
    test.deepEqual(isolinesData, 
                   [[[1, 0.5],[0.5,1],[1,1.5],[1.5,1],[1,0.5]]],
                   "The basic line must be correct");

    data = [[0, 0, 1],
            [0, 0, 0],
            [0, 0, 0]];

    isolinesData = isolines.isoline(data, 0.5);

    test.deepEqual(isolinesData, 
                   [[[1.5,0],[2,0.5]]],
                   "Non closed line must be correct");


    data = [[5, 5, 5, 5, 5, 5, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 5, 18, 5, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 5, 5, 5, 5, 5, 5]];

    isolinesData = isolines.isoline(data, 9);
    test.equal(isolinesData.length, 3, "This data should give three isolines (not four as in isobands)");

    test.deepEqual(isolinesData[0], 
    [[1, 0.5714285714285714], [0.5714285714285714, 1], [0.5714285714285714, 2], [0.5714285714285714, 3], [0.5714285714285714, 4], [0.5714285714285714, 5], [1, 5.428571428571429], [2, 5.428571428571429], [3, 5.428571428571429], [4, 5.428571428571429], [5, 5.428571428571429], [5.428571428571429, 5], [5.428571428571429, 4], [5.428571428571429, 3], [5.428571428571429, 2], [5.428571428571429, 1], [5, 0.5714285714285714], [4, 0.5714285714285714], [3, 0.5714285714285714], [2, 0.5714285714285714], [1, 0.5714285714285714]],
    "First ring must be this one");

    test.end();
});
tape("Isolines with projected coordinates", function(test) {  
    var data = [[0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]];

    test.throws(function() {isolines.projectedIsoline(data, "hola", 0.5, 1.0);},
        Error("GeoTransform must be a 6 elements array"),
        "Correct error when GeoTransform is wrong"); 

    test.throws(function() {isolines.projectedIsoline(data, [34], 0.5, 1.0);},
        Error("GeoTransform must be a 6 elements array"),
        "Correct error when GeoTransform is wrong"); 

    var isolinesData = isolines.projectedIsoline(data, [10, 1, 0, 10, 0, -1], 0.5);
    test.deepEqual(isolinesData, [[[11,9.5],[10.5,9],[11,8.5],[11.5,9],[11,9.5]]],
        "The simple isoline must be correct");

    test.deepEqual(isolines.projectedIsoline(data, [20, 1, 0, 10, 0, -1], 0.5, 1.0),
        [[[21,9.5],[20.5,9],[21,8.5],[21.5,9],[21,9.5]]], "Correct isoline with another GeoTransform");

    test.end();
});

tape("Isolines multiple breaks and GeoJSON output", function(test) {    
    var data = [[0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]];

    var lines = isolines.isolines(data, [10, 1, 0, 10, 0, -1], [0.5]);
    test.equal(lines.features.length, 1, "The function must generate one isoline");
    test.deepEqual(lines.features[0].properties,
        [{ value: 0.5 }], "Value must be set as properties");

    test.equal(lines.features[0].geometry.type, "MultiLineString", "The geometry type must be MultiLineString");
    test.deepEqual(lines.features[0].geometry.coordinates,  isolines.projectedIsoline(data, [10, 1, 0, 10, 0, -1], 0.5), 
            "The coordinates must be as in the projected coordinates function");

    test.end();
});
