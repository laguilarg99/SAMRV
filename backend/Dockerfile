#to run this container:
#docker build . -t <name of the container>
#docker run -p 5000:5000 <name of the container>

FROM python:3.8-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_APP backendApplication.py
ENV FLASK_ENV prod

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]