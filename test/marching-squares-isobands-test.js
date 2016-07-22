var tape = require("tape"),
    isobands = require("../");

tape("Basic isobands must behave as expected", function(test) {
    var data = [[0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]];

    test.deepEqual(isobands.isobandCoords(data, 0.5, 1.0), 
                   [[[1, 0.5],[0.5,1],[1,1.5],[1.5,1],[1,0.5]]],
                   "The basic band must be correct");

    var data = [[5, 5, 5, 5, 5, 5, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 5, 18, 5, 12, 5],
            [5, 12, 5, 5, 5, 12, 5],
            [5, 12, 12, 12, 12, 12, 5],
            [5, 5, 5, 5, 5, 5, 5]];

    var band = isobands.isobandCoords(data, 9, 4);
    test.equal(band.length, 4, "This data should give a four rings polygon");

    test.deepEqual(band[0], 
    [[1, 0.5714285714285714], [0.5714285714285714, 1], [0.5714285714285714, 2], [0.5714285714285714, 3], [0.5714285714285714, 4], [0.5714285714285714, 5], [1, 5.428571428571429], [2, 5.428571428571429], [3, 5.428571428571429], [4, 5.428571428571429], [5, 5.428571428571429], [5.428571428571429, 5], [5.428571428571429, 4], [5.428571428571429, 3], [5.428571428571429, 2], [5.428571428571429, 1], [5, 0.5714285714285714], [4, 0.5714285714285714], [3, 0.5714285714285714], [2, 0.5714285714285714], [1, 0.5714285714285714]],
    "First ring must be this one");



    test.end();
});

tape("Isobands path format", function(test) {    
    var data = [[0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]];

    test.throws(function() {isobands.isoband(data, "hola", 0.5, 1.0)},
        Error("GeoTransform must be a 6 elements array"),
        "Correct error when GeoTransform is wrong"); 

     test.throws(function() {isobands.isoband(data, [34], 0.5, 1.0)},
        Error("GeoTransform must be a 6 elements array"),
        "Correct error when GeoTransform is wrong"); 

     var path = isobands.isoband(data, [10, 1, 0, 10, 0, -1], 0.5, 1.0)
     test.equal(path, "M11,9.5L10.5,9L11,8.5L11.5,9L11,9.5Z", "Path must be correct");

     var path = isobands.isoband(data, [20, 1, 0, 10, 0, -1], 0.5, 1.0)
     test.equal(path, "M21,9.5L20.5,9L21,8.5L21.5,9L21,9.5Z", "Correct path with another GeoTransform");

    test.end();
});

