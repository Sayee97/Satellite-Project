import numpy as np
from os import walk
import os
from os import listdir
from os.path import isfile, join
from sklearn.model_selection import train_test_split
#import tensorflow as tf
#from PIL import Image
#import cnn_noise_bands3
from scipy import misc
#from libtiff5 import TIFF
import sys
import numpy as np
#from PIL import Image
import os
import pickle
from libtiff import TIFF
import libtiff
libtiff.libtiff_ctypes.suppress_warnings()
from PIL import Image
#import libtiff5
#libtiff5.libtiff5_ctypes.suppress_warnings()
import glob
import pandas as pd
import random
#from PIL import Image
random.seed(2001)

path=os.getcwd()
resizeDim=224
nchannels=3
path = os.getcwd()
# image_path="/sampleImages1/"
# image_path="/tifSingle/"

# dirs=os.listdir(path+image_path)
# print(dirs)
# files=[]
# for direc in dirs:
# 	file1=glob.glob(path+image_path+direc)
# 	files.extend(file1)

image_pathOrissa="/scratch/cse/mtech/mcs162557/tifSingle/croppedImagesOddisa/"
image_pathMaha="/scratch/cse/mtech/mcs162557/tifSingle/croppedImagesMaha/"
image_pathKer="/scratch/cse/mtech/mcs162557/tifSingle/croppedImagesKerela/"
image_pathKar="/scratch/cse/mtech/mcs162557/tifSingle/croppedImagesKarnataka/"
image_pathGuj="/scratch/cse/mtech/mcs162557/tifSingle/croppedImagesGuj/"
image_pathBihar="/scratch/cse/mtech/mcs162557/tifSingle/croppedImagesBihar/"
dirs1=os.listdir(image_pathOrissa)
dirs2=os.listdir(image_pathMaha)
dirs3=os.listdir(image_pathKer)
dirs4=os.listdir(image_pathKar)
dirs5=os.listdir(image_pathGuj)
dirs6=os.listdir(image_pathBihar)
#print("ORISSAAAAAAA...........",dirs1)
files1=[]
files2=[]
files3=[]
files4=[]
files5=[]
files6=[]
for direc1 in dirs1:
       file1=glob.glob(image_pathOrissa+direc1)
       files1.extend(file1)
#print(files1)
for direc2 in dirs2:
       file2=glob.glob(image_pathMaha+direc2)
       files2.extend(file2)
for direc3 in dirs3:
       file3=glob.glob(image_pathKer+direc3)
       files3.extend(file3)
for direc4 in dirs4:
       file4=glob.glob(image_pathKar+direc4)
       files4.extend(file4)
for direc5 in dirs5:
       file5=glob.glob(image_pathGuj+direc5)
       files5.extend(file5)
for direc6 in dirs6:
       file6=glob.glob(image_pathBihar+direc6)
       files6.extend(file6)
files=[]
files=files1+files2+files3+files4+files5+files6



N= len(files)


print("===========================CHH===================")

print(N,"------------------------LENGTH OF FILES-------------------------")
index_arr=np.arange(N)
index_arr=np.asarray(index_arr,dtype=np.int32)
random.shuffle(index_arr)
train_len=int(0.8*N)
# train_len=1000
train_files=index_arr[:train_len]
test_files=index_arr
df=pd.read_csv("/home/cse/mtech/mcs162557/Replicate_Emp/Vill.csv")
village_code=df["Town/Village"].values
emp_label=df["Village_HHD_Cluster_FC"].values
actual_labels= [ int(c.split(' ')[0].split('.')[0]) for c in emp_label]
s1 = pd.Series(actual_labels,index=list(village_code))
batch_size=64
numclasses=3

