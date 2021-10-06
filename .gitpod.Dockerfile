FROM gitpod/workspace-full:latest

RUN bash -c "$(curl -fsSL https://raw.githubusercontent.com/ohmybash/oh-my-bash/master/tools/install.sh)"

RUN sudo apt-get update &&\
    sudo apt-get install -y \
        fonts-firacode &&\
    sudo rm -rf /var/lib/apt/lists/*

RUN \
  cd /tmp &&\
  wget https://download.jetbrains.com/fonts/JetBrainsMono-2.225.zip &&\
  unzip JetBrainsMono-2.225.zip &&\
  sudo cp -Rf fonts/* /usr/share/fonts &&\
  fc-cache -f -v