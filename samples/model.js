/*
 *  Use a Model to manipulate semantically
 */

var iotdb = require("iotdb");

var WeMoSocketBridge = require('../WeMoSocketBridge').Bridge;
var WeMoSocketModel = require('../WeMoSocketModel').Model;

wrapper = iotdb.bridge_wrapper(new WeMoSocketBridge());
wrapper.on('discovered', function(bridge) {
    var model = new WeMoSocketModel();
    model.bind_bridge(bridge);

    model.on_change(function(model) {
        console.log("+ state\n ", model.thing_id(), model.state());
    });
    model.on_meta(function(model) {
        console.log("+ meta\n ", model.thing_id(), model.meta().state());
    });

    var on = false;
    var timer = setInterval(function() {
        if (!model.reachable()) {
            console.log("+ forgetting unreachable model");
            clearInterval(timer);
            return;
        }

        model.set("on", on);
        on = !on;
    }, 2500);
    
    console.log("+ discovered\n ", model.meta().state(), "\n ", model.thing_id());
})