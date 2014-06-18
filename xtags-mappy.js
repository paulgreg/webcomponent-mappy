(function(){

  xtag.register('mappy-element', {
    lifecycle: {
      created: function(){
          this.setAttribute('lat', 48.8567);
          this.setAttribute('lng', 2.3508);
          this.setAttribute('zoom', 7);
          this.setAttribute('layerControl', false);
      },
      inserted: function(){
            var div = document.createElement('div');
            div.id = 'map'
            div.style.width = '400px';
            div.style.height = '400px';
            this.appendChild(div);

            this.map = new L.Mappy.Map(div, {
                center: [this.getAttribute('lat'), this.getAttribute('lng')],
                zoom: this.getAttribute('zoom'),
                layersControl: this.getAttribute('layersControl'),
                logoControl: {
                    dir: "images/"
                }
            });

            L.Mappy.setToken("Sy2MzsQjDYbvAoOibcNz5oVDUi1y848EN6EpC4K+0W6gWEWZgY9bOK1uRyx05CzxGptivijagx20wZc08rtYufgGsxDSvrta");

            this.mLayer = L.layerGroup().addTo(this.map);
      },
      removed: function(){
      },
      attributeChanged: function(){
          console.log(arguments);
      }
    },
    accessors: {
        lat: {},
        lng: {},
        zoom: {},
        layersControl: {
            attribute: { boolean: true }
        }
    },
    methods: {
        locate: function(term) {
            L.Mappy.Services.geocode(term,
                // Callback de succès
                function(results) {
                    var coords = results[0].Point.coordinates.split(",").reverse();
                    this.map.setView(coords, 7);
                    this.mLayer.clearLayers();
                    this.mLayer.addLayer(L.marker(coords));
                }.bind(this),
                // Callback d'erreur
                function() {
                    // Error during geocoding
                }
            );
        },
        itinerary: function(from, to, optionsParam) {
            if (typeof from === "string") {
                L.Mappy.Services.geocode(from,
                    function(results) {
                        var coords = results[0].Point.coordinates.split(",").reverse();
                        console.log('from resolved', coords);
                        this.itinerary.call(this, coords, to, optionsParam);
                    }.bind(this),
                    function() {
                        console.log('error while resolving from');
                    }
                );
            } else if (typeof to === "string") {
                L.Mappy.Services.geocode(to,
                    function(results) {
                        var coords = results[0].Point.coordinates.split(",").reverse();
                        console.log('to resolved', coords);
                        this.itinerary.call(this, from, coords, optionsParam);
                    }.bind(this),
                    function() {
                        console.log('error while resolving to');
                    }
                );
            } else {
               var options = {
                    vehicle: L.Mappy.RouteModes.CAR, // PEDESTRIAN, BIKE, MOTORBIKE
                    cost: "length", // or "time" or "price"
                    gascost: 1.0,
                    gas: "petrol", // or diesel, lpg
                    nopass: 0, // 1 pour un trajet sans col
                    notoll: 0, // 1 pour un trajet sans péage
                    caravane: 0, // 1 pour un trajet avec caravane
                    infotraffic: 0 // 1 pour un trajet avec trafic
                };
                for (var attrname in optionsParam) {
                    options[attrname] = optionsParam[attrname]; // Merge objects
                }

                console.log('launching itinerary', from, to);
                L.Mappy.Services.route([from, to], options,
                    function(results) {
                        console.log('itinerary found', results);
                        var polyline = L.polyline(results.routes.route["polyline-definition"].polyline);
                        this.mLayer.clearLayers();
                        this.mLayer.addLayer(polyline);
                        this.map.fitBounds(polyline);
                    }.bind(this),
                    function() {
                        console.log('error while searching itinerary');
                    }
                );
            }
       }
    },
    events: {
    }
  });

})();
