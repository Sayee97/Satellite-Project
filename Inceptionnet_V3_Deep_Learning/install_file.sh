#PBS -P cse
#PBS -q low
#PBS -l select=1:ncpus=1:ngpus=1
#PBS -l walltime=24:00:00 

module load "pythonpackages/2.7.13/ucs4/gnu/447/pandas/0.20.0rc1/gnu"
module load "apps/tensorflow/1.5.0/gpu"
#module load "pythonpackages/2.7.13/ucs4/gnu/447/theano/0.9.0/gnu"
module load "pythonpackages/2.7.13/ucs4/gnu/447/pip/9.0.1/gnu"
module load "pythonpackages/2.7.13/ucs4/gnu/447/numpy/1.12.1/gnu"
module load "pythonpackages/2.7.13/ucs4/gnu/447/pillow/4.1.0/gnu"
module load "pythonpackages/2.7.13/ucs4/gnu/447/keras/2.0.3/gnu"
module load "pythonpackages/2.7.13/ucs4/gnu/447/h5py/2.7.0/gnu"
module load "pythonpackages/2.7.13/ucs4/gnu/447/scikit-learn/0.18.1/gnu"
module load "lib/hdf/5/1.8.16/gnu"

pwd
cd /home/cse/mtech/mcs162557
python /home/cse/mtech/mcs162557/Replicate_MSL/iitdproxy.py proxy &
#python iitdproxy.py proxy &
export http_proxy=10.10.78.62:3128
export https_proxy=10.10.78.62:3128
#pip install --upgrade pip
#pip install gedit
#pip install --upgrade pip
#pip install libtiff
#git config --global http.proxy http://proxy22.iitd.ernet.in:3128
#git config --global https.proxy https://proxy22.iitd.ernet.in:3128

#pip install --user --upgrade tqdm
#pip install --user h5py

pwd
python /home/cse/mtech/mcs162557/Replicate_MSL/finetuned_inceptionnetMSL.py

#git clone https://github.com/fizyr/keras-retinanet.git
#git push
#pip install --user boltons
#git clone https://github.com/LuaDist/qtlua
#git clone https://github.com/torch/distro.git ~/torch --recursive
#cd ./torch
#bash install-deps
#./install.sh
#git clone https://github.com/BVLC/caffe
#pip install --user --upgrade libtiff
