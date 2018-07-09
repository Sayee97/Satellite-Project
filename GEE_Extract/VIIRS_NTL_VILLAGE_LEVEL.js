
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
    fc = ee.FeatureCollection("ft:12C0095JAOOrJyL9K-RI_ePuSPfe5XwED-ZIvfGnE"),
    fcOrissa = ee.FeatureCollection("ft:1VisMLgHDmzUGr8tqWQWeBRqNL0_3qlF3Ugv24UKB"),
    fcSikkim = ee.FeatureCollection("ft:144copRdjlkKMR6PuYBXN-sLIE1U4vqn-NUCHLjlZ"),
    fcMaha = ee.FeatureCollection("ft:184ug09lm7AW1V1To4WmC1o0zJW3s7bYW2Gy82uo1"),
    fcOrissa1 = ee.FeatureCollection("ft:1KDh7t6ZOVKpr5Ld_P7v0mG8u0LPFvitRJDsitXuN"),
    fcBihar = ee.FeatureCollection("ft:1FNfPo_YrXtIoPNF1y153J7mKqmNbvoZF4LK0TZqT"),
    fcGoa = ee.FeatureCollection("ft:1j5FnlCxJv5s9WiGQSrnVKfuSugAWLyDP648sjp1g"),
    fcGuj = ee.FeatureCollection("ft:1P_dYOLYY1P4_MJb8skBSBTwK_NtZSHUGWCi9d3y2"),
    fcmaha1 = ee.FeatureCollection("ft:1I8XX4KaJaJLp6oXDZmRYgkfk6HioSnd4-v5cJ3C-");

 var allImg = imageCollection.filterDate('2012-04-01', '2013-03-31').mean();
Map.addLayer(allImg,{bands:['avg_rad']});




//Bihar
var sumOfLightsBihar = allImg.reduceRegions({
 collection:fcBihar,
 scale:30,
 reducer:ee.Reducer.sum(),

});

//Goa
var sumOfLightsGoa = allImg.reduceRegions({
 collection:fcGoa,
 scale:30,
 reducer:ee.Reducer.sum(),

});

//Gujarat

var sumOfLightsGujarat = allImg.reduceRegions({
 collection:fcGuj,
 scale:30,
 reducer:ee.Reducer.sum(),

});

//KERALA

var sumOfLightsKerala = allImg.reduceRegions({
 collection:fc,
 scale:30,
 reducer:ee.Reducer.sum(),

});

//ORISSA
var sumOfLightsOrissa = allImg.reduceRegions({
 collection:fcOrissa,
 scale:30,
 reducer:ee.Reducer.sum(),
 
});
//ORISSA1
var sumOfLightsOrissa1 = allImg.reduceRegions({
 collection:fcOrissa1,
 scale:30,
 reducer:ee.Reducer.sum(),
 
});

//Sikkim

var sumOfLightsSikkim = allImg.reduceRegions({
 collection:fcSikkim,
 scale:30,
 reducer:ee.Reducer.sum(),
 
})
//MAHA 2
var sumOfLightsMaha = allImg.reduceRegions({
 collection:fcMaha,
 scale:30,
 reducer:ee.Reducer.sum(),

});
//MAHA 1
var sumOfLightsMaha1 = allImg.reduceRegions({
 collection:fcmaha1,
 scale:30,
 reducer:ee.Reducer.sum(),

});


////Goa

var numm_goa = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DISTRICT','TYPE','avg_rad','cf_cvg','description','district_code_2001','district_code_2011','name','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};
var centroidsGoa= sumOfLightsGoa.map(numm_goa);





////Bihar

var numm_Bihar = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DISTRICT','TYPE','avg_rad','cf_cvg','description','name','village_code_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};
var centroidsBihar= sumOfLightsBihar.map(numm_Bihar);








////Gujarat

var numm_geo9 = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','CENSUS_CODE_2001','SUB_DISTRICT','TYPE','avg_rad','cf_cvg','description','district_code_2001','district_code_2011','name','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};
var centroidsGuj = sumOfLightsGujarat.map(numm_geo9);




////Kerala

var numm_geo = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_rad','cf_cvg','description','district_code_2001','district_code_2011','name','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var centroidsK = sumOfLightsKerala.map(numm_geo);
//print(sumOfLights);


///////////////////Orissa filtering colums

var numm_geo1 = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_rad','cf_cvg','description','district_code_2001','district_code_2011','name','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var centroidsOrissa = sumOfLightsOrissa.map(numm_geo1);
//print(sumOfLights);

////Orissa 1 filter
///////////////////Orissa filtering colums

var numm_geo8 = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_rad','cf_cvg','description','district_code_2001','district_code_2011','name','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var centroidsOrissa1 = sumOfLightsOrissa1.map(numm_geo8);
//print(sumOfLights);



//////////////////////Sikkim filtering colums

var numm_geo2 = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_rad','cf_cvg','description','district_code_2001','district_code_2011','name','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var centroidsSikkim = sumOfLightsSikkim.map(numm_geo2);

//////////////////////Maha 2 filtering colums

var numm_geo3 = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_rad','cf_cvg','description','district_code_2001','district_code_2011','name','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var centroidsMaha2 = sumOfLightsMaha.map(numm_geo3);






////////MAHA1 filtering colum
var numm_geo4 = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_rad','cf_cvg','description','district_code_2001','district_code_2011','name','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var centroidsMaha1 = sumOfLightsMaha1.map(numm_geo4);

Export.table.toDrive({
 collection: centroidsOrissa,
 description:'SumofLightsOrissaVIIRS',
 fileFormat: 'CSV'
});
Export.table.toDrive({
 collection: centroidsOrissa1,
 description:'SumofLightsOrissa1VIIRS',
 fileFormat: 'CSV'
});



Export.table.toDrive({
 collection: centroidsK,
 description:'SumofLights11KeralaVIIRS',
 fileFormat: 'CSV'
});


Export.table.toDrive({
 collection: centroidsSikkim,
 description:'SumofLightsSikkimVIIRS',
 fileFormat: 'CSV'
});

Export.table.toDrive({
 collection: centroidsMaha2,
 description:'SumofLightsMaha2VIIRS',
 fileFormat: 'CSV'
});

Export.table.toDrive({
 collection: centroidsMaha1,
 description:'SumofLightsMaha1VIIRS',
 fileFormat: 'CSV'
});

Export.table.toDrive({
 collection: centroidsGuj,
 description:'SumofLightsGujVIIRS',
 fileFormat: 'CSV'
});


Export.table.toDrive({
 collection: centroidsGoa,
 description:'SumofLightsGoaVIIRS',
 fileFormat: 'CSV'
});
Export.table.toDrive({
 collection: centroidsBihar,
 description:'SumofLightsBiharVIIRS',
 fileFormat: 'CSV'
});

