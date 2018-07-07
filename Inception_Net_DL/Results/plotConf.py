from sklearn.metrics import confusion_matrix
from itertools import product
import numpy as np
import matplotlib.pyplot as plt
import itertools
from sklearn import metrics
from sklearn.metrics import average_precision_score,recall_score



y=np.loadtxt("finetune_logEMP2.txt")

print('Accuracy',metrics.accuracy_score(y[:,0],y[:,1]))

print('PRECISION: ',average_precision_score(y[:,0], y[:,1]))
print('RECALL: ',metrics.recall_score(y[:,0],y[:,1],average='macro')) 
print('F1 score is',metrics.f1_score(y[:,0],y[:,1]))
plt.figure()
metrics.confusion_matrix(y[:,0], y[:,1])



class_names=['AGRICULTURAL','INDUSTRIAL']




plt.savefig("unnormalized_confusion_matrixDEMO.png")
plt.show()

