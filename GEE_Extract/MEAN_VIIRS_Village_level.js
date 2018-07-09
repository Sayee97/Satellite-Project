var imageCollection = ee.ImageCollection("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS"),
    image = ee.Image("NOAA/DMSP-OLS/NIGHTTIME_LIGHTS/F182011"),
    fc = ee.FeatureCollection("ft:12C0095JAOOrJyL9K-RI_ePuSPfe5XwED-ZIvfGnE"),
    fcOrissa = ee.FeatureCollection("ft:1VisMLgHDmzUGr8tqWQWeBRqNL0_3qlF3Ugv24UKB"),
    fcSikkim = ee.FeatureCollection("ft:144copRdjlkKMR6PuYBXN-sLIE1U4vqn-NUCHLjlZ"),
    fcMaha = ee.FeatureCollection("ft:184ug09lm7AW1V1To4WmC1o0zJW3s7bYW2Gy82uo1"),
    fcOrissa1 = ee.FeatureCollection("ft:1KDh7t6ZOVKpr5Ld_P7v0mG8u0LPFvitRJDsitXuN"),
    fcBihar = ee.FeatureCollection("ft:1FNfPo_YrXtIoPNF1y153J7mKqmNbvoZF4LK0TZqT"),
    fcGoa = ee.FeatureCollection("ft:1j5FnlCxJv5s9WiGQSrnVKfuSugAWLyDP648sjp1g"),
    fcGuj = ee.FeatureCollection("ft:1P_dYOLYY1P4_MJb8skBSBTwK_NtZSHUGWCi9d3y2"),
    fcmaha1 = ee.FeatureCollection("ft:1I8XX4KaJaJLp6oXDZmRYgkfk6HioSnd4-v5cJ3C-"),
    kar = ee.FeatureCollection("ft:1qQajCfUaTQmgAsOsm0B7kgLZTCyw9475irr7KtUW");


var sumOfLightsKarn = image.reduceRegions({
 collection:kar,
 reducer:ee.Reducer.mean(),

});

var numm_karn = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','TALUK','DIST_NAME','UNIQUE_TAL','TALUKA_NAM','NAME','STATE','SUB_DISTRICT','TYPE','avg_lights_x_pct','avg_vis','cf_cvg','description','district_code_2001','district_code_2011','name','stable_lights','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};
var centroidskarn= sumOfLightsKarn.map(numm_karn);

Export.table.toDrive({
 collection: centroidskarn,
 description:'MEANKarn'
});



//ADDING LAYER
Map.addLayer(image,{bands:['stable_lights']});
Map.addLayer(fcOrissa,{color:'blue'});
Map.addLayer(fcSikkim,{color:'blue'});
Map.addLayer(fcMaha,{color:'blue'});
Map.addLayer(fcmaha1,{color:'blue'});


//Bihar
var sumOfLightsBihar = image.reduceRegions({
 collection:fcBihar,
 reducer:ee.Reducer.mean(),

});

//Goa
var sumOfLightsGoa = image.reduceRegions({
 collection:fcGoa,
 reducer:ee.Reducer.mean(),

});

//Gujarat

var sumOfLightsGujarat = image.reduceRegions({
 collection:fcGuj,
 reducer:ee.Reducer.mean(),

});

//KERALA

var sumOfLightsKerala = image.reduceRegions({
 collection:fc,
 reducer:ee.Reducer.mean(),

});

//ORISSA
var sumOfLightsOrissa = image.reduceRegions({
 collection:fcOrissa,
 reducer:ee.Reducer.mean(),
 
});
//ORISSA1
var sumOfLightsOrissa1 = image.reduceRegions({
 collection:fcOrissa1,
 reducer:ee.Reducer.mean(),
 
});

//Sikkim

var sumOfLightsSikkim = image.reduceRegions({
 collection:fcSikkim,
 reducer:ee.Reducer.mean(),
 
})
//MAHA 2
var sumOfLightsMaha = image.reduceRegions({
 collection:fcMaha,
 reducer:ee.Reducer.mean(),

});
//MAHA 1
var sumOfLightsMaha1 = image.reduceRegions({
 collection:fcmaha1,
 reducer:ee.Reducer.mean(),

});


////Goa

var numm_goa = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DISTRICT','TYPE','avg_lights_x_pct','avg_vis','cf_cvg','description','district_code_2001','district_code_2011','name','stable_lights','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};
var centroidsGoa= sumOfLightsGoa.map(numm_goa);





////Bihar

var numm_Bihar = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DISTRICT','TYPE','avg_lights_x_pct','avg_vis','cf_cvg','description','name','stable_lights','village_code_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};
var centroidsBihar= sumOfLightsBihar.map(numm_Bihar);








////Gujarat

var numm_geo9 = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','CENSUS_CODE_2001','SUB_DISTRICT','TYPE','avg_lights_x_pct','avg_vis','cf_cvg','description','district_code_2001','district_code_2011','name','stable_lights','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};
var centroidsGuj = sumOfLightsGujarat.map(numm_geo9);




////Kerala

var numm_geo = function(feature) {
 // Keep this list of properties.
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_lights_x_pct','avg_vis','cf_cvg','description','district_code_2001','district_code_2011','name','stable_lights','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
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
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_lights_x_pct','avg_vis','cf_cvg','description','district_code_2001','district_code_2011','name','stable_lights','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
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
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_lights_x_pct','avg_vis','cf_cvg','description','district_code_2001','district_code_2011','name','stable_lights','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
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
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_lights_x_pct','avg_vis','cf_cvg','description','district_code_2001','district_code_2011','name','stable_lights','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
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
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_lights_x_pct','avg_vis','cf_cvg','description','district_code_2001','district_code_2011','name','stable_lights','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
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
 var keepProperties = ['DISTRICT','NAME','STATE','SUB_DIST','TYPE','avg_lights_x_pct','avg_vis','cf_cvg','description','district_code_2001','district_code_2011','name','stable_lights','state_code_2001','state_code_2011','sub_district_code_2001','sub_district_code_2011','village_code_2001','village_code_2011','village_name_2001','village_name_2011'];
 // Get the centroid of the feature's geometry.
 var centroid = feature.geometry().centroid();
 // Return a new Feature, copying properties from the old Feature.
 return ee.Feature(null).copyProperties(feature, keepProperties);
};

// Map the centroid getting function over the features.
var centroidsMaha1 = sumOfLightsMaha1.map(numm_geo4);

Export.table.toDrive({
 collection: centroidsOrissa,
 description:'MeanOrissa',
 fileFormat: 'CSV'
});
Export.table.toDrive({
 collection: centroidsOrissa1,
 description:'MeanOrissa1',
 fileFormat: 'CSV'
});



Export.table.toDrive({
 collection: centroidsK,
 description:'MeanKerala',
 fileFormat: 'CSV'
});


Export.table.toDrive({
 collection: centroidsSikkim,
 description:'MeanSikkim',
 fileFormat: 'CSV'
});

Export.table.toDrive({
 collection: centroidsMaha2,
 description:'MeanMaha2',
 fileFormat: 'CSV'
});

Export.table.toDrive({
 collection: centroidsMaha1,
 description:'MeanMaha1',
 fileFormat: 'CSV'
});

Export.table.toDrive({
 collection: centroidsGuj,
 description:'MeanGuj',
 fileFormat: 'CSV'
});


Export.table.toDrive({
 collection: centroidsGoa,
 description:'MeanGoa',
 fileFormat: 'CSV'
});
Export.table.toDrive({
 collection: centroidsBihar,
 description:'MeanBihar',
 fileFormat: 'CSV'
});

