# for some reason spk pack does not work from /vagrant
# so we copy everything into /tmp and pack from there
# (hack alert)

TARGET_DIR=$(pwd)
TEMP=/tmp/hacker-slides

cp -R /vagrant $TEMP && cd $TEMP
spk pack hacker-slides.spk
cp $TEMP/hacker-slides.spk $TARGET_DIR
rm -rf $TEMP
