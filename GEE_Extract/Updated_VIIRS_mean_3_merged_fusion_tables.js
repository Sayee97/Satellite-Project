var imageCollection = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG"),
    image = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20120401"),
    image2 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20120501"),
    image3 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20120601"),
    image4 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20120701"),
    image5 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20120801"),
    image6 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20120901"),
    image7 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20121001"),
    image8 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20121101"),
    image9 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20121201"),
    image10 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20130101"),
    image11 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20130201"),
    image12 = ee.Image("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG/20130301"),
    fcMahaOrissa = ee.FeatureCollection("ft:14D1gxaVsi4UQdED4E6886ayNFd7WlC5jdmHXgwHN"),
    fcBiharGuj = ee.FeatureCollection("ft:1LWgo7ozAxl9lH1g885j432odq0yqdmoiyJO1O-s5"),
    fcKerala = ee.FeatureCollection("ft:11-STJJFZgUt90rseMUZempHJLLxEP4cygT5cIDqv");
 
var allImg = imageCollection.filterDate('2012-04-01', '2013-03-31').mean();
Map.addLayer(allImg,{bands:['avg_rad']});




//MahaOrissa
var sumOfLightsMahaOrissa = allImg.reduceRegions({
 collection:fcMahaOrissa,
 scale:30,
 reducer:ee.Reducer.mean(),

});


////////MAHA1 filtering colum
var maha = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['description','name','ID','village_code_2001','village_code_2011','avg_rad']
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var mahaOrissa = sumOfLightsMahaOrissa.map(maha);

Export.table.toDrive({
 collection: mahaOrissa,
 description:'UpdatedMahaOrissaMEAN',
 fileFormat: 'CSV'
});




//Bihar Guj
var sumOfLightsBiharGuj = allImg.reduceRegions({
 collection:fcBiharGuj,
 scale:30,
 reducer:ee.Reducer.mean(),

});


////////MAHA1 filtering colum
var b = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['description','name','ID','village_code_2001','village_code_2011','avg_rad']
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var biharGuj = sumOfLightsBiharGuj.map(b);

Export.table.toDrive({
 collection: biharGuj,
 description:'UpdatedBiharGujMEAN',
 fileFormat: 'CSV'
});





//MahaOrissa
var kerala = allImg.reduceRegions({
 collection:fcKerala,
 scale:30,
 reducer:ee.Reducer.mean(),

});


////////MAHA1 filtering colum
var c = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['description','name','ID','village_code_2001','village_code_2011','avg_rad']
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var Kerala = kerala.map(c);

Export.table.toDrive({
 collection:Kerala ,
 description:'UpdatedKeralaMEAN',
 fileFormat: 'CSV'
});