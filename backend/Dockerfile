# Gunakan Python versi 3.9
FROM python:3.9

# Set folder kerja di dalam server
WORKDIR /code

# Copy file requirements dulu (biar cache jalan)
COPY ./requirements.txt /code/requirements.txt

# Install library
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy semua file backend ke server
COPY . /code

# Berikan izin ke folder (opsional, untuk keamanan HF)
RUN chmod -R 777 /code

# --- PENTING: Hugging Face berjalan di Port 7860 ---
# Kita suruh FastAPI jalan di port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]