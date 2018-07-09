var imageCollection = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG"),
    table = ee.FeatureCollection("users/sayee0612/2011_Dist"),
    table2 = ee.FeatureCollection("users/sayee0612/ind_1");
 
var allImg = imageCollection.filterDate('2016-04-01', '2017-03-31').mean();
Map.addLayer(allImg,{bands:['avg_rad']});




//MahaOrissa
var sumOfLightsMahaOrissa = allImg.reduceRegions({
 collection:table2,
 scale:30,
 reducer:ee.Reducer.sum(),

});

//////MAHA1 filtering colum
var maha = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['ID_0','ID_1','NAME_1','TYPE_1','avg_rad','cf_cvg']
 
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var mahaOrissa = sumOfLightsMahaOrissa.map(maha);

Export.table.toDrive({
 collection: mahaOrissa,
 description:'VIIRS_2016_STATE',
 fileFormat: 'CSV'
});

