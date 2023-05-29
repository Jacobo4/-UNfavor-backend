FROM python:3.10

WORKDIR /app

RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

RUN pip install numpy pandas pyyaml flask transformers sentence-transformers pymilvus

COPY . .

CMD ["cat", "setup_flash.sh", "|", "sh", "-"]
