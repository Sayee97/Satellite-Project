var goa = /* color: #d63000 */ee.Geometry.Polygon(
        [[[73.916015625, 14.689881366618764],
          [74.3829345703125, 14.79081652429783],
          [74.344482421875, 15.771109173575292],
          [73.5919189453125, 15.771109173575292]]]),
    sikkim = /* color: #98ff00 */ee.Geometry.Polygon(
        [[[88.714599609375, 27.07380043091176],
          [89.033203125, 27.293689224852407],
          [88.857421875, 28.188243641850313],
          [88.0828857421875, 28.06713326012151],
          [87.9840087890625, 27.366889032381298],
          [87.9510498046875, 27.09336363811584]]]),
    gujarat = /* color: #0b4a8b */ee.Geometry.Polygon(
        [[[68.455810546875, 22.816694126899844],
          [69.752197265625, 20.735565905218635],
          [72.630615234375, 20.12815531179718],
          [73.070068359375, 19.993998469485504],
          [73.4271240234375, 20.122997556207757],
          [74.4598388671875, 21.19977680725009],
          [74.68505859375, 22.77618150508651],
          [73.85009765625, 24.28702686537644],
          [72.09228515625, 24.906367237907997],
          [68.7744140625, 24.467150664739002],
          [67.65380859375, 23.704894502324915]]]),
    orrisa = /* color: #00ffff */ee.Geometry.Polygon(
        [[[81.002197265625, 17.696361965403323],
          [82.650146484375, 17.96828290799978],
          [85.01220703125, 18.999802829053262],
          [86.6162109375, 20.02496791722277],
          [87.1435546875, 20.622502259344817],
          [87.69287109375, 21.779905342529645],
          [86.0009765625, 22.715390019335942],
          [83.3203125, 22.654571520098997],
          [82.001953125, 20.632784250388028]]]),
    bihar = /* color: #d63000 */ee.Geometry.Polygon(
        [[[83.671875, 27.81964475509945],
          [83.0126953125, 24.226928664976374],
          [89.208984375, 24.467150664739002],
          [88.4344482421875, 26.926967642880523]]]),
    maharashtra = /* color: #98ff00 */ee.Geometry.Polygon(
        [[[71.8505859375, 18.35452552912664],
          [73.883056640625, 14.519780046326085],
          [75.52001953125, 16.109153239219467],
          [81.1669921875, 18.521283325496277],
          [81.18896484375, 21.80030805097259],
          [74.94873046875, 22.411028521558706],
          [72.00439453125, 21.841104749065032]]]),
    kerela = /* color: #0b4a8b */ee.Geometry.Polygon(
        [[[76.53076171875, 8.124491290861204],
          [77.45361328125, 7.906911616469297],
          [77.7392578125, 9.687398430760624],
          [76.70654296875, 11.974844752931833],
          [74.94873046875, 13.068776734357693],
          [74.4873046875, 12.747516274952728]]]),
    karnataka = /* color: #ffc82d */ee.Geometry.Polygon(
        [[[74.102783203125, 14.424040444354697],
          [74.608154296875, 12.865359661408899],
          [75.2618408203125, 11.646856393732364],
          [76.541748046875, 11.490790980367056],
          [77.607421875, 11.695272733029402],
          [78.760986328125, 13.165073873513027],
          [78.387451171875, 13.976715394601785],
          [77.67333984375, 14.115267411122709],
          [77.62939453125, 15.623036831528264],
          [78.0029296875, 18.542116654448996],
          [77.16796875, 18.6670631919266],
          [75.673828125, 17.727758609852284],
          [72.97119140625, 16.74142754700361]]]);

var currState=bihar;
var nl2013 = ee.Image('NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182013').select("stable_lights");
nl2013=nl2013.float();
print (nl2013)


var bands = ee.List(['B1','B2','B3','B4','B5','B6','B7','B8','B9']);
var india_image = (ee.Image)(ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA').select(bands)
.filterBounds(currState).filterDate('2014-01-01','2014-12-01').filter(ee.Filter.lt('CLOUD_COVER',4)).median())

india_image=india_image.addBands(nl2013.select("stable_lights"));

print(india_image);

Map.addLayer(india_image.clip(currState), {bands: ['B3', 'B2', 'B1'], max: 0.4}, '3bands');
Map.addLayer(india_image.clip(currState), {bands: ['stable_lights']}, 'night_lights');
Map.addLayer(india_image, {}, 'all');

Export.image.toDrive({
  image: india_image.clip(currState),
  description: 'landsatPlusNightLightsGoa',
  scale: 30,
  maxPixels: 1e9,
  region: currState
});

