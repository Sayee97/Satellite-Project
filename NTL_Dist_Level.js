 var imageCollection = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG"),
    table3 = ee.FeatureCollection("users/sayee0612/Census_2011");
var allImg = imageCollection.filterDate('2017-04-01', '2018-03-31').mean();
Map.addLayer(allImg,{bands:['avg_rad']});



var sumOfLightsMahaOrissa = allImg.reduceRegions({
 collection:table3,
 scale:30,
 reducer:ee.Reducer.sum(),

});

var maha = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','DT_CEN_CD','ST_CEN_CD','ST_NM','avg_rad','censuscode','cf_cvg']
 
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var mahaOrissa = sumOfLightsMahaOrissa.map(maha);

Export.table.toDrive({
 collection: mahaOrissa,
 description:'VIIRS_2017_DISTRICT_Upd',
 fileFormat: 'CSV'
});