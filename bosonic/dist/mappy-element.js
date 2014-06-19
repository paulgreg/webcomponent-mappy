(function () {
    var MappyElementPrototype = Object.create(HTMLElement.prototype, {
            div: {
                enumerable: true,
                get: function () {
                    return this.querySelector('div#map');
                }
            },
            createdCallback: {
                enumerable: true,
                value: function () {
                    var t = this.template.content.cloneNode(true);
                    this.appendChild(t);
                    this.map = new L.Mappy.Map(this.div, {
                        center: [
                            this.lat,
                            this.lng
                        ],
                        zoom: this.zoom,
                        layersControl: this.layersControl,
                        logoControl: { dir: '../../images/' }
                    });
                }
            }
        });
    window.MappyElement = document.registerElement('mappy-element', { prototype: MappyElementPrototype });
    Object.defineProperty(MappyElementPrototype, 'template', {
        get: function () {
            var fragment = document.createDocumentFragment();
            var div = fragment.appendChild(document.createElement('div'));
            div.innerHTML = ' <div id="map"></div> ';
            while (child = div.firstChild) {
                fragment.insertBefore(child, div);
            }
            fragment.removeChild(div);
            return { content: fragment };
        }
    });
}());