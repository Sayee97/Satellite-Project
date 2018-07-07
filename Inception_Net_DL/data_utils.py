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


print("===========================MSL===================")

print(N,"------------------------LENGTH OF FILES-------------------------")
index_arr=np.arange(N)
index_arr=np.asarray(index_arr,dtype=np.int32)
random.shuffle(index_arr)
train_len=int(0.8*N)
# train_len=1000
train_files=index_arr[:train_len]
test_files=index_arr[train_len:]
df=pd.read_csv("/home/cse/mtech/mcs162557/Replicate_MSL/Vill.csv")
village_code=df["Town/Village"].values
emp_label=df["Village_HHD_Cluster_MSL"].values
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

	X=np.array([]).reshape((0,resizeDim,resizeDim, nchannels))
	Y=np.zeros((batch_size,numclasses))

	while ind< len(test_files):

		ind=(ind+1)%len(test_files)
		tif = TIFF.open(files[test_files[ind]], mode='r')
		image = tif.read_image()
		dataAll = np.array(image)
		if(dataAll.shape[0]>resizeDim or dataAll.shape[1]>resizeDim):
			continue

		village_code=int((files[test_files[ind]].split('@')[3]).split('.')[0])
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

		j+=1
		if j%(64)==0:
			X=np.asarray(X,dtype=np.float32)
			Y=np.asarray(Y,dtype=np.int32)
			dataset = (X, Y)
			return X,Y
		
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


# def main(unused_argv):

# 	orig_stdout = sys.stdout
# 	orig_stderr=sys.stderr
# 	f = open('model_emp_bands3_out1.txt', 'w')
# 	f1= open('model_emp_bands3_warning1.txt','w')
# 	sys.stdout = f
# 	sys.stderr= f1

# 	for i in range(2):
# 	    print 'i = ', i



# 	# y=np.loadtxt(path+image_path+"/cluster_labels.txt")
# 	# y=y.T
# 	# s1 = pd.Series(y[:,1],index=list(y[:,0]))
#  #        print(s1)
# 	# X=np.array([]).reshape((0,resizeDim,resizeDim, nchannels))
# 	# Y=[]

# 	# j=0
# 	# i=0
# 	# k=0
# 	# dirs=os.listdir(path+image_path)
# 	# print(dirs)
# 	# files=[]
# 	# for direc in dirs:
# 	# 	file1=glob.glob(path+image_path+direc+"/*.tif")
# 	# 	files.extend(file1)
    
# 	# for file in files:
# 	# 	tif = TIFF.open(file, mode='r')
# 	# 	image = tif.read_image()
# 	# 	dataAll = np.array(image)
# 	# 	if(dataAll.shape[0]>resizeDim or dataAll.shape[1]>resizeDim):
# 	# 		continue

# 	# 	village_code=int((file.split('@')[3]).split('.')[0])
#  #                #print(village_code)
#  #                try:
#  #                    Y.append(s1.loc[village_code])
#  #                except:
#  #                    continue
# 	# 	data=np.delete(dataAll,[11,12],axis=2)

# 	# 	band2=data[:,:,1]
# 	# 	band3=data[:,:,2]
# 	# 	band4=data[:,:,3]
# 	# 	band5=data[:,:,4]
# 	# 	band6=data[:,:,5]
# 	# 	band7=data[:,:,6]
# 	# 	sum45=band4+band5
# 	# 	sum35=band3+band5
# 	# 	sum56=band5+band6
# 	# 	sum57=band5+band7
# 	# 	####ndvi
# 	# 	sum45[sum45==0.0]=1.0
# 	# 	ndvi=(band5-band4)/sum45
# 	# 	####ndwi
# 	# 	sum35[sum35==0.0]=1.0
# 	# 	ndwi=(band3-band5)/sum35
# 	# 	####ndbi
# 	# 	sum56[sum56==0.0]=1.0
# 	# 	ndbi=(band6-band5)/sum56
# 	# 	####ui
# 	# 	sum57[sum57==0.0]=1.0
# 	# 	ui=(band7-band5)/sum57
# 	# 	####evi
# 	# 	complexDenom=(band5+6*band4-7.5*band2+1.0)
# 	# 	complexDenom[complexDenom==0.0] = 1.0
# 	# 	band4Denom= band4.copy()
# 	# 	band4Denom[band4Denom==0.0]=1.0
# 	# 	eviHelper=2.5*(band5/band4Denom)
# 	# 	evi=eviHelper/complexDenom

