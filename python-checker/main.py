#!flask/bin/python
from flask import Flask, jsonify, redirect
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

app = Flask(__name__)

tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web',
        'done': False
    }
]


@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    return jsonify({'tasks': tasks})


@app.route('/api/get-html', methods=['GET'])
def get_html():
    return redirect('http://localhost:8080')


@app.route('/api/test-google', methods=['GET'])
def test_google():
    options = webdriver.ChromeOptions()

    driver = webdriver.Remote(
        command_executor='http://selenium:4444/wd/hub',
        options=options
    )

    try:
        driver.get("http://localhost:8080")
        element_present = EC.presence_of_element_located((By.ID, 'main-header'))
        WebDriverWait(driver, 10).until(element_present)
        return jsonify({'message': 'OK'}), 200
    except Exception as e:
        return jsonify({'message': e}), 500
    finally:
        driver.quit()


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)