def get_batch_data():
	global train_files,files,s1
	i=0
	j=0
	i=0
	k=0
	while True:
		random.shuffle(train_files)
		X=np.array([]).reshape((0,resizeDim,resizeDim, nchannels))
		Y=np.zeros((batch_size,numclasses))

		for ind in train_files:
			tif = TIFF.open(files[ind], mode='r')
			image = tif.read_image()
			dataAll = np.array(image)
			if(dataAll.shape[0]>resizeDim or dataAll.shape[1]>resizeDim):
				continue

			village_code=int((files[ind].split('@')[3]).split('.')[0])
			val=0
			try:
				try:
					val=int(s1.loc[village_code])-1
				except:
					continue
			except:
				continue
			data=np.delete(dataAll,[11,12],axis=2)

			band2=data[:,:,1]
			band3=data[:,:,2]
			band4=data[:,:,3]
			band5=data[:,:,4]
			band6=data[:,:,5]
			band7=data[:,:,6]
			sum45=band4+band5
			sum35=band3+band5
			sum56=band5+band6
			sum57=band5+band7
			####ndvi

			combinedData=np.dstack((band2,band3,band4))

			left=(resizeDim-combinedData.shape[0])//2
			right=resizeDim-combinedData.shape[0]-left
			up=(resizeDim-combinedData.shape[1])//2
			down=resizeDim-combinedData.shape[1]-up

			data1=np.lib.pad(combinedData,[(left,right),(up,down),(0,0)],'constant')
			data1=np.reshape(data1,(1,resizeDim,resizeDim,nchannels))
			if np.isnan(data1).any():
				continue
			else:
				X=np.vstack((X,data1))
				Y[i%batch_size,val]=1

			i+=1
	        
			if i%(64)==0:
				X=np.asarray(X,dtype=np.float32)
				Y=np.asarray(Y,dtype=np.int32)
				dataset = (X, Y)
				yield X,Y
				break

j=0
ind=0
def get_eval_data():
	global j
	global ind
	global test_files,files,s1
	print('Entering get_eval_data() function')

	X=np.array([]).reshape((0,resizeDim,resizeDim, nchannels))
	Y=np.zeros((batch_size,numclasses))

	village_label=np.zeros((batch_size,numclasses))
	
        #village_label=[]
	
	
	while ind< len(test_files):
		#print('test files total',len(test_files))
		#print('Entering while loop')

		ind=(ind+1)%len(test_files)
		tif = TIFF.open(files[test_files[ind]], mode='r')
		image = tif.read_image()
		dataAll = np.array(image)
		if(dataAll.shape[0]>resizeDim or dataAll.shape[1]>resizeDim):
			continue

		village_code=int((files[test_files[ind]].split('@')[3]).split('.')[0])
		
		
		#temp=np.ones((1,4))
		
		
		#village_label=np.vstack((village_label,temp*village_code))
		#village_label.append(temp*village_code)
		#village_label = np.append(temp*village_code)
		
		#print('village label shape 1',village_label.shape)
		
		val=0
		try:
			try:
				val=int(s1.loc[village_code])-1
			except:
				continue
		except:
			continue
		data=np.delete(dataAll,[11,12],axis=2)

		band2=data[:,:,1]
		band3=data[:,:,2]
		band4=data[:,:,3]
		band5=data[:,:,4]
		band6=data[:,:,5]
		band7=data[:,:,6]
		sum45=band4+band5
		sum35=band3+band5
		sum56=band5+band6
		sum57=band5+band7
		####ndvi
		sum45[sum45==0.0]=1.0
		ndvi=(band5-band4)/sum45
		####ndwi
		sum35[sum35==0.0]=1.0
		ndwi=(band3-band5)/sum35
		####ndbi
		sum56[sum56==0.0]=1.0
		ndbi=(band6-band5)/sum56
		####ui
		sum57[sum57==0.0]=1.0
		ui=(band7-band5)/sum57
		####evi
		complexDenom=(band5+6*band4-7.5*band2+1.0)
		complexDenom[complexDenom==0.0] = 1.0
		band4Denom= band4.copy()
		band4Denom[band4Denom==0.0]=1.0
		eviHelper=2.5*(band5/band4Denom)
		evi=eviHelper/complexDenom

		combinedData=np.dstack((band2,band3,band4))

		left=(resizeDim-combinedData.shape[0])//2
		right=resizeDim-combinedData.shape[0]-left
		up=(resizeDim-combinedData.shape[1])//2
		down=resizeDim-combinedData.shape[1]-up

		data1=np.lib.pad(combinedData,[(left,right),(up,down),(0,0)],'constant')
		data1=np.reshape(data1,(1,resizeDim, resizeDim,nchannels))
		if np.isnan(data1).any():
			continue
		else:
			X=np.vstack((X,data1))
			Y[j%batch_size,val]=1
			village_label[j%batch_size,val]=village_code
			

		j+=1
		if j%(64)==0:
			X=np.asarray(X,dtype=np.float32)
			Y=np.asarray(Y,dtype=np.int32)
			print(X.shape)
			print(Y.shape)
			village_label = np.asarray(village_label,dtype=np.int32)
			#village_label = np.array(village_label,dtype=np.int32)

			#print('village_label shape 2',village_label.shape)

			dataset = (X, Y)
			return X,Y,village_label
		
