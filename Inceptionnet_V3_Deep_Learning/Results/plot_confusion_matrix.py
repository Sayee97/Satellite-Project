from sklearn.metrics import confusion_matrix
from itertools import product
import numpy as np
import matplotlib.pyplot as plt
import itertools

from sklearn import metrics
from sklearn.metrics import average_precision_score,recall_score,f1_score,accuracy_score



def plot_confusion_matrix(cm, classes,
                          normalize=False,
                          title='Confusion matrix',
                          cmap=plt.cm.Blues):
    """
    This function prints and plots the confusion matrix.
    Normalization can be applied by setting `normalize=True`.
    """
    if normalize:
        cm = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
        print("Normalized confusion matrix")
    else:
        print('Confusion matrix, without normalization')

    print(cm)

    plt.imshow(cm, interpolation='nearest', cmap=cmap)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(len(classes))
    plt.xticks(tick_marks, classes, rotation=0)
    plt.yticks(tick_marks, classes)

    fmt = '.2f' if normalize else 'd'
    thresh = cm.max() / 2.
    for i, j in itertools.product(range(cm.shape[0]), range(cm.shape[1])):
        plt.text(j, i, format(cm[i, j], fmt),
                 horizontalalignment="center",
                 color="white" if cm[i, j] > thresh else "black")

    plt.tight_layout()
    plt.ylabel('True label')
    plt.xlabel('Predicted label')

y=np.loadtxt("EMP_copied.txt")
print(y.shape)
# Compute confusion matrix
cnf_matrix = confusion_matrix(y[:,0], y[:,1])
np.set_printoptions(precision=2)

print('Accuracy',metrics.accuracy_score(y[:,0],y[:,1]))

print('PRECISION: ',metrics.precision_score(y[:,0],y[:,1],average='macro'))
print('RECALL: ',metrics.recall_score(y[:,0],y[:,1],average='macro')) 
print('F1 score is',metrics.f1_score(y[:,0],y[:,1],average='macro'))
class_names=['AGRICULTURAL','INDUSTRIAL']


# Plot non-normalized confusion matrix
plt.figure()
plt.hist(y[:,1])
plt.hist(y[:,0])
plt.show()
plot_confusion_matrix(cnf_matrix, classes=class_names,
                      title='Confusion matrix, without normalization')

plt.savefig("unnormalized_confusion_matrixEMP.png")

# Plot normalized confusion matrix
fig2=plt.figure()
plot_confusion_matrix(cnf_matrix, classes=class_names, normalize=True,
                      title='Normalized confusion matrix')

plt.savefig("normalized_confusion_matrixEMP.png")


plt.show()

