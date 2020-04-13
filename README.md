# Earthquake Map
### UC Berkeley - Module 13

### Summary of Challenge
This challenge was to add additional view options to our Earthquake map. In addition to adding a third map type, we were to add another layer that showed the tectonic plate fault lines. These lines were to be styled in a way to be visible on each map type.


### Summary of Data
The map, earthquake, and tectonic fault line overlays clearly show that earthquakes predominately occur along these lines. However, there are numerous areas (like around Oklahoma, New York, and Hawaii) where earthquakes are occurring, but are not near fault lines.


### Improvements
The following items could be added to future maps to provide more insight into the earthquake data.
- Add data for volcanic activity
- Add more details for earthquakes that are more than a certain distance away from a fault line.
- Add dynamic animation for earthquakes that are within the last day (blinking)


### Functionality
The map uses Leaflet.JS, D3.JS, mapbox, and our own custom script to display earthquake and fault line data. The data itself are GeoJSON series and are procured via calls to the USGS website and a github repo that contains the fault line coordinates. The map creates 3 layers for the map types (streets, satellite streets, and dark) and uses these for the map type choice. Overlaid on these maps are optional layers containing the earthquake data and tectonic fault lines. Both of the optional layers are styled with color and size. In addition to dynamic sizes and colors, the earthquake markers can be clicked for a popup of the magnitude and location.