k=0
ind=0
def get_eval_train_data():
	global k
	global ind
	global train_files,files,s1
	while true:
		X=np.array([]).reshape((0,resizeDim,resizeDim, nchannels))
		Y=np.zeros((batch_size,numclasses))

		while ind < len(train_files):

			ind=(ind+1)%len(train_files)
			tif = TIFF.open(files[train_files[ind]], mode='r')
			image = tif.read_image()
			dataAll = np.array(image)
			if(dataAll.shape[0]>resizeDim or dataAll.shape[1]>resizeDim):
				continue

			village_code=int((files[train_files[ind]].split('@')[3]).split('.')[0])
			val=0
			try:
				try:
					val=int(s1.loc[village_code])-1
				except:
					continue
			except:
				continue
			data=np.delete(dataAll,[11,12],axis=2)

			band2=data[:,:,1]
			band3=data[:,:,2]
			band4=data[:,:,3]
			band5=data[:,:,4]
			band6=data[:,:,5]
			band7=data[:,:,6]
			sum45=band4+band5
			sum35=band3+band5
			sum56=band5+band6
			sum57=band5+band7
			####ndvi
			sum45[sum45==0.0]=1.0
			ndvi=(band5-band4)/sum45
			####ndwi
			sum35[sum35==0.0]=1.0
			ndwi=(band3-band5)/sum35
			####ndbi
			sum56[sum56==0.0]=1.0
			ndbi=(band6-band5)/sum56
			####ui
			sum57[sum57==0.0]=1.0
			ui=(band7-band5)/sum57
			####evi
			complexDenom=(band5+6*band4-7.5*band2+1.0)
			complexDenom[complexDenom==0.0] = 1.0
			band4Denom= band4.copy()
			band4Denom[band4Denom==0.0]=1.0
			eviHelper=2.5*(band5/band4Denom)
			evi=eviHelper/complexDenom

			combinedData=np.dstack((band2,band3,band4))

			left=(resizeDim-combinedData.shape[0])//2
			right=resizeDim-combinedData.shape[0]-left
			up=(resizeDim-combinedData.shape[1])//2
			down=resizeDim-combinedData.shape[1]-up

			data1=np.lib.pad(combinedData,[(left,right),(up,down),(0,0)],'constant')
			data1=np.reshape(data1,(1,resizeDim, resizeDim,nchannels))
			if np.isnan(data1).any():
				continue
			else:
				X=np.vstack((X,data1))
				Y[k%64,val]=1

			k+=1
			if k%(64)==0:
				X=np.asarray(X,dtype=np.float32)
				Y=np.asarray(Y,dtype=np.int32)
				dataset = (X, Y)
				print(k)
				yield X,Y
				break

