FROM python:3.9

WORKDIR /python-checker

RUN pip install --upgrade pip

# COPY requirements.txt /python-checker

#RUN pip install --upgrade pip -r requirements.txt

RUN pip install flask
RUN pip install jsonify
RUN pip install selenium

COPY . /python-checker

CMD ["python","main.py"]
