/**
 * [description]
 *
 *
 * 
 */
(function() {
    'use strict';

    var fs = require('fs'); // Node's file system lib.
    var bot;

    /** 
     * HackerRank bot code starts here..., remove comments on lines:
     * 18, 19 & 244 - comment out line 240.
     */

    // process.stdin.resume();
    // process.stdin.setEncoding('ascii');

    // Our models...

    var City = function() {
        this.isSafe = true;
    };

    var Road = function() {
        this.city1 = null;
        this.city2 = null;
        this.effort = null;
        this.canSkip = false;
    };

    // Our bot...

    /**
     * Our Bot's constructor, intialize's our params and sets 
     * up our event handlers for reading input.
     * 
     * @param {Object} input
     */
    var Bot = function(input) {

        this.input = input;

        this.init()
            .bindings();
    };

    /**
     * Initialize the configuration and settings for our bot.
     * 
     * @return {Bot}
     */
    Bot.prototype.init = function() {

        // System vars...

        this.debug = true;
        this.commands = ''; // Data being read into our bot.
        this.data = [];     // Array of our commands, itemized by line.

        // Unit counts...

        this.cityCount = 0;     // N 
        this.roadCount = 0;     // N-1
        this.machineCount = 0;  // K

        // Collections...

        this.cities = [];
        this.roads = [];
        this.machines = [];

        return this;
    };

    /**
     * Set bindings up for our bot.
     * 
     * @return {Bot}
     */
    Bot.prototype.bindings = function() {

        this.input.on('data', 
            this.store.bind(this)
        );

        this.input.on('end', 
            this.run.bind(this)
        );

        return this;
    };

    /**
     * Stores the commands sent to us via std input.
     * 
     * @param {Buffer} data
     */
    Bot.prototype.store = function(data) {
        this.commands += data;
    };

    /**
     * Formats our data input/commands for analysis 
     * and triggers our bot.
     */
    Bot.prototype.run = function() {
        this.data = this.commands.split('\n');
        this.process();
    };

    /**
     * Analyze our commands and form our solution.
     */
    Bot.prototype.process = function() {

        // Snag counts, build city and road lists.
        
        var counts = this.data.shift();

        this.cityCount = counts[0];          // N
        this.roadCount = this.cityCount - 1; // N-1
        this.machineCount = counts[2];       // K

        // Segment types of data.

        var roadData = this.data.splice(0, this.roadCount);
        var machineData = this.data;

        // Build our objects. 
        // (Order is important here so that we can map 
        // machines to cities and cities to roads.)
        
        this.formatMachines(machineData);
        this.buildCities();
        this.buildRoads(roadData);

        var res = this.determineEffort();

        process.stdout.write(res + '\n');
    };

    /**
     * Grabs the first item of each of our arrays (first char of each line)
     * since all machine input is a single integer on each line.
     * 
     * @param {Array} machines
     */
    Bot.prototype.formatMachines = function(machines) {

        machines.forEach(function(machine) {
            this.push( 
                parseInt(machine[0], 10) // Typecast to keep our int values for index searching.
            );
        }, this.machines);
    };

    /**
     * Builds our list of city objects.
     */
    Bot.prototype.buildCities = function() {

        for (var i = 0; i < this.cityCount; i += 1) {

            var city =  new City();
            city.isSafe = this.machines.indexOf(i) === -1 ? 1 : 0;

            this.cities.push(city);
        }
    };

    /**
     * Builds our list of road objects.
     * 
     * @param {Array} roads
     */
    Bot.prototype.buildRoads = function(roads) {

        roads.forEach(function(roadConfig) {

            var road = new Road();
            road.city1 = parseInt(roadConfig[0], 10);
            road.city2 = parseInt(roadConfig[2], 10);
            road.effort = parseInt(roadConfig[4], 10);
            road.canSkip = this.canWeSkip(roadConfig[0], roadConfig[2]);

            this.roads.push(road);

        }, this);
    };

    /**
     * Determines if the cities connected by a single road are both infected with machines OR 
     * are both free of machines.  If they are, then it would seem like a waste of time
     * destroying this particular bridge.  Let's skip it.
     * 
     * @param  {Integer} city1
     * @param  {Integer} city2
     * @return {Boolean} 
     */
    Bot.prototype.canWeSkip = function(city1, city2) {
        return (
            (!this.cities[city1].isSafe && !this.cities[city2].isSafe) ||
            (this.cities[city1].isSafe && this.cities[city2].isSafe)
        );
    };

    /**
     * Determines the level of effort it would take destroying all bridges
     * that connect an infected city to a machine free zone.
     * 
     * @return {Integer}
     */
    Bot.prototype.determineEffort = function() {

        var effort = 0;

        (this.roads).forEach(function(road) {
            if (!road.canSkip) {
                effort += road.effort;
            }
        });

        return effort;
    };
 
    /**
     * Helper function for debugging.
     * 
     * @param {String} string
     */
    Bot.prototype.log = function(string) {

        if (!this.debug) {
            return false;
        }

        process.stderr.write(string + '\n');
    };

    var input = fs.createReadStream('bot/input.txt');
    // var input = process.stdin;

    bot = new Bot(input);

})();
