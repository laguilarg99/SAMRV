#to run this container:
#docker build . -t processdata
#docker run -p 5000:5000 processdata

FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_APP backendApplication.py
ENV FLASK_ENV dev

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]