# 	# 	combinedData=np.dstack((data,ndvi,ndwi,ndbi,ui,evi))

# 	# 	left=(resizeDim-combinedData.shape[0])//2
# 	# 	right=resizeDim-combinedData.shape[0]-left
# 	# 	up=(resizeDim-combinedData.shape[1])//2
# 	# 	down=resizeDim-combinedData.shape[1]-up

# 	# 	data1=np.lib.pad(combinedData,[(left,right),(up,down),(0,0)],'constant')
# 	# 	data1=np.reshape(data1,(1,200,200,16))
# 	# 	X=np.vstack((X,data1))
#  #                i+=1
#  #               # if i==50:
#  #                   # break

# 	# X=np.array(X)
# 	# # print(Y)
# 	# print(X.shape)
# 	# Y=np.array(Y)
# 	# Y.reshape(Y.size)
# 	# print(Y.shape)
# 	# train_data,X_test,y_train,y_test=train_test_split(X,Y,test_size=0.2,random_state=37)
# 	# # mnist = tf.contrib.learn.datasets.load_dataset("mnist")
# 	# # train_data = mnist.train.images  # Returns np.array
# 	# train_data=np.asarray(train_data,dtype=np.float32)
# 	# train_labels = np.asarray(y_train, dtype=np.int32)
# 	# eval_data = np.array(X_test,dtype=np.float32)  # Returns np.array
# 	# eval_labels = np.asarray(y_test, dtype=np.int32)

# 	# Create the Estimator
# 	num_epochs=1
# 	batch_size=64
# 	nsteps=100
# 	mnist_classifier = tf.estimator.Estimator(
# 	  model_fn=cnn_noise_bands3.cnn_model_fn, model_dir=path+"/EMP_bands3")

# 	# Set up logging for predictions
# 	# Log the values in the "Softmax" tensor with label "probabilities"
# 	tensors_to_log = {"probabilities": "softmax_tensor"}
# 	logging_hook = tf.train.LoggingTensorHook(
# 	  tensors=tensors_to_log, every_n_iter=50)

# 	for epoch in range(num_epochs):
# 		total_batch= (train_len//batch_size)//nsteps
# 		print("total_batch: ",total_batch)
# 		for batch_num in range(total_batch):
# 			print("epoch: ",epoch, " batch_num: ",batch_num)


# 			# nsteps=train_data.shape[0]//128
# 			# Train the model
# 			# train_input_fn = tf.estimator.inputs.numpy_input_fn(
# 			#   x={"x": train_data},
# 			#   y=train_labels,
# 			#   batch_size=16,
# 			#   num_epochs=2,
# 			#   shuffle=True)
# 			mnist_classifier.train(
# 			  input_fn= lambda:get_batch_data(),
# 			  steps=nsteps,
# 			  hooks=[logging_hook])
			

# 	test_batch_size=batch_size*10
# 	total_test_batch= len(test_files)//test_batch_size
# 	avg=0
# 	# for i in range(total_test_batch):


# 	# # Evaluate the model and print results
# 	# 	evalX,evalY=get_eval_data()
# 	# 	eval_input_fn = tf.estimator.inputs.numpy_input_fn(
# 	# 	  x=evalX,
# 	# 	  y=evalY,
# 	# 	  num_epochs=1,
# 	# 	  shuffle=False)
# 	# 	eval_results = mnist_classifier.evaluate(input_fn= eval_input_fn)
# 	# 	avg+=eval_results["accuracy"]
# 	# print("test_accuracy: ",avg/total_test_batch)

# 	# total_train_batch=train_len//test_batch_size
# 	# avg=0
# 	# for i in range(total_train_batch):


# 	# # Evaluate the model and print results
# 	# 	evalX,evalY=get_eval_train_data()
# 	# 	eval_input_fn = tf.estimator.inputs.numpy_input_fn(
# 	# 	  x=evalX,
# 	# 	  y=evalY,
# 	# 	  num_epochs=1,
# 	# 	  shuffle=False)
# 	# 	eval_results = mnist_classifier.evaluate(input_fn= eval_input_fn)
# 	# 	avg+=eval_results["accuracy"]

# 	# # print(eval_results)
# 	# print("train_accuracy: ",avg/total_train_batch)
# 	sys.stdout = orig_stdout
# 	sys.stderr= orig_stderr
# 	f.close()
# 	f1.close()


# if __name__ == "__main__":
# 	tf.app.run()
