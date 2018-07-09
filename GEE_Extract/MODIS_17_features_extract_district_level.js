

var TABLE = ee.FeatureCollection("ft:10WS-ouyBw0Bc_xmmGD-S-NuJ85odITxoOCGvFXqx");



TABLE = TABLE.merge(ee.FeatureCollection('ft:13hlU2arZ5elLBmmuCasSV_r_5XiYru8EjhoKtUgi'));
TABLE = TABLE.merge(ee.FeatureCollection('ft:1yUA3Cx8EoNtRCS9xxvlW1ByQddcCsPUB4KgoPs1k'));


var district = (ee.Feature)(TABLE.first())
var band = 'Land_Cover_Type_1'
var modis = ee.Image('MODIS/051/MCD12Q1/2012_01_01')
    .select(band);


function getCrops(district){
var res = ee.Feature(null)
  res = res.set('village_code_2011',district.get('village_code_2011'))

for(var i = 0; i<17;i++){
var modis2 = modis.expression('a==i?1:0',{'a':modis.select(band),'i':i})
var ss = modis2.multiply(ee.Image.pixelArea()).multiply(1e-6).reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: district.geometry(),
  scale: 100,
  maxPixels: 1e9
});
res = res.set('feature_'+i,ss.get('constant'))
}
return res
}

print(getCrops(district))
Export.table.toDrive(TABLE.map(getCrops))
