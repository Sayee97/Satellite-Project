from keras.applications.inception_v3 import InceptionV3
from keras.preprocessing import image
from keras.models import Model
from keras.models import load_model
from keras.layers import Dense, GlobalAveragePooling2D
from keras import backend as K
import data_utils_v2
from keras import metrics
from keras.optimizers import Adam
import numpy as np


model = load_model('FC_tuned_inceptionnetV3.h5')
test_batch_size=64
total_test_batch= 2700
avg=0

predicted_y=np.array([])
actual_y=np.array([])
actual_village = np.array([])

#village=np.ones((64,1))

for i in range(total_test_batch):
        print(i)
	evalX,evalY,eval_village_code=data_utils_v2.get_eval_data()
        
	#print('VILLCODE',eval_village_code.shape)
        print('evalX',evalX.shape)
	print('eval_village_code', eval_village_code.shape)
        
	#print(eval_village_code)
	#loss,acc = model.evaluate(evalX,evalY,batch_size=64)
	
	y1=model.predict(evalX,batch_size=64)
	y1=np.argmax(y1,axis=1)
	y2=np.argmax(evalY,axis=1)
        print('y2 shape',y2.shape)
        #village=village*eval_village_code
	
	y3=np.amax(eval_village_code,axis=1)
        print('y3 shape', y3.shape)
	predicted_y=np.hstack((predicted_y,y1))
	actual_y=np.hstack((actual_y,y2))
	actual_village = np.hstack((actual_village,y3))

	#print("loss: ",loss)
	#print("acc: ",acc)
	#avg+=acc
#print("avg: ", avg/total_test_batch)

#print('actual village shape',actual_village.shape)

arr=np.vstack((actual_y,predicted_y,actual_village)).T
np.savetxt('/home/cse/mtech/mcs162557/Arpit_Test/Results/Results_FC.txt',arr)


